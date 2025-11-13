package com.project.mhotel.repository;

import com.project.mhotel.entity.Payment;
import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm payments theo reservation
    List<Payment> findByReservationOrderByPaidAtDesc(Reservation reservation);

    // Tìm payments theo status
    // Tìm payment theo reservation
    List<Payment> findByReservation(Reservation reservation);

    List<Payment> findByReservationId(Long reservationId);

    // Tìm payment theo hotel
    List<Payment> findByHotelId(Long hotelId);

    // Tìm payment theo status
    List<Payment> findByStatus(Payment.Status status);

    // Tìm payment theo payment method
    List<Payment> findByPaymentMethod(String paymentMethod);

    // Tìm payment theo transaction reference
    Optional<Payment> findByTransactionRef(String transactionRef);

    // Tìm payment với thông tin reservation và guest
    @Query("SELECT p FROM Payment p " +
            "LEFT JOIN FETCH p.reservation r " +
            "LEFT JOIN FETCH r.guest g " +
            "WHERE p.id = :id")
    Optional<Payment> findByIdWithDetails(@Param("id") Long id);

    // Tìm tất cả payment với thông tin đầy đủ
    @Query("SELECT p FROM Payment p " +
            "LEFT JOIN FETCH p.reservation r " +
            "LEFT JOIN FETCH r.guest g " +
            "ORDER BY p.paidAt DESC")
    List<Payment> findAllWithDetails();

    // Kiểm tra xem reservation đã có payment chưa
    boolean existsByReservationId(Long reservationId);

    // Đếm số payment theo status
    long countByStatus(Payment.Status status);
}
