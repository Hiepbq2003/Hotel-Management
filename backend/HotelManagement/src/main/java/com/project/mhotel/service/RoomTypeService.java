package com.project.mhotel.service;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;

    public List<RoomType> getAll() {
        return roomTypeRepository.findAll();
    }

    public List<RoomType> getByHotel(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId);
    }

    public RoomType getById(Long id) {
        return roomTypeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Room type not found with id: " + id));
    }

    public RoomType create(RoomType roomType) {
        if (roomTypeRepository.existsByHotelIdAndCode(roomType.getHotel().getId(), roomType.getCode())) {
            throw new IllegalArgumentException("Room type code already exists for this hotel");
        }
        return roomTypeRepository.save(roomType);
    }

    public RoomType update(Long id, RoomType updated) {
        RoomType existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setCapacity(updated.getCapacity());
        existing.setBedInfo(updated.getBedInfo());
        existing.setBasePrice(updated.getBasePrice());
        return roomTypeRepository.save(existing);
    }

    public void delete(Long id) {
        roomTypeRepository.deleteById(id);
    }
}
