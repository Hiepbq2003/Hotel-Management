package com.project.mhotel.dto;

import com.project.mhotel.entity.HotelAmenity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAmenityResponse {

    private Long id;
    private Long hotelId;
    private String name;
    private String description;
    private String iconUrl;
    private Boolean isActive;
    private LocalDateTime createdAt;

    // Mapper tĩnh
    public static HotelAmenityResponse fromEntity(HotelAmenity entity) {
        HotelAmenityResponse dto = new HotelAmenityResponse();
        dto.setId(entity.getId());
        dto.setHotelId(entity.getHotel().getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setIconUrl(entity.getIconUrl());
        dto.setIsActive(entity.getIsActive());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}