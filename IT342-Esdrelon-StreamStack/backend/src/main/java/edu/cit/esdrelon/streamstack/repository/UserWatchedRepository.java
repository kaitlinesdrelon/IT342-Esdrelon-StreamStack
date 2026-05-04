package edu.cit.esdrelon.streamstack.repository;

import edu.cit.esdrelon.streamstack.entity.UserWatched;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWatchedRepository extends JpaRepository<UserWatched, Long> {
    List<UserWatched> findByUserId(Long userId);
    Optional<UserWatched> findByUserIdAndMovieId(Long userId, Long movieId);
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    long countByUserId(Long userId);
}