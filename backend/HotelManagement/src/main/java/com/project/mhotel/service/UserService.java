package com.project.mhotel.service;

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
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private HotelRepository hotelRepository;

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
    public UserResponse createUser(UserRequest request) {

        // 1. Kiểm tra Email đã tồn tại
        if (userAccountRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email đã được sử dụng.");
        }

        // 2. Kiểm tra Username đã tồn tại
        if (userAccountRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username đã được sử dụng.");
        }
        Hotel hotel = null;
        if (request.getHotelId() != null) {
            hotel = hotelRepository.findById(request.getHotelId())
                    .orElseThrow(() -> new IllegalArgumentException("Hotel không tồn tại với ID: " + request.getHotelId()));
        }

        // 4. Tạo Entity (Bỏ updatedAt)
        UserAccount newUser = UserAccount.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(request.getPassword())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(request.getRole())
                .status(Status.active)
                .hotel(hotel)
                .createdAt(LocalDateTime.now())
                .build();

        return toUserResponse(userAccountRepository.save(newUser));
    }

    public List<UserResponse> getAllUsers() {
        return userAccountRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse updateStatus(Long userId, Status newStatus) {
        UserAccount user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại."));

        user.setStatus(newStatus);

        return toUserResponse(userAccountRepository.save(user));
    }
}