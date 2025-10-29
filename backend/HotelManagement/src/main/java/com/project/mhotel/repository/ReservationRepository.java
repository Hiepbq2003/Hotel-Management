package com.project.mhotel.repository;

import com.project.mhotel.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> { }
