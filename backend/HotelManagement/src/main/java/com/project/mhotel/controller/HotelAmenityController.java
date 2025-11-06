package com.project.mhotel.controller;

import com.project.mhotel.dto.HotelAmenityRequest;
import com.project.mhotel.dto.HotelAmenityResponse;
import com.project.mhotel.service.HotelAmenityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hotel-amenities")
@CrossOrigin(origins = "http://localhost:3000")
public class HotelAmenityController {

    private final HotelAmenityService amenityService;

    public HotelAmenityController(HotelAmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    public ResponseEntity<List<HotelAmenityResponse>> getAllAmenities(@RequestParam(required = false) Long hotelId) {
        List<HotelAmenityResponse> amenities;
        if (hotelId != null) {
            amenities = amenityService.getAmenitiesByHotel(hotelId);
        } else {
            amenities = amenityService.getAllAmenities();
        }
        return ResponseEntity.ok(amenities);
    }

    // GET: Lấy tiện ích theo ID
    @GetMapping("/{id}")
    public ResponseEntity<HotelAmenityResponse> getAmenityById(@PathVariable Long id) {
        return amenityService.getAmenityById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Tạo tiện ích mới
    @PostMapping
    public ResponseEntity<HotelAmenityResponse> createAmenity(@RequestBody HotelAmenityRequest request) {
        HotelAmenityResponse newAmenity = amenityService.createAmenity(request);
        return ResponseEntity.ok(newAmenity);
    }

    // PUT: Cập nhật tiện ích
    @PutMapping("/{id}")
    public ResponseEntity<HotelAmenityResponse> updateAmenity(@PathVariable Long id, @RequestBody HotelAmenityRequest request) {
        HotelAmenityResponse updatedAmenity = amenityService.updateAmenity(id, request);
        return ResponseEntity.ok(updatedAmenity);
    }

    // DELETE: Xóa tiện ích
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long id) {
        amenityService.deleteAmenity(id);
        return ResponseEntity.noContent().build();
    }
}