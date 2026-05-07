package edu.cit.esdrelon.streamstack.features.user;

import edu.cit.esdrelon.streamstack.features.user.dto.UpdateProfileRequest;
import edu.cit.esdrelon.streamstack.features.user.dto.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            UserResponse.UserData userData = new UserResponse.UserData(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstname(),
                user.getLastname(),
                user.getRole()
            );
            
            UserResponse response = new UserResponse(true, "User profile retrieved", userData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserResponse(false, e.getMessage(), null));
        }
    }
    
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setFirstname(request.getFirstname());
            user.setLastname(request.getLastname());
            
            User updatedUser = userRepository.save(user);
            
            UserResponse.UserData userData = new UserResponse.UserData(
                updatedUser.getUserId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getFirstname(),
                updatedUser.getLastname(),
                updatedUser.getRole()
            );
            
            UserResponse response = new UserResponse(true, "Profile updated successfully", userData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new UserResponse(false, e.getMessage(), null));
        }
    }
}