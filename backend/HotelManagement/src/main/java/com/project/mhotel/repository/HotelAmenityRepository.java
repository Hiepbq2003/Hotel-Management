package com.project.mhotel.repository;

import com.project.mhotel.entity.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelAmenityRepository extends JpaRepository<HotelAmenity, Long> {

    List<HotelAmenity> findByHotel_Id(Long hotelId);

    boolean existsByHotel_IdAndNameIgnoreCase(Long hotelId, String name);

    boolean existsByHotel_IdAndNameIgnoreCaseAndIdNot(Long hotelId, String name, Long id);
}