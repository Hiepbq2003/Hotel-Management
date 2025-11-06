package com.project.mhotel.dto;

import com.project.mhotel.entity.HotelAmenity;
import com.project.mhotel.entity.Services; // Import Services Entity
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
    private ServiceDto service;
    private LocalDateTime createdAt;

    public static HotelAmenityResponse fromEntity(HotelAmenity entity) {
        HotelAmenityResponse dto = new HotelAmenityResponse();
        dto.setId(entity.getId());

        dto.setHotelId(entity.getHotel() != null ? entity.getHotel().getId() : null);
        dto.setCreatedAt(entity.getCreatedAt());

        Services serviceEntity = entity.getService();
        if (serviceEntity != null) {
            dto.setService(new ServiceDto(
                    serviceEntity.getId(),
                    serviceEntity.getCode(),
                    serviceEntity.getName(),
                    serviceEntity.getDescription(),
                    serviceEntity.getPrice()
            ));
        }
        return dto;
    }
}