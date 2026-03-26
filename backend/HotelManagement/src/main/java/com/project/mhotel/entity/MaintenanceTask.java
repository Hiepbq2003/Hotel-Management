package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.Optional;

@Entity
@Table(name = "maintenance_task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_maintenance_hotel"))
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_id",
            foreignKey = @ForeignKey(name = "fk_maintenance_room"))
    private Room room;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne
    @JoinColumn(name = "reported_by",
            foreignKey = @ForeignKey(name = "fk_maintenance_reported_by"))
    private UserAccount reportedBy;

    @ManyToOne
    @JoinColumn(name = "assigned_to",
            foreignKey = @ForeignKey(name = "fk_maintenance_assigned_to"))
    private UserAccount assignedTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('open','in_progress','resolved','closed') DEFAULT 'open'")
    private Status status = Status.open;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        open, in_progress, resolved, closed
    }
}
