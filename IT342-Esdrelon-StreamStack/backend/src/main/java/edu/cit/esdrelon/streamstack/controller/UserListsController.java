package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.service.UserListsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user-lists")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class UserListsController {
    
    private final UserListsService userListsService;
    
    // Get all user lists
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getAllUserLists(@PathVariable Long userId) {
        return ResponseEntity.ok(userListsService.getAllUserLists(userId));
    }
    
    // WATCHLIST
    @PostMapping("/{userId}/watchlist/{movieId}")
    public ResponseEntity<Map<String, Object>> addToWatchlist(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.addToWatchlist(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Added to watchlist");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{userId}/watchlist/{movieId}")
    public ResponseEntity<Map<String, Object>> removeFromWatchlist(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.removeFromWatchlist(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Removed from watchlist");
        return ResponseEntity.ok(response);
    }
    
    // WATCHED
    @PostMapping("/{userId}/watched/{movieId}")
    public ResponseEntity<Map<String, Object>> addToWatched(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.addToWatched(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Marked as watched");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{userId}/watched/{movieId}")
    public ResponseEntity<Map<String, Object>> removeFromWatched(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.removeFromWatched(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Removed from watched");
        return ResponseEntity.ok(response);
    }
    
    // FAVORITES
    @PostMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Map<String, Object>> addToFavorites(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.addToFavorites(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Added to favorites");
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{userId}/favorites/{movieId}")
    public ResponseEntity<Map<String, Object>> removeFromFavorites(
            @PathVariable Long userId,
            @PathVariable Long movieId) {
        userListsService.removeFromFavorites(userId, movieId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Removed from favorites");
        return ResponseEntity.ok(response);
    }
}