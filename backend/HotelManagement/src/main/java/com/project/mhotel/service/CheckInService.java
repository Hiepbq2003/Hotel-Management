package com.project.mhotel.service;

import com.project.mhotel.dto.AssignedRoomResponse;
import com.project.mhotel.dto.CheckInRequest;
import com.project.mhotel.dto.CheckInTodayResponse;
import com.project.mhotel.entity.*;
import com.project.mhotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final RoomRepository roomRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationRoomRepository reservationRoomRepository;
    private final HotelService hotelService;

    private final Long DEFAULT_HOTEL_ID = 1L; // hotel mặc định

    @Transactional
    public AssignedRoomResponse assignRoom(CheckInRequest req) {
        // 1️⃣ Tìm loại phòng
        RoomType type = roomTypeRepository
                .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        // 2️⃣ Lấy phòng còn trống
        List<Room> availableRooms = roomRepository.findByHotel_Id(DEFAULT_HOTEL_ID)
                .stream()
                .filter(r -> r.getRoomType().equals(type) && r.getStatus() == Room.Status.available)
                .toList();

        if (availableRooms.isEmpty()) {
            throw new RuntimeException("No available rooms for this type");
        }

        Room room = availableRooms.get(0);
        room.setStatus(Room.Status.occupied);
        roomRepository.save(room);

        // 3️⃣ Lưu Guest
        Guest guest = Guest.builder()
                .fullName(req.getGuestName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .nationality(req.getNationality())
                .documentType(req.getDocumentType())
                .documentNumber(req.getIdNumber())
                .build();
        guestRepository.save(guest);

        // 4️⃣ Lưu Reservation
        Reservation reservation = Reservation.builder()
                .hotel(room.getHotel())
                .guest(guest)
                .reservationCode("CHK-" + System.currentTimeMillis())
                .status(Reservation.Status.checked_in)
                .arrivalDate(req.getCheckInDate())    // LocalDateTime
                .departureDate(req.getCheckOutDate()) // LocalDateTime
                .pax(req.getAdultCount() + req.getChildCount())
                .build();
        reservationRepository.save(reservation);

        // 5️⃣ Lưu ReservationRoom
        ReservationRoom rr = ReservationRoom.builder()
                .reservation(reservation)
                .room(room)
                .roomType(type)
                .nightlyPrice(type.getBasePrice())
                .checkinDate(req.getCheckInDate())    // LocalDateTime
                .checkoutDate(req.getCheckOutDate())  // LocalDateTime
                .adultCount(req.getAdultCount())
                .childCount(req.getChildCount())
                .status(ReservationRoom.Status.checked_in)
                .build();
        reservationRoomRepository.save(rr);

        System.out.println("✅ Assigned room: " + room.getRoomNumber() + " (" + type.getName() + ")");
        return AssignedRoomResponse.builder()
                .number(room.getRoomNumber())
                .type(type.getName())
                .build();
    }

    /**
     * Lấy danh sách khách check-in hôm nay (dựa trên LocalDateTime)
     */
    public List<CheckInTodayResponse> getTodayCheckIns() {
        // Lấy khoảng thời gian của "hôm nay"
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

        // Truy vấn trong khoảng thời gian đó
        List<ReservationRoom> todayRooms = reservationRoomRepository.findAll()
                .stream()
                .filter(rr -> rr.getCheckinDate() != null
                        && !rr.getCheckinDate().isBefore(startOfDay)
                        && !rr.getCheckinDate().isAfter(endOfDay)
                        && rr.getStatus() == ReservationRoom.Status.checked_in)
                .toList();

        return todayRooms.stream()
                .map(rr -> new CheckInTodayResponse(
                        rr.getReservation().getGuest().getFullName(),
                        rr.getReservation().getGuest().getPhone(),
                        rr.getReservation().getGuest().getEmail(),
                        rr.getRoom().getRoomNumber(),
                        rr.getRoomType().getName(),
                        rr.getCheckinDate(),
                        rr.getCheckoutDate(),
                        rr.getStatus().name()
                ))
                .collect(Collectors.toList());
    }
}
