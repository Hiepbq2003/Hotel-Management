package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Reservation (nullable)
    @ManyToOne
    @JoinColumn(name = "reservation_id",
            foreignKey = @ForeignKey(name = "fk_invoice_reservation"))
    private Reservation reservation;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id",
            foreignKey = @ForeignKey(name = "fk_invoice_hotel"))
    private Hotel hotel;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 100)
    private String invoiceNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDateTime issuedAt = LocalDateTime.now();

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal total;

    @Column(precision = 14, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('open','paid','cancelled') DEFAULT 'open'")
    private Status status = Status.open;

    public enum Status {
        open, paid, cancelled
    }
}
