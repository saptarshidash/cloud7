package com.cloud7.controller;

import com.cloud7.dto.FolderInfoResponse;
import com.cloud7.repository.FileRepository;
import org.springframework.web.bind.annotation.*;
import com.cloud7.repository.FolderRepository;
import com.cloud7.entity.Folder;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/folders")
public class FolderController {

    private final FolderRepository repo;
    private final FileRepository fileRepo;

    public FolderController(FolderRepository repo, FileRepository fileRepo) {
        this.repo = repo;
        this.fileRepo = fileRepo;
    }

    @PostMapping
    public Folder create(@RequestBody Folder folder) {
        return repo.save(folder);
    }

    @GetMapping
    public List<Folder> list(@RequestParam Long userId, @RequestParam(required = false) Long parentId) {
        return repo.findByUserIdAndParentId(userId, parentId);
    }

    @DeleteMapping("/{id}")
    public void deleteFolder(@PathVariable Long id) {
        Folder folder = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.deleted = true;
        repo.save(folder);
    }

    @PostMapping("/{id}/restore")
    public void restoreFolder(@PathVariable Long id) {
        Folder folder = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));
        folder.deleted = false;
        repo.save(folder);
    }

    @GetMapping("/trash")
    public List<Folder> trashedFolders(@RequestParam Long userId) {
        return repo.findByUserIdAndDeletedTrue(userId);
    }

    @GetMapping("/{id}/info")
    public FolderInfoResponse folderInfo(@PathVariable Long id) {

        Folder folder = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        FolderInfoResponse dto = new FolderInfoResponse();
        dto.id = folder.id;
        dto.name = folder.name;
        dto.createdAt = folder.createdAt;

        dto.fileCount = fileRepo.countByFolderIdAndDeletedFalse(folder.id);
        dto.folderCount = repo.countByParentIdAndDeletedFalse(folder.id);
        dto.sizeBytes = fileRepo.totalSizeInFolder(folder.id);

        return dto;
    }

}