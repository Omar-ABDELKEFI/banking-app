package com.banking.repository;

import com.banking.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long>, JpaSpecificationExecutor<Client> {
    List<Client> findByNameContainingIgnoreCase(String name);
    List<Client> findByRegion(String region);
    List<Client> findByCity(String city);
    List<Client> findByRegionCode(String regionCode);
    List<Client> findByPhoneStartsWith(String phonePrefix);

    List<Client> findByDateOfBirthBetween(LocalDate startDate, LocalDate endDate);
    List<Client> findByDateOfBirthBefore(LocalDate date);
    List<Client> findByDateOfBirthAfter(LocalDate date);

    @Query("SELECT c FROM Client c WHERE c.deletedAt IS NOT NULL")
    List<Client> findDeleted();
    
    @Query("SELECT c FROM Client c WHERE c.id = :id AND c.deletedAt IS NOT NULL")
    Optional<Client> findDeletedById(@Param("id") Long id);

    Optional<Client> findByEmail(String email);
}
