package com.project.mhotel.service;

import com.project.mhotel.dto.CustomerResponse;
import com.project.mhotel.dto.CustomerUpdateRequest;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    private CustomerResponse toResponse(UserAccount u) {
        return new CustomerResponse(u.getId(), u.getEmail(), u.getPhone(),
                u.getFullName(), u.getStatus(), u.getCreatedAt());
    }

    public List<CustomerResponse> getAllCustomers() {
        return userAccountRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.customer)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CustomerResponse updateStatus(Long customerId, Status newStatus) {
        UserAccount user = userAccountRepository.findById(customerId)
                .orElseThrow(() -> new NoSuchElementException("Customer not found with ID: " + customerId));
        user.setStatus(newStatus);
        return toResponse(userAccountRepository.save(user));
    }

    public CustomerResponse createCustomer(RegisterRequest request) {
        if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        UserAccount newUser = UserAccount.builder()
                .username(request.getEmail())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone() != null ? request.getPhone() : "")
                .fullName(request.getFullName())
                .role(Role.customer)
                .status(Status.active)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(userAccountRepository.save(newUser));
    }

    public CustomerResponse updateCustomerDetails(Long customerId, CustomerUpdateRequest request) {
        UserAccount user = userAccountRepository.findById(customerId)
                .orElseThrow(() -> new NoSuchElementException("Customer not found with ID: " + customerId));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        return toResponse(userAccountRepository.save(user));
    }

    public void deleteCustomer(Long customerId) {
        if (!userAccountRepository.existsById(customerId)) {
            throw new NoSuchElementException("Customer not found with ID: " + customerId);
        }
        userAccountRepository.deleteById(customerId);
    }
}