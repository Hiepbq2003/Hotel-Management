package com.project.mhotel.service;

import com.project.mhotel.dto.HotelAmenityResponse;
import com.project.mhotel.dto.RoomTypeRequest;
import com.project.mhotel.dto.RoomTypeResponse;
import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.HotelAmenity;
import com.project.mhotel.entity.RoomType;
import com.project.mhotel.entity.RoomTypeAmenity;
import com.project.mhotel.entity.RoomTypeAmenityId;
import com.project.mhotel.repository.HotelAmenityRepository;
import com.project.mhotel.repository.RoomTypeAmenityRepository;
import com.project.mhotel.repository.RoomTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final HotelService hotelService;
    private final HotelAmenityRepository amenityRepository;
    private final RoomTypeAmenityRepository roomTypeAmenityRepository;


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

    public RoomType create(RoomType roomType, Long hotelId) {
        Hotel hotel = hotelService.getById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found with id: " + hotelId));

        roomType.setHotel(hotel);

        if (roomTypeRepository.existsByHotelIdAndCode(hotel.getId(), roomType.getCode())) {
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


    // --- DTO Methods ---

    public List<RoomTypeResponse> getAllDto() {
        return roomTypeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<RoomTypeResponse> getByHotelDto(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public RoomTypeResponse getByIdDto(Long id) {
        RoomType roomType = getById(id);
        return toResponse(roomType);
    }

    public RoomTypeResponse createDto(RoomTypeRequest request, Long hotelId) {
        Hotel hotel = hotelService.getById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("Hotel not found with id: " + hotelId));

        if (roomTypeRepository.existsByHotelIdAndCode(hotelId, request.getCode())) {
            throw new IllegalArgumentException("Room type code already exists for this hotel");
        }

        RoomType roomType = toEntity(request, hotel);
        RoomType saved = roomTypeRepository.save(roomType);
        return toResponse(saved);
    }

    public RoomTypeResponse updateDto(Long id, RoomTypeRequest request) {
        RoomType existing = getById(id);
        existing.setName(request.getName());
        existing.setDescription(request.getDescription());
        existing.setCapacity(request.getCapacity());
        existing.setBedInfo(request.getBedInfo());
        existing.setBasePrice(request.getBasePrice());
        RoomType updated = roomTypeRepository.save(existing);
        return toResponse(updated);
    }

    // --- AMENITY MANAGEMENT METHOD (FIXED) ---
    @Transactional
    public RoomTypeResponse updateRoomTypeAmenities(Long roomTypeId, List<Long> amenityIds) {
        RoomType roomType = getById(roomTypeId);

        Set<RoomTypeAmenity> newAmenities = amenityIds.stream()
                .map(amenityId -> {
                    HotelAmenity amenity = amenityRepository.findById(amenityId)
                            .orElseThrow(() -> new IllegalArgumentException("Amenity not found with id: " + amenityId));

                    return RoomTypeAmenity.builder()
                            .id(new RoomTypeAmenityId(roomTypeId, amenityId))
                            .roomType(roomType)
                            .amenity(amenity)
                            .createdAt(LocalDateTime.now())
                            .build();
                })
                .collect(Collectors.toSet());

        roomType.getAmenities().clear();

        roomType.getAmenities().addAll(newAmenities);

        RoomType saved = roomTypeRepository.save(roomType);

        return toResponse(saved);
    }

    // --- Mapper Methods ---

    private RoomType toEntity(RoomTypeRequest dto, Hotel hotel) {
        RoomType roomType = new RoomType();
        roomType.setId(dto.getId());
        roomType.setCode(dto.getCode());
        roomType.setName(dto.getName());
        roomType.setDescription(dto.getDescription());
        roomType.setCapacity(dto.getCapacity());
        roomType.setBedInfo(dto.getBedInfo());
        roomType.setBasePrice(dto.getBasePrice());
        roomType.setHotel(hotel);
        return roomType;
    }

    private RoomTypeResponse toResponse(RoomType entity) {
        List<HotelAmenityResponse> amenityResponses = entity.getAmenities() != null
                ? entity.getAmenities().stream()
                .map(RoomTypeAmenity::getAmenity)
                .map(amenity -> new HotelAmenityResponse(
                        amenity.getId(),
                        amenity.getHotel().getId(),
                        amenity.getName(),
                        amenity.getDescription(),
                        amenity.getCreatedAt(),
                        List.of()
                ))
                .toList()
                : List.of();

        return RoomTypeResponse.builder()
                .id(entity.getId())
                .code(entity.getCode())
                .name(entity.getName())
                .description(entity.getDescription())
                .capacity(entity.getCapacity())
                .bedInfo(entity.getBedInfo())
                .basePrice(entity.getBasePrice())
                .createdAt(entity.getCreatedAt())
                .hotelId(entity.getHotel() != null ? entity.getHotel().getId() : null)
                .hotelName(entity.getHotel() != null ? entity.getHotel().getName() : null)
                .amenities(amenityResponses)
                .build();
    }
}