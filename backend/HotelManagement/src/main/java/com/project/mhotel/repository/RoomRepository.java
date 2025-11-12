package com.project.mhotel.repository;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);
    List<Room> findByStatus(Status status);
    List<Room> findByHotel_Id(Long hotelId);
    Room findByHotel_IdAndRoomNumber(Long hotelId, String roomNumber);
    @Modifying
    @Query("UPDATE Room r SET r.status = :status WHERE r.id = :roomId")
    void updateRoomStatus(@Param("roomId") Long roomId, @Param("status") Room.Status status);
    @Query("SELECT r FROM Room r WHERE r.hotel.id = :hotelId AND r.roomType.id = :roomTypeId " +
            "AND r.status = 'available' AND NOT EXISTS (" +
            "SELECT rr FROM ReservationRoom rr WHERE rr.room = r AND rr.status IN ('checked_in') AND " +
            "((rr.checkinDate <= :checkOut AND rr.checkoutDate >= :checkIn)))")
    List<Room> findAvailableRoomsForPeriod(
            @Param("hotelId") Long hotelId,
            @Param("roomTypeId") Long roomTypeId,
            @Param("checkIn") LocalDateTime checkIn,
            @Param("checkOut") LocalDateTime checkOut);
}
