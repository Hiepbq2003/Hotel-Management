package com.project.mhotel.repository;

import com.project.mhotel.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    List<RoomType> findByHotelId(Long hotelId);

    Optional<RoomType> findByHotelIdAndCode(Long hotelId, String code);

    boolean existsByHotelIdAndCode(Long hotelId, String code);

}
