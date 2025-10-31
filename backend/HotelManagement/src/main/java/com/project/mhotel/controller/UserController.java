package com.project.mhotel.controller;

import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users") // Endpoint dành cho Admin/Manager
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
        try {
            UserResponse newUser = userService.createUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Tạo tài khoản thất bại: Lỗi hệ thống.");
        }
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String statusString = request.get("newStatus");
        if (statusString == null || statusString.isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái mới (newStatus).");
        }

        try {
            Status newStatus = Status.valueOf(statusString.toLowerCase());
            UserResponse updatedUser = userService.updateStatus(userId, newStatus);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ. Phải là 'active', 'inactive', hoặc 'blocked'.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật trạng thái thất bại: Lỗi hệ thống.");
        }
    }

}