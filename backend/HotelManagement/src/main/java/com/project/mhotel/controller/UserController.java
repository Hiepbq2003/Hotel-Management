package com.project.mhotel.controller;

import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // Endpoint: Thêm/Tạo mới người dùng (Admin-Only)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest request, @RequestHeader("X-User-Role") String callerRoleStr) {
        try {
            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
            UserResponse newUser = userService.createUser(request, callerRole);
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
    public ResponseEntity<?> updateStatus(@PathVariable Long userId, @RequestBody Map<String, String> request, @RequestHeader("X-User-Role") String callerRoleStr) {
        String statusString = request.get("newStatus");
        if (statusString == null || statusString.isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái mới (newStatus).");
        }

        try {
            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
            Status newStatus = Status.valueOf(statusString.toUpperCase()); // Chuyển toUpperCase để khớp với Enum

            UserResponse updatedUser = userService.updateStatus(userId, newStatus, callerRole);
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

    // NEW Endpoint: Chỉnh sửa Chi tiết (Tên/SĐT và Vai trò) (Admin-Only)
    @PutMapping("/{id}/details")
    public ResponseEntity<?> updateStaffDetails(
            @PathVariable Long id,
            @RequestBody UserRequest request,
            @RequestHeader("X-User-Role") String callerRoleStr) {

        try {

            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());

            UserResponse updatedUser = userService.updateStaffDetails(id, request, callerRole);

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