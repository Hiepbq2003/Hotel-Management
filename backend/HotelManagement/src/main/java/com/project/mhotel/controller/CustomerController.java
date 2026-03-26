package com.project.mhotel.controller;

import com.project.mhotel.dto.CustomerResponse;
import com.project.mhotel.dto.RegisterRequest;
import com.project.mhotel.dto.CustomerUpdateRequest;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    @PutMapping("/{customerId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long customerId, @RequestBody Map<String, String> request) {
        String statusString = request.get("newStatus");
        if (statusString == null || statusString.isEmpty()) {
            return ResponseEntity.badRequest().body("Missing newStatus field.");
        }
        try {
            Status newStatus = Status.valueOf(statusString.toLowerCase());
            CustomerResponse updated = customerService.updateStatus(customerId, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status. Must be 'active', 'inactive', or 'blocked'.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update status.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getFullName() == null) {
            return ResponseEntity.badRequest().body("email, password, and fullName are required.");
        }
        try {
            CustomerResponse newCustomer = customerService.createCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCustomer);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create customer.");
        }
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomerDetails(@PathVariable Long customerId, @RequestBody CustomerUpdateRequest request) {
        if (request.getFullName() == null || request.getFullName().isEmpty()) {
            return ResponseEntity.badRequest().body("fullName is required.");
        }
        try {
            CustomerResponse updated = customerService.updateCustomerDetails(customerId, request);
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update customer.");
        }
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) {
        try {
            customerService.deleteCustomer(customerId);
            return ResponseEntity.ok("Customer ID " + customerId + " deleted successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete customer.");
        }
    }
}