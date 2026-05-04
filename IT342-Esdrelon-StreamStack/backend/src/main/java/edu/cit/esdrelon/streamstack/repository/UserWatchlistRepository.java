package edu.cit.esdrelon.streamstack.repository;

import edu.cit.esdrelon.streamstack.entity.UserWatchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWatchlistRepository extends JpaRepository<UserWatchlist, Long> {
    List<UserWatchlist> findByUserId(Long userId);
    Optional<UserWatchlist> findByUserIdAndMovieId(Long userId, Long movieId);
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    long countByUserId(Long userId);
}