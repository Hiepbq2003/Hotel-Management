package com.project.mhotel.repository;

import com.project.mhotel.entity.HotelAmenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelAmenityRepository extends JpaRepository<HotelAmenity, Long> {

    List<HotelAmenity> findByHotel_Id(Long hotelId);

    boolean existsByHotel_IdAndService_Id(Long hotelId, Long serviceId);

    boolean existsByHotel_IdAndService_IdAndIdNot(Long hotelId, Long serviceId, Long id);

}