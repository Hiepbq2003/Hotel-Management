package com.project.mhotel.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardStatsResponse {
    private Long totalRooms;
    private Long availableRooms;
    private Long bookedRooms;
    private BigDecimal totalMonthlyRevenue;
    private BigDecimal totalAnnualRevenue;
    private Long totalEmployees;
    private Long bookingsToday;
}