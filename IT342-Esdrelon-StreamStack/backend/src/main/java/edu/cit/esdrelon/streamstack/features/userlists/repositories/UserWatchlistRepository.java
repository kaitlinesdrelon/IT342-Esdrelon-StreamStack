package edu.cit.esdrelon.streamstack.features.userlists.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.esdrelon.streamstack.features.userlists.entities.UserWatchlist;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWatchlistRepository extends JpaRepository<UserWatchlist, Long> {
    List<UserWatchlist> findByUserId(Long userId);
    Optional<UserWatchlist> findByUserIdAndMovieId(Long userId, Long movieId);
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    long countByUserId(Long userId);
}