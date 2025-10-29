package com.project.mhotel.repository;

import com.project.mhotel.entity.Guest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuestRepository extends JpaRepository<Guest, Long> { }
