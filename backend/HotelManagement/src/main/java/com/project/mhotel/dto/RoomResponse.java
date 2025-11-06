package com.project.mhotel.dto;

import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.RoomType;

public class RoomResponse {

    private Long id;
    private String roomNumber;
    private RoomTypeDto roomType;
    private Integer floor;
    private Room.Status status;
    private String description;

    public RoomResponse() {}

    public static RoomResponse fromEntity(Room room) {
        RoomResponse dto = new RoomResponse();
        dto.setId(room.getId());
        dto.setRoomNumber(room.getRoomNumber());
        dto.setFloor(room.getFloor());
        dto.setStatus(room.getStatus());
        dto.setDescription(room.getDescription());

        // Chuyển đổi RoomType Entity sang RoomTypeDto
        RoomType roomTypeEntity = room.getRoomType();
        if (roomTypeEntity != null) {
            dto.setRoomType(new RoomTypeDto(
                    roomTypeEntity.getId(),
                    roomTypeEntity.getName(),
                    roomTypeEntity.getCode()
            ));
        }

        return dto;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }
    public RoomTypeDto getRoomType() { return roomType; }
    public void setRoomType(RoomTypeDto roomType) { this.roomType = roomType; }
    public Integer getFloor() { return floor; }
    public void setFloor(Integer floor) { this.floor = floor; }
    public Room.Status getStatus() { return status; }
    public void setStatus(Room.Status status) { this.status = status; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}