package com.banking.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE client SET deleted_at = NOW() WHERE id=?")
@Where(clause = "deleted_at IS NULL")
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String surname;
    
    @Column(unique = true)
    private String email;
    
    @Column(unique = true)
    private String phone;
    
    // Address fields
    private String streetAddress;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    
    // Coordinates
    private Double latitude;
    private Double longitude;
    
    // Region information
    private String region;
    private String regionCode;

    private String profilePictureUrl;

    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Account> accounts;

    
 

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
