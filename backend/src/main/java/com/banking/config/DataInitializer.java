package com.banking.config;

import com.banking.model.Role;
import com.banking.model.User;
import com.banking.model.Client;
import com.banking.model.Account;
import com.banking.model.AccountType;    // Add this import
import com.banking.model.AccountStatus;   // Add this import
import com.banking.repository.UserRepository;
import com.banking.repository.ClientRepository;
import com.banking.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeSampleData();
    }

    private void initializeAdmin() {
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstName("Admin")
                    .lastName("User")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Admin user created successfully");
        }
    }

    private void initializeSampleData() {
        if (clientRepository.count() == 0) {
            // Create sample clients
            Client client1 = Client.builder()
                    .name("John Doe")
                    .email("john@example.com")
                    .phone("+212 6-12-34-56-78")
                    .streetAddress("123 Hassan II Street")
                    .city("Casablanca")
                    .state("Casablanca-Settat")
                    .postalCode("20250")
                    .country("Morocco")
                    .latitude(33.5731104)
                    .longitude(-7.5898434)
                    .region("Grand Casablanca")
                    .regionCode("GC-01")
                    .dateOfBirth(LocalDate.of(1990, 1, 15))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            Client client2 = Client.builder()
                    .name("Jane Smith")
                    .email("jane@example.com")
                    .phone("+212 6-98-76-54-32")
                    .streetAddress("45 Mohammed V Avenue")
                    .city("Rabat")
                    .state("Rabat-Salé-Kénitra")
                    .postalCode("10000")
                    .country("Morocco")
                    .latitude(34.0209169)
                    .longitude(-6.8416734)
                    .region("Rabat-Salé")
                    .regionCode("RS-02")
                    .dateOfBirth(LocalDate.of(1985, 6, 22))
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            clientRepository.saveAll(Arrays.asList(client1, client2));

            // Create sample accounts
            Account account1 = Account.builder()
                    .rib("RIB123456789")
                    .balance(new BigDecimal("1000.00"))
                    .type(AccountType.SAVINGS)
                    .status(AccountStatus.ACTIVE)
                    .currency("MAD")
                    .interestRate(new BigDecimal("2.5"))
                    .overdraftLimit(new BigDecimal("1000.00"))
                    .swiftCode("BCDM12345")
                    .iban("MA123456789")
                    .client(client1)
                    .branchCode("CAS001")
                    .notes("Primary savings account")
                    .createdAt(LocalDateTime.now())
                    .build();

            Account account2 = Account.builder()
                    .rib("RIB987654321")
                    .balance(new BigDecimal("2500.00"))
                    .type(AccountType.CHECKING)
                    .status(AccountStatus.ACTIVE)
                    .currency("MAD")
                    .interestRate(new BigDecimal("0.5"))
                    .overdraftLimit(new BigDecimal("5000.00"))
                    .swiftCode("BCDM12345")
                    .iban("MA987654321")
                    .client(client2)
                    .branchCode("RAB001")
                    .notes("Primary checking account")
                    .createdAt(LocalDateTime.now())
                    .build();

            accountRepository.saveAll(Arrays.asList(account1, account2));
            System.out.println("Sample clients and accounts created successfully");
        }
    }
}
