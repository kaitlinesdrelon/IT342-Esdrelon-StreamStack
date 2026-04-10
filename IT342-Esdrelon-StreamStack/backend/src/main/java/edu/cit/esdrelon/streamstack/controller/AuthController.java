package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.dto.*;
import edu.cit.esdrelon.streamstack.service.AuthFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * FACADE PATTERN - Controller is now SIMPLE
 * All complex logic is delegated to AuthFacade
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private final AuthFacade authFacade;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authFacade.registerUser(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authFacade.loginUser(request));
    }
}