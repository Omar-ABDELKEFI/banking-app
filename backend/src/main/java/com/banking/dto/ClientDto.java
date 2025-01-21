package com.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDto {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String city;
    private String region;
    private String streetAddress;
    private String postalCode;
    private String country;
}
