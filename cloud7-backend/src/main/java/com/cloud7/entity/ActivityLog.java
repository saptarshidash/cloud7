package com.cloud7.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String action;
    public String entityType;
    public Long entityId;
    public Long userId;
    public Instant timestamp = Instant.now();
}