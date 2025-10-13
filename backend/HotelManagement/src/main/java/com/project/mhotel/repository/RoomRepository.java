package com.project.mhotel.repository;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    // Lấy danh sách phòng theo trạng thái
    List<Room> findByStatus(Status status);

    // Lấy danh sách phòng theo khách sạn
    List<Room> findByHotel_Id(Long hotelId);

    // Tìm phòng theo số phòng và khách sạn
    Room findByHotel_IdAndRoomNumber(Long hotelId, String roomNumber);
}
