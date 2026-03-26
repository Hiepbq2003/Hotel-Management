package com.project.mhotel.dto;

import com.project.mhotel.entity.UserAccount.Status;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private Status status;
    private LocalDateTime createdAt;
}