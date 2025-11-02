package com.project.mhotel.repository;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    Optional<Room> findByRoomNumber(String roomNumber);
    // Lấy danh sách phòng theo trạng thái
    List<Room> findByStatus(Status status);

    // Lấy danh sách phòng theo khách sạn
    List<Room> findByHotel_Id(Long hotelId);

    // Tìm phòng theo số phòng và khách sạn
    Room findByHotel_IdAndRoomNumber(Long hotelId, String roomNumber);

    // ✅ Cập nhật trạng thái phòng mà không cần merge toàn bộ entity
    @Modifying
    @Transactional
    @Query("UPDATE Room r SET r.status = :status WHERE r.id = :roomId")
    void updateRoomStatus(@Param("roomId") Long roomId, @Param("status") Status status);
}

