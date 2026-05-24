package com.karlsamaha.smart_locker_backend.menu.exception;

public class ItemNotFoundException extends RuntimeException {

    public ItemNotFoundException() {
        super("Item not found");
    }
}
