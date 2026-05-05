package edu.cit.esdrelon.streamstack.features.authenticator.dto;

/**
 * STRATEGY PATTERN - Interface
 * Defines contract for all authentication strategies
 */
public interface AuthenticationStrategy {
    AuthResponse authenticate(String identifier, String credential);
    String getStrategyName();
}