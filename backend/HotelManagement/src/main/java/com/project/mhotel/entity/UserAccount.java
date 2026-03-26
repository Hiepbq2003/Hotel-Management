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

    @ManyToOne
    @JoinColumn(name = "hotel_id",
            foreignKey = @ForeignKey(name = "fk_user_hotel"))
    private Hotel hotel;

    @Column(length = 100)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 200)
    private String fullName;

    @Column(length = 150, unique = true)
    private String email;

    @Column(length = 50)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('admin','manager','reception','housekeeping','customer') DEFAULT 'customer'")
    private Role role = Role.customer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('active','inactive','blocked') DEFAULT 'active'")
    private Status status = Status.active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        admin, manager, reception, housekeeping, customer
    }

    public enum Status {
        active, inactive, blocked
    }

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HouseKeepingTask> housekeepingTasks;
}
