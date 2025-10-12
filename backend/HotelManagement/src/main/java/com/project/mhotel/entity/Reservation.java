package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reservation",
        indexes = {
                @Index(name = "idx_reservation_hotel", columnList = "hotel_id"),
                @Index(name = "idx_reservation_dates", columnList = "arrival_date, departure_date"),
                @Index(name = "idx_reservation_guest", columnList = "guest_id")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reservation_hotel"))
    private Hotel hotel;

    @Column(name = "reservation_code", nullable = false, unique = true, length = 100)
    private String reservationCode;

    // Quan hệ với Guest
    @ManyToOne
    @JoinColumn(name = "guest_id",
            foreignKey = @ForeignKey(name = "fk_reservation_guest"))
    private Guest guest;

    // Người tạo đặt phòng
    @ManyToOne
    @JoinColumn(name = "created_by",
            foreignKey = @ForeignKey(name = "fk_reservation_user"))
    private UserAccount createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('reserved','checked_in','checked_out','cancelled','no_show') DEFAULT 'reserved'")
    private Status status = Status.reserved;

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(name = "total_amount", precision = 14, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(length = 10)
    private String currency = "USD";

    @Column
    private Integer pax = 1;

    @Column(name = "booking_source", length = 100)
    private String bookingSource;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Quan hệ với ReservationRoom
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReservationRoom> reservationRooms;

    // Quan hệ với Payment
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments;

    // Quan hệ với Invoice
    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Invoice> invoices;

    // Enum trạng thái đặt phòng
    public enum Status {
        reserved, checked_in, checked_out, cancelled, no_show
    }
}
