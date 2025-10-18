package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "housekeeping_task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseKeepingTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_housekeeping_hotel"))
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_housekeeping_room"))
    private Room room;

    @ManyToOne
    @JoinColumn(name = "assigned_to",
            foreignKey = @ForeignKey(name = "fk_housekeeping_user"))
    private UserAccount assignedTo;

    @Column(name = "task_date", nullable = false)
    private LocalDate taskDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('pending','in_progress','done') DEFAULT 'pending'")
    private Status status = Status.pending;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        pending, in_progress, done
    }
}
