package com.cloud7.controller;

import com.cloud7.dto.FileInfoResponse;
import com.cloud7.entity.User;
import com.cloud7.repository.UserRepository;
import com.cloud7.storage.StorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.cloud7.repository.FileRepository;
import com.cloud7.repository.ActivityLogRepository;
import com.cloud7.entity.FileItem;
import com.cloud7.entity.ActivityLog;

import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/files")
public class FileController {

    private final FileRepository repo;
    private final ActivityLogRepository activityRepo;
    private final StorageService storageService;
    private final UserRepository userRepo;

    public FileController(FileRepository repo, ActivityLogRepository activityRepo, StorageService storageService, UserRepository userRepo) {
        this.repo = repo;
        this.activityRepo = activityRepo;
        this.storageService = storageService;
        this.userRepo = userRepo;
    }

    @PostMapping("/upload")
    public FileItem upload(
            @RequestParam MultipartFile file,
            @RequestParam Long userId,
            @RequestParam(required = false) Long folderId
    ) {
        String guid = UUID.randomUUID().toString();

        User user = userRepo.findById(userId).orElse(null);

        FileItem item = new FileItem();
        item.guid = guid;
        item.name = file.getOriginalFilename();
        item.contentType = file.getContentType();
        item.userId = userId;
        item.folderId = folderId;
        item.status = FileItem.Status.PENDING;
        item.sizeBytes = file.getSize();
        item.contentType = file.getContentType();

        item = repo.save(item);
        user.usedStorageBytes += file.getSize();
        userRepo.save(user);

        try {
            String path = storageService.save(file, guid);
            item.path = path;
            item.status = FileItem.Status.STORED;


        } catch (Exception ex) {
            item.status = FileItem.Status.FAILED;
        }

        return repo.save(item);
    }


    @GetMapping
    public List<FileItem> list(
            @RequestParam Long userId,
            @RequestParam(required = false) Long folderId
    ) {
        return repo.findByUserIdAndFolderId(userId, folderId);
    }

    @GetMapping("/{id}/info")
    public FileInfoResponse fileInfo(@PathVariable Long id) {

        FileItem file = repo.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        return new FileInfoResponse(
                file.id,
                file.name,
                file.contentType,
                file.sizeBytes,
                file.uploadedAt,
                file.folderId
        );
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> preview(@PathVariable Long id,
                                            HttpServletRequest request) throws Exception {


        FileItem file = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        System.out.println("File Preview for " + file.path);

        Resource resource = storageService.load(file.path);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        contentDispositionHeader(file.name)
                )
                .body(resource);
    }



    @DeleteMapping("/{id}")
    public void deleteFile(@PathVariable Long id) {
        FileItem file = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        file.deleted = true;
        repo.save(file);
    }

    @PostMapping("/{id}/restore")
    public void restoreFile(@PathVariable Long id) {
        FileItem file = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));
        file.deleted = false;
        repo.save(file);
    }

    @GetMapping("/trash")
    public List<FileItem> trashedFiles(@RequestParam Long userId) {
        return repo.findByUserIdAndDeletedTrue(userId);
    }




    private String contentDispositionHeader(String filename) {

        String asciiFilename = filename.replaceAll("[^\\x20-\\x7E]", "_");

        String encodedFilename = URLEncoder.encode(filename, StandardCharsets.UTF_8)
                .replaceAll("\\+", "%20");

        return "inline; filename=\"" + asciiFilename + "\"; filename*=UTF-8''" + encodedFilename;
    }

}