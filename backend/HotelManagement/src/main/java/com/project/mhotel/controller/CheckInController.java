package com.project.mhotel.controller;

import com.project.mhotel.dto.AssignedRoomResponse;
import com.project.mhotel.dto.CheckInRequest;
import com.project.mhotel.dto.CheckInTodayResponse;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.repository.RoomTypeRepository;
import com.project.mhotel.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/checkIn")
@RequiredArgsConstructor
public class CheckInController {
    private final CheckInService checkInService;
    private final RoomTypeRepository roomTypeRepository;
    private static final Long DEFAULT_HOTEL_ID = 1L;
    // ✅ Nhận phòng, tự động gán phòng còn trống
    @GetMapping("/today")
    public List<CheckInTodayResponse> getTodayCheckIns() {
        return checkInService.getTodayCheckIns();
    }
    @PostMapping("/assign")
    public ResponseEntity<?> assignRoom(@RequestBody CheckInRequest req) {
        try {
            AssignedRoomResponse res = checkInService.assignRoom(req);
            return ResponseEntity.ok(res);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error: " + e.getMessage()));
        }
    }
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@RequestBody Map<String, String> payload) {
        try {
            String roomNumber = payload.get("roomNumber");
            checkInService.checkOut(roomNumber);
            return ResponseEntity.ok(Map.of("message", "Checkout thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



}
