package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.entity.User;
import edu.cit.esdrelon.streamstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admindashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    private final UserRepository userRepository;
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PutMapping("/users/{userId}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long userId,
            @RequestBody User userUpdate) {
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setUsername(userUpdate.getUsername());
        user.setEmail(userUpdate.getEmail());
        user.setFirstname(userUpdate.getFirstname());
        user.setLastname(userUpdate.getLastname());
        user.setRole(userUpdate.getRole());
        
        if (userUpdate.getPassword() != null && !userUpdate.getPassword().isEmpty()) {
            // Password update logic here if needed
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        userRepository.deleteById(userId);
        return ResponseEntity.ok().build();
    }
}