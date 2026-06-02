package com.karlsamaha.smart_locker_backend.auth.dto.app.response;

public class UserAuthResponse {
    private String token;

    public UserAuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
