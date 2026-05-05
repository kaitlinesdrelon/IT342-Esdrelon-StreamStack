package edu.cit.esdrelon.streamstack.service;

import org.springframework.stereotype.Service;

import edu.cit.esdrelon.streamstack.features.user.User;

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