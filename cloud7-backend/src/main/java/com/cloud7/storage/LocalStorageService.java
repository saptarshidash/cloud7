package com.cloud7.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;
import java.util.UUID;

@Service
@ConditionalOnProperty(
        name = "storage.type",
        havingValue = "local",
        matchIfMissing = true
)
public class LocalStorageService implements StorageService {

    private final Path rootDir;

    public LocalStorageService(
            @Value("${storage.local.root-dir}") String rootDir
    ) throws IOException {
        this.rootDir = Paths.get(rootDir).toAbsolutePath();
        Files.createDirectories(this.rootDir);
    }

    @Override
    public String save(MultipartFile file, String guid) {
        try {
            String ext = Optional.ofNullable(file.getOriginalFilename())
                    .filter(n -> n.contains("."))
                    .map(n -> n.substring(n.lastIndexOf(".")))
                    .orElse("");

            String filename = guid + ext;
            Path target = rootDir.resolve(filename);

            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return filename; // stored path
        } catch (IOException e) {
            throw new RuntimeException("File storage failed", e);
        }
    }

    @Override
    public Resource load(String path) {
        try {
            Path file = rootDir.resolve(path).normalize();
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException("File not readable");
            }

            return resource;
        } catch (Exception e) {
            throw new RuntimeException("Failed to load file", e);
        }
    }
}

