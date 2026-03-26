package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_rate",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"room_type_id", "rate_plan_id", "date"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_roomrate_hotel"))
    private Hotel hotel;

    @ManyToOne
    @JoinColumn(name = "room_type_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_roomrate_roomtype"))
    private RoomType roomType;

    @ManyToOne
    @JoinColumn(name = "rate_plan_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_roomrate_rateplan"))
    private RatePlan ratePlan;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "available_count")
    private Integer availableCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
