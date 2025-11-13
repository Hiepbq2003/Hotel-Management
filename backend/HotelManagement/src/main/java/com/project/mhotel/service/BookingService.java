package com.project.mhotel.service;

import com.project.mhotel.dto.BookingRequest;
import com.project.mhotel.dto.PaymentRequest;
import com.project.mhotel.entity.*;
import com.project.mhotel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final RoomTypeRepository roomTypeRepository;
    private final GuestRepository guestRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationRoomRepository reservationRoomRepository;
    private final CustomerAccountRepository customerAccountRepository;
    private final PaymentRepository paymentRepository;

    private final Long DEFAULT_HOTEL_ID = 1L;

    @Transactional
    public Reservation createBooking(BookingRequest req) {

        // 1️⃣ Tìm RoomType
        RoomType roomType = roomTypeRepository
                .findByHotelIdAndCode(DEFAULT_HOTEL_ID, req.getRoomType())
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        // 2️⃣ Xử lý CustomerAccount nếu có
        CustomerAccount customer = null;
        if (req.getCustomerId() != null) {
            customer = customerAccountRepository.findById(req.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
        }

        // 3️⃣ Tính số đêm
        long nights = Duration.between(req.getCheckInDate(), req.getCheckOutDate()).toDays();
        if (nights <= 0) nights = 1;

        // 4️⃣ Tính tổng tiền
        int roomCount = (req.getRooms() == null || req.getRooms().isEmpty()) ? 1 : req.getRooms().size();
        BigDecimal totalAmount = roomType.getBasePrice()
                .multiply(BigDecimal.valueOf(roomCount))
                .multiply(BigDecimal.valueOf(nights));

        // 5️⃣ Xác định guest chính THÔNG MINH HƠN
        Guest mainGuest;
        boolean isMultiRoom = req.getRooms() != null && !req.getRooms().isEmpty();

        if (isMultiRoom) {
            // MULTI-ROOM: Dùng guest từ phòng đầu tiên làm guest chính
            BookingRequest.RoomBookingItem firstRoom = req.getRooms().get(0);
            String firstGuestName = (firstRoom.getGuestName() != null) ? firstRoom.getGuestName().trim() : null;

            if (firstGuestName == null || firstGuestName.isEmpty()) {
                throw new RuntimeException("Guest name for the first room is required");
            }

            mainGuest = Guest.builder()
                    .customer(customer)
                    .fullName(firstGuestName)
                    .email(firstRoom.getEmail())
                    .phone(firstRoom.getPhone())
                    .documentType(firstRoom.getDocumentType())
                    .documentNumber(firstRoom.getDocumentNumber())
                    .build();
        } else {
            // SINGLE-ROOM: Dùng guest từ request chính
            String mainGuestName = (req.getGuestName() != null) ? req.getGuestName().trim() : null;
            if (mainGuestName == null || mainGuestName.isEmpty()) {
                throw new RuntimeException("Guest name is required");
            }

            mainGuest = Guest.builder()
                    .customer(customer)
                    .fullName(mainGuestName)
                    .email(req.getEmail())
                    .phone(req.getPhone())
                    .nationality(req.getNationality())
                    .documentType(req.getDocumentType())
                    .documentNumber(req.getDocumentNumber())
                    .build();
        }

        guestRepository.save(mainGuest);

        // 6️⃣ Tạo reservation
        Reservation reservation = Reservation.builder()
                .hotel(roomType.getHotel())
                .guest(mainGuest)
                .reservationCode("RES-" + System.currentTimeMillis())
                .status(Reservation.Status.reserved) // Sửa thành pending_payment để nhất quán
                .arrivalDate(req.getCheckInDate())
                .departureDate(req.getCheckOutDate())
                .pax(req.getAdultCount() + req.getChildCount())
                .totalAmount(totalAmount)
                .bookingSource("Online Booking")
                .notes(req.getNotes())
                .build();
        reservationRepository.save(reservation);

        // 7️⃣ Xử lý multi-room nếu có
        if (isMultiRoom) {
            for (int i = 0; i < req.getRooms().size(); i++) {
                BookingRequest.RoomBookingItem item = req.getRooms().get(i);

                Guest roomGuest;
                if (i == 0) {
                    // Phòng đầu tiên dùng guest chính đã tạo
                    roomGuest = mainGuest;
                } else {
                    // Các phòng khác tạo guest mới
                    String itemGuestName = (item.getGuestName() != null) ? item.getGuestName().trim() : null;
                    if (itemGuestName == null || itemGuestName.isEmpty()) {
                        throw new RuntimeException("Guest name for room " + (i + 1) + " is required");
                    }

                    roomGuest = Guest.builder()
                            .customer(customer)
                            .fullName(itemGuestName)
                            .email(item.getEmail())
                            .phone(item.getPhone())
                            .documentType(item.getDocumentType())
                            .documentNumber(item.getDocumentNumber())
                            .build();
                    guestRepository.save(roomGuest);
                }

                ReservationRoom rr = ReservationRoom.builder()
                        .reservation(reservation)
                        .roomType(roomType)
                        .checkinDate(req.getCheckInDate())
                        .checkoutDate(req.getCheckOutDate())
                        .adultCount(item.getAdultCount())
                        .childCount(item.getChildCount())
                        .nightlyPrice(roomType.getBasePrice())
                        .status(ReservationRoom.Status.booked) // Đồng bộ trạng thái
                        .build();

                reservationRoomRepository.save(rr);
            }
        } else {
            // 8️⃣ Single room mode
            ReservationRoom rr = ReservationRoom.builder()
                    .reservation(reservation)
                    .roomType(roomType)
                    .checkinDate(req.getCheckInDate())
                    .checkoutDate(req.getCheckOutDate())
                    .adultCount(req.getAdultCount())
                    .childCount(req.getChildCount())
                    .nightlyPrice(roomType.getBasePrice())
                    .status(ReservationRoom.Status.booked) // Đồng bộ trạng thái
                    .build();

            reservationRoomRepository.save(rr);
        }

        return reservation;
    }

    // Phương thức xử lý thanh toán thành công
    @Transactional
    public Reservation processPayment(Long reservationId, PaymentRequest paymentRequest) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Kiểm tra trạng thái hiện tại
        if (reservation.getStatus() != Reservation.Status.pending_payment) {
            throw new RuntimeException("Reservation is not in pending payment status");
        }

        // Tạo payment record
        Payment payment = Payment.builder()
                .reservation(reservation)
                .hotel(reservation.getHotel())
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .transactionRef(paymentRequest.getTransactionRef())
                .status(Payment.Status.completed)
                .notes(paymentRequest.getNotes())
                .build();
        paymentRepository.save(payment);

        // Cập nhật trạng thái reservation thành reserved
        reservation.setStatus(Reservation.Status.reserved);
        reservation.setUpdatedAt(LocalDateTime.now());

        // Cập nhật trạng thái các reservation room
        if (reservation.getReservationRooms() != null) {
            for (ReservationRoom room : reservation.getReservationRooms()) {
                room.setStatus(ReservationRoom.Status.booked);
            }
        }

        return reservationRepository.save(reservation);
    }

    // Phương thức xử lý thanh toán thất bại
    @Transactional
    public Reservation processPaymentFailed(Long reservationId, PaymentRequest paymentRequest) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Tạo payment record với trạng thái failed
        Payment payment = Payment.builder()
                .reservation(reservation)
                .hotel(reservation.getHotel())
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .transactionRef(paymentRequest.getTransactionRef())
                .status(Payment.Status.failed)
                .notes(paymentRequest.getNotes())
                .build();
        paymentRepository.save(payment);

        return reservation;
    }

    // Phương thức huỷ booking quá hạn thanh toán (24 giờ)
    @Transactional
    public void cancelOverdueBookings() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);

        List<Reservation> overdueReservations = reservationRepository
                .findByStatusAndCreatedAtBefore(
                        Reservation.Status.pending_payment,
                        twentyFourHoursAgo
                );

        for (Reservation reservation : overdueReservations) {
            // Cập nhật trạng thái reservation thành cancelled
            reservation.setStatus(Reservation.Status.cancelled);
            reservation.setUpdatedAt(LocalDateTime.now());

            // Cập nhật trạng thái các reservation room
            if (reservation.getReservationRooms() != null) {
                for (ReservationRoom room : reservation.getReservationRooms()) {
                    room.setStatus(ReservationRoom.Status.cancelled);
                }
            }

            reservationRepository.save(reservation);

            // Tạo payment record cho việc huỷ do quá hạn
            Payment payment = Payment.builder()
                    .reservation(reservation)
                    .hotel(reservation.getHotel())
                    .amount(BigDecimal.ZERO)
                    .paymentMethod("SYSTEM")
                    .transactionRef("AUTO_CANCEL_" + reservation.getReservationCode())
                    .status(Payment.Status.failed)
                    .notes("Tự động huỷ do quá hạn thanh toán (24 giờ)")
                    .build();
            paymentRepository.save(payment);
        }
    }

    // Phương thức lấy thông tin booking
    public Reservation getBooking(Long reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }
}