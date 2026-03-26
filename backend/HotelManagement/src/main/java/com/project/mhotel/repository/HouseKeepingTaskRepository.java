package com.project.mhotel.repository;

import com.project.mhotel.entity.HouseKeepingTask;
import com.project.mhotel.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HouseKeepingTaskRepository extends JpaRepository<HouseKeepingTask, Long> {
    
    List<HouseKeepingTask> findByStatus(TaskStatus status);
    
    List<HouseKeepingTask> findByRoomId(Long roomId);
    
    List<HouseKeepingTask> findByPriority(String priority);

    List<HouseKeepingTask> findByAssignedToId(Long staffId);

    List<HouseKeepingTask> findByAssignedToIdAndStatus(Long staffId, TaskStatus status);

    long countByStatus(TaskStatus status);

    long countByAssignedToIdAndStatus(Long staffId, TaskStatus status);
}
