package com.cloud7.dto;

import java.time.Instant;

public class FolderInfoResponse {
    public Long id;
    public String name;
    public Instant createdAt;
    public long fileCount;
    public long folderCount;
    public long sizeBytes;
}

