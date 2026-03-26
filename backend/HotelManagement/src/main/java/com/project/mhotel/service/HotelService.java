package com.project.mhotel.service;

import com.project.mhotel.entity.Hotel;
import com.project.mhotel.entity.Room;
import com.project.mhotel.repository.HotelRepository;
import com.project.mhotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Optional<Hotel> getById(Long id) {
        return hotelRepository.findById(id);
    }

    public Hotel createHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel updatedHotel) {
        return hotelRepository.findById(id)
                .map(hotel -> {
                    hotel.setCode(updatedHotel.getCode());
                    hotel.setName(updatedHotel.getName());
                    hotel.setDescription(updatedHotel.getDescription());
                    hotel.setAddress(updatedHotel.getAddress());
                    hotel.setCity(updatedHotel.getCity());
                    hotel.setState(updatedHotel.getState());
                    hotel.setCountry(updatedHotel.getCountry());
                    hotel.setPostalCode(updatedHotel.getPostalCode());
                    hotel.setTimezone(updatedHotel.getTimezone());
                    hotel.setPhone(updatedHotel.getPhone());
                    hotel.setEmail(updatedHotel.getEmail());
                    hotel.setUpdatedAt(updatedHotel.getUpdatedAt());
                    return hotelRepository.save(hotel);
                })
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn ID: " + id));
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public Room addRoomToHotel(Long hotelId, Room room) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách sạn ID: " + hotelId));

        room.setHotel(hotel);
        return roomRepository.save(room);
    }

    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    public List<Room> getRoomsByHotel(Long hotelId) {
        return roomRepository.findByHotel_Id(hotelId);
    }
}
