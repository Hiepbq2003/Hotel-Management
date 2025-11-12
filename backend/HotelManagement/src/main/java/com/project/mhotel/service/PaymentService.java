package com.project.mhotel.service;

import com.project.mhotel.config.VnPayConfig;
import com.project.mhotel.entity.Payment;
import com.project.mhotel.entity.Reservation;
import com.project.mhotel.repository.PaymentRepository;
import com.project.mhotel.repository.ReservationRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    private final VnPayService vnPayService; // Thêm dependency này

    // THÊM PHƯƠNG THỨC BỊ THIẾU
    public String createVnPayPayment(Long reservationId, HttpServletRequest request) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Tạo payment với status completed ngay lập tức
        Payment payment = Payment.builder()
                .reservation(reservation)
                .hotel(reservation.getHotel())
                .amount(reservation.getTotalAmount().multiply(new BigDecimal(4600)))
                .status(Payment.Status.completed) // 🔥 CẬP NHẬT LUÔN THÀNH completed
                .paymentMethod("VNPay")
                .paidAt(LocalDateTime.now()) // 🔥 Đặt paidAt ngay bây giờ
                .transactionRef("PENDING_VNPay") // Tạm thời
                .build();

        payment = paymentRepository.save(payment);
        System.out.println("✅ Payment created with COMPLETED status - ID: " + payment.getId());

        // Vẫn tạo VNPay URL để thu tiền
        return vnPayService.generatePaymentUrl(payment, request);
    }

    // CÁC PHƯƠNG THỨC KHÁC GIỮ NGUYÊN...
    public boolean validateVnPayReturn(Map<String, String> params) {
        try {
            String vnp_SecureHash = params.get("vnp_SecureHash");
            if (vnp_SecureHash == null || vnp_SecureHash.isEmpty()) {
                System.out.println("Missing vnp_SecureHash");
                return false;
            }

            // Create a copy and remove secure hash fields
            Map<String, String> paramsForHash = new TreeMap<>(params);
            paramsForHash.remove("vnp_SecureHash");
            paramsForHash.remove("vnp_SecureHashType");

            // SỬA: Dùng US_ASCII để khớp với VnPayService
            StringBuilder hashData = new StringBuilder();
            Iterator<Map.Entry<String, String>> iterator = paramsForHash.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, String> entry = iterator.next();
                if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                    if (hashData.length() > 0) {
                        hashData.append('&');
                    }
                    hashData.append(entry.getKey());
                    hashData.append('=');
                    // SỬA: Dùng US_ASCII để khớp với VnPayService
                    hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII.toString()));
                }
            }

            String rawHashData = hashData.toString();
            System.out.println("VALIDATION - Raw Hash Data: " + rawHashData);

            // Sử dụng HMAC-SHA512
            String calculatedHash = hmacSHA512(VnPayConfig.vnp_HashSecret, rawHashData);
            System.out.println("VALIDATION - Received Hash: " + vnp_SecureHash);
            System.out.println("VALIDATION - Calculated Hash: " + calculatedHash);
            System.out.println("VALIDATION - Match: " + calculatedHash.equalsIgnoreCase(vnp_SecureHash));

            return calculatedHash.equalsIgnoreCase(vnp_SecureHash);

        } catch (Exception e) {
            System.out.println("Validation error: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    private String hmacSHA512(String key, String data) {
        try {
            if (key == null || data == null) {
                throw new NullPointerException();
            }
            final Mac hmac512 = Mac.getInstance("HmacSHA512");
            byte[] hmacKeyBytes = key.getBytes(StandardCharsets.UTF_8);
            final SecretKeySpec secretKey = new SecretKeySpec(hmacKeyBytes, "HmacSHA512");
            hmac512.init(secretKey);
            byte[] dataBytes = data.getBytes(StandardCharsets.UTF_8);
            byte[] result = hmac512.doFinal(dataBytes);
            StringBuilder sb = new StringBuilder(2 * result.length);
            for (byte b : result) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();

        } catch (Exception ex) {
            System.err.println("Lỗi HMAC-SHA512: " + ex.getMessage());
            return "";
        }
    }

    // Method chính xử lý return từ VNPay
    @Transactional
    public Map<String, Object> processVnPayReturn(Map<String, String> params) {
        try {
            String vnp_TxnRef = params.get("vnp_TxnRef");
            String vnp_TransactionNo = params.get("vnp_TransactionNo");
            String vnp_ResponseCode = params.get("vnp_ResponseCode");

            System.out.println("=== 🔄 UPDATING EXISTING PAYMENT ===");

            Long paymentId = Long.valueOf(vnp_TxnRef);
            Payment payment = paymentRepository.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            if ("00".equals(vnp_ResponseCode)) {
                // 🎯 CHỈ CẦN CẬP NHẬT TRANSACTION REF
                payment.setTransactionRef(vnp_TransactionNo);
                paymentRepository.save(payment);

                System.out.println("✅ Payment transaction ref updated: " + vnp_TransactionNo);

                return Map.of(
                        "status", "success",
                        "message", "Payment completed successfully",
                        "reservationId", payment.getReservation().getId(),
                        "reservationCode", payment.getReservation().getReservationCode(),
                        "paymentId", payment.getId(),
                        "transactionRef", payment.getTransactionRef()
                );
            } else {
                // ❌ Nếu thanh toán thất bại, revert status
                payment.setStatus(Payment.Status.failed);
                payment.getReservation().setStatus(Reservation.Status.cancelled);
                paymentRepository.save(payment);
                reservationRepository.save(payment.getReservation());

                return Map.of("status", "failed", "message", "Payment failed");
            }

        } catch (Exception e) {
            System.out.println("💥 Error updating payment: " + e.getMessage());
            return Map.of("status", "error", "message", e.getMessage());
        }
    }
    @Transactional
    protected Map<String, Object> processSuccessfulPayment(Payment payment, Reservation reservation, Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Cập nhật payment
            payment.setStatus(Payment.Status.completed);
            payment.setTransactionRef(params.get("vnp_TransactionNo"));
            payment.setPaidAt(LocalDateTime.now());

            // Cập nhật amount từ VNPay (chia cho 100 vì VNPay gửi amount * 100)
            if (params.get("vnp_Amount") != null) {
                long amountFromVNPay = Long.parseLong(params.get("vnp_Amount"));
                BigDecimal actualAmount = BigDecimal.valueOf(amountFromVNPay / 100.0);
                payment.setAmount(actualAmount);
            }

            paymentRepository.save(payment);

            // Cập nhật reservation status thành reserved
            reservation.setStatus(Reservation.Status.reserved);
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);

            System.out.println("Payment completed - Reservation: " + reservation.getId() + " updated to reserved");

            result.put("status", "success");
            result.put("message", "Payment completed successfully");
            result.put("reservationId", reservation.getId());
            result.put("reservationCode", reservation.getReservationCode());
            result.put("reservationStatus", reservation.getStatus().toString());
            result.put("paymentId", payment.getId());
            result.put("amount", payment.getAmount());
            result.put("transactionRef", payment.getTransactionRef());

            return result;

        } catch (Exception e) {
            System.out.println("Error processing successful payment: " + e.getMessage());
            throw new RuntimeException("Error updating reservation: " + e.getMessage(), e);
        }
    }

    @Transactional
    protected Map<String, Object> processFailedPayment(Payment payment, Reservation reservation, Map<String, String> params) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Cập nhật payment status thành failed
            payment.setStatus(Payment.Status.failed);
            payment.setTransactionRef(params.get("vnp_TransactionNo"));
            payment.setPaidAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // Reservation vẫn giữ nguyên trạng thái pending_payment để cho phép thanh toán lại
            // Không cập nhật status reservation ở đây
            reservation.setUpdatedAt(LocalDateTime.now());
            reservationRepository.save(reservation);

            System.out.println("Payment failed - Reservation: " + reservation.getId() + " remains in " + reservation.getStatus());

            result.put("status", "failed");
            result.put("message", "Payment failed");
            result.put("reservationId", reservation.getId());
            result.put("reservationCode", reservation.getReservationCode());
            result.put("reservationStatus", reservation.getStatus().toString());
            result.put("paymentId", payment.getId());
            result.put("errorCode", params.get("vnp_ResponseCode"));

            return result;

        } catch (Exception e) {
            System.out.println("Error processing failed payment: " + e.getMessage());
            throw new RuntimeException("Error updating payment: " + e.getMessage(), e);
        }
    }

    // Lấy thông tin payment theo reservation
    public List<Payment> getPaymentsByReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        return paymentRepository.findByReservationOrderByPaidAtDesc(reservation);
    }

    // Kiểm tra trạng thái thanh toán của reservation
    public Map<String, Object> getPaymentStatus(Long reservationId) {
        Map<String, Object> status = new HashMap<>();

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        List<Payment> payments = getPaymentsByReservation(reservationId);

        status.put("reservationId", reservationId);
        status.put("reservationStatus", reservation.getStatus().toString());
        status.put("totalAmount", reservation.getTotalAmount());
        status.put("payments", payments);

        // Kiểm tra nếu có payment thành công
        boolean hasSuccessfulPayment = payments.stream()
                .anyMatch(p -> p.getStatus() == Payment.Status.completed);
        status.put("hasSuccessfulPayment", hasSuccessfulPayment);

        // Tính tổng số tiền đã thanh toán
        BigDecimal totalPaid = payments.stream()
                .filter(p -> p.getStatus() == Payment.Status.completed)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        status.put("totalPaid", totalPaid);

        return status;
    }
}