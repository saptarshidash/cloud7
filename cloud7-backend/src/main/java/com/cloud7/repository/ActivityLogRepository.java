package com.cloud7.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.cloud7.entity.ActivityLog;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}