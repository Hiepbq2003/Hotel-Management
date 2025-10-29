package com.project.mhotel.controller;

import com.project.mhotel.dto.AssignedRoomResponse;
import com.project.mhotel.dto.CheckInRequest;
import com.project.mhotel.dto.CheckInTodayResponse;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.repository.RoomTypeRepository;
import com.project.mhotel.service.CheckInService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public AssignedRoomResponse assignRoom(@RequestBody CheckInRequest request) {
        return checkInService.assignRoom(request);
    }
}
