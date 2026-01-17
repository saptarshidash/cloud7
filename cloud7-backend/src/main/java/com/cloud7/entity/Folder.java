package com.cloud7.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class Folder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String name;
    public Long parentId;
    public Long userId;
    public boolean deleted = false;
    @Column(nullable = false)
    public Instant createdAt = Instant.now();
}