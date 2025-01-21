package com.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    @Id
    private String rib;
    
    @Column(nullable = false)
    private BigDecimal balance;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountType type;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus status;
    
    private String currency;
    private BigDecimal interestRate;
    private BigDecimal overdraftLimit;
    private String swiftCode;
    private String iban;
    
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "closed_at")
    private LocalDateTime closedAt;
    
    @Column(name = "last_transaction_date")
    private LocalDateTime lastTransactionDate;
    
    private String branchCode;
    private String notes;
}
