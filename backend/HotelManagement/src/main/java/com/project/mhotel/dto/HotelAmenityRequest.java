package com.project.mhotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HotelAmenityRequest {

    private Long hotelId;
    // ✅ THAY THẾ: Chỉ cần ID của Service được chọn
    private Long serviceId;
}