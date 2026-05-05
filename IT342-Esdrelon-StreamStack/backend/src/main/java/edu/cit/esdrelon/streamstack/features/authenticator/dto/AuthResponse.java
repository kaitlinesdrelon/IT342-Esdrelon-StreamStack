package edu.cit.esdrelon.streamstack.features.authenticator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private UserData data;
    private String timestamp;
    
    @Data
    @AllArgsConstructor
    public static class UserData {
        private UserInfo user;
        private String accessToken;
        private String refreshToken;
    }
    
    @Data
    @AllArgsConstructor
    public static class UserInfo {
        private Long userId;
        private String username;
        private String email;
        private String firstname;
        private String lastname;
        private String role;
    }
}