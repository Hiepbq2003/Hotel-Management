package com.project.mhotel.service;

import com.project.mhotel.dto.CustomerResponse;
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
}