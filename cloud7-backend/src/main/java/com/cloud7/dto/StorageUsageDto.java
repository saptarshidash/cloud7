package com.cloud7.dto;

public class StorageUsageDto {
    public Long used;
    public Long total;

    public double percent() {
        return total == 0 ? 0 : (used * 100.0) / total;
    }
}

