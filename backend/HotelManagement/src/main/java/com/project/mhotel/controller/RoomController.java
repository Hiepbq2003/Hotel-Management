package com.project.mhotel.controller;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.Room.Status;
import com.project.mhotel.service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:3000")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // GET all rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // GET room by id
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET rooms by hotel
    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Room>> getRoomsByHotel(@PathVariable Long hotelId) {
        return ResponseEntity.ok(roomService.getRoomsByHotel(hotelId));
    }

    // GET rooms by status
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Room>> getRoomsByStatus(@PathVariable Status status) {
        return ResponseEntity.ok(roomService.getRoomsByStatus(status));
    }

    // GET specific room by hotel + room number
    @GetMapping("/hotel/{hotelId}/number/{roomNumber}")
    public ResponseEntity<Room> getRoomByHotelAndNumber(@PathVariable Long hotelId,
                                                        @PathVariable String roomNumber) {
        Room room = roomService.getRoomByHotelAndNumber(hotelId, roomNumber);
        if (room == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(room);
    }

    // POST create new room
    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody Room room) {
        return ResponseEntity.ok(roomService.createRoom(room));
    }

    // PUT update room
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        return ResponseEntity.ok(roomService.updateRoom(id, room));
    }

    // DELETE room
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }
}

