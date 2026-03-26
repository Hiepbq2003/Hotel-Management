package com.project.mhotel.service;

import com.project.mhotel.entity.Services; 
import com.project.mhotel.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service; 
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ServiceService {

    private final ServiceRepository serviceRepository;

    public List<Services> findAllServices() {
        return serviceRepository.findAll();
    }

    public Optional<Services> findServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public Services saveService(Services service) {
        if (service.getHotel() == null || service.getHotel().getId() == null) {
            throw new RuntimeException("Service must be associated with a Hotel.");
        }

        if (service.getId() == null) {
            service.setCreatedAt(LocalDateTime.now());
        } else {

            Optional<Services> existingService = serviceRepository.findById(service.getId());
            existingService.ifPresent(s -> service.setCreatedAt(s.getCreatedAt()));
        }

        return serviceRepository.save(service);
    }

    public Services updateService(Long id, Services serviceDetails) {
        Services service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        service.setCode(serviceDetails.getCode());
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());

        if (serviceDetails.getHotel() != null && serviceDetails.getHotel().getId() != null) {
            service.setHotel(serviceDetails.getHotel());
        } else if (service.getHotel() == null) {
            throw new RuntimeException("Service must be associated with a Hotel.");
        }

        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        if (!serviceRepository.existsById(id)) {
            throw new RuntimeException("Service not found with id: " + id);
        }
        serviceRepository.deleteById(id);
    }
}