package com.project.mhotel.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PaymentRequest {
    private BigDecimal amount;
    private String paymentMethod;
    private String transactionRef;
    private String notes;
}