package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_service")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Reservation
    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reservationservice_reservation"))
    private Reservation reservation;

    // Quan hệ với Service
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reservationservice_service"))
    private Services service;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "total_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
