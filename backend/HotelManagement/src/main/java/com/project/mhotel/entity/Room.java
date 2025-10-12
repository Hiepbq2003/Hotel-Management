package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "room",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"hotel_id", "room_number"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_room_hotel"))
    private Hotel hotel;

    @Column(name = "room_number", nullable = false, length = 50)
    private String roomNumber;

    // Quan hệ với RoomType
    @ManyToOne
    @JoinColumn(name = "room_type_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_room_room_type"))
    private RoomType roomType;

    @Column
    private Integer floor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('available','occupied','maintenance','out_of_service') DEFAULT 'available'")
    private Status status = Status.available;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Enum cho trạng thái phòng
    public enum Status {
        available, occupied, maintenance, out_of_service
    }
}
