package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.entity.Movie;
import edu.cit.esdrelon.streamstack.proxy.MovieServiceProxy;
import edu.cit.esdrelon.streamstack.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * PROXY PATTERN - Movie Controller with Authorization Proxy
 */
@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    
    private final MovieService movieService;
    private final MovieServiceProxy movieServiceProxy;
    
    /**
     * Get all movies - Protected by Proxy
     */
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies(@RequestHeader(value = "X-User-Id", required = false) Long userId) {
        // PROXY PATTERN: Authorization check before accessing data
        List<Movie> movies = movieServiceProxy.executeWithAuthorization(
            userId,
            "READ",
            () -> movieService.getAllMovies()
        );
        
        return ResponseEntity.ok(movies);
    }
    
    /**
     * Get movie by ID - Protected by Proxy
     */
    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        Movie movie = movieServiceProxy.executeWithAuthorization(
            userId,
            "READ",
            () -> movieService.getMovieById(id)
        );
        
        return ResponseEntity.ok(movie);
    }
    
    /**
     * Create movie - Protected by Proxy (ADMIN only)
     */
    @PostMapping
    public ResponseEntity<Movie> createMovie(
            @RequestBody Movie movie,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        try {
            Movie createdMovie = movieServiceProxy.executeWithAuthorization(
                userId,
                "CREATE",
                () -> movieService.createMovie(movie)
            );
            
            return ResponseEntity.ok(createdMovie);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
    }
    
    /**
     * Update movie - Protected by Proxy (ADMIN only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(
            @PathVariable Long id,
            @RequestBody Movie movie,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        try {
            Movie updatedMovie = movieServiceProxy.executeWithAuthorization(
                userId,
                "UPDATE",
                () -> movieService.updateMovie(id, movie)
            );
            
            return ResponseEntity.ok(updatedMovie);
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
    }
    
    /**
     * Delete movie - Protected by Proxy (ADMIN only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Id", required = false) Long userId) {
        
        try {
            movieServiceProxy.executeWithAuthorization(
                userId,
                "DELETE",
                () -> {
                    movieService.deleteMovie(id);
                    return null;
                }
            );
            
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build(); // Forbidden
        }
    }
}