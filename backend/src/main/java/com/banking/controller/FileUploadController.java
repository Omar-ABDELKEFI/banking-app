package com.banking.controller;

import com.banking.service.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@Slf4j
public class FileUploadController {

    private final FileStorageService fileStorageService;

    public FileUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("Received file upload request: {}", file.getOriginalFilename());
        String fileUrl = fileStorageService.storeFile(file);
        
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        log.info("Received profile picture upload request: {}", file.getOriginalFilename());
        String fileUrl = fileStorageService.storeProfilePicture(file);
        
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        
        return ResponseEntity.ok(response);
    }
}
