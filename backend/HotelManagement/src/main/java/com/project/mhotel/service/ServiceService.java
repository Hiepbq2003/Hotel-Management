package com.project.mhotel.service;

import com.project.mhotel.entity.Services; // Import entity Services MỚI
import com.project.mhotel.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service; // Annotation @Service (không còn xung đột)
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    // Lấy tất cả dịch vụ
    public List<Services> findAllServices() {
        return serviceRepository.findAll();
    }

    // Tìm dịch vụ theo ID
    public Optional<Services> findServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    // Lưu/Tạo mới dịch vụ
    public Services saveService(Services service) {
        if (service.getHotel() == null || service.getHotel().getId() == null) {
            throw new RuntimeException("Service must be associated with a Hotel.");
        }

        // Cài đặt ngày tạo nếu là service mới (hoặc không có)
        if (service.getId() == null) {
            service.setCreatedAt(LocalDateTime.now());
        } else {
            // Giữ nguyên ngày tạo nếu là cập nhật
            Optional<Services> existingService = serviceRepository.findById(service.getId());
            existingService.ifPresent(s -> service.setCreatedAt(s.getCreatedAt()));
        }

        return serviceRepository.save(service);
    }

    // Cập nhật dịch vụ
    public Services updateService(Long id, Services serviceDetails) {
        Services service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        // Cập nhật các trường
        service.setCode(serviceDetails.getCode());
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());

        // Cập nhật hotel
        if (serviceDetails.getHotel() != null && serviceDetails.getHotel().getId() != null) {
            service.setHotel(serviceDetails.getHotel());
        } else if (service.getHotel() == null) {
            throw new RuntimeException("Service must be associated with a Hotel.");
        }

        return serviceRepository.save(service);
    }

    // Xóa dịch vụ
    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
}