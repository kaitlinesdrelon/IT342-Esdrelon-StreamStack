package edu.cit.esdrelon.streamstack.strategy;

import edu.cit.esdrelon.streamstack.dto.AuthResponse;

/**
 * STRATEGY PATTERN - Interface
 * Defines contract for all authentication strategies
 */
public interface AuthenticationStrategy {
    AuthResponse authenticate(String identifier, String credential);
    String getStrategyName();
}