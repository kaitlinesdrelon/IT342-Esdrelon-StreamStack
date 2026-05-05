package edu.cit.esdrelon.streamstack.features.user;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * BUILDER PATTERN
 * Allows step-by-step construction of User objects with optional fields
 */
@Entity
@Table(name = "tbl_user")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;
    
    @Column(nullable = false, unique = true)
    private String username;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String firstname;
    private String lastname;
    private String role;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // BUILDER PATTERN IMPLEMENTATION
    public static class UserBuilder {
        private String username;
        private String email;
        private String password;
        private String firstname;
        private String lastname;
        private String role = "USER"; // Default value
        
        public UserBuilder username(String username) {
            this.username = username;
            return this;
        }
        
        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }
        
        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }
        
        public UserBuilder firstname(String firstname) {
            this.firstname = firstname;
            return this;
        }
        
        public UserBuilder lastname(String lastname) {
            this.lastname = lastname;
            return this;
        }
        
        public UserBuilder role(String role) {
            this.role = role;
            return this;
        }
        
        public User build() {
            User user = new User();
            user.setUsername(this.username);
            user.setEmail(this.email);
            user.setPassword(this.password);
            user.setFirstname(this.firstname);
            user.setLastname(this.lastname);
            user.setRole(this.role);
            return user;
        }
    }
    
    public static UserBuilder builder() {
        return new UserBuilder();
    }
}