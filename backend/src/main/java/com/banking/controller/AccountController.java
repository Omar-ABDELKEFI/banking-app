package com.banking.controller;

import com.banking.dto.AccountRequestDto;
import com.banking.dto.AccountResponseDto;
import com.banking.service.AccountService;

import java.util.List;

import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "Account", description = "Account management APIs")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {
    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @Operation(summary = "Get all accounts")
    @GetMapping
    public List<AccountResponseDto> getAllAccounts() {
        return accountService.findAll();
    }

    @Operation(summary = "Create a new account")
    @PostMapping
    public AccountResponseDto createAccount(@RequestBody AccountRequestDto accountRequest) {
        return accountService.save(accountRequest);
    }

    @Operation(summary = "Delete an account by RIB")
    @DeleteMapping("/{rib}")
    public void deleteAccount(@PathVariable String rib) {
        accountService.deleteByRib(rib);
    }

    @Operation(summary = "Update an account")
    @PutMapping("/{rib}")
    public AccountResponseDto updateAccount(@PathVariable String rib, @RequestBody AccountRequestDto accountRequest) {
        return accountService.update(rib, accountRequest);
    }
}
