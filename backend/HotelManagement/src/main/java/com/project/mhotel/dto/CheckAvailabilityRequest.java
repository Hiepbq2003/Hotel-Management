package com.project.mhotel.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CheckAvailabilityRequest {
    private String roomType;         // code loại phòng (VD: "DLX")
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private int adultCount;
    private int childCount;
}
