package com.karlsamaha.smart_locker_backend.common.exception;

import com.karlsamaha.smart_locker_backend.auth.exception.InvalidCredentialsException;
import com.karlsamaha.smart_locker_backend.auth.exception.SignupException;
import com.karlsamaha.smart_locker_backend.auth.exception.UserSigninException;
import com.karlsamaha.smart_locker_backend.category.exception.CategoryException;
import com.karlsamaha.smart_locker_backend.category.exception.CategorySelectedException;
import com.karlsamaha.smart_locker_backend.category.exception.DuplicateCategoryException;
import com.karlsamaha.smart_locker_backend.common.response.ErrorResponse;
import com.karlsamaha.smart_locker_backend.menu.exception.CategorySelectedNotFoundException;
import com.karlsamaha.smart_locker_backend.menu.exception.FileStorageException;
import com.karlsamaha.smart_locker_backend.menu.exception.ItemCreationFailedException;
import com.karlsamaha.smart_locker_backend.menu.exception.ItemNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ---- Validation failures (@Valid on @RequestBody / @ModelAttribute) ----

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("message", "Validation failed");
        body.put("errors", fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // ---- Auth ----

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException ex) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(UserSigninException.class)
    public ResponseEntity<ErrorResponse> handleUserSignin(UserSigninException ex) {
        return build(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(SignupException.class)
    public ResponseEntity<ErrorResponse> handleSignup(SignupException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    // ---- Category ----

    @ExceptionHandler(CategoryException.class)
    public ResponseEntity<ErrorResponse> handleCategory(CategoryException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(CategorySelectedException.class)
    public ResponseEntity<ErrorResponse> handleCategorySelected(CategorySelectedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    // ---- Menu ----

    @ExceptionHandler(CategorySelectedNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleCategorySelectedNotFound(CategorySelectedNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ItemNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleItemNotFound(ItemNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    // ---- Fallback for anything unanticipated ----

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex) {
        log.error("Unhandled exception", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    @ExceptionHandler(DuplicateCategoryException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateCategory(DuplicateCategoryException ex) {
        log.warn("Duplicate category rejected", ex);
        return build(HttpStatus.CONFLICT, "Duplicate category");
    }

    @ExceptionHandler(ItemCreationFailedException.class)
    public ResponseEntity<ErrorResponse> handleItemCreationFailed(ItemCreationFailedException ex) {
        log.error("Item creation failed", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Could not create item");
    }

    @ExceptionHandler(FileStorageException.class)
    public ResponseEntity<ErrorResponse> handleFileStorage(FileStorageException ex) {
        log.error("File storage failed", ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file");
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message) {
        ErrorResponse errorResponse = new ErrorResponse(LocalDateTime.now(), status.value(), message);
        return ResponseEntity.status(status).body(errorResponse);
    }


}