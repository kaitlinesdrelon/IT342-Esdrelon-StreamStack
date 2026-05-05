package edu.cit.esdrelon.streamstack.features.userlists;

import edu.cit.esdrelon.streamstack.features.userlists.entities.UserFavorite;
import edu.cit.esdrelon.streamstack.features.userlists.entities.UserWatched;
import edu.cit.esdrelon.streamstack.features.userlists.entities.UserWatchlist;
import edu.cit.esdrelon.streamstack.features.userlists.repositories.UserFavoriteRepository;
import edu.cit.esdrelon.streamstack.features.userlists.repositories.UserWatchedRepository;
import edu.cit.esdrelon.streamstack.features.userlists.repositories.UserWatchlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserListsService {
    
    private final UserWatchlistRepository watchlistRepository;
    private final UserWatchedRepository watchedRepository;
    private final UserFavoriteRepository favoriteRepository;
    
    // WATCHLIST
    public List<Long> getUserWatchlist(Long userId) {
        return watchlistRepository.findByUserId(userId)
            .stream()
            .map(UserWatchlist::getMovieId)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void addToWatchlist(Long userId, Long movieId) {
        if (!watchlistRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            UserWatchlist watchlist = new UserWatchlist();
            watchlist.setUserId(userId);
            watchlist.setMovieId(movieId);
            watchlistRepository.save(watchlist);
        }
    }
    
    @Transactional
    public void removeFromWatchlist(Long userId, Long movieId) {
        watchlistRepository.deleteByUserIdAndMovieId(userId, movieId);
    }
    
    // WATCHED
    public List<Long> getUserWatched(Long userId) {
        return watchedRepository.findByUserId(userId)
            .stream()
            .map(UserWatched::getMovieId)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void addToWatched(Long userId, Long movieId) {
        if (!watchedRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            UserWatched watched = new UserWatched();
            watched.setUserId(userId);
            watched.setMovieId(movieId);
            watchedRepository.save(watched);
        }
    }
    
    @Transactional
    public void removeFromWatched(Long userId, Long movieId) {
        watchedRepository.deleteByUserIdAndMovieId(userId, movieId);
    }
    
    // FAVORITES
    public List<Long> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId)
            .stream()
            .map(UserFavorite::getMovieId)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public void addToFavorites(Long userId, Long movieId) {
        if (!favoriteRepository.findByUserIdAndMovieId(userId, movieId).isPresent()) {
            UserFavorite favorite = new UserFavorite();
            favorite.setUserId(userId);
            favorite.setMovieId(movieId);
            favoriteRepository.save(favorite);
        }
    }
    
    @Transactional
    public void removeFromFavorites(Long userId, Long movieId) {
        favoriteRepository.deleteByUserIdAndMovieId(userId, movieId);
    }
    
    // GET ALL LISTS
    public Map<String, Object> getAllUserLists(Long userId) {
        Map<String, Object> lists = new HashMap<>();
        lists.put("watchlist", getUserWatchlist(userId));
        lists.put("watched", getUserWatched(userId));
        lists.put("favorites", getUserFavorites(userId));
        lists.put("counts", getListCounts(userId));
        return lists;
    }
    
    // GET COUNTS
    public Map<String, Long> getListCounts(Long userId) {
        Map<String, Long> counts = new HashMap<>();
        counts.put("watchlist", watchlistRepository.countByUserId(userId));
        counts.put("watched", watchedRepository.countByUserId(userId));
        counts.put("favorites", favoriteRepository.countByUserId(userId));
        return counts;
    }
}