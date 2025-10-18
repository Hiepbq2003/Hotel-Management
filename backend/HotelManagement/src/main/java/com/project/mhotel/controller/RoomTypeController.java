package com.project.mhotel.controller;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/room-type")
@RequiredArgsConstructor// nếu frontend truy cập
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping
    public List<RoomType> getAll() {
        return roomTypeService.getAll();
    }

    @GetMapping("/hotel/{hotelId}")
    public List<RoomType> getByHotel(@PathVariable Long hotelId) {
        return roomTypeService.getByHotel(hotelId);
    }

    @GetMapping("/{id}")
    public RoomType getById(@PathVariable Long id) {
        return roomTypeService.getById(id);
    }

    @PostMapping
    public ResponseEntity<RoomType> createRoomType(@RequestBody RoomType roomType) {
        // LƯU Ý: Frontend PHẢI gửi 'hotel' Entity (chứa ít nhất 'id') bên trong body JSON.
        // Spring sẽ cố gắng ánh xạ JSON vào RoomType Entity.

        // Vì FE gửi JSON, chúng ta gọi service với logic đã được thay đổi.
        // Giả định RoomTypeService.create đã được sửa đổi để chỉ nhận RoomType Entity.

        RoomType createdRoomType = roomTypeService.create(roomType , 1L );

        return new ResponseEntity<>(createdRoomType, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public RoomType update(@PathVariable Long id, @RequestBody RoomType roomType) {
        return roomTypeService.update(id, roomType);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        roomTypeService.delete(id);
    }
}

