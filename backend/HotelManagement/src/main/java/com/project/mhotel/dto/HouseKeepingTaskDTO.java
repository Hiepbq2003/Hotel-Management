package com.project.mhotel.dto;

import com.project.mhotel.entity.TaskStatus;
import lombok.Data;

@Data
public class HouseKeepingTaskDTO {
    private Long id;
    private Long roomId;
    private String roomNumber;
    private Long assignedTo;
    private Long reservationId;
    private String type;
    private String priority;
    private TaskStatus status;
    private String notes;
}
