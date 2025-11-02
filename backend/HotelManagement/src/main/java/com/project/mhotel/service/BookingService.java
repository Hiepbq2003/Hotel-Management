package com.project.mhotel.service;

import com.project.mhotel.dto.BookingRequest;
import com.project.mhotel.entity.*;
import com.project.mhotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final RoomTypeRepository roomTypeRepository;
    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationRoomRepository reservationRoomRepository;
    private final RoomRepository roomRepository;

    private final Long DEFAULT_HOTEL_ID = 1L;

    @Transactional
    public Reservation createBooking(BookingRequest req) {
        // 1️⃣ Tìm loại phòng
        RoomType roomType = roomTypeRepository
                .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        // 2️⃣ Tạo hoặc tìm Guest
        Guest guest = Guest.builder()
                .fullName(req.getGuestName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .nationality(req.getNationality())
                .documentType(req.getDocumentType())
                .documentNumber(req.getDocumentNumber())
                .build();
        guestRepository.save(guest);

        // 3️⃣ Tạo Reservation
        Reservation reservation = Reservation.builder()
                .hotel(roomType.getHotel())
                .guest(guest)
                .reservationCode("RES-" + System.currentTimeMillis())
                .status(Reservation.Status.reserved)
                .arrivalDate(req.getCheckInDate())
                .departureDate(req.getCheckOutDate())
                .pax(req.getAdultCount() + req.getChildCount())
                .totalAmount(roomType.getBasePrice())
                .bookingSource("Online Booking")
                .notes(req.getNotes())
                .build();
        reservationRepository.save(reservation);

        // 4️⃣ Ghi ReservationRoom (chưa gán phòng cụ thể)
        ReservationRoom rr = ReservationRoom.builder()
                .reservation(reservation)
                .roomType(roomType)
                .checkinDate(req.getCheckInDate())
                .checkoutDate(req.getCheckOutDate())
                .adultCount(req.getAdultCount())
                .childCount(req.getChildCount())
                .nightlyPrice(roomType.getBasePrice())
                .status(ReservationRoom.Status.booked)
                .build();
        reservationRoomRepository.save(rr);

        return reservation;
    }
}

