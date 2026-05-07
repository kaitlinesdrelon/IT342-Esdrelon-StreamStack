package edu.cit.esdrelon.streamstack.features.userlists.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.cit.esdrelon.streamstack.features.userlists.entities.UserWatched;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWatchedRepository extends JpaRepository<UserWatched, Long> {
    List<UserWatched> findByUserId(Long userId);
    Optional<UserWatched> findByUserIdAndMovieId(Long userId, Long movieId);
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    long countByUserId(Long userId);
}