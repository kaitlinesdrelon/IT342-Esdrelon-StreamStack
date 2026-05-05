package edu.cit.esdrelon.streamstack.features.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private boolean success;
    private String message;
    private UserData data;
    
    @Data
    @NoArgsConstructor
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