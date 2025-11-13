// backend/HotelManagement/src/main/java/com/project/mhotel/service/DashboardService.java

package com.project.mhotel.service;

import com.project.mhotel.dto.DashboardStatsResponse;
import com.project.mhotel.repository.RoomRepository;
import com.project.mhotel.repository.PaymentRepository;
import com.project.mhotel.repository.UserAccountRepository;
import com.project.mhotel.entity.Room;           // Import Entity để truy cập Room.Status
import com.project.mhotel.entity.UserAccount; // Import Entity để truy cập UserAccount.Role
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;
import java.math.BigDecimal;

@Service
public class DashboardService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private UserAccountRepository userAccountRepository;

    // Giả định rằng DashboardStatsResponse DTO đã được tạo
    public DashboardStatsResponse getDashboardStats(String userRole) {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        // Lấy ngày tháng năm hiện tại
        LocalDate today = LocalDate.now();
        int currentYear = today.getYear();
        int currentMonth = today.getMonthValue();

        // 1. Thống kê Phòng (Sử dụng các phương thức đếm thực tế)
        Long totalRooms = roomRepository.countTotalRooms();
        Long availableRooms = roomRepository.countByStatus(Room.Status.available);
        // Giả định rằng phòng có khách là OCCUPIED
        Long occupiedRooms = roomRepository.countByStatus(Room.Status.occupied);

        // Gán giá trị, tránh null
        stats.setTotalRooms(totalRooms != null ? totalRooms : 0L);
        stats.setAvailableRooms(availableRooms != null ? availableRooms : 0L);
        stats.setBookedRooms(occupiedRooms != null ? occupiedRooms : 0L);


        // 2. Thống kê Doanh thu (Sử dụng các phương thức truy vấn đã thêm vào PaymentRepository)
        BigDecimal monthlyRevenue = paymentRepository.sumTotalAmountByMonthAndYear(currentYear, currentMonth);
        BigDecimal annualRevenue = paymentRepository.sumTotalAmountByYear(currentYear);

        // Gán giá trị, tránh null
        stats.setTotalMonthlyRevenue(monthlyRevenue != null ? monthlyRevenue : BigDecimal.ZERO);
        stats.setTotalAnnualRevenue(annualRevenue != null ? annualRevenue : BigDecimal.ZERO);


        // 3. Thống kê Nhân viên (Chỉ dành cho Admin/Manager)
        if ("ADMIN".equalsIgnoreCase(userRole) || "MANAGER".equalsIgnoreCase(userRole)) {
            // Giả định Role.STAFF là vai trò của nhân viên cần đếm
            Long totalEmployees = userAccountRepository.countByRole(UserAccount.Role.reception) +
                    userAccountRepository.countByRole(UserAccount.Role.housekeeping) ;
            stats.setTotalEmployees(totalEmployees != null ? totalEmployees : 0L);
        } else {
            // Đặt null hoặc 0 nếu không có quyền xem
            stats.setTotalEmployees(null);
        }

        return stats;
    }
}