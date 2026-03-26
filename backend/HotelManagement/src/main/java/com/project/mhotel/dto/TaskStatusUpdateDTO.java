package com.project.mhotel.dto;

import com.project.mhotel.entity.TaskStatus;
import lombok.Data;

@Data
public class TaskStatusUpdateDTO {
    private TaskStatus status;
    private String notes;
}
