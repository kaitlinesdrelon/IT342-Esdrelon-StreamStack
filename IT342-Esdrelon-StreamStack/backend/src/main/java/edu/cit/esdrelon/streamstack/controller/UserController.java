package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.dto.UpdateProfileRequest;
import edu.cit.esdrelon.streamstack.dto.UserResponse;
import edu.cit.esdrelon.streamstack.entity.User;
import edu.cit.esdrelon.streamstack.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            return ResponseEntity.ok(createUserResponse(user, "User profile retrieved"));
        } catch (Exception e) {
            UserResponse errorResponse = new UserResponse(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        try {
            User updatedUser = userService.updateUserProfile(userId, request);
            return ResponseEntity.ok(createUserResponse(updatedUser, "Profile updated successfully"));
        } catch (Exception e) {
            UserResponse errorResponse = new UserResponse(false, e.getMessage(), null);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    private UserResponse createUserResponse(User user, String message) {
        UserResponse.UserData userData = new UserResponse.UserData(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstname(),
            user.getLastname(),
            user.getRole()
        );
        
        return new UserResponse(true, message, userData);
    }
}