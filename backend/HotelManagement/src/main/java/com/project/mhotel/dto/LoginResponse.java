package com.project.mhotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long customerId;
    private String token;
    private String email;
    private String role;
    private String fullName;
    private String phone;
}
