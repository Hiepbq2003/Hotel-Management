package com.project.mhotel.service;

import com.project.mhotel.config.VnPayConfig;
import com.project.mhotel.entity.Payment;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnPayService {

    public String generatePaymentUrl(Payment payment, HttpServletRequest request) {
        try {
            System.out.println("=== BẮT ĐẦU TẠO VNPay URL (FIXED TIMEZONE) ===");

            // 1. THIẾT LẬP THAM SỐ CƠ BẢN
            String vnp_Version = "2.1.0";
            String vnp_Command = "pay";
            String vnp_CurrCode = "VND";

            // Amount calculation - multiply by 100
            long amount = payment.getAmount().longValue() * 100;

            // THỜI GIAN QUAN TRỌNG: Dùng timezone GMT+7 (Việt Nam)
            TimeZone timeZone = TimeZone.getTimeZone("GMT+7");
            Calendar calendar = Calendar.getInstance(timeZone);
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            formatter.setTimeZone(timeZone);

            String vnp_CreateDate = formatter.format(calendar.getTime());
            calendar.add(Calendar.MINUTE, 15); // Thêm 15 phút
            String vnp_ExpireDate = formatter.format(calendar.getTime());

            // Use payment ID as transaction reference
            String vnp_TxnRef = String.valueOf(payment.getId());
            String vnp_OrderInfo = "Hotel_Booking_" + payment.getId();
            String vnp_IpAddr = getClientIpAddress(request);

            System.out.println("Payment ID: " + payment.getId());
            System.out.println("TxnRef: " + vnp_TxnRef);
            System.out.println("Amount (VND): " + payment.getAmount());
            System.out.println("Amount (x100): " + amount);
            System.out.println("Create Date (GMT+7): " + vnp_CreateDate);
            System.out.println("Expire Date (GMT+7): " + vnp_ExpireDate);

            // 2. TẠO PARAMS
            Map<String, String> vnp_Params = new TreeMap<>();
            vnp_Params.put("vnp_Version", vnp_Version);
            vnp_Params.put("vnp_Command", vnp_Command);
            vnp_Params.put("vnp_TmnCode", VnPayConfig.vnp_TmnCode);
            vnp_Params.put("vnp_Amount", String.valueOf(amount));
            vnp_Params.put("vnp_CurrCode", vnp_CurrCode);
            vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
            vnp_Params.put("vnp_OrderInfo", vnp_OrderInfo);
            vnp_Params.put("vnp_OrderType", "170000");
            vnp_Params.put("vnp_Locale", "vn");
            vnp_Params.put("vnp_ReturnUrl", VnPayConfig.vnp_Returnurl);
            vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
            vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
            vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

            // 3. TẠO HASH DATA VỚI URL ENCODING
            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();

            System.out.println("=== PARAMS FOR HASHING ===");
            Iterator<Map.Entry<String, String>> iterator = vnp_Params.entrySet().iterator();
            while (iterator.hasNext()) {
                Map.Entry<String, String> entry = iterator.next();
                String fieldName = entry.getKey();
                String fieldValue = entry.getValue();

                System.out.println(fieldName + " = " + fieldValue);

                if (fieldValue != null && !fieldValue.isEmpty()) {
                    // Build hash data - URL ENCODE values
                    if (hashData.length() > 0) {
                        hashData.append('&');
                    }
                    hashData.append(fieldName);
                    hashData.append('=');
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                    // Build query string
                    if (query.length() > 0) {
                        query.append('&');
                    }
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                }
            }

            String rawHashData = hashData.toString();
            System.out.println("RAW HASH DATA: " + rawHashData);

            // 4. TẠO SECURE HASH VỚI HMAC-SHA512
            String vnp_SecureHash = hmacSHA512(VnPayConfig.vnp_HashSecret, rawHashData);
            System.out.println("SECURE HASH: " + vnp_SecureHash);

            // 5. TẠO URL HOÀN CHỈNH
            String paymentUrl = VnPayConfig.vnp_Url + "?" + query.toString() +
                    "&vnp_SecureHashType=SHA512&vnp_SecureHash=" + vnp_SecureHash;

            System.out.println("FINAL URL: " + paymentUrl);
            System.out.println("=== KẾT THÚC TẠO URL ===\n");

            return paymentUrl;

        } catch (Exception e) {
            System.err.println("LỖI TẠO VNPay URL: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi tạo VNPay URL: " + e.getMessage(), e);
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

    private String getClientIpAddress(HttpServletRequest request) {
        try {
            String xForwardedFor = request.getHeader("X-Forwarded-For");
            if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
                return xForwardedFor.split(",")[0].trim();
            }
            return request.getRemoteAddr();
        } catch (Exception e) {
            return "127.0.0.1";
        }
    }
}