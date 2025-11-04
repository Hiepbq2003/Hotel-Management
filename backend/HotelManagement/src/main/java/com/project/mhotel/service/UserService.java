package com.project.mhotel.service;

import com.project.mhotel.entity.UserAccount.Role;
import com.project.mhotel.dto.UserRequest;
import com.project.mhotel.dto.UserResponse;
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.UserAccount.Status;
import com.project.mhotel.repository.HotelRepository;
import com.project.mhotel.repository.UserAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private HotelRepository hotelRepository;

    private static final Set<Role> STAFF_ROLES = Set.of(
            Role.admin,
            Role.manager,
            Role.reception,
            Role.housekeeping
    );

    /**
     * Phương thức cập nhật tên (fullName), số điện thoại (phone) và vai trò (role) của nhân viên.
     * Chỉ Admin mới có quyền thực hiện.
     */
    public UserResponse updateStaffDetails(Long targetUserId, UserRequest request, Role callerRole) {

        UserAccount targetUser = userAccountRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("Tài khoản người dùng không tồn tại."));

        // Kiểm tra quyền Admin
        if (callerRole != Role.admin) {
            throw new SecurityException("Bạn không có quyền cập nhật thông tin chi tiết người dùng. Chỉ Admin mới có quyền này.");
        }

        // Ngăn Admin thay đổi vai trò của tài khoản Admin khác hoặc chính mình
        if (targetUser.getRole() == Role.admin && request.getRole() != targetUser.getRole()) {
            throw new SecurityException("Không thể thay đổi vai trò của tài khoản Admin.");
        }

        // Cập nhật FullName (nếu có trong request)
        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            targetUser.setFullName(request.getFullName().trim());
        }

        // Cập nhật Phone (nếu có trong request)
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            targetUser.setPhone(request.getPhone().trim());
        }

        // Cập nhật Role (nếu có trong request)
        if (request.getRole() != null) {
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

    /**
     * Phương thức tạo người dùng mới.
     * Chỉ Admin mới có quyền thực hiện.
     */
    public UserResponse createUser(UserRequest request, Role callerRole) {

        // Kiểm tra quyền Admin
        if (callerRole != Role.admin) {
            throw new SecurityException("Bạn không có quyền tạo tài khoản người dùng mới. Chỉ Admin mới có quyền này.");
        }

        if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        if (userAccountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username đã được sử dụng.");
        }

        // 🌟 Chỉnh sửa theo yêu cầu: Bỏ qua logic Hotel và gán luôn là null
        Hotel hotel = null;

        UserAccount newUser = UserAccount.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : Role.reception) // Đảm bảo role có giá trị
                .status(Status.active)
                .hotel(hotel) // hotel giờ là null
                .createdAt(LocalDateTime.now())
                .build();

        return toUserResponse(userAccountRepository.save(newUser));
    }

    public List<UserResponse> getAllUsers() {
        // Đây là chức năng Xem. Không cần kiểm tra quyền Admin, quyền này sẽ được kiểm tra ở tầng Controller
        return userAccountRepository.findAll().stream()
                .filter(user -> STAFF_ROLES.contains(user.getRole()))
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    /**
     * Phương thức cập nhật trạng thái (active/inactive/blocked).
     * Chỉ Admin mới có quyền thực hiện.
     */
    public UserResponse updateStatus(Long userId, Status newStatus, Role callerRole) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        // Kiểm tra quyền Admin
        if (callerRole != Role.admin) {
            throw new SecurityException("Bạn không có quyền thay đổi trạng thái của người dùng này. Chỉ Admin mới có quyền này.");
        }

        // Ngăn Admin thay đổi trạng thái của tài khoản Admin
        if (user.getRole() == Role.admin) {
            throw new SecurityException("Không thể thay đổi trạng thái của tài khoản Admin.");
        }

        user.setStatus(newStatus);

        return toUserResponse(userAccountRepository.save(user));
    }

}