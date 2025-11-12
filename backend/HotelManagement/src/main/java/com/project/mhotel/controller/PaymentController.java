package com.project.mhotel.controller;

import com.project.mhotel.entity.Payment;
import com.project.mhotel.entity.Reservation;
import com.project.mhotel.repository.PaymentRepository;
import com.project.mhotel.repository.ReservationRepository;
import com.project.mhotel.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;
    @PostMapping("/create-vnpay")
    public ResponseEntity<Map<String, String>> createVnPayPayment(
            @RequestBody Map<String, Object> payload,
            HttpServletRequest request) {

        Long reservationId = Long.valueOf(payload.get("reservationId").toString());
        String paymentUrl = paymentService.createVnPayPayment(reservationId, request);

        return ResponseEntity.ok(Map.of("vnpayUrl", paymentUrl));
    }
    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> handleVnPayReturn(HttpServletRequest request) {

        System.out.println("=== 🔥 VNPay RETURN ENDPOINT HIT ===");
        System.out.println("🕒 Time: " + LocalDateTime.now());
        System.out.println("🔗 Request URL: " + request.getRequestURL());
        System.out.println("❓ Query String: " + request.getQueryString());
        System.out.println("🌐 Remote Address: " + request.getRemoteAddr());

        try {
            // Lấy parameters TRỰC TIẾP từ request
            Map<String, String> params = new HashMap<>();
            Enumeration<String> paramNames = request.getParameterNames();

            System.out.println("=== 📥 PARAMETERS RECEIVED ===");
            if (paramNames == null || !paramNames.hasMoreElements()) {
                System.out.println("❌ NO PARAMETERS RECEIVED");
            } else {
                while (paramNames.hasMoreElements()) {
                    String paramName = paramNames.nextElement();
                    String paramValue = request.getParameter(paramName);
                    params.put(paramName, paramValue);
                    System.out.println("✅ " + paramName + " = " + paramValue);
                }
                System.out.println("📊 Total parameters: " + params.size());
            }

            // Xử lý kết quả thanh toán
            Map<String, Object> result = paymentService.processVnPayReturn(params);

            System.out.println("=== 📤 RESPONSE SENT ===");
            System.out.println("Response: " + result);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            System.out.println("💥 ERROR in controller: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<?> getPaymentsByReservation(@PathVariable Long reservationId) {
        try {
            List<Payment> payments = paymentService.getPaymentsByReservation(reservationId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/status/{reservationId}")
    public ResponseEntity<?> getPaymentStatus(@PathVariable Long reservationId) {
        try {
            Map<String, Object> status = paymentService.getPaymentStatus(reservationId);
            return ResponseEntity.ok(status);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // API test và debug
    @GetMapping("/check-reservation-status")
    public ResponseEntity<Map<String, Object>> checkReservationStatus() {
        try {
            Map<String, Object> statusInfo = new HashMap<>();

            // Lấy thông tin từ Payment entity
            statusInfo.put("payment_status_enum", java.util.Arrays.toString(Payment.Status.values()));
            statusInfo.put("reservation_status_enum", java.util.Arrays.toString(Reservation.Status.values()));

            // Lấy thông tin từ database
            List<Reservation> reservations = reservationRepository.findAll();
            statusInfo.put("total_reservations", reservations.size());

            if (!reservations.isEmpty()) {
                Reservation sample = reservations.get(0);
                statusInfo.put("sample_reservation_id", sample.getId());
                statusInfo.put("sample_reservation_status", sample.getStatus());
                statusInfo.put("sample_reservation_code", sample.getReservationCode());
            }

            List<Payment> payments = paymentRepository.findAll();
            statusInfo.put("total_payments", payments.size());

            return ResponseEntity.ok(statusInfo);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // API để manually xác nhận thanh toán (cho testing)
    @PostMapping("/manual-confirm")
    public ResponseEntity<?> manualConfirmPayment(@RequestBody Map<String, Object> payload) {
        try {
            Long reservationId = Long.valueOf(payload.get("reservationId").toString());
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            // Tạo payment record
            Payment payment = Payment.builder()
                    .reservation(reservation)
                    .hotel(reservation.getHotel())
                    .amount(reservation.getTotalAmount())
                    .status(Payment.Status.completed)
                    .paymentMethod("MANUAL")
                    .transactionRef("MANUAL-" + System.currentTimeMillis())
                    .build();
            paymentRepository.save(payment);

            // Cập nhật reservation status
            reservation.setStatus(Reservation.Status.reserved);
            reservationRepository.save(reservation);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Payment confirmed manually",
                    "reservationId", reservationId,
                    "reservationStatus", reservation.getStatus().toString()
            ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @GetMapping("/test-vnpay-return")
    public ResponseEntity<Map<String, Object>> testVnPayReturn(
            @RequestParam(required = false) String vnp_Amount,
            @RequestParam(required = false) String vnp_ResponseCode,
            @RequestParam(required = false) String vnp_TxnRef) {

        System.out.println("=== 🧪 TEST ENDPOINT ===");
        System.out.println("vnp_Amount: " + vnp_Amount);
        System.out.println("vnp_ResponseCode: " + vnp_ResponseCode);
        System.out.println("vnp_TxnRef: " + vnp_TxnRef);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Test endpoint working",
                "amount", vnp_Amount,
                "responseCode", vnp_ResponseCode,
                "txnRef", vnp_TxnRef
        ));
    }
}