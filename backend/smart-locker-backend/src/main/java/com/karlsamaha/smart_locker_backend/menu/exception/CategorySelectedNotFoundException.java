package com.karlsamaha.smart_locker_backend.menu.exception;

public class CategorySelectedNotFoundException extends RuntimeException {

    public CategorySelectedNotFoundException() {
        super("Category selected not found");
    }
}
