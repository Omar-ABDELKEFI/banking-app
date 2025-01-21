package com.banking.controller;

import com.banking.dto.*;
import com.banking.service.ClientService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@Tag(name = "Client", description = "Client management APIs")
@RestController
@RequestMapping("/api/clients")  // Make sure this matches the frontend endpoint
@Slf4j
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @Operation(summary = "Get all clients with pagination and filters")
    @GetMapping
    public ResponseWrapper<List<ClientResponseDto>> getAllClients(@Valid ClientFilterDto filterDto) {
        return ResponseWrapper.success(clientService.findAllWithFilters(filterDto));
    }

    @Operation(summary = "Get client by ID")
    @GetMapping("/{id}")
    public ResponseWrapper<ClientResponseDto> getClientById(@PathVariable Long id) {
        return ResponseWrapper.success(clientService.findById(id));
    }

    @Operation(summary = "Create a new client with profile picture")
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseWrapper<ClientResponseDto> createClient(
            @RequestPart("data") @Valid ClientRequestDto requestDto,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        
        return ResponseWrapper.success(clientService.save(requestDto));
    }

    @Operation(summary = "Update a client")
    @PutMapping("/{id}")
    public ResponseWrapper<ClientResponseDto> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequestDto requestDto) {
        return ResponseWrapper.success(clientService.update(id, requestDto));
    }

    @Operation(summary = "Update a client partially")
    @PatchMapping("/{id}")
    public ResponseWrapper<ClientResponseDto> partialUpdateClient(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {
        return ResponseWrapper.success(clientService.partialUpdate(id, updates));
    }

    @Operation(summary = "Update client profile picture")
    @PatchMapping("/{id}/profile-picture")
    public ResponseWrapper<ClientResponseDto> updateProfilePicture(
            @PathVariable Long id,
            @RequestParam String profilePictureUrl) {
        return ResponseWrapper.success(clientService.updateProfilePicture(id, profilePictureUrl));
    }

    @Operation(summary = "Delete a client")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
