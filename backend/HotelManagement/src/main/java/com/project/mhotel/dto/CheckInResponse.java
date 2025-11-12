package com.project.mhotel.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CheckInResponse {
    private String reservationCode;
    private String guestName;
    private List<String> roomNumbers;
    private LocalDateTime checkInTime;
    private String message;
}
