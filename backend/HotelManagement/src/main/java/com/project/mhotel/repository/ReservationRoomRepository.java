package com.project.mhotel.repository;

import com.project.mhotel.entity.ReservationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

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
}
