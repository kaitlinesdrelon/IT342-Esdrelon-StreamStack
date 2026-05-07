package edu.cit.esdrelon.streamstack.features.authenticator;

import edu.cit.esdrelon.streamstack.dto.*;
import edu.cit.esdrelon.streamstack.features.authenticator.dto.AuthResponse;
import edu.cit.esdrelon.streamstack.features.authenticator.dto.RegisterRequest;
import edu.cit.esdrelon.streamstack.features.user.User;
import edu.cit.esdrelon.streamstack.features.user.UserRepository;
import edu.cit.esdrelon.streamstack.features.user.validation.ValidationService;
import edu.cit.esdrelon.streamstack.service.AuthenticationContext;
import edu.cit.esdrelon.streamstack.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * FACADE PATTERN + STRATEGY PATTERN
 */
@Service
@RequiredArgsConstructor
public class AuthFacade {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final ValidationService validationService;
    private final AuthenticationContext authenticationContext; // STRATEGY PATTERN
    
    /**
     * Register user
     */
    public AuthResponse registerUser(RegisterRequest request) {
        try {
            validationService.validateRegistration(request);
        } catch (IllegalArgumentException e) {
            return createErrorResponse(e.getMessage());
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            return createErrorResponse("Email already registered");
        }
        
        if (userRepository.existsByUsername(request.getUsername())) {
            return createErrorResponse("Username already taken");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setRole("USER");
        
        User savedUser = userRepository.save(user);
        
        String accessToken = tokenService.generateAccessToken(savedUser);
        String refreshToken = tokenService.generateRefreshToken(savedUser);
        
        return createSuccessResponse(savedUser, accessToken, refreshToken, "Registration successful");
    }
    
    /**
     * Login user - USES STRATEGY PATTERN
     */
    public AuthResponse loginUser(LoginRequest request) {
        // Default to EMAIL_PASSWORD strategy
        return authenticationContext.executeStrategy(
            "EMAIL_PASSWORD", 
            request.getEmail(), 
            request.getPassword()
        );
    }
    
    /**
     * Login with specific strategy
     */
    public AuthResponse loginWithStrategy(String strategy, String identifier, String credential) {
        return authenticationContext.executeStrategy(strategy, identifier, credential);
    }
    
    private AuthResponse createSuccessResponse(User user, String accessToken, 
                                               String refreshToken, String message) {
        AuthResponse.UserInfo userInfo = new AuthResponse.UserInfo(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstname(),
            user.getLastname(),
            user.getRole()
        );
        
        AuthResponse.UserData userData = new AuthResponse.UserData(
            userInfo, accessToken, refreshToken
        );
        
        return new AuthResponse(true, message, userData, getCurrentTimestamp());
    }
    
    private AuthResponse createErrorResponse(String message) {
        return new AuthResponse(false, message, null, getCurrentTimestamp());
    }
    
    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }
}