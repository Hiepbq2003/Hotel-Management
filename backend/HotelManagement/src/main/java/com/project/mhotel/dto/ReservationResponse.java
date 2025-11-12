package com.project.mhotel.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private String reservationCode;
    private String guestName;
    private String email;
    private String phone;
    private LocalDateTime arrivalDate;
    private LocalDateTime departureDate;
}
