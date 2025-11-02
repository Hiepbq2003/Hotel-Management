package com.project.mhotel.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class CustomerUpdateRequest {
    @NonNull
    private String fullName;
    private String phone;
}