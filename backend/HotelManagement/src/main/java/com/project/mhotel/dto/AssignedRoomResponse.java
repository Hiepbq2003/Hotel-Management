package com.project.mhotel.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedRoomResponse {
    private String reservationCode;
    private String number;      
    private String type;        
    private String guestName;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
}

