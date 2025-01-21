package com.banking.dto;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ClientResponseDto {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String phone;
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private Double latitude;
    private Double longitude;
    private String region;
    private String regionCode;
    private LocalDate dateOfBirth;
    private List<AccountResponseDto> accounts;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
