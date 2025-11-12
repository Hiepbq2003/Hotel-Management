package com.project.mhotel.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {

    private Long customerId;
    private String guestName;
    private String email;
    private String phone;
    private String nationality;
    private String documentType;
    private String documentNumber;
    private String roomType;
    private LocalDateTime checkInDate;
    private LocalDateTime checkOutDate;
    private Integer adultCount = 1;   // default value
    private Integer childCount = 0;
    private String notes;

    // ✅ THÊM – hỗ trợ MULTI-ROOM booking
    private List<RoomBookingItem> rooms;

    @Data
    public static class RoomBookingItem {
        private String guestName;
        private String email;
        private String phone;
        private String documentType;
        private String documentNumber;
        private Integer adultCount;
        private Integer childCount;
        private String notes;
    }
}
