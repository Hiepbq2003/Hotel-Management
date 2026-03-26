package com.project.mhotel.repository;

import com.project.mhotel.entity.Reservation;
import com.project.mhotel.entity.ReservationRoom;
import com.project.mhotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRoomRepository extends JpaRepository<ReservationRoom, Long> {
    @Query("SELECT rr FROM ReservationRoom rr "
            + "JOIN FETCH rr.room "
            + "JOIN FETCH rr.roomType "
            + "JOIN FETCH rr.reservation res "
            + "JOIN FETCH res.guest "
            + "WHERE rr.checkinDate BETWEEN :start AND :end "
            + "AND rr.status = 'checked_in'")
    List<ReservationRoom> findTodayCheckIns(LocalDateTime start, LocalDateTime end);
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.roomType.id = :roomTypeId " +
            "AND r.status = 'available' AND NOT EXISTS (" +
            "SELECT rr FROM ReservationRoom rr WHERE rr.room = r AND " +
            "rr.status IN ('checked_in', 'reserved') AND " +
            "((rr.checkinDate <= :checkOutDate AND rr.checkoutDate >= :checkInDate)))")
    List<Room> findAvailableRoomsForPeriod(
            @Param("hotelId") Long hotelId,
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkInDate") LocalDateTime checkInDate,
            @Param("checkOutDate") LocalDateTime checkOutDate);
    List<ReservationRoom> findByReservation(Reservation reservation);

    @Query("SELECT rr FROM ReservationRoom rr WHERE " +
            "rr.room.roomNumber = :roomNumber AND rr.status = 'checked_in'")
    Optional<ReservationRoom> findActiveByRoomNumber(@Param("roomNumber") String roomNumber);

    List<ReservationRoom> findByStatus(ReservationRoom.Status status);

    @Query("SELECT rr FROM ReservationRoom rr WHERE " +
            "rr.room.id = :roomId AND rr.status IN ('checked_in') AND " +
            "((rr.checkinDate <= :checkOut AND rr.checkoutDate >= :checkIn))")
    List<ReservationRoom> findOverlappingReservations(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDateTime checkIn,
            @Param("checkOut") LocalDateTime checkOut);
}
