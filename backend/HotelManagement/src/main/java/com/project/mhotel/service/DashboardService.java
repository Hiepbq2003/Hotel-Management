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

        // ... (Giữ nguyên phần khai báo ngày tháng năm)
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();


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


        // 3. THÊM: Thống kê Đặt phòng hôm nay
        // Giả định đặt phòng "hôm nay" là các đặt phòng có ngày check-in (startDate) là hôm nay
        Long bookingsToday = reservationRepository.countByArrivalDate(today);
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