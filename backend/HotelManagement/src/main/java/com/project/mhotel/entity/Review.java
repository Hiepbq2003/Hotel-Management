package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "review",
        indexes = {@Index(name = "idx_review_hotel", columnList = "hotel_id")})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_review_hotel"))
    private Hotel hotel;

    // Quan hệ với Guest (nullable)
    @ManyToOne
    @JoinColumn(name = "guest_id",
            foreignKey = @ForeignKey(name = "fk_review_guest"))
    private Guest guest;

    // Quan hệ với Reservation (nullable)
    @ManyToOne
    @JoinColumn(name = "reservation_id",
            foreignKey = @ForeignKey(name = "fk_review_reservation"))
    private Reservation reservation;

    @Column(nullable = false)
    private Short rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    private void validateRating() {
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }
}
