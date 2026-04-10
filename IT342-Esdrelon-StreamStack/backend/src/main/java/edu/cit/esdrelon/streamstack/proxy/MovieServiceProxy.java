package edu.cit.esdrelon.streamstack.proxy;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * PROXY PATTERN - Movie Service Proxy
 * Intercepts calls to movie service and performs authorization checks
 */
@Component
@RequiredArgsConstructor
public class MovieServiceProxy {
    
    private final AuthorizationProxy authorizationProxy;
    
    /**
     * Proxy method - checks authorization before allowing access
     */
    public <T> T executeWithAuthorization(Long userId, String action, ProxyOperation<T> operation) {
        // Step 1: Check if user is authenticated
        if (!authorizationProxy.isAuthenticated(userId)) {
            throw new SecurityException("User not authenticated");
        }
        
        // Step 2: Check if user has permission
        if (!authorizationProxy.hasPermission(userId, "MOVIE", action)) {
            throw new SecurityException("User does not have permission to " + action + " movies");
        }
        
        // Step 3: Log the action (audit trail)
        logAction(userId, action);
        
        // Step 4: Execute the actual operation
        return operation.execute();
    }
    
    private void logAction(Long userId, String action) {
        System.out.println("[AUDIT] User " + userId + " performed action: " + action + " at " + 
                          java.time.LocalDateTime.now());
    }
    
    /**
     * Functional interface for proxy operations
     */
    @FunctionalInterface
    public interface ProxyOperation<T> {
        T execute();
    }
}