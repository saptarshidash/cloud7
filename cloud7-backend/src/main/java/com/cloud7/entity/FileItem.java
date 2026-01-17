package com.cloud7.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
public class FileItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String guid;

    @Column(nullable = false)
    public String name;

    public String contentType;

    public Long userId;

    public Long folderId;

    public String path;

    public Long sizeBytes;

    @Column(nullable = false)
    public Instant uploadedAt = Instant.now();

    public boolean deleted = false;

    @Enumerated(EnumType.STRING)
    public Status status;

    public enum Status {
        PENDING,
        STORED,
        FAILED
    }
}
