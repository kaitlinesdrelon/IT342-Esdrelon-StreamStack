package edu.cit.esdrelon.streamstack.service;

import edu.cit.esdrelon.streamstack.entity.User;
import org.springframework.stereotype.Service;

/**
 * Token Service for JWT token generation
 */
@Service
public class TokenService {
    
    /**
     * Generate access token for user
     */
    public String generateAccessToken(User user) {
        // Simple token generation (you can improve this with JWT library later)
        return "access_token_" + user.getUserId() + "_" + System.currentTimeMillis();
    }
    
    /**
     * Generate refresh token for user
     */
    public String generateRefreshToken(User user) {
        return "refresh_token_" + user.getUserId() + "_" + System.currentTimeMillis();
    }
}