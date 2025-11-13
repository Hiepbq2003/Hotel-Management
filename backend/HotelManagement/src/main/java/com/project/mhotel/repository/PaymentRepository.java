package com.project.mhotel.repository;

import com.project.mhotel.entity.Payment;
import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByReservationOrderByPaidAtDesc(Reservation reservation);

    List<Payment> findByReservation(Reservation reservation);

    List<Payment> findByStatus(Payment.Status status);

    Optional<Payment> findByTransactionRef(String transactionRef);

    @Query("SELECT SUM(p.amount) FROM Payment p " +
            "WHERE FUNCTION('YEAR', p.paidAt) = :year " +
            "AND FUNCTION('MONTH', p.paidAt) = :month " +
            "AND p.status = 'completed'") // Lọc theo status đã hoàn thành
    BigDecimal sumTotalAmountByMonthAndYear(
            @Param("year") int year,
            @Param("month") int month);

    @Query("SELECT SUM(p.amount) FROM Payment p " +
            "WHERE FUNCTION('YEAR', p.paidAt) = :year " +
            "AND p.status = 'completed'") // Lọc theo status đã hoàn thành
    BigDecimal sumTotalAmountByYear(@Param("year") int year);
}
