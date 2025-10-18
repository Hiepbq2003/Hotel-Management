package com.project.mhotel.controller;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.service.RoomTypeService;
import lombok.RequiredArgsConstructor;
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
    public RoomType create(@RequestBody RoomType roomType) {
        return roomTypeService.create(roomType);
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

