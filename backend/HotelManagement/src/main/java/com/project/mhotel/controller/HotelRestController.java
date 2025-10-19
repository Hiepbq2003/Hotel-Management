//package com.project.mhotel.controller;
//
//import com.project.mhotel.entity.Hotel;
//import com.project.mhotel.service.HotelService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/hotel")
//@CrossOrigin(origins = "http://localhost:3000")
//@RequiredArgsConstructor
//public class HotelRestController {
//
//    private final HotelService hotelService;
//
//    // -------------------- GET ALL --------------------
//    @GetMapping
//    public List<Hotel> getAllHotels() {
//        return hotelService.getAllHotels();
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Hotel> getHotelById(@PathVariable Long id) {
//        Optional<Hotel> hotel = hotelService.getHotelById(id);
//        return hotel.map(ResponseEntity::ok)
//                .orElseGet(() -> ResponseEntity.notFound().build());
//    }
//
//    // -------------------- CREATE --------------------
//    @PostMapping
//    public ResponseEntity<Hotel> createHotel(@RequestBody Hotel hotel) {
//        Hotel created = hotelService.createHotel(hotel);
//        return ResponseEntity.ok(created);
//    }
//
//    // -------------------- UPDATE --------------------
//    @PutMapping("/{id}")
//    public ResponseEntity<Hotel> updateHotel(@PathVariable Long id, @RequestBody Hotel hotel) {
//        Hotel updated = hotelService.updateHotel(id, hotel);
//        return ResponseEntity.ok(updated);
//    }
//
//    // -------------------- DELETE --------------------
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteHotel(@PathVariable Long id) {
//        hotelService.deleteHotel(id);
//        return ResponseEntity.noContent().build();
//    }
//}
