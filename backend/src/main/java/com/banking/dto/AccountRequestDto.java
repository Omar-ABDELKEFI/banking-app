package com.banking.dto;

import com.banking.model.AccountType;
import com.banking.model.AccountStatus;
import lombok.Data;
import lombok.Builder;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

@Data
@Builder
public class AccountRequestDto {
    @NotBlank(message = "RIB is required")
    private String rib;
    
    @NotNull(message = "Balance is required")
    @PositiveOrZero(message = "Balance must be positive or zero")
    private BigDecimal balance;
    
    @NotNull(message = "Account type is required")
    private AccountType type;
    
    @NotNull(message = "Account status is required")
    private AccountStatus status;
    
    @NotBlank(message = "Currency is required")
    private String currency;
    
    @Positive(message = "Interest rate must be positive")
    private BigDecimal interestRate;
    
    @PositiveOrZero(message = "Overdraft limit must be positive or zero")
    private BigDecimal overdraftLimit;
    
    private String swiftCode;
    private String iban;
    
    @NotNull(message = "Client ID is required")
    private Long clientId;
    
    private String branchCode;
    private String notes;
}
