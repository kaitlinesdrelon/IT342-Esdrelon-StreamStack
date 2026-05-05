package edu.cit.esdrelon.streamstack.features.userlists.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "tbl_user_watched")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserWatched {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "movie_id", nullable = false)
    private Long movieId;
    
    @CreationTimestamp
    @Column(name = "watched_at", updatable = false)
    private LocalDateTime watchedAt;
}