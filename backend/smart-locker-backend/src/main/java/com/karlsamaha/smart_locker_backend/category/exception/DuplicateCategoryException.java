package com.karlsamaha.smart_locker_backend.category.exception;

public class DuplicateCategoryException extends RuntimeException {

    public DuplicateCategoryException(String message, Throwable cause) {
        super(message, cause);
    }
}