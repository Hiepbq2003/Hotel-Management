package com.project.mhotel.dto;

import com.project.mhotel.entity.Room;

public class RoomRequest {

    private String roomNumber;
    private Long roomTypeId;
    private Integer floor;
    private Room.Status status;
    private String description;
    private Long hotelId;

    public RoomRequest() {}

    public RoomRequest(String roomNumber, Long roomTypeId, Integer floor, Room.Status status, String description, Long hotelId) {
        this.roomNumber = roomNumber;
        this.roomTypeId = roomTypeId;
        this.floor = floor;
        this.status = status;
        this.description = description;
        this.hotelId = hotelId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public Long getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Long roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public Integer getFloor() {
        return floor;
    }

    public void setFloor(Integer floor) {
        this.floor = floor;
    }

    public Room.Status getStatus() {
        return status;
    }

    public void setStatus(Room.Status status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }
}
