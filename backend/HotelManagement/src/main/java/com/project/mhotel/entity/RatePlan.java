package com.project.mhotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "rate_plan",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"hotel_id", "code"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatePlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quan hệ với Hotel
    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_rateplan_hotel"))
    private Hotel hotel;

    @Column(nullable = false, length = 100)
    private String code;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "rate_type", nullable = false, columnDefinition = "ENUM('standard','non_refundable','promo','corporate') DEFAULT 'standard'")
    private RateType rateType = RateType.standard;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    // Quan hệ với RoomRate (1 rate plan có nhiều room rates)
    @OneToMany(mappedBy = "ratePlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomRate> roomRates;

    public enum RateType {
        standard, non_refundable, promo, corporate
    }
}
