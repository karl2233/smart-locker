package com.karlsamaha.smart_locker_backend.menu.exception;

import com.karlsamaha.smart_locker_backend.common.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice(basePackages = "com.karlsamaha.smart_locker_backend.menu")
public class MenuExceptionHandler {

    @ExceptionHandler(CategorySelectedNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategorySelectedNotFound(
            CategorySelectedNotFoundException ex
    ) {
        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
