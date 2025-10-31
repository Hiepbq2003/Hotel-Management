package com.project.mhotel.dto;

import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.entity.UserAccount.Status;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private Status status;
    private String hotelName;
}