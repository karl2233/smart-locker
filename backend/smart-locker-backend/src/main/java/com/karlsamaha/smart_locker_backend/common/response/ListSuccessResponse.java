package com.karlsamaha.smart_locker_backend.common.response;

import java.time.LocalDateTime;
import java.util.List;

public class ListSuccessResponse <T> {
    private LocalDateTime timestamp;

    public ListSuccessResponse(LocalDateTime now, String status, List<T> categories) {
        this.timestamp = now;
        this.message = status;
        this.documents = categories;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    private String message;
    private List<T> documents;

    public List<T> getDocuments() {
        return documents;
    }

    public void setDocuments(List<T> documents) {
        this.documents = documents;
    }
}
