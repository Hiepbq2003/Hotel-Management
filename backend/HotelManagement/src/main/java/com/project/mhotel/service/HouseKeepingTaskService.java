package com.project.mhotel.service;

import com.project.mhotel.dto.HouseKeepingTaskDTO;
import com.project.mhotel.dto.TaskStatusUpdateDTO;
import com.project.mhotel.entity.HouseKeepingTask;
import com.project.mhotel.entity.Room;
import com.project.mhotel.entity.TaskStatus;
import com.project.mhotel.entity.UserAccount;
import com.project.mhotel.entity.Reservation;
import com.project.mhotel.repository.HouseKeepingTaskRepository;
import com.project.mhotel.repository.RoomRepository;
import com.project.mhotel.repository.UserAccountRepository;
import com.project.mhotel.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class HouseKeepingTaskService {

    private final HouseKeepingTaskRepository repository;
    private final RoomRepository roomRepository;
    private final UserAccountRepository userAccountRepository;
    private final ReservationRepository reservationRepository;

    public List<HouseKeepingTask> getAllTasks() {
        return repository.findAll();
    }

    public List<HouseKeepingTask> getTasksByStatus(TaskStatus status) {
        return repository.findByStatus(status);
    }

    public List<HouseKeepingTask> getTasksByAssignedTo(Long staffId) {
        return repository.findByAssignedToId(staffId);
    }

    public HouseKeepingTask createTask(HouseKeepingTaskDTO dto) {
        HouseKeepingTask task = new HouseKeepingTask();
        
        if (dto.getRoomId() != null) {
            Room room = roomRepository.findById(dto.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found"));
            task.setRoom(room);
        }
        
        task.setRoomNumber(dto.getRoomNumber());
        
        if (dto.getAssignedTo() != null) {
            UserAccount staff = userAccountRepository.findById(dto.getAssignedTo())
                    .orElseThrow(() -> new RuntimeException("Staff not found"));
            task.setAssignedTo(staff);
        }
        
        if (dto.getReservationId() != null) {
            Reservation reservation = reservationRepository.findById(dto.getReservationId())
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));
            task.setReservation(reservation);
        }
        
        task.setType(dto.getType());
        task.setPriority(dto.getPriority());
        task.setStatus(dto.getStatus() != null ? dto.getStatus() : TaskStatus.PENDING);
        task.setNotes(dto.getNotes());
        
        return repository.save(task);
    }

    public HouseKeepingTask updateTaskStatusAndLog(Long taskId, TaskStatusUpdateDTO dto) {
        HouseKeepingTask task = repository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (dto.getStatus() != null) {
            task.setStatus(dto.getStatus());
            if (dto.getStatus() == TaskStatus.COMPLETED) {
                task.setCompletedAt(LocalDateTime.now());
            } else if (dto.getStatus() == TaskStatus.IN_PROGRESS) {
                task.setStartedAt(LocalDateTime.now());
            }
        }

        if (dto.getNotes() != null && !dto.getNotes().trim().isEmpty()) {
            String timeStamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
            String existingNotes = task.getNotes() == null ? "" : task.getNotes() + "\n";
            task.setNotes(existingNotes + "[" + timeStamp + "] " + dto.getNotes());
        }

        return repository.save(task);
    }

    public HouseKeepingTask assignTask(Long taskId, Long staffId) {
        HouseKeepingTask task = repository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        UserAccount staff = userAccountRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found"));
                
        task.setAssignedTo(staff);
        task.setStatus(TaskStatus.ASSIGNED);
        return repository.save(task);
    }

    public Map<String, Object> getOverallStatistics() {
        long totalTasks = repository.count();
        long pendingTasks = repository.countByStatus(TaskStatus.PENDING);
        long inProgressTasks = repository.countByStatus(TaskStatus.IN_PROGRESS);
        long completedTasks = repository.countByStatus(TaskStatus.COMPLETED);
        long cancelledTasks = repository.countByStatus(TaskStatus.CANCELLED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", totalTasks);
        stats.put("pending", pendingTasks);
        stats.put("inProgress", inProgressTasks);
        stats.put("completed", completedTasks);
        stats.put("cancelled", cancelledTasks);
        return stats;
    }

    public Map<String, Object> getStaffStatistics(Long staffId) {
        long pendingTasks = repository.countByAssignedToIdAndStatus(staffId, TaskStatus.PENDING);
        long assignedTasks = repository.countByAssignedToIdAndStatus(staffId, TaskStatus.ASSIGNED);
        long inProgressTasks = repository.countByAssignedToIdAndStatus(staffId, TaskStatus.IN_PROGRESS);
        long completedTasks = repository.countByAssignedToIdAndStatus(staffId, TaskStatus.COMPLETED);

        Map<String, Object> stats = new HashMap<>();
        stats.put("staffId", staffId);
        stats.put("pending", pendingTasks);
        stats.put("assigned", assignedTasks);
        stats.put("inProgress", inProgressTasks);
        stats.put("completed", completedTasks);
        return stats;
    }

    public void deleteTask(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        repository.deleteById(id);
    }
}
