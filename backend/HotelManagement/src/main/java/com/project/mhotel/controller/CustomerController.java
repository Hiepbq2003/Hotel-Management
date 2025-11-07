package com.project.mhotel.controller;

import com.project.mhotel.dto.CustomerResponse;
import com.project.mhotel.dto.RegisterRequest; // <-- Import mới
import com.project.mhotel.dto.CustomerUpdateRequest; // <-- Import mới
import com.project.mhotel.entity.CustomerAccount.Status;
import com.project.mhotel.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(customers);
    }

    // Existing PUT: Update Status
    @PutMapping("/{customerId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long customerId, @RequestBody Map<String, String> request) {
        String statusString = request.get("newStatus");

        if (statusString == null || statusString.isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái mới (newStatus).");
        }

        try {

            Status newStatus = Status.valueOf(statusString.toLowerCase());
            CustomerResponse updatedCustomer = customerService.updateStatus(customerId, newStatus);

            return ResponseEntity.ok(updatedCustomer);

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ. Phải là 'active', 'inactive', hoặc 'blocked'.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật trạng thái thất bại: Lỗi hệ thống.");
        }
    }

    // --- Bổ sung chức năng CREATE (POST /api/customer) ---
    @PostMapping
    public ResponseEntity<?> createCustomer(@RequestBody RegisterRequest request) {
        if (request.getEmail() == null || request.getEmail().isEmpty() ||
                request.getPassword() == null || request.getPassword().isEmpty() ||
                request.getFullName() == null || request.getFullName().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin bắt buộc (email, password, fullName).");
        }

        try {
            CustomerResponse newCustomer = customerService.createCustomer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCustomer);
        } catch (IllegalArgumentException e) {
            // Lỗi email đã tồn tại
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Tạo tài khoản thất bại: Lỗi hệ thống.");
        }
    }

    // --- Bổ sung chức năng EDIT (PUT /api/customer/{customerId} để cập nhật tên/SĐT) ---
    @PutMapping("/{customerId}")
    public ResponseEntity<?> updateCustomerDetails(@PathVariable Long customerId, @RequestBody CustomerUpdateRequest request) {
        if (request.getFullName() == null || request.getFullName().isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin tên đầy đủ (fullName).");
        }

        try {
            CustomerResponse updatedCustomer = customerService.updateCustomerDetails(customerId, request);
            return ResponseEntity.ok(updatedCustomer);
        } catch (NoSuchElementException e) {
            // Lỗi không tìm thấy ID
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật thông tin khách hàng thất bại: Lỗi hệ thống.");
        }
    }

    // --- Bổ sung chức năng DELETE (DELETE /api/customer/{customerId}) ---
    @DeleteMapping("/{customerId}")
    public ResponseEntity<?> deleteCustomer(@PathVariable Long customerId) {
        try {
            customerService.deleteCustomer(customerId);
            // Trả về HTTP 200 OK với thông báo thành công
            return ResponseEntity.ok().body("Xóa tài khoản khách hàng với ID " + customerId + " thành công.");
        } catch (NoSuchElementException e) {
            // Lỗi không tìm thấy ID
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Xóa tài khoản khách hàng thất bại: Lỗi hệ thống.");
        }
    }
}