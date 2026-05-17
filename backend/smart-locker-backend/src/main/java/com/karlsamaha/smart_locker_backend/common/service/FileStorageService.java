package com.karlsamaha.smart_locker_backend.common.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    public String storeFile(
            MultipartFile file,
            String storagePath,
            String publicUrlPath
    ) {
        try {
            Path uploadPath = Paths.get(storagePath);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return publicUrlPath + "/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Could not store file", e);
        }
    }
}