package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "user_account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Hotel (nullable)
    @ManyToOne
    @JoinColumn(name = "hotel_id",
            foreignKey = @ForeignKey(name = "fk_user_hotel"))
    private Hotel hotel;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(length = 150)
    private String email;

    @Column(length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('admin','manager','reception','housekeeping') DEFAULT 'reception'")
    private Role role = Role.reception;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('active','inactive','blocked') DEFAULT 'active'")
    private Status status = Status.active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum cho role
    public enum Role {
        admin, manager, reception, housekeeping
    }

    // Enum cho status
    public enum Status {
        active, inactive, blocked
    }

    // Optional: Quan hệ với HousekeepingTask (1 user được giao nhiều task)
    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HouseKeepingTask> housekeepingTasks;
}
