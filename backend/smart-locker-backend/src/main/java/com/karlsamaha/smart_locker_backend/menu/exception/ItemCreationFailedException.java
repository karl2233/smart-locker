package com.karlsamaha.smart_locker_backend.menu.exception;

public class ItemCreationFailedException extends RuntimeException {

    public ItemCreationFailedException(Throwable cause) {
        super("Failed to create item", cause);
    }
}
