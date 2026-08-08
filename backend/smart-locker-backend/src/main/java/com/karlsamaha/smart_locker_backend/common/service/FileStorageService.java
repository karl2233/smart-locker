package com.karlsamaha.smart_locker_backend.common.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    public String storeFile(
            MultipartFile file,
            String storagePath,
            String publicUrlPath
    ) {
        if (file == null || file.isEmpty()) {
            throw new com.karlsamaha.smart_locker_backend.menu.exception.FileStorageException("File is empty");
        }

        Path uploadPath = Paths.get(storagePath).toAbsolutePath().normalize();

        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + (ext != null ? "." + ext : "");
        Path filePath = uploadPath.resolve(fileName);

        try {
            Files.createDirectories(uploadPath);
            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException e) {
            deleteQuietly(filePath);
            throw new com.karlsamaha.smart_locker_backend.menu.exception.FileStorageException("Could not store file", e);
        }

        return publicUrlPath + "/" + fileName;
    }

    public void deleteFile(String storagePath, String publicUrl) {
        if (publicUrl == null || publicUrl.isBlank()) {
            return;
        }

        String fileName = publicUrl.substring(publicUrl.lastIndexOf('/') + 1);
        if (fileName.isBlank()) {
            return;
        }

        Path uploadPath = Paths.get(storagePath).toAbsolutePath().normalize();
        deleteQuietly(uploadPath.resolve(fileName));
    }

    private void deleteQuietly(Path path) {
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            log.warn("Orphaned file left on disk: {}", path, e);
        }
    }
}