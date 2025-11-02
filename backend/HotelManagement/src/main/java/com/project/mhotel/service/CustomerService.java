package com.project.mhotel.service;

import com.project.mhotel.dto.CustomerResponse;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.CustomerUpdateRequest;
import com.project.mhotel.entity.CustomerAccount;
import com.project.mhotel.entity.CustomerAccount.Status;
import com.project.mhotel.repository.CustomerAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class CustomerService {

    @Autowired
    private CustomerAccountRepository customerAccountRepository;

    public List<CustomerResponse> getAllCustomers() {
        List<CustomerAccount> customers = customerAccountRepository.findAll();

        // Map sang CustomerResponse DTO
        return customers.stream()
                .map(customer -> new CustomerResponse(
                        customer.getId(),
                        customer.getEmail(),
                        customer.getPhone(),
                        customer.getFullName(),
                        customer.getStatus(),
                        customer.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public CustomerResponse updateStatus(Long customerId, Status newStatus) {
        CustomerAccount customer = customerAccountRepository.findById(customerId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tài khoản khách hàng với ID: " + customerId));

        customer.setStatus(newStatus);
        customer.setUpdatedAt(LocalDateTime.now());

        CustomerAccount updatedCustomer = customerAccountRepository.save(customer);

        return new CustomerResponse(
                updatedCustomer.getId(),
                updatedCustomer.getEmail(),
                updatedCustomer.getPhone(),
                updatedCustomer.getFullName(),
                updatedCustomer.getStatus(),
                updatedCustomer.getCreatedAt()
        );
    }

    // --- Bổ sung chức năng CREATE ---
    public CustomerResponse createCustomer(RegisterRequest request) {
        if (customerAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã tồn tại.");
        }

        // CHÚ Ý AN TOÀN: Trong ứng dụng thực tế, 'password' phải được HASH (ví dụ: dùng BCryptPasswordEncoder) trước khi lưu.
        String hashedPassword = request.getPassword(); // Thay thế bằng logic hash thực tế

        CustomerAccount newCustomer = CustomerAccount.builder()
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .phone(request.getPhone())
                .fullName(request.getFullName())
                .status(Status.active) // Trạng thái mặc định là active
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        CustomerAccount savedCustomer = customerAccountRepository.save(newCustomer);

        return new CustomerResponse(
                savedCustomer.getId(),
                savedCustomer.getEmail(),
                savedCustomer.getPhone(),
                savedCustomer.getFullName(),
                savedCustomer.getStatus(),
                savedCustomer.getCreatedAt()
        );
    }

    // --- Bổ sung chức năng EDIT (tên và SĐT) ---
    public CustomerResponse updateCustomerDetails(Long customerId, CustomerUpdateRequest request) {
        CustomerAccount customer = customerAccountRepository.findById(customerId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy tài khoản khách hàng với ID: " + customerId));

        customer.setFullName(request.getFullName());
        customer.setPhone(request.getPhone());
        customer.setUpdatedAt(LocalDateTime.now());

        CustomerAccount updatedCustomer = customerAccountRepository.save(customer);

        return new CustomerResponse(
                updatedCustomer.getId(),
                updatedCustomer.getEmail(),
                updatedCustomer.getPhone(),
                updatedCustomer.getFullName(),
                updatedCustomer.getStatus(),
                updatedCustomer.getCreatedAt()
        );
    }

    // --- Bổ sung chức năng DELETE ---
    public void deleteCustomer(Long customerId) {
        if (!customerAccountRepository.existsById(customerId)) {
            throw new NoSuchElementException("Không tìm thấy tài khoản khách hàng với ID: " + customerId);
        }
        customerAccountRepository.deleteById(customerId);
    }
}