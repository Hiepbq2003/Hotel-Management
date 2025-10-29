package com.project.mhotel.controller;

import com.project.mhotel.dto.RoomTypeRequest;
import com.project.mhotel.dto.RoomTypeResponse;
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

    // ✅ Lấy toàn bộ RoomType
    @GetMapping
    public List<RoomTypeResponse> getAll() {
        return roomTypeService.getAllDto();
    }

    // ✅ Lấy RoomType theo hotelId
    @GetMapping("/hotel/{hotelId}")
    public List<RoomTypeResponse> getByHotel(@PathVariable Long hotelId) {
        return roomTypeService.getByHotelDto(hotelId);
    }

    // ✅ Lấy RoomType theo id
    @GetMapping("/{id}")
    public RoomTypeResponse getById(@PathVariable Long id) {
        return roomTypeService.getByIdDto(id);
    }

    // ✅ Tạo mới RoomType
    @PostMapping
    public ResponseEntity<RoomTypeResponse> create(@RequestBody RoomTypeRequest request) {
        RoomTypeResponse created = roomTypeService.createDto(request, 1L); // có thể thay hotelId động
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // ✅ Cập nhật RoomType
    @PutMapping("/{id}")
    public RoomTypeResponse update(@PathVariable Long id, @RequestBody RoomTypeRequest request) {
        return roomTypeService.updateDto(id, request);
    }

    // ✅ Xóa RoomType
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        roomTypeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
