package com.karlsamaha.smart_locker_backend.common.response;

import java.time.LocalDateTime;

public class SuccessResponse<T> {
    private LocalDateTime timestamp;
    private String message;
    private T data;

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getMessage() {
        return message;
    }
    public T getData() {
        return data;
    }

    public SuccessResponse(LocalDateTime timestamp, String message, T data) {
        this.timestamp = timestamp;
        this.message = message;
        this.data = data;
    }
}

