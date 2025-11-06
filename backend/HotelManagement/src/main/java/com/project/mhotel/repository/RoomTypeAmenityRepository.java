package com.project.mhotel.repository;

import com.project.mhotel.entity.RoomTypeAmenity;
import com.project.mhotel.entity.RoomTypeAmenityId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeAmenityRepository extends JpaRepository<RoomTypeAmenity, RoomTypeAmenityId> {
}