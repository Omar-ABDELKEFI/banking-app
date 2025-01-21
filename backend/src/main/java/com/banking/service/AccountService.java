package com.banking.service;

import com.banking.dto.AccountRequestDto;
import com.banking.dto.AccountResponseDto;
import com.banking.model.Account;
import com.banking.model.Client;
import com.banking.repository.AccountRepository;
import com.banking.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
    private final AccountRepository accountRepository;
    private final ClientRepository clientRepository;

    public List<AccountResponseDto> findAll() {
        return accountRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public AccountResponseDto findByRib(String rib) {
        return accountRepository.findById(rib)
                .map(this::mapToResponseDto)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with RIB: " + rib));
    }

    public AccountResponseDto save(AccountRequestDto requestDto) {
        Client client = clientRepository.findById(requestDto.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + requestDto.getClientId()));
        
        Account account = Account.builder()
                .rib(requestDto.getRib())
                .balance(requestDto.getBalance())
                .type(requestDto.getType())
                .status(requestDto.getStatus())
                .currency(requestDto.getCurrency())
                .interestRate(requestDto.getInterestRate())
                .overdraftLimit(requestDto.getOverdraftLimit())
                .swiftCode(requestDto.getSwiftCode())
                .iban(requestDto.getIban())
                .branchCode(requestDto.getBranchCode())
                .notes(requestDto.getNotes())
                .client(client)
                .build();

        return mapToResponseDto(accountRepository.save(account));
    }

    public AccountResponseDto update(String rib, AccountRequestDto requestDto) {
        Account existingAccount = accountRepository.findById(rib)
                .orElseThrow(() -> new EntityNotFoundException("Account not found with RIB: " + rib));

        Client client = clientRepository.findById(requestDto.getClientId())
                .orElseThrow(() -> new EntityNotFoundException("Client not found with ID: " + requestDto.getClientId()));

        existingAccount.setBalance(requestDto.getBalance());
        existingAccount.setType(requestDto.getType());
        existingAccount.setStatus(requestDto.getStatus());
        existingAccount.setCurrency(requestDto.getCurrency());
        existingAccount.setInterestRate(requestDto.getInterestRate());
        existingAccount.setOverdraftLimit(requestDto.getOverdraftLimit());
        existingAccount.setSwiftCode(requestDto.getSwiftCode());
        existingAccount.setIban(requestDto.getIban());
        existingAccount.setBranchCode(requestDto.getBranchCode());
        existingAccount.setNotes(requestDto.getNotes());
        existingAccount.setClient(client);

        return mapToResponseDto(accountRepository.save(existingAccount));
    }

    public void deleteByRib(String rib) {
        if (!accountRepository.existsById(rib)) {
            throw new EntityNotFoundException("Account not found with RIB: " + rib);
        }
        accountRepository.deleteById(rib);
    }

    private AccountResponseDto mapToResponseDto(Account account) {
        return AccountResponseDto.builder()
                .rib(account.getRib())
                .balance(account.getBalance())
                .type(account.getType())
                .status(account.getStatus())
                .currency(account.getCurrency())
                .interestRate(account.getInterestRate())
                .overdraftLimit(account.getOverdraftLimit())
                .swiftCode(account.getSwiftCode())
                .iban(account.getIban())
                .branchCode(account.getBranchCode())
                .notes(account.getNotes())
                .client(mapToClientDto(account.getClient()))
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .closedAt(account.getClosedAt())
                .lastTransactionDate(account.getLastTransactionDate())
                .build();
    }

    private AccountResponseDto.ClientDto mapToClientDto(Client client) {
        return AccountResponseDto.ClientDto.builder()
                .id(client.getId())
                .name(client.getName())
                .surname(client.getSurname())
                .email(client.getEmail())
                .phone(client.getPhone())
                .build();
    }
}