package com.project.mhotel.service;

import com.project.mhotel.dto.HotelAmenityRequest;
import com.project.mhotel.dto.HotelAmenityResponse;
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.HotelAmenity;
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

    // --- GET METHODS ---

    public List<HotelAmenityResponse> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(HotelAmenityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<HotelAmenityResponse> getAmenitiesByHotel(Long hotelId) {
        return amenityRepository.findByHotel_Id(hotelId).stream()
                .map(HotelAmenityResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public Optional<HotelAmenityResponse> getAmenityById(Long id) {
        return amenityRepository.findById(id)
                .map(HotelAmenityResponse::fromEntity);
    }

    // --- CREATE METHOD ---

    public HotelAmenityResponse createAmenity(HotelAmenityRequest request) {
        if (request.getHotelId() == null) {
            throw new RuntimeException("Hotel ID is required.");
        }

        // 1. Kiểm tra Hotel
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + request.getHotelId()));

        // 2. Kiểm tra trùng lặp tên
        if (amenityRepository.existsByHotel_IdAndNameIgnoreCase(request.getHotelId(), request.getName())) {
            throw new RuntimeException("Amenity name already exists in this hotel.");
        }

        // 3. Map DTO sang Entity và lưu
        HotelAmenity newAmenity = HotelAmenity.builder()
                .hotel(hotel)
                .name(request.getName())
                .description(request.getDescription())
                .iconUrl(request.getIconUrl())
                .isActive(request.getIsActive())
                .build();

        return HotelAmenityResponse.fromEntity(amenityRepository.save(newAmenity));
    }

    // --- UPDATE METHOD ---

    public HotelAmenityResponse updateAmenity(Long id, HotelAmenityRequest request) {
        HotelAmenity existingAmenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel Amenity not found with ID: " + id));

        // 1. Kiểm tra trùng lặp tên (loại trừ chính nó)
        if (amenityRepository.existsByHotel_IdAndNameIgnoreCaseAndIdNot(
                existingAmenity.getHotel().getId(),
                request.getName(),
                id)) {
            throw new RuntimeException("Amenity name already exists in this hotel.");
        }

        // 2. Cập nhật Entity
        existingAmenity.setName(request.getName());
        existingAmenity.setDescription(request.getDescription());
        existingAmenity.setIconUrl(request.getIconUrl());
        existingAmenity.setIsActive(request.getIsActive());

        return HotelAmenityResponse.fromEntity(amenityRepository.save(existingAmenity));
    }

    // --- DELETE METHOD ---

    public void deleteAmenity(Long id) {
        if (!amenityRepository.existsById(id)) {
            throw new RuntimeException("Hotel Amenity not found with ID: " + id);
        }
        amenityRepository.deleteById(id);
    }
}