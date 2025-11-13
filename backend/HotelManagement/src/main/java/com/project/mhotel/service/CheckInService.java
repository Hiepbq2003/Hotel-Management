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

            // Validation với entity hiện tại
            if (reservation.getStatus() != Reservation.Status.reserved) {
                throw new RuntimeException("Cannot check-in. Reservation status is: " + reservation.getStatus() + ". Expected: reserved");
            }

            // Kiểm tra ngày arrival
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

            // Check room availability và update status
            for (ReservationRoom rr : reservationRooms) {
                Room room = rr.getRoom();

                // 🆕 FIX: Tự động gán phòng nếu chưa có
                if (room == null) {
                    System.out.println("⚠️ No room assigned for reservation room ID: " + rr.getId() + ". Auto-assigning room...");

                    // Tìm phòng available cùng loại
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
                    rr.setRoom(room); // 🆕 Gán phòng vào reservation room
                    reservationRoomRepository.save(rr);
                    System.out.println("✅ Auto-assigned room: " + room.getRoomNumber() + " to reservation room ID: " + rr.getId());
                }

                System.out.println("🔍 Checking room: " + room.getRoomNumber() + ", Status: " + room.getStatus());

                if (room.getStatus() != Room.Status.available) {
                    throw new RuntimeException("Room " + room.getRoomNumber() + " is not available. Current status: " + room.getStatus());
                }

                // Cập nhật trạng thái phòng
                room.setStatus(Room.Status.occupied);
                roomRepository.save(room);

                // Cập nhật reservation room
                rr.setStatus(ReservationRoom.Status.checked_in);
                reservationRoomRepository.save(rr);

                System.out.println("✅ Room " + room.getRoomNumber() + " updated to occupied");
            }

            // Cập nhật reservation status
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

    /**
     * CHECK-IN walk-in (tạo mới reservation)
     */
    @Transactional
    public AssignedRoomResponse assignRoom(CheckInRequest req) {
        try {
            System.out.println("=== 🎯 DEBUG CHECK-IN REQUEST ===");
            System.out.println("Reception ID: " + req.getReceptionId());
            System.out.println("Guest Name: " + req.getGuestName());
            System.out.println("Email: " + req.getEmail());
            System.out.println("Room Type: " + req.getRoomType());

            // 🎯 VALIDATE receptionId
            if (req.getReceptionId() == null) {
                throw new RuntimeException("Receptionist ID is required. Received: null");
            }

            System.out.println("🔍 Looking for receptionist with ID: " + req.getReceptionId());
            UserAccount receptionist = userAccountRepository.findById(req.getReceptionId())
                    .orElseThrow(() -> {
                        // 🎯 KIỂM TRA CÓ USER NÀO TRONG DB KHÔNG
                        long userCount = userAccountRepository.count();
                        System.out.println("❌ Receptionist not found. Total users in DB: " + userCount);
                        return new RuntimeException("Receptionist not found with ID: " + req.getReceptionId());
                    });

            System.out.println("✅ Found receptionist: " + receptionist.getFullName() + " (" + receptionist.getRole() + ")");
            System.out.println("=== 🎯 DEBUG CHECK-IN REQUEST ===");
            System.out.println("Reception ID from request: " + req.getReceptionId());
            System.out.println("Guest Name: " + req.getGuestName());
            System.out.println("Room Type: " + req.getRoomType());

            // 🎯 VALIDATE receptionId
            if (req.getReceptionId() == null) {
                throw new RuntimeException("Receptionist ID is required");
            }

            // 🎯 VALIDATE datetime (mềm mại hơn)
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime checkInDate = req.getCheckInDate();
            LocalDateTime checkOutDate = req.getCheckOutDate();

            System.out.println("CheckInDate: " + checkInDate);
            System.out.println("CheckOutDate: " + checkOutDate);
            System.out.println("Current time: " + now);

            // Auto-correct datetime nếu cần
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

            // Tìm loại phòng
            RoomType type = roomTypeRepository
                    .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                    .orElseThrow(() -> new RuntimeException("Room type not found: " + req.getRoomType()));

            // Tìm phòng available
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

            // Lưu Guest
            Guest guest = Guest.builder()
                    .fullName(req.getGuestName())
                    .email(req.getEmail())
                    .phone(req.getPhone())
                    .nationality(req.getNationality())
                    .documentType(req.getDocumentType())
                    .documentNumber(req.getDocumentNumber())
                    .build();
            guestRepository.save(guest);

            // 🎯 TÌM RECEPTIONIST với validation
            System.out.println("🔍 Looking for receptionist with ID: " + req.getReceptionId());
            System.out.println("✅ Found receptionist: " + receptionist.getFullName());

            // Tạo Reservation
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

            // Tạo ReservationRoom
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

    /**
     * CHECK-OUT với entity hiện tại
     */
    /**
     * CHECK-OUT với entity hiện tại
     * VERSION MỚI: Kiểm tra phương thức thanh toán - Booking online: 80%, Walk-in: 100%
     */
    @Transactional
    public CheckOutResponse checkOut(String roomNumber) {
        Room room = roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomNumber));

        // Tìm reservation room đang checked_in
        ReservationRoom rr = reservationRoomRepository.findAll().stream()
                .filter(r -> r.getRoom() != null &&
                        r.getRoom().equals(room) &&
                        r.getStatus() == ReservationRoom.Status.checked_in)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active check-in for room: " + roomNumber));

        Reservation reservation = rr.getReservation();

        // Tính tổng tiền với entity hiện tại
        BigDecimal totalAmount = calculateTotalAmount(rr);

        // 🆕 KIỂM TRA PHƯƠNG THỨC THANH TOÁN
        BigDecimal finalAmount;
        String paymentType;

        if (reservation.getReservationCode().startsWith("WALKIN-")) {
            // Walk-in: trả 100% giá
            finalAmount = totalAmount;
            paymentType = "WALK-IN (100%)";
            System.out.println("💰 Walk-in payment: 100% = " + finalAmount);
        } else {
            // Booking online: trả 80% giá (giảm 20%)
            finalAmount = totalAmount.multiply(BigDecimal.valueOf(0.8));
            paymentType = "BOOKING ONLINE (80%)";
            System.out.println("💰 Booking online payment: 80% = " + finalAmount + " (original: " + totalAmount + ")");
        }

        LocalDateTime now = LocalDateTime.now();

        // Cập nhật reservation room
        rr.setStatus(ReservationRoom.Status.checked_out);
        reservationRoomRepository.save(rr);

        // Cập nhật reservation
        reservation.setStatus(Reservation.Status.checked_out);
        reservation.setUpdatedAt(now);
        reservationRepository.save(reservation);

        // Cập nhật phòng thành available
        room.setStatus(Room.Status.available);
        roomRepository.save(room);

        // 🆕 Tạo payment với amount đã điều chỉnh
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
                .originalAmount(totalAmount) // 🆕 Thêm original amount để hiển thị
                .paymentType(paymentType) // 🆕 Thêm loại thanh toán
                .message("Check-out completed. " + paymentType + " - Total: " + finalAmount + " VND" +
                        (reservation.getReservationCode().startsWith("WALKIN-") ? "" : " (Đã giảm 20% cho booking online)"))
                .build();
    }

    /**
     * Tính tổng tiền với entity hiện tại (LocalDateTime)
     */
    private BigDecimal calculateTotalAmount(ReservationRoom rr) {
        LocalDateTime checkIn = rr.getCheckinDate();
        LocalDateTime checkOut = LocalDateTime.now();

        // Tính số giờ thực tế
        long hours = java.time.Duration.between(checkIn, checkOut).toHours();

        // Logic tính tiền:
        // - Dưới 6 giờ: tính nửa ngày (50% giá)
        // - Trên 6 giờ: tính full ngày
        // - Mỗi ngày = 24 giờ

        if (hours <= 6) {
            // Nửa ngày
            return rr.getNightlyPrice().divide(BigDecimal.valueOf(2));
        } else {
            // Tính số ngày (làm tròn lên)
            long days = (hours + 23) / 24;
            return rr.getNightlyPrice().multiply(BigDecimal.valueOf(days));
        }
    }

    /**
     * Lấy danh sách reservation có thể check-in
     */
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

    /**
     * Lấy check-in hôm nay - VERSION cho entity hiện tại
     */
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

    /**
     * Check availability - VERSION cho entity hiện tại
     */
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
    /**
     * Xác thực document cho booking
     */
    @Transactional(readOnly = true)
    public boolean verifyDocument(String reservationCode, String documentType, String documentNumber) {
        Reservation reservation = reservationRepository.findByReservationCode(reservationCode)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        Guest guest = reservation.getGuest();

        // 🎯 Kiểm tra document type và number
        boolean isDocumentValid = documentType.equals(guest.getDocumentType())
                && documentNumber.equals(guest.getDocumentNumber());

        if (!isDocumentValid) {
            throw new RuntimeException("Document information does not match");
        }

        // 🎯 Kiểm tra trạng thái reservation
        if (reservation.getStatus() != Reservation.Status.reserved) {
            throw new RuntimeException("Reservation is not in valid status for check-in");
        }

        return true;
    }


}