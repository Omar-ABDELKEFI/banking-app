package com.banking.util;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class SpecificationUtils {
    public static <T> Specification<T> likeIgnoreCase(String attribute, String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return (root, query, cb) -> 
            cb.like(cb.lower(root.get(attribute)), "%" + value.toLowerCase() + "%");
    }

    public static <T> Specification<T> equals(String attribute, String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return (root, query, cb) -> cb.equal(root.get(attribute), value);
    }
}
