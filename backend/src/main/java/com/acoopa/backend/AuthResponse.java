package com.acoopa.backend;

public record AuthResponse(String token, UserInfo user) {

    public record UserInfo(String id, String name, String email) {
    }

    public static AuthResponse of(String token, User u) {
        return new AuthResponse(token, new UserInfo(u.getId(), u.getName(), u.getEmail()));
    }
}