package com.project.mhotel.dto;

import com.project.mhotel.entity.CustomerAccount.Status;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String email;
    private String phone;
    private String fullName;
    private Status status;
    private LocalDateTime createdAt;
}