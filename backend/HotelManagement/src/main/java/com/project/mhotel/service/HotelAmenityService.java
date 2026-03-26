package com.project.mhotel.service;

import com.project.mhotel.dto.HotelAmenityRequest;
import com.project.mhotel.dto.HotelAmenityResponse;
import com.project.mhotel.dto.RoomTypeDto; 
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.HotelAmenity;
import com.project.mhotel.entity.RoomTypeAmenity; 
import com.project.mhotel.repository.HotelAmenityRepository;
import com.project.mhotel.repository.HotelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HotelAmenityService {

    private final HotelAmenityRepository amenityRepository;
    private final HotelRepository hotelRepository;

    public HotelAmenityService(HotelAmenityRepository amenityRepository, HotelRepository hotelRepository) {
        this.amenityRepository = amenityRepository;
        this.hotelRepository = hotelRepository;
    }

    public List<HotelAmenityResponse> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(this::toResponse) 
                .collect(Collectors.toList());
    }

    public List<HotelAmenityResponse> getAmenitiesByHotel(Long hotelId) {
        return amenityRepository.findByHotel_Id(hotelId).stream()
                .map(this::toResponse) 
                .collect(Collectors.toList());
    }

    public Optional<HotelAmenityResponse> getAmenityById(Long id) {
        return amenityRepository.findById(id)
                .map(this::toResponse); 
    }

    public HotelAmenityResponse createAmenity(HotelAmenityRequest request) {
        if (request.getHotelId() == null) {
            throw new RuntimeException("Hotel ID is required.");
        }

        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + request.getHotelId()));

        if (amenityRepository.existsByHotel_IdAndNameIgnoreCase(request.getHotelId(), request.getName())) {
            throw new RuntimeException("Amenity name already exists in this hotel.");
        }

        HotelAmenity newAmenity = HotelAmenity.builder()
                .hotel(hotel)
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return toResponse(amenityRepository.save(newAmenity)); 
    }

    public HotelAmenityResponse updateAmenity(Long id, HotelAmenityRequest request) {
        HotelAmenity existingAmenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel Amenity not found with ID: " + id));

        if (amenityRepository.existsByHotel_IdAndNameIgnoreCaseAndIdNot(
                existingAmenity.getHotel().getId(),
                request.getName(),
                id)) {
            throw new RuntimeException("Amenity name already exists in this hotel.");
        }

        existingAmenity.setName(request.getName());
        existingAmenity.setDescription(request.getDescription());

        return toResponse(amenityRepository.save(existingAmenity));
    }

    public void deleteAmenity(Long id) {
        if (!amenityRepository.existsById(id)) {
            throw new RuntimeException("Hotel Amenity not found with ID: " + id);
        }
        amenityRepository.deleteById(id);
    }

    private HotelAmenityResponse toResponse(HotelAmenity entity) {

        List<RoomTypeDto> roomTypeDtos = entity.getRoomTypes() != null
                ? entity.getRoomTypes().stream()
                .map(RoomTypeAmenity::getRoomType)
                .map(this::toRoomTypeDto)
                .collect(Collectors.toList())
                : List.of();

        HotelAmenityResponse response = new HotelAmenityResponse();
        response.setId(entity.getId());
        response.setHotelId(entity.getHotel().getId());
        response.setName(entity.getName());
        response.setDescription(entity.getDescription());
        response.setCreatedAt(entity.getCreatedAt());

        response.setRoomTypes(roomTypeDtos);
        return response;
    }

    private RoomTypeDto toRoomTypeDto(com.project.mhotel.entity.RoomType roomTypeEntity) {
        return new RoomTypeDto(roomTypeEntity.getId(), roomTypeEntity.getName(), roomTypeEntity.getCode());
    }
}