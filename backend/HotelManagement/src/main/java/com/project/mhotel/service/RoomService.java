package com.project.mhotel.service;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import com.project.mhotel.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long id, Room updatedRoom) {
        return roomRepository.findById(id)
                .map(room -> {
                    room.setRoomNumber(updatedRoom.getRoomNumber());
                    room.setRoomType(updatedRoom.getRoomType());
                    room.setHotel(updatedRoom.getHotel());
                    room.setFloor(updatedRoom.getFloor());
                    room.setStatus(updatedRoom.getStatus());
                    room.setDescription(updatedRoom.getDescription());
                    return roomRepository.save(room);
                })
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));
    }

    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with id: " + id);
        }
        roomRepository.deleteById(id);
    }

    public List<Room> getRoomsByStatus(Status status) {
        return roomRepository.findByStatus(status);
    }

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotel_Id(hotelId);
    }

    public Room getRoomByHotelAndNumber(Long hotelId, String roomNumber) {
        return roomRepository.findByHotel_IdAndRoomNumber(hotelId, roomNumber);
    }
}
