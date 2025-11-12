package com.project.mhotel.repository;

import com.project.mhotel.entity.Payment;
import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm payments theo reservation
    List<Payment> findByReservationOrderByPaidAtDesc(Reservation reservation);

    // Tìm payments theo status
    List<Payment> findByStatus(Payment.Status status);
    // Trong PaymentRepository
}
