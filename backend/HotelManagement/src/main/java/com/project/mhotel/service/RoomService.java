package com.project.mhotel.service;

import com.project.mhotel.dto.RoomRequest;
import com.project.mhotel.dto.RoomResponse; // CẬP NHẬT
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.repository.HotelRepository;
import com.project.mhotel.repository.RoomRepository;
import com.project.mhotel.repository.RoomTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // CẬP NHẬT

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final HotelRepository hotelRepository;

    public RoomService(RoomRepository roomRepository, RoomTypeRepository roomTypeRepository, HotelRepository hotelRepository) {
        this.roomRepository = roomRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.hotelRepository = hotelRepository;
    }

    // FIX: Trả về List<RoomResponse>
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(RoomResponse::fromEntity) // Dùng mapper để trả về DTO
                .collect(Collectors.toList());
    }

    // FIX: Trả về Optional<RoomResponse>
    public Optional<RoomResponse> getRoomById(Long id) {
        return roomRepository.findById(id)
                .map(RoomResponse::fromEntity);
    }

    // FIX: Trả về List<RoomResponse>
    public List<RoomResponse> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotel_Id(hotelId).stream()
                .map(RoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // FIX: Trả về List<RoomResponse>
    public List<RoomResponse> getRoomsByStatus(Status status) {
        return roomRepository.findByStatus(status).stream()
                .map(RoomResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // FIX: Trả về Optional<RoomResponse>
    public Optional<RoomResponse> getRoomByHotelAndNumber(Long hotelId, String roomNumber) {
        return Optional.ofNullable(roomRepository.findByHotel_IdAndRoomNumber(hotelId, roomNumber))
                .map(RoomResponse::fromEntity);
    }

    // PHƯƠNG THỨC MỚI: Xử lý tạo Room từ DTO, trả về RoomResponse
    public RoomResponse createRoomFromRequest(RoomRequest roomRequest) {
        if (roomRequest.getRoomTypeId() == null) {
            throw new RuntimeException("RoomType ID is required for creating a room.");
        }
        if (roomRequest.getHotelId() == null) {
            throw new RuntimeException("Hotel ID is required for creating a room.");
        }

        RoomType roomType = roomTypeRepository.findById(roomRequest.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("RoomType not found with ID: " + roomRequest.getRoomTypeId()));

        Hotel hotel = hotelRepository.findById(roomRequest.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + roomRequest.getHotelId()));

        Room newRoom = new Room();
        newRoom.setRoomNumber(roomRequest.getRoomNumber());
        newRoom.setRoomType(roomType);
        newRoom.setFloor(roomRequest.getFloor());
        newRoom.setStatus(roomRequest.getStatus());
        newRoom.setDescription(roomRequest.getDescription());
        newRoom.setHotel(hotel);

        Room savedRoom = roomRepository.save(newRoom);

        // FIX: Trả về DTO
        return RoomResponse.fromEntity(savedRoom);
    }

    // PHƯƠNG THỨC MỚI: Xử lý cập nhật Room từ DTO, trả về RoomResponse
    public RoomResponse updateRoomFromRequest(Long id, RoomRequest roomRequest) {
        Room existingRoom = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with ID: " + id));

        if (roomRequest.getRoomTypeId() == null) {
            throw new RuntimeException("RoomType ID must not be null in the update request.");
        }
        if (roomRequest.getHotelId() == null) {
            throw new RuntimeException("Hotel ID must not be null in the update request.");
        }

        RoomType roomType = roomTypeRepository.findById(roomRequest.getRoomTypeId())
                .orElseThrow(() -> new RuntimeException("RoomType not found with ID: " + roomRequest.getRoomTypeId()));

        Hotel hotel = hotelRepository.findById(roomRequest.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + roomRequest.getHotelId()));

        existingRoom.setRoomNumber(roomRequest.getRoomNumber());
        existingRoom.setRoomType(roomType);
        existingRoom.setFloor(roomRequest.getFloor());
        existingRoom.setStatus(roomRequest.getStatus());
        existingRoom.setDescription(roomRequest.getDescription());
        existingRoom.setHotel(hotel);

        Room updatedRoom = roomRepository.save(existingRoom);

        // FIX: Trả về DTO
        return RoomResponse.fromEntity(updatedRoom);
    }

    // Giữ phương thức deleteRoom
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with ID: " + id);
        }
        roomRepository.deleteById(id);
    }
}