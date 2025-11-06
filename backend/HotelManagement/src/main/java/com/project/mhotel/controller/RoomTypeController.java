package com.project.mhotel.controller;

import com.project.mhotel.dto.RoomTypeRequest;
import com.project.mhotel.dto.RoomTypeResponse;
import com.project.mhotel.dto.RoomTypeAmenityUpdateRequest; // Import DTO mới cho Amenity
import com.project.mhotel.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/room-type")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public List<RoomTypeResponse> getAll() {
        return roomTypeService.getAllDto();
    }

    @GetMapping("/hotel/{hotelId}")
    public List<RoomTypeResponse> getByHotel(@PathVariable Long hotelId) {
        return roomTypeService.getByHotelDto(hotelId);
    }

    @GetMapping("/{id}")
    public RoomTypeResponse getById(@PathVariable Long id) {
        return roomTypeService.getByIdDto(id);
    }

    @PostMapping
    public ResponseEntity<RoomTypeResponse> create(@RequestBody RoomTypeRequest request) {
        RoomTypeResponse created = roomTypeService.createDto(request, 1L);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public RoomTypeResponse update(@PathVariable Long id, @RequestBody RoomTypeRequest request) {
        return roomTypeService.updateDto(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/amenities")
    public ResponseEntity<RoomTypeResponse> updateRoomTypeAmenities(
            @PathVariable Long id,
            @RequestBody RoomTypeAmenityUpdateRequest request) {

        RoomTypeResponse updatedRoomType = roomTypeService.updateRoomTypeAmenities(id, request.getAmenityIds());

        return ResponseEntity.ok(updatedRoomType);
    }
}