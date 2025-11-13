package com.project.mhotel.repository;

import com.project.mhotel.entity.Guest;
import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByStatusAndCreatedAtBefore(
            Reservation.Status status,
            LocalDateTime createdAt);

    // Tìm reservation bằng code
    List<Reservation> findByStatus(Reservation.Status status);

    // Tìm reservation theo code
    Optional<Reservation> findByReservationCode(String reservationCode);

    // Tìm reservation theo guest
    List<Reservation> findByGuest(Guest guest);

    // Tìm reservation đang active (reserved hoặc checked_in)
    @Query("SELECT r FROM Reservation r WHERE r.status IN ('reserved', 'checked_in')")
    List<Reservation> findActiveReservations();

    Long countByArrivalDate (LocalDate arrivalDate);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.arrivalDate >= :startOfDay AND r.arrivalDate < :startOfNextDay")
    Long countReservationsByArrivalDateRange(
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("startOfNextDay") LocalDateTime startOfNextDay);
}
