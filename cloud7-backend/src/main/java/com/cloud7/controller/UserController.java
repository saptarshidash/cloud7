package com.cloud7.controller;

import com.cloud7.dto.StorageUsageDto;
import com.cloud7.entity.User;
import com.cloud7.repository.FileRepository;
import com.cloud7.repository.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository users;
    private final FileRepository files;

    public UserController(UserRepository users, FileRepository files) {
        this.users = users;
        this.files = files;
    }

    @GetMapping("/{id}/storage")
    public StorageUsageDto storage(@PathVariable Long id) {
        User user = users.findById(id)
                .orElseThrow();

        Long used = files.getUsedStorage(id);

        StorageUsageDto dto = new StorageUsageDto();
        dto.used = used;
        dto.total = user.storageQuotaBytes;
        return dto;
    }
}

