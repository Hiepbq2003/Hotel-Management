package com.project.mhotel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {
    private Long id;
    private Long reservationId;
    private String reservationCode;
    private String guestName;
    private Long hotelId;
    private String hotelName;
    private BigDecimal amount;
    private String currency;
    private LocalDateTime paidAt;
    private String paymentMethod;
    private String transactionRef;
    private String status;
    private Long createdById;
    private String createdByName;
    private String notes;
    private LocalDateTime createdAt;
}
