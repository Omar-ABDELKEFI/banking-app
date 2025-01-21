package com.banking.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResponseWrapper<T> {
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;
    private PageMetadata pageMetadata;

    private ResponseWrapper(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    public static <T> ResponseWrapper<T> success(T data) {
        return new ResponseWrapper<>(true, "Success", data);
    }

    public static <T> ResponseWrapper<T> error(String message) {
        return new ResponseWrapper<>(false, message, null);
    }

    public static <T> ResponseWrapper<List<T>> success(Page<T> page) {
        ResponseWrapper<List<T>> wrapper = new ResponseWrapper<>(true, "Success", page.getContent());
        wrapper.setPageMetadata(new PageMetadata(page));
        return wrapper;
    }

    @Data
    public static class PageMetadata {
        private int pageNumber;
        private int pageSize;
        private long totalElements;
        private int totalPages;

        public PageMetadata(Page<?> page) {
            this.pageNumber = page.getNumber();
            this.pageSize = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
        }
    }
}
