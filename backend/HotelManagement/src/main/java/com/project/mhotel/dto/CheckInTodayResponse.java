package com.project.mhotel.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CheckInTodayResponse {
    private String guestName;
    private String phone;
    private String email;
    private String roomNumber;
    private String roomType;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private String status;
}
