package com.project.mhotel.dto;

import lombok.Data;

@Data
public class RoomTypeCreationDto {

    private String name;
    private String description;
    private Integer capacity;
    private String bedInfo;
    private Double basePrice;
    private String imageUrl;

    private Long hotelId;
}