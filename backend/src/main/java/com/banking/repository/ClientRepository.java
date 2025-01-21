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

    @Query("SELECT c FROM Client c WHERE c.email = :email AND c.deletedAt IS NULL")
    Optional<Client> findByEmail(@Param("email") String email);

    @Query("SELECT c FROM Client c WHERE c.phone = :phone AND c.deletedAt IS NULL")
    Optional<Client> findByPhone(@Param("phone") String phone);

    @Query("SELECT EXISTS (SELECT 1 FROM Client c WHERE c.email = :email AND c.id != :clientId AND c.deletedAt IS NULL)")
    boolean existsByEmailAndIdNot(@Param("email") String email, @Param("clientId") Long clientId);
}
