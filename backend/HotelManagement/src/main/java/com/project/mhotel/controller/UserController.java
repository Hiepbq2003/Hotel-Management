package com.project.mhotel.controller;

import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")

@CrossOrigin(origins = "*", allowedHeaders = {"Authorization", "Content-Type", "X-User-Role"})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private static final Role HARDCODED_ADMIN_ROLE = Role.admin;

    @PostMapping

    public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
        try {

            UserResponse newUser = userService.createUser(request, HARDCODED_ADMIN_ROLE);
            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Tạo tài khoản thất bại: Lỗi hệ thống.");
        }
    }

    @GetMapping("/staff")
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
            Status newStatus = Status.valueOf(statusString.toUpperCase());
            UserResponse updatedUser = userService.updateStatus(userId, newStatus, HARDCODED_ADMIN_ROLE);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ. Phải là 'ACTIVE', 'INACTIVE', hoặc 'BLOCKED'.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật trạng thái thất bại: Lỗi hệ thống.");
        }
    }

    @PutMapping("/{userId}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long userId) {

        try {

            UserResponse updatedUser = userService.resetStaffPassword(userId, HARDCODED_ADMIN_ROLE);
            return ResponseEntity.ok(Map.of(
                    "message", "Đặt lại mật khẩu cho người dùng ID " + userId + " thành công. Mật khẩu mặc định: 123456.",
                    "user", updatedUser
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đặt lại mật khẩu thất bại: Lỗi hệ thống.");
        }
    }

    @PutMapping("/{id}/details")
    public ResponseEntity<?> updateStaffDetails(
            @PathVariable Long id,
            @RequestBody UserRequest request) {

        try {
            UserResponse updatedUser = userService.updateStaffDetails(id, request, HARDCODED_ADMIN_ROLE);

            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống khi cập nhật chi tiết người dùng: " + e.getMessage());
        }
    }

}