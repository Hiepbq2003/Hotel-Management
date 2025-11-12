package com.project.mhotel.repository;

import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // Tìm các reservation đang chờ thanh toán và được tạo trước thời điểm specified
    List<Reservation> findByStatusAndCreatedAtBefore(
            Reservation.Status status,
            LocalDateTime createdAt);

    // Tìm reservation bằng code
    Optional<Reservation> findByReservationCode(String reservationCode);
}
