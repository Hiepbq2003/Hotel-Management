package com.project.mhotel.repository;

import com.project.mhotel.entity.ReservationRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRoomRepository extends JpaRepository<ReservationRoom, Long> {

    @Query("SELECT rr FROM ReservationRoom rr " +
            "WHERE DATE(rr.checkinDate) = CURRENT_DATE " +
            "AND rr.status = 'checked_in'")
    List<ReservationRoom> findTodayCheckIns();
}
