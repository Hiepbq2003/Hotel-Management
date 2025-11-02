package com.project.mhotel.controller;

import com.project.mhotel.dto.CustomerResponse;
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
}