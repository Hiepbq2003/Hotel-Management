package com.project.mhotel.utils; // Đặt đúng package của bạn

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.websocket.Session;
import org.apache.logging.log4j.message.Message;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value; // Import để đọc từ application.properties

import java.net.Authenticator;
import java.net.PasswordAuthentication;
import java.util.Date;
import java.util.Properties;

@Component
public class EmailUtil {
    @Value("${spring.mail.username}")
    private String fromEmail;

    // Thay thế bằng "mhotel.app.password" nếu bạn không dùng Spring Boot Mail tự động
    // Nếu bạn muốn dùng Spring Mail, hãy bỏ qua APP_PASSWORD ở đây
    private static final String APP_PASSWORD = "yqxf ubko usty uzqc"; // Vẫn giữ tạm cho cấu hình thủ công

    private static final String FROM_NAME = "Hệ Thống Quản Lý Khách Sạn";

    // ==========================================================
    // Cấu hình Email Properties cho JavaMail API
    // ==========================================================
    private Properties getMailProperties() {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", "smtp.gmail.com"); // Thay thế nếu dùng SMTP khác
        props.put("mail.smtp.port", "587");
        props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        return props;
    }

    // ==========================================================
    // 1. Gửi Mã OTP (Khôi phục mật khẩu)
    // ==========================================================
    public boolean sendOTP(String toEmail, String otp, String name) {
        String subject = "Mã OTP Khôi Phục Mật Khẩu";
        String content = buildOTPContent(otp, name);

        return sendEmail(toEmail, subject, content);
    }

    // ==========================================================
    // 2. Phương thức chung để gửi email
    // ==========================================================
    public boolean sendEmail(String toEmail, String subject, String content) {
        try {
            // Lấy cấu hình Properties
            Properties props = getMailProperties();

            // Tạo Session với Authenticator (để đăng nhập vào SMTP server)
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    // Nếu dùng email và App Password của Gmail, bạn phải dùng APP_PASSWORD này.
                    // Nếu dùng Spring Boot Mail starter, có thể không cần đoạn này.
                    return new PasswordAuthentication(fromEmail, APP_PASSWORD);
                }
            });

            // Tạo nội dung email
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(fromEmail, FROM_NAME));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toEmail));
            message.setSubject(subject);
            message.setSentDate(new Date());

            // Thiết lập nội dung (HTML)
            message.setContent(content, "text/html; charset=utf-8");

            // Gửi email
            Transport.send(message);
            System.out.println("✅ Đã gửi email ['" + subject + "'] đến: " + toEmail);
            return true;

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("❌ Gửi email thất bại đến " + toEmail + ": " + e.getMessage());
            return false;
        }
    }

    // ==========================================================
    // 3. Xây dựng nội dung HTML cho email OTP
    // ==========================================================
    private String buildOTPContent(String otp, String name) {
        return "<!DOCTYPE html>" +
                "<html><head><meta charset='UTF-8'>" +
                "<style>" +
                "body{font-family:sans-serif;padding:20px;background:#f4f4f4;}" +
                ".box{max-width:600px;margin:auto;background:#fff;padding:20px 30px;border-radius:8px;border:1px solid #ddd;}" +
                "h2{color:#333;}" +
                "p{color:#555;line-height:1.5;}" +
                ".otp-container{text-align:center;padding:15px;background:#e9ecef;border-radius:4px;margin:25px 0;}" +
                ".otp{font-size:36px;font-weight:bold;color:#007bff;letter-spacing:5px;}" +
                "hr{border:0;border-top:1px solid #eee;margin:20px 0;}" +
                "b{color:#333;}" +
                "</style></head><body>" +
                "<div class='box'>" +
                "<h2>Khôi Phục Mật Khẩu Hệ Thống " + FROM_NAME + "</h2>" +
                "<p>Xin chào <b>" + name + "</b>,</p>" +
                "<p>Bạn vừa yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã xác thực một lần (OTP) sau để hoàn tất quá trình:</p>" +
                "<div class='otp-container'>" +
                "<div class='otp'>" + otp + "</div>" +
                "</div>" +
                "<p>Mã này chỉ có hiệu lực trong vòng <b>5 phút</b>.</p>" +
                "<hr><p style='font-size:12px;color:#999;'>Vui lòng không chia sẻ mã này cho bất kỳ ai. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>" +
                "<p>Trân trọng,<br>Đội Ngũ Hỗ Trợ " + FROM_NAME + "</p>" +
                "</div></body></html>";
    }

}