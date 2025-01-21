package com.banking.dto;

import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Past;
import java.time.LocalDate;

@Data
@Builder
public class ClientRequestDto {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Surname is required")
    private String surname;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Pattern(regexp = "^\\+?[1-9][0-9]{7,14}$", message = "Invalid phone number")
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

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;
}
