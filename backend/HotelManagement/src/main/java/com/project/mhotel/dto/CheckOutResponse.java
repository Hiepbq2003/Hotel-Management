package com.project.mhotel.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class CheckOutResponse {
    private String reservationCode;
    private String roomNumber;
    private String guestName;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private BigDecimal totalAmount;
    private BigDecimal originalAmount; 
    private String paymentType; 
    private String message;

}
