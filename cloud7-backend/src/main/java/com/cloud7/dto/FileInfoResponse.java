package com.cloud7.dto;

import java.time.Instant;

public class FileInfoResponse {

    public Long id;
    public String name;
    public String contentType;
    public Long sizeBytes;
    public Instant uploadedAt;
    public Long folderId;

    public FileInfoResponse(
            Long id,
            String name,
            String contentType,
            Long sizeBytes,
            Instant uploadedAt,
            Long folderId
    ) {
        this.id = id;
        this.name = name;
        this.contentType = contentType;
        this.sizeBytes = sizeBytes;
        this.uploadedAt = uploadedAt;
        this.folderId = folderId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public double getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(Long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }

    public Instant getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(Instant uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public Long getFolderId() {
        return folderId;
    }

    public void setFolderId(Long folderId) {
        this.folderId = folderId;
    }
}
