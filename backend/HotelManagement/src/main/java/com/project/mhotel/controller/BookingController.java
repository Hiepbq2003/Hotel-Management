package com.project.mhotel.controller;

import com.project.mhotel.dto.BookingRequest;
import com.project.mhotel.dto.BookingResponse;
import com.project.mhotel.dto.CheckAvailabilityRequest;
import com.project.mhotel.dto.CheckAvailabilityResponse;
import com.project.mhotel.dto.PaymentRequest;
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
            return ResponseEntity.ok(new BookingResponse(
                    reservation.getId(),
                    reservation.getReservationCode(),
                    reservation.getStatus().toString(),
                    "Vui lòng hoàn tất thanh toán trong vòng 24 giờ"
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{reservationId}/payment")
    public ResponseEntity<?> processPayment(
            @PathVariable Long reservationId,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Reservation reservation = bookingService.processPayment(reservationId, paymentRequest);
            return ResponseEntity.ok(new BookingResponse(
                    reservation.getId(),
                    reservation.getReservationCode(),
                    reservation.getStatus().toString(),
                    "Thanh toán thành công. Đặt phòng đã được xác nhận."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{reservationId}/payment-failed")
    public ResponseEntity<?> processPaymentFailed(
            @PathVariable Long reservationId,
            @RequestBody PaymentRequest paymentRequest) {
        try {
            Reservation reservation = bookingService.processPaymentFailed(reservationId, paymentRequest);
            return ResponseEntity.ok(new BookingResponse(
                    reservation.getId(),
                    reservation.getReservationCode(),
                    reservation.getStatus().toString(),
                    "Thanh toán thất bại. Vui lòng thử lại trong vòng 24 giờ."
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<?> getBooking(@PathVariable Long reservationId) {
        try {
            Reservation reservation = bookingService.getBooking(reservationId);
            return ResponseEntity.ok(reservation);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/cancel-overdue")
    public ResponseEntity<?> cancelOverdueBookings() {
        try {
            bookingService.cancelOverdueBookings();
            return ResponseEntity.ok("Overdue bookings cancelled successfully");
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