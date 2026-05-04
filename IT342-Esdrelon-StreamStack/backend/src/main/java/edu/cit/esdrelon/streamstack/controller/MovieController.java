package edu.cit.esdrelon.streamstack.controller;

import edu.cit.esdrelon.streamstack.entity.Movie;
import edu.cit.esdrelon.streamstack.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {
    
    private final MovieRepository movieRepository;
    
    // Get all movies
    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return ResponseEntity.ok(movies);
    }
    
    // Get movie by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try {
            Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
            return ResponseEntity.ok(movie);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Create new movie
    @PostMapping
    public ResponseEntity<?> createMovie(@RequestBody Movie movie) {
        try {
            System.out.println("Creating movie: " + movie);
            
            // Validate required fields
            if (movie.getTitle() == null || movie.getTitle().isEmpty()) {
                throw new RuntimeException("Title is required");
            }
            if (movie.getGenre() == null || movie.getGenre().isEmpty()) {
                throw new RuntimeException("Genre is required");
            }
            
            Movie savedMovie = movieRepository.save(movie);
            System.out.println("Movie saved successfully: " + savedMovie);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie created successfully");
            response.put("data", savedMovie);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating movie: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to create movie: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Update movie
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMovie(@PathVariable Long id, @RequestBody Movie movieUpdate) {
        try {
            System.out.println("Updating movie ID: " + id);
            System.out.println("Update data: " + movieUpdate);
            
            Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + id));
            
            movie.setTitle(movieUpdate.getTitle());
            movie.setDescription(movieUpdate.getDescription());
            movie.setGenre(movieUpdate.getGenre());
            movie.setPosterUrl(movieUpdate.getPosterUrl());
            movie.setReleaseYear(movieUpdate.getReleaseYear());
            movie.setRating(movieUpdate.getRating());
            
            Movie updatedMovie = movieRepository.save(movie);
            System.out.println("Movie updated successfully: " + updatedMovie);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie updated successfully");
            response.put("data", updatedMovie);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error updating movie: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to update movie: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // Delete movie
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        try {
            System.out.println("Deleting movie ID: " + id);
            
            if (!movieRepository.existsById(id)) {
                throw new RuntimeException("Movie not found with id: " + id);
            }
            
            movieRepository.deleteById(id);
            System.out.println("Movie deleted successfully");
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Movie deleted successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error deleting movie: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Failed to delete movie: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(error);
        }
    }
}