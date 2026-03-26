package com.project.mhotel.service;

import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.repository.HotelRepository;
import com.project.mhotel.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Set<String> STAFF_ROLES_STRING = Set.of(
            Role.admin.name().toUpperCase(),
            Role.manager.name().toUpperCase(),
            Role.reception.name().toUpperCase(),
            Role.housekeeping.name().toUpperCase()
    );

    public UserResponse resetStaffPassword(Long targetUserId, Role callerRole) {

        UserAccount targetUser = userAccountRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản người dùng không tồn tại."));

        if (!callerRole.name().toUpperCase().equals(Role.admin.name().toUpperCase())) {
            throw new SecurityException("Bạn không có quyền reset mật khẩu. Chỉ Admin mới có quyền này.");
        }

        if (targetUser.getRole() == Role.manager) {
            throw new SecurityException("Không thể reset mật khẩu của tài khoản Manager độc nhất.");
        }

        final String DEFAULT_PASSWORD = "123456";
        String newHashedPassword = passwordEncoder.encode(DEFAULT_PASSWORD);

        targetUser.setPasswordHash(newHashedPassword);

        return toUserResponse(userAccountRepository.save(targetUser));
    }

    public UserResponse createUser(UserRequest request, Role callerRole) {

        if (!callerRole.name().toUpperCase().equals(Role.admin.name().toUpperCase())) {
            throw new SecurityException("Bạn không có quyền tạo tài khoản người dùng mới. Chỉ Admin mới có quyền này.");
        }

        if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        if (userAccountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username đã được sử dụng.");
        }

        Hotel hotel = null;

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        UserAccount newUser = UserAccount.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(hashedPassword)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.reception)
                .status(Status.active)
                .hotel(hotel)
                .createdAt(LocalDateTime.now())
                .build();

        return toUserResponse(userAccountRepository.save(newUser));
    }

    public UserResponse updateStaffDetails(Long targetUserId, UserRequest request, Role callerRole) {

        UserAccount targetUser = userAccountRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản người dùng không tồn tại."));

        if (!callerRole.name().toUpperCase().equals(Role.admin.name().toUpperCase())) {
            throw new SecurityException("Bạn không có quyền cập nhật thông tin chi tiết người dùng. Chỉ Admin mới có quyền này.");
        }

        if (targetUser.getRole() == Role.manager && (request.getRole() != null && request.getRole() != targetUser.getRole())) {

            throw new SecurityException("Không thể thay đổi vai trò của tài khoản Manager độc nhất.");
        }

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            targetUser.setFullName(request.getFullName().trim());
        }

        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            targetUser.setPhone(request.getPhone().trim());
        }

        if (request.getRole() != null) {
            if (!STAFF_ROLES_STRING.contains(request.getRole().name().toUpperCase())) {
                throw new IllegalArgumentException("Vai trò mới không hợp lệ.");
            }
            targetUser.setRole(request.getRole());
        }

        return toUserResponse(userAccountRepository.save(targetUser));
    }

    private UserResponse toUserResponse(UserAccount user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getHotel() != null ? user.getHotel().getName() : null
        );
    }

    public List<UserResponse> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .filter(user -> STAFF_ROLES_STRING.contains(user.getRole().name().toUpperCase()))
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateStatus(Long userId, Status newStatus, Role callerRole) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        if (!callerRole.name().toUpperCase().equals(Role.admin.name().toUpperCase())) {
            throw new SecurityException("Bạn không có quyền thay đổi trạng thái của người dùng này. Chỉ Admin mới có quyền này.");
        }

        if (user.getRole() == Role.manager) {
            throw new SecurityException("Không thể thay đổi trạng thái của tài khoản Manager độc nhất.");
        }

        user.setStatus(newStatus);

        return toUserResponse(userAccountRepository.save(user));
    }

}