package edu.cit.esdrelon.streamstack.strategy;

import edu.cit.esdrelon.streamstack.dto.AuthResponse;
import edu.cit.esdrelon.streamstack.entity.User;
import edu.cit.esdrelon.streamstack.repository.UserRepository;
import edu.cit.esdrelon.streamstack.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * STRATEGY PATTERN - Concrete Strategy 1
 * Email/Password authentication implementation
 */
@Component
@RequiredArgsConstructor
public class EmailPasswordStrategy implements AuthenticationStrategy {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    
    @Override
    public AuthResponse authenticate(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            return createErrorResponse("Invalid email or password");
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return createErrorResponse("Invalid email or password");
        }
        
        // Generate tokens
        String accessToken = tokenService.generateAccessToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);
        
        return createSuccessResponse(user, accessToken, refreshToken);
    }
    
    @Override
    public String getStrategyName() {
        return "EMAIL_PASSWORD";
    }
    
    private AuthResponse createSuccessResponse(User user, String accessToken, String refreshToken) {
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
        
        return new AuthResponse(true, "Login successful", userData, getCurrentTimestamp());
    }
    
    private AuthResponse createErrorResponse(String message) {
        return new AuthResponse(false, message, null, getCurrentTimestamp());
    }
    
    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }
}