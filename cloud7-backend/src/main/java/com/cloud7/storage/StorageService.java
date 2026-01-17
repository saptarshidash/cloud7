package com.cloud7.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String save(MultipartFile file, String guid);

    Resource load(String path);

}

