package com.project.mhotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAmenityRequest {
    private Long hotelId;
    private String name;
    private String description;
    private String iconUrl;
}