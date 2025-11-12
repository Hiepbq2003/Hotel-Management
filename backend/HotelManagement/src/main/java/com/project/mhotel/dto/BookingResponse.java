package com.project.mhotel.dto;

import lombok.Data;

@Data
public class BookingResponse {
    private Long reservationId;
    private String reservationCode;
    private String status;
    private String message;

    public BookingResponse(Long reservationId, String reservationCode, String status, String message) {
        this.reservationId = reservationId;
        this.reservationCode = reservationCode;
        this.status = status;
        this.message = message;
    }
}
