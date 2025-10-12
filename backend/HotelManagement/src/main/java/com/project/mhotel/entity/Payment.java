package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment",
        indexes = {@Index(name = "idx_payment_reservation", columnList = "reservation_id")})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Reservation (nullable)
    @ManyToOne
    @JoinColumn(name = "reservation_id",
            foreignKey = @ForeignKey(name = "fk_payment_reservation"))
    private Reservation reservation;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id",
            foreignKey = @ForeignKey(name = "fk_payment_hotel"))
    private Hotel hotel;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal amount;

    @Column(length = 10)
    private String currency = "USD";

    @Column(name = "paid_at", nullable = false)
    private LocalDateTime paidAt = LocalDateTime.now();

    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    @Column(name = "transaction_ref", length = 200)
    private String transactionRef;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('completed','pending','failed','refunded') DEFAULT 'completed'")
    private Status status = Status.completed;

    // Người tạo (nullable)
    @ManyToOne
    @JoinColumn(name = "created_by",
            foreignKey = @ForeignKey(name = "fk_payment_user"))
    private UserAccount createdBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum Status {
        completed, pending, failed, refunded
    }
}
