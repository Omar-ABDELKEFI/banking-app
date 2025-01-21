package com.banking.dto;

import com.banking.model.AccountType;
import com.banking.model.AccountStatus;
import lombok.Data;
import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AccountResponseDto {
    private String rib;
    private BigDecimal balance;
    private AccountType type;
    private AccountStatus status;
    private String currency;
    private BigDecimal interestRate;
    private BigDecimal overdraftLimit;
    private String swiftCode;
    private String iban;
    private String branchCode;
    private String notes;
    private ClientDto client;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;
    private LocalDateTime lastTransactionDate;

    @Data
    @Builder
    public static class ClientDto {
        private Long id;
        private String name;
        private String surname;
        private String email;
        private String phone;
    }
}
