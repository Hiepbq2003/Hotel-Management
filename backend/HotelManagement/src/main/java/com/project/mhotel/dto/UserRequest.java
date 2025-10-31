package com.project.mhotel.dto;

import com.project.mhotel.entity.UserAccount.Role;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Role role;
    private Long hotelId;
}