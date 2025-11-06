package com.project.mhotel.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // Import List

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeResponse {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer capacity;
    private String bedInfo;
    private BigDecimal basePrice;
    private LocalDateTime createdAt;
    private Long hotelId;
    private String hotelName;
    private List<HotelAmenityResponse> amenities;
}