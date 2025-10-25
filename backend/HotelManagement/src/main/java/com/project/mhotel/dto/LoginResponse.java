package com.project.mhotel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    // Token (JWT hoặc token giả lập) để Frontend sử dụng cho các request tiếp theo
    private String token;
    private String email;
    private String role;
}