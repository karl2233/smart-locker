package com.karlsamaha.smart_locker_backend.auth.dto.admin.response;

public class AdminAuthResponse {
    private String token;

    public AdminAuthResponse(String token) {
        this.token = token;

    }
    public String getToken() {
        return token;
    }


}
