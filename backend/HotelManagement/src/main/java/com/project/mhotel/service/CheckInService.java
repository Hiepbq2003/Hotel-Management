package com.project.mhotel.service;

import com.project.mhotel.dto.*;
import com.project.mhotel.entity.*;
import com.project.mhotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    private final UserAccountRepository userAccountRepository;
    private final PaymentRepository paymentRepository;

    private final Long DEFAULT_HOTEL_ID = 1L;
    @Transactional
    public CheckInResponse checkInFromBooking(Long reservationId, Long receptionistId) {
        try {
            System.out.println("🔍 Validating reservation ID: " + reservationId);

            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found with ID: " + reservationId));

            System.out.println("📋 Reservation found: " + reservation.getReservationCode() + ", Status: " + reservation.getStatus());

            if (reservation.getStatus() != Reservation.Status.reserved) {
                throw new RuntimeException("Cannot check-in. Reservation status is: " + reservation.getStatus() + ". Expected: reserved");
            }

            LocalDateTime now = LocalDateTime.now();
            if (reservation.getArrivalDate().isAfter(now)) {
                throw new RuntimeException("Cannot check-in before arrival date. Arrival: " + reservation.getArrivalDate() + ", Current: " + now);
            }

            UserAccount receptionist = userAccountRepository.findById(receptionistId)
                    .orElseThrow(() -> new RuntimeException("Receptionist not found with ID: " + receptionistId));

            List<ReservationRoom> reservationRooms = reservationRoomRepository.findByReservation(reservation);
            if (reservationRooms.isEmpty()) {
                throw new RuntimeException("No rooms assigned to reservation: " + reservation.getReservationCode());
            }

            System.out.println("🛏️ Found " + reservationRooms.size() + " reservation rooms");

            for (ReservationRoom rr : reservationRooms) {
                Room room = rr.getRoom();

                if (room == null) {
                    System.out.println("⚠️ No room assigned for reservation room ID: " + rr.getId() + ". Auto-assigning room...");

                    RoomType roomType = rr.getRoomType();
                    if (roomType == null) {
                        throw new RuntimeException("Cannot auto-assign room: Room type not specified for reservation room ID: " + rr.getId());
                    }

                    List<Room> availableRooms = roomRepository.findByHotel_Id(DEFAULT_HOTEL_ID)
                            .stream()
                            .filter(r -> r.getRoomType().equals(roomType) && r.getStatus() == Room.Status.available)
                            .collect(Collectors.toList());

                    if (availableRooms.isEmpty()) {
                        throw new RuntimeException("No available " + roomType.getName() + " rooms for auto-assignment");
                    }

                    room = availableRooms.get(0);
                    rr.setRoom(room); 
                    reservationRoomRepository.save(rr);
                    System.out.println("✅ Auto-assigned room: " + room.getRoomNumber() + " to reservation room ID: " + rr.getId());
                }

                System.out.println("🔍 Checking room: " + room.getRoomNumber() + ", Status: " + room.getStatus());

                if (room.getStatus() != Room.Status.available) {
                    throw new RuntimeException("Room " + room.getRoomNumber() + " is not available. Current status: " + room.getStatus());
                }

                room.setStatus(Room.Status.occupied);
                roomRepository.save(room);

                rr.setStatus(ReservationRoom.Status.checked_in);
                reservationRoomRepository.save(rr);

                System.out.println("✅ Room " + room.getRoomNumber() + " updated to occupied");
            }

            reservation.setStatus(Reservation.Status.checked_in);
            reservation.setUpdatedAt(now);
            reservationRepository.save(reservation);

            System.out.println("✅ Online check-in completed: " + reservation.getReservationCode());

            return CheckInResponse.builder()
                    .reservationCode(reservation.getReservationCode())
                    .guestName(reservation.getGuest().getFullName())
                    .roomNumbers(reservationRooms.stream()
                            .map(rr -> rr.getRoom().getRoomNumber())
                            .collect(Collectors.toList()))
                    .checkInTime(now)
                    .message("Check-in completed successfully")
                    .build();

        } catch (Exception e) {
            System.out.println("❌ Service layer error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Check-in service error: " + e.getMessage(), e);
        }
    }

    @Transactional
    public AssignedRoomResponse assignRoom(CheckInRequest req) {
        try {
            System.out.println("=== 🎯 DEBUG CHECK-IN REQUEST ===");
            System.out.println("Reception ID: " + req.getReceptionId());
            System.out.println("Guest Name: " + req.getGuestName());
            System.out.println("Email: " + req.getEmail());
            System.out.println("Room Type: " + req.getRoomType());

            if (req.getReceptionId() == null) {
                throw new RuntimeException("Receptionist ID is required. Received: null");
            }

            System.out.println("🔍 Looking for receptionist with ID: " + req.getReceptionId());
            UserAccount receptionist = userAccountRepository.findById(req.getReceptionId())
                    .orElseThrow(() -> {

                        long userCount = userAccountRepository.count();
                        System.out.println("❌ Receptionist not found. Total users in DB: " + userCount);
                        return new RuntimeException("Receptionist not found with ID: " + req.getReceptionId());
                    });

            System.out.println("✅ Found receptionist: " + receptionist.getFullName() + " (" + receptionist.getRole() + ")");
            System.out.println("=== 🎯 DEBUG CHECK-IN REQUEST ===");
            System.out.println("Reception ID from request: " + req.getReceptionId());
            System.out.println("Guest Name: " + req.getGuestName());
            System.out.println("Room Type: " + req.getRoomType());

            if (req.getReceptionId() == null) {
                throw new RuntimeException("Receptionist ID is required");
            }

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime checkInDate = req.getCheckInDate();
            LocalDateTime checkOutDate = req.getCheckOutDate();

            System.out.println("CheckInDate: " + checkInDate);
            System.out.println("CheckOutDate: " + checkOutDate);
            System.out.println("Current time: " + now);

            if (checkInDate == null || checkInDate.isBefore(now)) {
                System.out.println("⚠️  Auto-correcting check-in date to now");
                checkInDate = now;
                req.setCheckInDate(now);
            }

            if (checkOutDate == null || !checkOutDate.isAfter(checkInDate)) {
                System.out.println("⚠️  Auto-correcting check-out date to +1 day");
                checkOutDate = checkInDate.plusDays(1);
                req.setCheckOutDate(checkOutDate);
            }

            RoomType type = roomTypeRepository
                    .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                    .orElseThrow(() -> new RuntimeException("Room type not found: " + req.getRoomType()));

            List<Room> availableRooms = roomRepository.findByHotel_Id(DEFAULT_HOTEL_ID)
                    .stream()
                    .filter(r -> r.getRoomType().equals(type) && r.getStatus() == Room.Status.available)
                    .collect(Collectors.toList());

            if (availableRooms.isEmpty()) {
                throw new RuntimeException("No available " + type.getName() + " rooms");
            }

            Room room = availableRooms.get(0);
            room.setStatus(Room.Status.occupied);
            roomRepository.save(room);

            Guest guest = Guest.builder()
                    .fullName(req.getGuestName())
                    .email(req.getEmail())
                    .phone(req.getPhone())
                    .nationality(req.getNationality())
                    .documentType(req.getDocumentType())
                    .documentNumber(req.getDocumentNumber())
                    .build();
            guestRepository.save(guest);

            System.out.println("🔍 Looking for receptionist with ID: " + req.getReceptionId());
            System.out.println("✅ Found receptionist: " + receptionist.getFullName());

            Reservation reservation = Reservation.builder()
                    .hotel(room.getHotel())
                    .guest(guest)
                    .createdBy(receptionist)
                    .reservationCode("WALKIN-" + System.currentTimeMillis())
                    .status(Reservation.Status.checked_in)
                    .arrivalDate(req.getCheckInDate())
                    .departureDate(req.getCheckOutDate())
                    .pax(req.getAdultCount() + req.getChildCount())
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            reservationRepository.save(reservation);

            ReservationRoom rr = ReservationRoom.builder()
                    .reservation(reservation)
                    .room(room)
                    .roomType(type)
                    .nightlyPrice(type.getBasePrice())
                    .checkinDate(req.getCheckInDate())
                    .checkoutDate(req.getCheckOutDate())
                    .adultCount(req.getAdultCount())
                    .childCount(req.getChildCount())
                    .status(ReservationRoom.Status.checked_in)
                    .createdAt(LocalDateTime.now())
                    .build();
            reservationRoomRepository.save(rr);

            System.out.println("✅ Walk-in check-in completed: " + room.getRoomNumber());

            return AssignedRoomResponse.builder()
                    .reservationCode(reservation.getReservationCode())
                    .number(room.getRoomNumber())
                    .type(type.getName())
                    .guestName(guest.getFullName())
                    .checkInDate(req.getCheckInDate())
                    .checkOutDate(req.getCheckOutDate())
                    .build();

        } catch (Exception e) {
            System.out.println("❌ Check-in error: " + e.getMessage());
            throw new RuntimeException("Check-in failed: " + e.getMessage(), e);
        }
    }

    @Transactional
    public CheckOutResponse checkOut(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomNumber));

        ReservationRoom rr = reservationRoomRepository.findAll().stream()
                .filter(r -> r.getRoom() != null &&
                        r.getRoom().equals(room) &&
                        r.getStatus() == ReservationRoom.Status.checked_in)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active check-in for room: " + roomNumber));

        Reservation reservation = rr.getReservation();

        BigDecimal totalAmount = calculateTotalAmount(rr);

        BigDecimal finalAmount;
        String paymentType;

        if (reservation.getReservationCode().startsWith("WALKIN-")) {

            finalAmount = totalAmount;
            paymentType = "WALK-IN (100%)";
            System.out.println("💰 Walk-in payment: 100% = " + finalAmount);
        } else {

            finalAmount = totalAmount.multiply(BigDecimal.valueOf(0.8));
            paymentType = "BOOKING ONLINE (80%)";
            System.out.println("💰 Booking online payment: 80% = " + finalAmount + " (original: " + totalAmount + ")");
        }

        LocalDateTime now = LocalDateTime.now();

        rr.setStatus(ReservationRoom.Status.checked_out);
        reservationRoomRepository.save(rr);

        reservation.setStatus(Reservation.Status.checked_out);
        reservation.setUpdatedAt(now);
        reservationRepository.save(reservation);

        room.setStatus(Room.Status.available);
        roomRepository.save(room);

        Payment payment = Payment.builder()
                .reservation(reservation)
                .hotel(reservation.getHotel())
                .amount(finalAmount)
                .status(Payment.Status.completed)
                .paymentMethod("CASH")
                .paidAt(now)
                .transactionRef("CASH-" + System.currentTimeMillis())
                .build();
        paymentRepository.save(payment);

        System.out.println("✅ Check-out completed: " + roomNumber + " - Final Amount: " + finalAmount + " (" + paymentType + ")");

        return CheckOutResponse.builder()
                .reservationCode(reservation.getReservationCode())
                .roomNumber(roomNumber)
                .guestName(reservation.getGuest().getFullName())
                .checkInDate(rr.getCheckinDate())
                .checkOutDate(now)
                .totalAmount(finalAmount)
                .originalAmount(totalAmount) 
                .paymentType(paymentType) 
                .message("Check-out completed. " + paymentType + " - Total: " + finalAmount + " VND" +
                        (reservation.getReservationCode().startsWith("WALKIN-") ? "" : " (Đã giảm 20% cho booking online)"))
                .build();
    }

    private BigDecimal calculateTotalAmount(ReservationRoom rr) {
        LocalDateTime checkIn = rr.getCheckinDate();
        LocalDateTime checkOut = LocalDateTime.now();

        long hours = java.time.Duration.between(checkIn, checkOut).toHours();

        if (hours <= 6) {

            return rr.getNightlyPrice().divide(BigDecimal.valueOf(2));
        } else {

            long days = (hours + 23) / 24;
            return rr.getNightlyPrice().multiply(BigDecimal.valueOf(days));
        }
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getReservationsForCheckIn() {
        return reservationRepository.findByStatus(Reservation.Status.reserved)
                .stream()
                .map(res -> ReservationResponse.builder()
                        .id(res.getId())
                        .reservationCode(res.getReservationCode())
                        .guestName(res.getGuest().getFullName())
                        .email(res.getGuest().getEmail())
                        .phone(res.getGuest().getPhone())
                        .arrivalDate(res.getArrivalDate())
                        .departureDate(res.getDepartureDate())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CheckInTodayResponse> getTodayCheckIns() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay().minusNanos(1);

        List<ReservationRoom> todayRooms = reservationRoomRepository.findAll()
                .stream()
                .filter(rr -> rr.getCheckinDate() != null &&
                        !rr.getCheckinDate().isBefore(startOfDay) &&
                        !rr.getCheckinDate().isAfter(endOfDay) &&
                        rr.getStatus() == ReservationRoom.Status.checked_in)
                .collect(Collectors.toList());

        return todayRooms.stream()
                .map(rr -> {
                    Reservation reservation = rr.getReservation();
                    Guest guest = reservation.getGuest();

                    return CheckInTodayResponse.builder()
                            .guestName(guest.getFullName())
                            .phone(guest.getPhone())
                            .email(guest.getEmail())
                            .roomNumber(rr.getRoom().getRoomNumber())
                            .roomType(rr.getRoomType().getName())
                            .checkInDate(rr.getCheckinDate())
                            .checkOutDate(rr.getCheckoutDate())
                            .documentType(guest.getDocumentType())
                            .documentNumber(guest.getDocumentNumber())
                            .status(rr.getStatus().name())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CheckAvailabilityResponse checkAvailability(CheckAvailabilityRequest req) {
        RoomType type = roomTypeRepository
                .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        List<Room> availableRooms = roomRepository.findByHotel_Id(DEFAULT_HOTEL_ID)
                .stream()
                .filter(r -> r.getRoomType().equals(type) && r.getStatus() == Room.Status.available)
                .collect(Collectors.toList());

        int count = availableRooms.size();

        return CheckAvailabilityResponse.builder()
                .roomType(type.getName())
                .availableRooms(count)
                .message(count > 0
                        ? "✅ Có " + count + " phòng trống cho loại " + type.getName()
                        : "❌ Không còn phòng trống cho loại " + type.getName())
                .build();
    }

    @Transactional(readOnly = true)
    public boolean verifyDocument(String reservationCode, String documentType, String documentNumber) {
        Reservation reservation = reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Guest guest = reservation.getGuest();

        boolean isDocumentValid = documentType.equals(guest.getDocumentType())
                && documentNumber.equals(guest.getDocumentNumber());

        if (!isDocumentValid) {
            throw new RuntimeException("Document information does not match");
        }

        if (reservation.getStatus() != Reservation.Status.reserved) {
            throw new RuntimeException("Reservation is not in valid status for check-in");
        }

        return true;
    }

}