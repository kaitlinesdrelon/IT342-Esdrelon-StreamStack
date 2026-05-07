package edu.cit.esdrelon.streamstack.service;

import edu.cit.esdrelon.streamstack.features.authenticator.dto.AuthResponse;
import edu.cit.esdrelon.streamstack.features.authenticator.dto.AuthenticationStrategy;
import edu.cit.esdrelon.streamstack.features.authenticator.strategies.EmailPasswordStrategy;
import edu.cit.esdrelon.streamstack.features.authenticator.strategies.GoogleOAuthStrategy;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * STRATEGY PATTERN - Context
 * Manages different authentication strategies
 */
@Service
public class AuthenticationContext {
    
    private final Map<String, AuthenticationStrategy> strategies = new HashMap<>();
    
    // FIXED: Single constructor with proper initialization
    public AuthenticationContext(EmailPasswordStrategy emailPasswordStrategy,
                                  GoogleOAuthStrategy googleOAuthStrategy) {
        // Register all available strategies
        strategies.put("EMAIL_PASSWORD", emailPasswordStrategy);
        strategies.put("GOOGLE_OAUTH", googleOAuthStrategy);
    }
    
    /**
     * Execute authentication using selected strategy
     */
    public AuthResponse executeStrategy(String strategyName, String identifier, String credential) {
        AuthenticationStrategy strategy = strategies.get(strategyName);
        
        if (strategy == null) {
            return new AuthResponse(
                false,
                "Authentication method not supported",
                null,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ISO_DATE_TIME)
            );
        }
        
        return strategy.authenticate(identifier, credential);
    }
    
    /**
     * Add new authentication strategy dynamically
     */
    public void addStrategy(AuthenticationStrategy strategy) {
        strategies.put(strategy.getStrategyName(), strategy);
    }
}