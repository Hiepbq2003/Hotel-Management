package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservation_room",
        indexes = {
                @Index(name = "idx_reservationroom_reservation", columnList = "reservation_id"),
                @Index(name = "idx_reservationroom_room_type", columnList = "room_type_id")
        })
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reservationroom_reservation"))
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "room_id",
            foreignKey = @ForeignKey(name = "fk_reservationroom_room"))
    private Room room;

    @ManyToOne
    @JoinColumn(name = "room_type_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reservationroom_roomtype"))
    private RoomType roomType;

    @ManyToOne
    @JoinColumn(name = "rate_plan_id",
            foreignKey = @ForeignKey(name = "fk_reservationroom_rateplan"))
    private RatePlan ratePlan;

    @Column(name = "nightly_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal nightlyPrice;

    @Column(name = "checkin_date", nullable = false)
    private LocalDateTime checkinDate;

    @Column(name = "checkout_date", nullable = false)
    private LocalDateTime checkoutDate;

    @Column(name = "adult_count", nullable = false)
    private Integer adultCount = 1;

    @Column(name = "child_count", nullable = false)
    private Integer childCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('booked','checked_in','checked_out','cancelled') DEFAULT 'booked'")
    private Status status = Status.booked;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Status {
        booked, checked_in, checked_out, cancelled
    }
}
