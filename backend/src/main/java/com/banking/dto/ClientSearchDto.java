package com.banking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClientSearchDto {
    @NotBlank(message = "Search query cannot be empty")
    private String query;
    
    private String city;
    private String region;
    
    @Min(value = 0, message = "Page number cannot be negative")
    private Integer page = 0;
    
    @Min(value = 1, message = "Page size must be greater than 0")
    private Integer size = 10;
    
    private String sortBy = "name";
    private String sortDirection = "asc";
}
