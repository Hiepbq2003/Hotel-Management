package com.project.mhotel.service;

import com.project.mhotel.dto.*;
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
        roomRepository.updateRoomStatus(room.getId(), Room.Status.occupied);

        // 3️⃣ Lưu Guest
        Guest guest = Guest.builder()
                .fullName(req.getGuestName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .nationality(req.getNationality())
                .documentType(req.getDocumentType())
                .documentNumber(req.getDocumentNumber())
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
                .map(rr -> CheckInTodayResponse.builder()
                        .guestName(rr.getReservation().getGuest().getFullName())
                        .phone(rr.getReservation().getGuest().getPhone())
                        .email(rr.getReservation().getGuest().getEmail())
                        .roomNumber(rr.getRoom().getRoomNumber())
                        .roomType(rr.getRoomType().getName())
                        .checkInDate(rr.getCheckinDate())
                        .checkOutDate(rr.getCheckoutDate())
                        .status(rr.getStatus().name())
                        .documentType(rr.getReservation().getGuest().getDocumentType())
                        .documentNumber(rr.getReservation().getGuest().getDocumentNumber())
                        .build()
                )
                .collect(Collectors.toList());

    }
    @Transactional(readOnly = true)
    public CheckAvailabilityResponse checkAvailability(CheckAvailabilityRequest req) {
        RoomType type = roomTypeRepository
                .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        // Lọc phòng trống theo loại
        List<Room> availableRooms = roomRepository.findByHotel_Id(DEFAULT_HOTEL_ID)
                .stream()
                .filter(r -> r.getRoomType().equals(type) && r.getStatus() == Room.Status.available)
                .toList();

        int count = availableRooms.size();

        return CheckAvailabilityResponse.builder()
                .roomType(type.getName())
                .availableRooms(count)
                .message(count > 0
                        ? "✅ Có " + count + " phòng trống cho loại " + type.getName()
                        : "❌ Không còn phòng trống cho loại " + type.getName())
                .build();
    }
    @Transactional
    public void checkOut(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        // Tìm reservationRoom đang active
        ReservationRoom rr = reservationRoomRepository.findAll().stream()
                .filter(r -> r.getRoom().equals(room)
                        && r.getStatus() == ReservationRoom.Status.checked_in)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng đang được check-in"));

        rr.setStatus(ReservationRoom.Status.checked_out);
        reservationRoomRepository.save(rr);

        // Cập nhật reservation status
        Reservation reservation = rr.getReservation();
        reservation.setStatus(Reservation.Status.checked_out);
        reservationRepository.save(reservation);

        // Cập nhật trạng thái phòng
        roomRepository.updateRoomStatus(room.getId(), Room.Status.available);

        System.out.println("✅ Guest checked out from room " + roomNumber);
    }

}
