package com.project.mhotel.dto;

import lombok.*;
import java.time.LocalDateTime;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CheckInRequest {
    private String guestName;
    private String idNumber;
    private String roomType;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private Integer adultCount;
    private Integer childCount;
    private String email;
    private String phone;
    private String nationality;
    private String documentType;
    private String documentNumber;

    private Long receptionId;
}

