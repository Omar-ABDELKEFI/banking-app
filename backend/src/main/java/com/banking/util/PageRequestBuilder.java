package com.banking.util;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

public class PageRequestBuilder {
    public static PageRequest build(Integer page, Integer size, String sortBy, String sortDirection) {
        int pageNumber = page != null ? page : 0;
        int pageSize = size != null ? size : 10;
        Sort sort = Sort.by(
            Sort.Direction.fromString(sortDirection != null ? sortDirection : "asc"),
            sortBy != null ? sortBy : "id"
        );
        return PageRequest.of(pageNumber, pageSize, sort);
    }
}
