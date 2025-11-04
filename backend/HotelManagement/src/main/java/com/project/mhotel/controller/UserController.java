//package com.project.mhotel.controller;
//
//import com.project.mhotel.dto.UserRequest;
//import com.project.mhotel.dto.UserResponse;
//import com.project.mhotel.entity.UserAccount;
//import com.project.mhotel.entity.UserAccount.Role;
//import com.project.mhotel.entity.UserAccount.Status;
//import com.project.mhotel.service.UserService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/user")
//@CrossOrigin(origins = "*", allowedHeaders = {"Authorization", "Content-Type", "X-User-Role"})
//public class UserController {
//
//    @Autowired
//    private UserService userService;
//
//    // Endpoint: Thêm/Tạo mới người dùng (Admin-Only)
//    @PostMapping
//    public ResponseEntity<?> createUser(@RequestBody UserRequest request, @RequestHeader(value = "X-User-Role", required = false) String callerRoleStr) {
//        if (callerRoleStr == null || callerRoleStr.trim().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Lỗi xác thực: Header 'X-User-Role' bị thiếu.");
//        }
//        try {
//            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
//            UserResponse newUser = userService.createUser(request, callerRole);
//            return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
//        } catch (IllegalArgumentException e) {
//            if (e.getMessage().contains("No enum constant")) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
//            }
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        } catch (SecurityException e) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Tạo tài khoản thất bại: Lỗi hệ thống.");
//        }
//    }
//
//    @GetMapping("/staff")
//    public ResponseEntity<List<UserResponse>> getAllUsers() {
//
//        List<UserResponse> users = userService.getAllUsers();
//        return ResponseEntity.ok(users);
//    }
//
//    // PHƯƠNG THỨC CẦN SỬA: updateStatus
//    @PutMapping("/{userId}/status")
//    public ResponseEntity<?> updateStatus(
//            @PathVariable Long userId,
//            @RequestBody Map<String, String> request,
//            @RequestHeader(value = "X-User-Role", required = false) String callerRoleStr) { // SỬA ĐỔI QUAN TRỌNG
//
//        // KIỂM TRA HEADER BẰNG TAY
//        if (callerRoleStr == null || callerRoleStr.trim().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Lỗi xác thực: Header 'X-User-Role' bị thiếu.");
//        }
//
//        String statusString = request.get("newStatus");
//        if (statusString == null || statusString.isEmpty()) {
//            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái mới (newStatus).");
//        }
//
//        try {
//            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
//            Status newStatus = Status.valueOf(statusString.toUpperCase()); // Chuyển toUpperCase để khớp với Enum
//
//            UserResponse updatedUser = userService.updateStatus(userId, newStatus, callerRole);
//            return ResponseEntity.ok(updatedUser);
//        } catch (IllegalArgumentException e) {
//            if (e.getMessage().contains("No enum constant")) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ. Phải là 'ACTIVE', 'INACTIVE', hoặc 'BLOCKED'.");
//            }
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        } catch (SecurityException e) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật trạng thái thất bại: Lỗi hệ thống.");
//        }
//    }
//
//    // NEW Endpoint: Chỉnh sửa Chi tiết (Tên/SĐT và Vai trò) (Admin-Only)
//    @PutMapping("/{id}/details")
//    public ResponseEntity<?> updateStaffDetails(
//            @PathVariable Long id,
//            @RequestBody UserRequest request,
//            @RequestHeader(value = "X-User-Role", required = false) String callerRoleStr) { // SỬA ĐỔI
//
//        // KIỂM TRA HEADER BẰNG TAY
//        if (callerRoleStr == null || callerRoleStr.trim().isEmpty()) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Lỗi xác thực: Header 'X-User-Role' bị thiếu.");
//        }
//
//        try {
//
//            Role callerRole = Role.valueOf(callerRoleStr.toUpperCase());
//
//            UserResponse updatedUser = userService.updateStaffDetails(id, request, callerRole);
//
//            return ResponseEntity.ok(updatedUser);
//
//        } catch (IllegalArgumentException e) {
//            if (e.getMessage().contains("No enum constant")) {
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
//            }
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
//        } catch (SecurityException e) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống khi cập nhật chi tiết người dùng: " + e.getMessage());
//        }
//    }
//
//}
package com.project.mhotel.controller;

import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
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
// Giữ lại allowedHeaders để tránh các lỗi CORS khác
@CrossOrigin(origins = "*", allowedHeaders = {"Authorization", "Content-Type", "X-User-Role"})
public class UserController {

    @Autowired
    private UserService userService;

    // Vai trò Admin được gán cứng để vượt qua vấn đề Header
    private static final Role HARDCODED_ADMIN_ROLE = Role.admin;

    // Endpoint: Thêm/Tạo mới người dùng (Admin-Only)
    @PostMapping
    // Loại bỏ hoàn toàn @RequestHeader
    public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
        try {
            // Sử dụng vai trò Admin cứng
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
    // Loại bỏ hoàn toàn @RequestHeader
    public ResponseEntity<?> updateStatus(@PathVariable Long userId, @RequestBody Map<String, String> request) {
        String statusString = request.get("newStatus");
        if (statusString == null || statusString.isEmpty()) {
            return ResponseEntity.badRequest().body("Thiếu thông tin trạng thái mới (newStatus).");
        }

        try {
            Status newStatus = Status.valueOf(statusString.toUpperCase()); // Chuyển toUpperCase để khớp với Enum
            // Sử dụng vai trò Admin cứng
            UserResponse updatedUser = userService.updateStatus(userId, newStatus, HARDCODED_ADMIN_ROLE);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Trạng thái không hợp lệ. Phải là 'ACTIVE', 'INACTIVE', hoặc 'BLOCKED'.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (SecurityException e) {
            // SecurityException vẫn được ném ra từ UserService nếu Admin cố gắng sửa Admin khác
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Cập nhật trạng thái thất bại: Lỗi hệ thống.");
        }
    }

    // NEW Endpoint: Chỉnh sửa Chi tiết (Tên/SĐT và Vai trò) (Admin-Only)
    @PutMapping("/{id}/details")
    public ResponseEntity<?> updateStaffDetails(
            @PathVariable Long id,
            @RequestBody UserRequest request) {

        try {
            // Sử dụng vai trò Admin cứng
            UserResponse updatedUser = userService.updateStaffDetails(id, request, HARDCODED_ADMIN_ROLE);

            return ResponseEntity.ok(updatedUser);

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("No enum constant")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Vai trò không hợp lệ.");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (SecurityException e) {
            // SecurityException vẫn được ném ra từ UserService nếu Admin cố gắng sửa Admin khác
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống khi cập nhật chi tiết người dùng: " + e.getMessage());
        }
    }

}
