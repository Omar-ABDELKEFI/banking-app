package com.banking.dto;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class ClientFilterDto {
    private String name;
    private String city;
    private String region;
    private String regionCode;
    private String query;
    
    @Min(value = 0, message = "Minimum age cannot be negative")
    private Integer ageMin;
    
    @Min(value = 0, message = "Maximum age cannot be negative")
    private Integer ageMax;
    
    @Min(value = 0, message = "Page number cannot be negative")
    private Integer page = 0;
    
    @Min(value = 1, message = "Page size must be greater than 0")
    private Integer size = 10;
    
    private String sortBy = "name";
    private String sortDirection = "asc";

    // Add custom filter fields
    private Boolean hasAccounts;
    private String countryCode;
    private String phonePrefix;
}
