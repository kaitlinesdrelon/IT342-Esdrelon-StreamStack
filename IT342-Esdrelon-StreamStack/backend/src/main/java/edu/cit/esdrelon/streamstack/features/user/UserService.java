package edu.cit.esdrelon.streamstack.features.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.cit.esdrelon.streamstack.features.user.dto.UpdateProfileRequest;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    @Transactional
    public User updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = getUserById(userId);
        
        // Check if username is being changed and if it's already taken
        if (!user.getUsername().equals(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already taken");
            }
        }
        
        // Check if email is being changed and if it's already taken
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already registered");
            }
        }
        
        // Update user fields
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        
        return userRepository.save(user);
    }
}