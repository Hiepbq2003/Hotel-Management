package com.project.mhotel.controller;

import com.project.mhotel.dto.HouseKeepingTaskDTO;
import com.project.mhotel.dto.TaskStatusUpdateDTO;
import com.project.mhotel.entity.HouseKeepingTask;
import com.project.mhotel.entity.TaskStatus;
import com.project.mhotel.service.HouseKeepingTaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks/housekeeping")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class HouseKeepingTaskController {

    private final HouseKeepingTaskService service;

    @GetMapping
    public ResponseEntity<List<HouseKeepingTask>> getAllTasks() {
        return ResponseEntity.ok(service.getAllTasks());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<HouseKeepingTask>> getTasksByStatus(@PathVariable TaskStatus status) {
        return ResponseEntity.ok(service.getTasksByStatus(status));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<HouseKeepingTask>> getTasksByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(service.getTasksByAssignedTo(staffId));
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody HouseKeepingTaskDTO dto) {
        try {
            HouseKeepingTask savedTask = service.createTask(dto);
            return ResponseEntity.ok(Map.of("message", "Task created successfully", "task", savedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody TaskStatusUpdateDTO dto) {
        try {
            HouseKeepingTask updatedTask = service.updateTaskStatusAndLog(id, dto);
            return ResponseEntity.ok(Map.of("message", "Task updated successfully", "task", updatedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTask(@PathVariable Long id, @RequestParam Long staffId) {
        try {
            HouseKeepingTask updatedTask = service.assignTask(id, staffId);
            return ResponseEntity.ok(Map.of("message", "Task assigned successfully", "task", updatedTask));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        return ResponseEntity.ok(service.getOverallStatistics());
    }

    @GetMapping("/staff/{staffId}/statistics")
    public ResponseEntity<?> getStaffStatistics(@PathVariable Long staffId) {
        return ResponseEntity.ok(service.getStaffStatistics(staffId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            service.deleteTask(id);
            return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
