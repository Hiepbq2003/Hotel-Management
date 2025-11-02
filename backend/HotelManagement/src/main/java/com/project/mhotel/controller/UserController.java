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
@RequestMapping("/api/manager/user-management")
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

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateStaffRole(
            @PathVariable Long id,
            @RequestBody UserRequest request,
            @RequestHeader("X-User-Role") String callerRoleStr) {

        try {

            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
            Role newRole = Role.valueOf(request.getRole().name().toUpperCase());

            UserAccount updatedUser = userService.updateUserRole(id, newRole, callerRole);

            String hotelName = updatedUser.getHotel() != null ? updatedUser.getHotel().getName() : null;

            return ResponseEntity.ok(new UserResponse(
                    updatedUser.getId(),
                    updatedUser.getUsername(),
                    updatedUser.getEmail(),
                    updatedUser.getFullName(),
                    updatedUser.getPhone(),
                    updatedUser.getRole(),
                    updatedUser.getStatus(),
                    hotelName
            ));

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống khi cập nhật vai trò: " + e.getMessage());
        }
    }
}