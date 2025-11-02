package com.project.mhotel.controller;

import com.project.mhotel.dto.BookingRequest;
import com.project.mhotel.dto.CheckAvailabilityRequest;
import com.project.mhotel.dto.CheckAvailabilityResponse;
import com.project.mhotel.entity.Reservation;
import com.project.mhotel.service.BookingService;
import com.project.mhotel.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/booking")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;
    private final CheckInService checkInService;
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest req) {
        try {
            Reservation reservation = bookingService.createBooking(req);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    @PostMapping("/check-availability")
    public ResponseEntity<CheckAvailabilityResponse> checkAvailability(
            @RequestBody CheckAvailabilityRequest req) {
        CheckAvailabilityResponse res = checkInService.checkAvailability(req);
        return ResponseEntity.ok(res);
    }
}
