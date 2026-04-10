package edu.cit.esdrelon.streamstack.service;

import edu.cit.esdrelon.streamstack.dto.AuthResponse;
import edu.cit.esdrelon.streamstack.dto.LoginRequest;
import edu.cit.esdrelon.streamstack.dto.RegisterRequest;
import edu.cit.esdrelon.streamstack.entity.User;
import edu.cit.esdrelon.streamstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AuthResponse register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return createErrorResponse("Email already registered");
        }
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return createErrorResponse("Username already taken");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole("USER");
        
        // Save user
        User savedUser = userRepository.save(user);
        
        // Create response
        return createSuccessResponse(savedUser, "Registration successful");
    }
    
    public AuthResponse login(LoginRequest request) {
        // Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);
        
        if (user == null) {
            return createErrorResponse("Invalid email or password");
        }
        
        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return createErrorResponse("Invalid email or password");
        }
        
        // Create response
        return createSuccessResponse(user, "Login successful");
    }
    
    private AuthResponse createSuccessResponse(User user, String message) {
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstname(),
            user.getLastname(),
            user.getRole()
        );
        
        AuthResponse.UserData userData = new AuthResponse.UserData(
            userInfo,
            generateToken(user),
            generateRefreshToken(user)
        );
        
        return new AuthResponse(
            true,
            message,
            userData,
            getCurrentTimestamp()
        );
    }
    
    private AuthResponse createErrorResponse(String message) {
        return new AuthResponse(
            false,
            message,
            null,
            getCurrentTimestamp()
        );
    }
    
    private String generateToken(User user) {
        // Simple token generation for now
        return "token_" + user.getUserId() + "_" + System.currentTimeMillis();
    }
    
    private String generateRefreshToken(User user) {
        return "refresh_" + user.getUserId() + "_" + System.currentTimeMillis();
    }
    
    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }
}