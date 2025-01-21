package com.banking.specification;

import com.banking.dto.ClientFilterDto;
import com.banking.dto.ClientSearchDto;
import com.banking.model.Client;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalDate;

public final class ClientSpecifications {
    
    private ClientSpecifications() {
        // Private constructor to prevent instantiation
    }

    public static Specification<Client> withFilters(ClientFilterDto filter) {
        return Specification.where(withName(filter.getName()))
                .and(withCity(filter.getCity()))
                .and(withRegion(filter.getRegion()))
                .and(withRegionCode(filter.getRegionCode()))
                .and(withAgeRange(filter.getAgeMin(), filter.getAgeMax()));
    }

    public static Specification<Client> withSearch(ClientSearchDto search) {
        return Specification.where(withNameLike(search.getQuery()))
                .and(withCity(search.getCity()))
                .and(withRegion(search.getRegion()));
    }

    public static Specification<Client> withName(String name) {
        return (root, query, cb) -> {
            if (name == null) return null;
            return cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }

    public static Specification<Client> withCity(String city) {
        return (root, query, cb) -> {
            if (city == null) return null;
            return cb.equal(root.get("city"), city);
        };
    }

    public static Specification<Client> withRegion(String region) {
        return (root, query, cb) -> {
            if (region == null) return null;
            return cb.equal(root.get("region"), region);
        };
    }

    public static Specification<Client> withRegionCode(String regionCode) {
        return (root, query, cb) -> {
            if (regionCode == null) return null;
            return cb.equal(root.get("regionCode"), regionCode);
        };
    }

    public static Specification<Client> withAgeRange(Integer minAge, Integer maxAge) {
        return (root, query, cb) -> {
            if (minAge == null && maxAge == null) return null;
            
            LocalDate now = LocalDate.now();
            if (minAge != null && maxAge != null) {
                LocalDate maxDate = now.minusYears(minAge);
                LocalDate minDate = now.minusYears(maxAge + 1);
                return cb.between(root.get("dateOfBirth"), minDate, maxDate);
            } else if (minAge != null) {
                LocalDate maxDate = now.minusYears(minAge);
                return cb.lessThanOrEqualTo(root.get("dateOfBirth"), maxDate);
            } else {
                LocalDate minDate = now.minusYears(maxAge + 1);
                return cb.greaterThan(root.get("dateOfBirth"), minDate);
            }
        };
    }

    public static Specification<Client> withSearchQuery(String query) {
        return (root, criteriaQuery, cb) -> {
            if (query == null) return null;
            String likePattern = "%" + query.toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("name")), likePattern),
                cb.like(cb.lower(root.get("email")), likePattern),
                cb.like(cb.lower(root.get("city")), likePattern),
                cb.like(cb.lower(root.get("region")), likePattern)
            );
        };
    }

    private static Specification<Client> withNameLike(String query) {
        return StringUtils.hasText(query) ?
                (root, query_, cb) -> cb.like(cb.lower(root.get("name")), 
                        "%" + query.toLowerCase() + "%") : null;
    }

    public static Specification<Client> hasAccounts(Boolean hasAccounts) {
        if (hasAccounts == null) {
            return null;
        }
        return (root, query, cb) -> {
            if (hasAccounts) {
                return cb.isNotEmpty(root.get("accounts"));
            } else {
                return cb.isEmpty(root.get("accounts"));
            }
        };
    }

    public static Specification<Client> withPhonePrefix(String prefix) {
        return StringUtils.hasText(prefix) ?
                (root, query, cb) -> cb.like(root.get("phone"), prefix + "%") : null;
    }
}
