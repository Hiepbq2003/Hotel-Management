package com.project.mhotel.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

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

    // Thông tin khách sạn (rút gọn)
    private Long hotelId;
    private String hotelName;
}

