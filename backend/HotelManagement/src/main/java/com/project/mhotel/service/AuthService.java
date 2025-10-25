package com.project.mhotel.service;

import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.CustomerAccount.Status;
import com.project.mhotel.repository.CustomerAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    public Optional<CustomerAccount> authenticateCustomer(String email, String rawPassword) {
        Optional<CustomerAccount> account = customerAccountRepository.findByEmail(email);

        if (account.isPresent()) {
            CustomerAccount customer = account.get();
            if (isPasswordMatch(rawPassword, customer.getPasswordHash()) && customer.getStatus() == Status.active) {
                return account;
            }
        }

        return Optional.empty();
    }

    private boolean isPasswordMatch(String rawPassword, String storedHash) {
        // LƯU Ý: Đây là so sánh mật khẩu thô (string equals), cần dùng BCryptPasswordEncoder trong thực tế.
        return rawPassword.equals(storedHash);
    }

    public CustomerAccount registerCustomer(RegisterRequest request) throws IllegalArgumentException {

        if (customerAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        CustomerAccount newCustomer = CustomerAccount.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .passwordHash(request.getPassword())
                .status(Status.active)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return customerAccountRepository.save(newCustomer);
    }
}