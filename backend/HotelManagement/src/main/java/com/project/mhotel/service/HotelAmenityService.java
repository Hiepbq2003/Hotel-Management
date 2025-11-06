package com.project.mhotel.service;

import com.project.mhotel.dto.HotelAmenityRequest;
import com.project.mhotel.dto.HotelAmenityResponse;
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.HotelAmenity;
import com.project.mhotel.entity.Services;
import com.project.mhotel.repository.HotelAmenityRepository;
import com.project.mhotel.repository.HotelRepository;
import com.project.mhotel.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HotelAmenityService {

    private final HotelAmenityRepository amenityRepository;
    private final HotelRepository hotelRepository;
    private final ServiceRepository serviceRepository;

    public HotelAmenityService(HotelAmenityRepository amenityRepository,
                               HotelRepository hotelRepository,
                               ServiceRepository serviceRepository) {
        this.amenityRepository = amenityRepository;
        this.hotelRepository = hotelRepository;
        this.serviceRepository = serviceRepository;
    }

    // --- GET METHODS (giữ nguyên logic DTO) ---
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
        if (request.getHotelId() == null || request.getServiceId() == null) {
            throw new RuntimeException("Hotel ID and Service ID are required.");
        }

        // 1. Kiểm tra Hotel
        Hotel hotel = hotelRepository.findById(request.getHotelId())
                .orElseThrow(() -> new RuntimeException("Hotel not found with ID: " + request.getHotelId()));

        // 2. Tìm Service Entity
        Services service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + request.getServiceId()));

        // 3. ✅ FIX LOGIC: Kiểm tra trùng lặp Service ID (Sử dụng phương thức mới)
        if (amenityRepository.existsByHotel_IdAndService_Id(request.getHotelId(), request.getServiceId())) {
            throw new RuntimeException("The selected service is already added as an amenity to this hotel.");
        }

        // 4. Map DTO sang Entity và lưu
        HotelAmenity newAmenity = HotelAmenity.builder()
                .hotel(hotel)
                .service(service)
                .build();

        return HotelAmenityResponse.fromEntity(amenityRepository.save(newAmenity));
    }

    // --- UPDATE METHOD ---

    public HotelAmenityResponse updateAmenity(Long id, HotelAmenityRequest request) {
        HotelAmenity existingAmenity = amenityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel Amenity not found with ID: " + id));

        if (request.getServiceId() == null) {
            throw new RuntimeException("Service ID is required for updating amenity.");
        }

        // 1. Tìm Service Entity mới
        Services newService = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with ID: " + request.getServiceId()));

        // 2. ✅ FIX LOGIC: Kiểm tra trùng lặp Service ID, loại trừ chính nó (Sử dụng phương thức mới)
        if (amenityRepository.existsByHotel_IdAndService_IdAndIdNot(
                existingAmenity.getHotel().getId(),
                request.getServiceId(),
                id)) {
            throw new RuntimeException("The selected service is already added as an amenity to this hotel.");
        }

        // 3. Cập nhật Service
        existingAmenity.setService(newService);

        return HotelAmenityResponse.fromEntity(amenityRepository.save(existingAmenity));
    }

    // --- DELETE METHOD (Giữ nguyên) ---
    public void deleteAmenity(Long id) {
        if (!amenityRepository.existsById(id)) {
            throw new RuntimeException("Hotel Amenity not found with ID: " + id);
        }
        amenityRepository.deleteById(id);
    }
}