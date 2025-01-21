package com.banking.controller;

import com.banking.dto.*;
import com.banking.service.ClientService;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.List;

@Tag(name = "Client", description = "Client management APIs")
@RestController
@RequestMapping("/api/clients")
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

    @Operation(summary = "Create a new client")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseWrapper<ClientResponseDto> createClient(@Valid @RequestBody ClientRequestDto requestDto) {
        return ResponseWrapper.success(clientService.save(requestDto));
    }

    @Operation(summary = "Update a client")
    @PutMapping("/{id}")
    public ResponseWrapper<ClientResponseDto> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequestDto requestDto) {
        return ResponseWrapper.success(clientService.update(id, requestDto));
    }

    @Operation(summary = "Delete a client")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseWrapper<List<Object>> deleteClient(@PathVariable Long id) {
        clientService.deleteById(id);
        return ResponseWrapper.success(null);
    }

  

}
