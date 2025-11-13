package com.project.mhotel.dto;

import lombok.Data;

@Data
public class VerifyDocumentRequest {
    private String reservationCode;
    private String documentType;
    private String documentNumber;
}
