package com.project.mhotel.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignedRoomResponse {
    private String number;
    private String type;
}

