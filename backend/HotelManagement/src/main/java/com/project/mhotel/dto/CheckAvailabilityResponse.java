package com.project.mhotel.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CheckAvailabilityResponse {
    private String roomType;
    private int availableRooms;
    private String message;
}

