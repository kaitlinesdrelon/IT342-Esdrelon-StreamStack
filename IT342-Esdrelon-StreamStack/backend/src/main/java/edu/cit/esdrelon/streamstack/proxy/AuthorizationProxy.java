package edu.cit.esdrelon.streamstack.proxy;

import edu.cit.esdrelon.streamstack.entity.User;
import edu.cit.esdrelon.streamstack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * PROXY PATTERN
 * Acts as a gatekeeper - checks authorization before allowing access
 */
@Component
@RequiredArgsConstructor
public class AuthorizationProxy {
    
    private final UserRepository userRepository;
    
    /**
     * Check if user has permission to access resource
     */
    public boolean hasPermission(Long userId, String resource, String action) {
        User user = userRepository.findById(userId).orElse(null);
        
        if (user == null) {
            return false;
        }
        
        // Check role-based permissions
        String role = user.getRole();
        
        switch (resource) {
            case "MOVIE":
                return hasMoviePermission(role, action);
            case "USER":
                return hasUserPermission(role, action);
            case "ADMIN":
                return hasAdminPermission(role, action);
            default:
                return false;
        }
    }
    
    private boolean hasMoviePermission(String role, String action) {
        switch (action) {
            case "READ":
                // All authenticated users can read movies
                return true;
            case "CREATE":
            case "UPDATE":
            case "DELETE":
                // Only ADMIN can create/update/delete movies
                return "ADMIN".equals(role);
            default:
                return false;
        }
    }
    
    private boolean hasUserPermission(String role, String action) {
        switch (action) {
            case "READ":
                // Users can read their own profile
                return true;
            case "UPDATE":
                // Users can update their own profile
                return true;
            case "DELETE":
                // Only ADMIN can delete users
                return "ADMIN".equals(role);
            default:
                return false;
        }
    }
    
    private boolean hasAdminPermission(String role, String action) {
        // Only ADMIN role has admin permissions
        return "ADMIN".equals(role);
    }
    
    /**
     * Check if user is authenticated
     */
    public boolean isAuthenticated(Long userId) {
        if (userId == null) {
            return false;
        }
        return userRepository.existsById(userId);
    }
    
    /**
     * Check if user is ADMIN
     */
    public boolean isAdmin(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        return user != null && "ADMIN".equals(user.getRole());
    }
}