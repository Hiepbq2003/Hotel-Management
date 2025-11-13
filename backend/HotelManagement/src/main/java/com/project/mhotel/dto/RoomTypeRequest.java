package com.project.mhotel.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomTypeRequest {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Integer capacity;
    private String bedInfo;
    private BigDecimal basePrice;
    private String image;
}