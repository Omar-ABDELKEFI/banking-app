package com.banking.service;

import com.banking.config.JwtService;
import com.banking.dto.AuthenticationRequest;
import com.banking.dto.AuthenticationResponse;
import com.banking.dto.RegisterRequest;
import com.banking.exception.AuthenticationException;
import com.banking.model.Role;
import com.banking.model.User;
import com.banking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        // Validate request
        validateRegistrationRequest(request);

        // Check if email already exists
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new AuthenticationException("Email already registered");
        }

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase(),
                            request.getPassword()
                    )
            );
            
            var user = repository.findByEmail(request.getEmail().toLowerCase())
                    .orElseThrow(() -> new AuthenticationException("User not found"));
            System.out.println("user: " + user);
            var jwtToken = jwtService.generateToken(user);
            System.out.println("Generated JWT Token: " + jwtToken);
            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .build();
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Invalid email or password");
        }
    }

    private void validateRegistrationRequest(RegisterRequest request) {
        if (!StringUtils.hasText(request.getEmail())) {
            throw new AuthenticationException("Email is required");
        }
        if (!StringUtils.hasText(request.getPassword())) {
            throw new AuthenticationException("Password is required");
        }
        if (!StringUtils.hasText(request.getFirstName())) {
            throw new AuthenticationException("First name is required");
        }
        if (!StringUtils.hasText(request.getLastName())) {
            throw new AuthenticationException("Last name is required");
        }
        if (request.getPassword().length() < 6) {
            throw new AuthenticationException("Password must be at least 6 characters");
        }
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new AuthenticationException("Invalid email format");
        }
    }

    public boolean emailExists(String email) {
        return repository.findByEmail(email.toLowerCase()).isPresent();
    }
}
