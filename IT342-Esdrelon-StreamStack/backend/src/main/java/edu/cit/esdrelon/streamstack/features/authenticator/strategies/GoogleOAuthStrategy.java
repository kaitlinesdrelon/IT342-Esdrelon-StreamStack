package edu.cit.esdrelon.streamstack.features.authenticator.strategies;

import edu.cit.esdrelon.streamstack.features.authenticator.dto.AuthResponse;
import edu.cit.esdrelon.streamstack.features.authenticator.dto.AuthenticationStrategy;
import edu.cit.esdrelon.streamstack.features.user.UserRepository;
import edu.cit.esdrelon.streamstack.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * STRATEGY PATTERN - Concrete Strategy 2
 * Google OAuth authentication implementation (Future Phase)
 */
@Component
@RequiredArgsConstructor
public class GoogleOAuthStrategy implements AuthenticationStrategy {
    
    private final UserRepository userRepository;
    private final TokenService tokenService;
    
    @Override
    public AuthResponse authenticate(String googleToken, String credential) {
        // Future implementation: Verify Google OAuth token
        // For now, return not implemented
        return new AuthResponse(
            false, 
            "Google OAuth not yet implemented", 
            null, 
            getCurrentTimestamp()
        );
        
        /* Future implementation:
        // 1. Verify Google token with Google API
        // 2. Extract user info (email, name, etc.)
        // 3. Check if user exists in database
        // 4. Create user if doesn't exist
        // 5. Generate our own tokens
        // 6. Return success response
        */
    }
    
    @Override
    public String getStrategyName() {
        return "GOOGLE_OAUTH";
    }
    
    private String getCurrentTimestamp() {
        return LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME);
    }
}