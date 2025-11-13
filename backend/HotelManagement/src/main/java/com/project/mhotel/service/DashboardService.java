// backend/HotelManagement/src/main/java/com/project/mhotel/service/DashboardService.java (Cập nhật)

package com.project.mhotel.service;

import com.project.mhotel.dto.DashboardStatsResponse;
import com.project.mhotel.repository.RoomRepository;
import com.project.mhotel.repository.PaymentRepository;
import com.project.mhotel.repository.UserAccountRepository;
import com.project.mhotel.repository.ReservationRepository; // 👈 THÊM IMPORT NÀY
import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.UserAccount;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class DashboardService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;
    @Autowired
    private ReservationRepository reservationRepository; // 👈 THÊM REPOSITORY NÀY

    public DashboardStatsResponse getDashboardStats(String userRole) {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        LocalDate todayDate = LocalDate.now();
        int currentYear = todayDate.getYear();
        int currentMonth = todayDate.getMonthValue();
        LocalDateTime startOfDay = todayDate.atStartOfDay();
        LocalDateTime startOfNextDay = todayDate.plusDays(1).atStartOfDay();

        // 1. Thống kê Phòng (Giữ nguyên)
        Long totalRooms = roomRepository.countTotalRooms();
        Long availableRooms = roomRepository.countByStatus(Room.Status.available);
        Long occupiedRooms = roomRepository.countByStatus(Room.Status.occupied);

        stats.setTotalRooms(totalRooms != null ? totalRooms : 0L);
        stats.setAvailableRooms(availableRooms != null ? availableRooms : 0L);
        stats.setBookedRooms(occupiedRooms != null ? occupiedRooms : 0L);


        // 2. Thống kê Doanh thu (Giữ nguyên)
        BigDecimal monthlyRevenue = paymentRepository.sumTotalAmountByMonthAndYear(currentYear, currentMonth);
        BigDecimal annualRevenue = paymentRepository.sumTotalAmountByYear(currentYear);

        stats.setTotalMonthlyRevenue(monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO);
        stats.setTotalAnnualRevenue(annualRevenue != null ? annualRevenue : BigDecimal.ZERO);


        Long bookingsToday = reservationRepository.countReservationsByArrivalDateRange(startOfDay, startOfNextDay);
        stats.setBookingsToday(bookingsToday != null ? bookingsToday : 0L);

        // 4. Thống kê Nhân viên (Giữ nguyên)
        if ("ADMIN".equalsIgnoreCase(userRole) || "MANAGER".equalsIgnoreCase(userRole)) {
            Long receptionists = userAccountRepository.countByRole(UserAccount.Role.reception);
            Long housekeepers = userAccountRepository.countByRole(UserAccount.Role.housekeeping);
            Long totalEmployees = receptionists + housekeepers;
            stats.setTotalEmployees(totalEmployees != null ? totalEmployees : 0L);
        } else {
            stats.setTotalEmployees(null);
        }

        return stats;
    }
}