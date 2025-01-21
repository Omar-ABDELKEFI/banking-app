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

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;

@Service
@Transactional
@Slf4j
public class ClientService {
    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    public ClientService(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
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
            Client client = clientMapper.toEntity(requestDto);
            validateNewClient(client);
            Client savedClient = clientRepository.save(client);
            return clientMapper.toResponseDto(savedClient);
        } catch (Exception e) {
            log.error("Error while saving client", e);
            throw new ServiceException("Error while saving client", e);
        }
    }

    @Transactional
    public ClientResponseDto update(Long id, ClientRequestDto requestDto) {
        log.debug("Updating client with id: {}", id);
        try {
            if (!clientRepository.existsById(id)) {
                throw new ResourceNotFoundException("Client" + "id" +id);
            }
            Client client = clientMapper.toEntity(requestDto);
            client.setId(id);
            validateClient(client);
            Client updatedClient = clientRepository.save(client);
            return clientMapper.toResponseDto(updatedClient);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error while updating client", e);
            throw new ServiceException("Error while updating client", e);
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
        if (client.getDateOfBirth() != null && client.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Date of birth cannot be in the future");
        }
    }
}
