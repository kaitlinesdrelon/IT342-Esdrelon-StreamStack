package edu.cit.esdrelon.streamstack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private boolean success;
    private String message;
    private UserData data;
    
    @Data
    @AllArgsConstructor
    public static class UserData {
        private Long userId;
        private String username;
        private String email;
        private String firstname;
        private String lastname;
        private String role;
    }
}