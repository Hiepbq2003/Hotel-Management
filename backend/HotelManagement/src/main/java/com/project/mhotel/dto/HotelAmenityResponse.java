// Giả định nội dung HotelAmenityResponse.java đã có:
package com.project.mhotel.dto;

import com.project.mhotel.entity.HotelAmenity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List; // Cần import List

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAmenityResponse {

    private Long id;
    private Long hotelId;
    private String name;
    private String description;
    private LocalDateTime createdAt;

    private List<RoomTypeDto> roomTypes;

    public static HotelAmenityResponse fromEntity(HotelAmenity entity) {
        HotelAmenityResponse dto = new HotelAmenityResponse();
        dto.setId(entity.getId());
        dto.setHotelId(entity.getHotel().getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}