package com.banking.service;

import com.banking.model.Client;
import com.banking.repository.ClientRepository;
import com.banking.dto.ClientFilterDto;
import com.banking.dto.ClientRequestDto;
import com.banking.dto.ClientResponseDto;
import com.banking.exception.DuplicateResourceException;
import com.banking.exception.ResourceNotFoundException;
import com.banking.exception.ServiceException;
import com.banking.mapper.ClientMapper;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import com.banking.specification.ClientSpecifications;
import com.banking.util.PageRequestBuilder;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.IncorrectResultSizeDataAccessException;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;
import java.util.Map;

@Service
@Transactional
@Slf4j
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;
    private final FileStorageService fileStorageService;  

    public ClientService(
            ClientRepository clientRepository, 
            ClientMapper clientMapper,
            FileStorageService fileStorageService) {    
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
        this.fileStorageService = fileStorageService;  
    }

    @Transactional(readOnly = true)
    public Page<ClientResponseDto> findAllWithFilters(ClientFilterDto filterDto) {
        log.debug("Finding all clients with filters: {}", filterDto);
        validateFilterDto(filterDto);

        try {
            Pageable pageable = PageRequestBuilder.build(
                filterDto.getPage(),
                filterDto.getSize(),
                filterDto.getSortBy(),
                filterDto.getSortDirection()
            );

            Specification<Client> spec = createFilterSpecification(filterDto);
            return clientRepository.findAll(spec, pageable)
                .map(clientMapper::toResponseDto);
        } catch (Exception e) {
            log.error("Error while finding clients with filters", e);
            throw new ServiceException("Error while finding clients", e);
        }
    }

    private Specification<Client> createFilterSpecification(ClientFilterDto filterDto) {
        return Specification.where(ClientSpecifications.withName(filterDto.getName()))
            .and(ClientSpecifications.withCity(filterDto.getCity()))
            .and(ClientSpecifications.withRegion(filterDto.getRegion()))
            .and(ClientSpecifications.withRegionCode(filterDto.getRegionCode()))
            .and(ClientSpecifications.withAgeRange(filterDto.getAgeMin(), filterDto.getAgeMax()))
            .and(filterDto.getQuery() != null ? 
                ClientSpecifications.withSearchQuery(filterDto.getQuery()) : null);
    }

    @Transactional(readOnly = true)
    public ClientResponseDto findById(Long id) {
        return clientRepository.findById(id)
            .map(clientMapper::toResponseDto)
            .orElseThrow(() -> new ResourceNotFoundException("Client"+ "id"+ id));
    }

    @Transactional
    public ClientResponseDto save(ClientRequestDto requestDto) {
        log.debug("Saving new client: {}", requestDto);
        try {
            log.error("Saving new clidsffffffffffffent: {}",requestDto);

            // Validate input first
            if (requestDto == null) {
                throw new IllegalArgumentException("Client request cannot be null");
            }


            // Validate email and phone
            validateEmailAndPhone(requestDto.getEmail(), requestDto.getPhone());

            Client client = clientMapper.toEntity(requestDto);
            validateClient(client);
            Client savedClient = clientRepository.save(client);
            return clientMapper.toResponseDto(savedClient);
        } catch (IncorrectResultSizeDataAccessException e) {
            log.error("Duplicate entry detected", e);
            throw new DuplicateResourceException("An account with this email already exists");
        } catch (DataIntegrityViolationException e) {
            log.error("Database constraint violation", e);
            throw new DuplicateResourceException("A client with these details already exists");
        } catch (Exception e) {
            log.error("Error while saving client: {}", e.getMessage(), e);
            throw new ServiceException("Error while saving client: " + e.getMessage());
        }
    }

    private void validateEmailAndPhone(String email, String phone) {
        // Check email
        try {
            if (clientRepository.findByEmail(email).isPresent()) {
                throw new DuplicateResourceException("Email " + email + " is already registered");
            }
        } catch (IncorrectResultSizeDataAccessException e) {
            throw new DuplicateResourceException("Multiple accounts found with email " + email);
        }

        // Check phone
        try {
            if (clientRepository.findByPhone(phone).isPresent()) {
                throw new DuplicateResourceException("Phone number " + phone + " is already registered");
            }
        } catch (IncorrectResultSizeDataAccessException e) {
            throw new DuplicateResourceException("Multiple accounts found with phone " + phone);
        }
    }

    @Transactional
    public ClientResponseDto update(Long id, ClientRequestDto requestDto) {
        log.debug("Updating client with id: {}", id);
        try {
            Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client" + "id" + id));
            
            // Only check for duplicate email if email is changed
            if (!existingClient.getEmail().equals(requestDto.getEmail())) {
                boolean emailExists = clientRepository.existsByEmailAndIdNot(requestDto.getEmail(), id);
                if (emailExists) {
                    throw new DuplicateResourceException("Client with email " + requestDto.getEmail() + " already exists");
                }
            }
            
            // Only check for duplicate phone if phone is changed
            if (!existingClient.getPhone().equals(requestDto.getPhone())) {
                Optional<Client> clientWithPhone = clientRepository.findByPhone(requestDto.getPhone());
                if (clientWithPhone.isPresent() && !clientWithPhone.get().getId().equals(id)) {
                    throw new DuplicateResourceException("Client with phone " + requestDto.getPhone() + " already exists");
                }
            }

            // Map the request DTO to entity while preserving the existing data
            Client updatedClient = clientMapper.toEntity(requestDto);
            updatedClient.setId(id);
            
            // Preserve existing data that shouldn't be updated
            updatedClient.setProfilePictureUrl(existingClient.getProfilePictureUrl());
            updatedClient.setCreatedAt(existingClient.getCreatedAt());
            
            validateClient(updatedClient);
            Client savedClient = clientRepository.save(updatedClient);
            return clientMapper.toResponseDto(savedClient);
        } catch (ResourceNotFoundException | DuplicateResourceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error while updating client", e);
            throw new ServiceException("Error while updating client", e);
        }
    }

    @Transactional
    public ClientResponseDto partialUpdate(Long id, Map<String, Object> updates) {
        log.debug("Partially updating client with id: {} with updates: {}", id, updates);
        try {
            Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client" + "id" + id));

            // Only check email if it's being updated
            if (updates.containsKey("email")) {
                String newEmail = (String) updates.get("email");
                if (!existingClient.getEmail().equals(newEmail)) {
                    boolean emailExists = clientRepository.existsByEmailAndIdNot(newEmail, id);
                    if (emailExists) {
                        throw new DuplicateResourceException("Client with email " + newEmail + " already exists");
                    }
                }
            }

            // Only check phone if it's being updated
            if (updates.containsKey("phone")) {
                String newPhone = (String) updates.get("phone");
                if (!existingClient.getPhone().equals(newPhone)) {
                    Optional<Client> clientWithPhone = clientRepository.findByPhone(newPhone);
                    if (clientWithPhone.isPresent() && !clientWithPhone.get().getId().equals(id)) {
                        throw new DuplicateResourceException("Client with phone " + newPhone + " already exists");
                    }
                }
            }

            // Apply only the changed fields
            updates.forEach((key, value) -> {
                try {
                    if (value != null) {
                        switch (key) {
                            case "name" -> existingClient.setName((String) value);
                            case "surname" -> existingClient.setSurname((String) value);
                            case "email" -> existingClient.setEmail((String) value);
                            case "phone" -> existingClient.setPhone((String) value);
                            case "streetAddress" -> existingClient.setStreetAddress((String) value);
                            case "city" -> existingClient.setCity((String) value);
                            case "state" -> existingClient.setState((String) value);
                            case "postalCode" -> existingClient.setPostalCode((String) value);
                            case "country" -> existingClient.setCountry((String) value);
                            case "region" -> existingClient.setRegion((String) value);
                            case "regionCode" -> existingClient.setRegionCode((String) value);
                            case "dateOfBirth" -> existingClient.setDateOfBirth(LocalDate.parse((String) value));
                            case "latitude" -> existingClient.setLatitude((Double) value);
                            case "longitude" -> existingClient.setLongitude((Double) value);
                        }
                    }
                } catch (Exception e) {
                    log.error("Error updating field: " + key, e);
                    throw new IllegalArgumentException("Invalid value for field: " + key);
                }
            });

            validateClient(existingClient);
            Client savedClient = clientRepository.save(existingClient);
            return clientMapper.toResponseDto(savedClient);
        } catch (Exception e) {
            log.error("Error while partially updating client", e);
            throw new ServiceException("Error while updating client", e);
        }
    }

    @Transactional
    public ClientResponseDto updateProfilePicture(Long id, String profilePictureUrl) {
        log.debug("Updating profile picture for client with id: {}", id);
        try {
            Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client" + "id" + id));
            
            client.setProfilePictureUrl(profilePictureUrl);
            Client updatedClient = clientRepository.save(client);
            return clientMapper.toResponseDto(updatedClient);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error while updating client profile picture", e);
            throw new ServiceException("Error while updating client profile picture", e);
        }
    }

    @Transactional
    public void deleteById(Long id) {
        log.debug("Deleting client with id: {}", id);
        try {
            if (!clientRepository.existsById(id)) {
                throw new ResourceNotFoundException("Client" +  "id" + id);
            }
            clientRepository.deleteById(id);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error while deleting client", e);
            throw new ServiceException("Error while deleting client", e);
        }
    }

    private void validateNewClient(Client client) {
        if (clientRepository.findByEmail(client.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Client with email " + client.getEmail() + " already exists");
        }
        if (clientRepository.findByPhone(client.getPhone()).isPresent()) {
            throw new DuplicateResourceException("Client with phone " + client.getPhone() + " already exists");
        }
        validateClient(client);
    }

    private void validateFilterDto(ClientFilterDto filterDto) {
        if (filterDto.getPage() < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }
        if (filterDto.getSize() < 1) {
            throw new IllegalArgumentException("Page size must be greater than 0");
        }
        if (filterDto.getAgeMin() != null && filterDto.getAgeMin() < 0) {
            throw new IllegalArgumentException("Minimum age cannot be negative");
        }
        if (filterDto.getAgeMax() != null && filterDto.getAgeMax() < 0) {
            throw new IllegalArgumentException("Maximum age cannot be negative");
        }
        if (filterDto.getAgeMin() != null && filterDto.getAgeMax() != null 
            && filterDto.getAgeMin() > filterDto.getAgeMax()) {
            throw new IllegalArgumentException("Minimum age cannot be greater than maximum age");
        }
    }

    private void validateClient(Client client) {
        if (client == null) {
            throw new IllegalArgumentException("Client cannot be null");
        }
        if (!StringUtils.hasText(client.getName())) {
            throw new IllegalArgumentException("Client name is required");
        }
        if (!StringUtils.hasText(client.getEmail())) {
            throw new IllegalArgumentException("Client email is required");
        }
        if (!StringUtils.hasText(client.getPhone())) {
            throw new IllegalArgumentException("Client phone is required");
        }
        // Add phone number format validation
        if (!client.getPhone().matches("^[2459]\\d{7}$")) {
            throw new IllegalArgumentException("Invalid phone number format. Must be Tunisian format: 2/4/5/9XXXXXXX (8 digits)");
        }

        if (client.getDateOfBirth() != null) {
            LocalDate now = LocalDate.now();
            
            if (client.getDateOfBirth().isAfter(now)) {
                throw new IllegalArgumentException("Date of birth cannot be in the future");
            }
            
            // Optional: Add minimum age validation
            if (client.getDateOfBirth().plusYears(18).isAfter(now)) {
                throw new IllegalArgumentException("Client must be at least 18 years old");
            }
        }
        
        // Add profile picture URL validation if needed
        if (client.getProfilePictureUrl() != null && !client.getProfilePictureUrl().isEmpty()) {
            if (!client.getProfilePictureUrl().matches("^(http|https)://.*$")) {
                throw new IllegalArgumentException("Profile picture URL must be a valid HTTP/HTTPS URL");
            }
        }
    }
}
