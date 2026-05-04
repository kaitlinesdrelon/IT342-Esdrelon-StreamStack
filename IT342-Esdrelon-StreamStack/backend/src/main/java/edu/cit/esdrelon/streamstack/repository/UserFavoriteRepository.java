package edu.cit.esdrelon.streamstack.repository;

import edu.cit.esdrelon.streamstack.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    List<UserFavorite> findByUserId(Long userId);
    Optional<UserFavorite> findByUserIdAndMovieId(Long userId, Long movieId);
    void deleteByUserIdAndMovieId(Long userId, Long movieId);
    long countByUserId(Long userId);
}