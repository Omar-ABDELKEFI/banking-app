package com.banking.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseWrapper<T> {
    private T data;
    private String message;
    private boolean success;
    private PageMetadata pagination;

    @Data
    @Builder
    public static class PageMetadata {
        private int page;
        private int size;
        private long totalElements;
        private int totalPages;
        private boolean hasNext;
        private boolean hasPrevious;
    }

    public static <T> ResponseWrapper<T> success(T data) {
        return ResponseWrapper.<T>builder()
                .data(data)
                .success(true)
                .message("Operation successful")
                .build();
    }

    public static <T> ResponseWrapper<List<T>> success(Page<T> page) {
        return ResponseWrapper.<List<T>>builder()
                .data(page.getContent())
                .success(true)
                .message("Operation successful")
                .pagination(PageMetadata.builder()
                        .page(page.getNumber())
                        .size(page.getSize())
                        .totalElements(page.getTotalElements())
                        .totalPages(page.getTotalPages())
                        .hasNext(page.hasNext())
                        .hasPrevious(page.hasPrevious())
                        .build())
                .build();
    }

    public static <T> ResponseWrapper<T> error(String message) {
        return ResponseWrapper.<T>builder()
                .success(false)
                .message(message)
                .build();
    }
}
