package com.filmfinder.dashboard;

import java.sql.SQLException;

import com.filmfinder.blacklist.Blacklist;
import com.filmfinder.frontendObject.frontendObject;
import com.filmfinder.movie.Movies;
import com.filmfinder.movieLists.Watchlist;
import com.filmfinder.movieLists.Wishlist;
import com.filmfinder.recommender.Recommender;
import com.filmfinder.review.Reviews;
import com.filmfinder.user.User;
import com.google.gson.annotations.Expose;

import javassist.NotFoundException;

public class Dashboard extends frontendObject {
    @Expose
    private Watchlist watchlist;
    @Expose
    private Wishlist wishlist;
    @Expose
    private Movies recommendations;
    @Expose
    private Reviews reviews;
    @Expose
    private Blacklist blacklisted;
    @Expose
    private User userInfo;

    public Dashboard(int userId, int movieLimit) throws NotFoundException, SQLException {
        watchlist = new Watchlist(userId);
        wishlist = new Wishlist(userId);
        recommendations = new Movies();
        reviews = Reviews.getReviewsByUserId(userId);
        blacklisted = new Blacklist(userId);
        recommendations = Recommender.getRecommendedMovies2(userId, movieLimit);
        userInfo = User.getUser(userId);
    }

	public Dashboard(int userId, int limit, int observerId) throws NotFoundException, SQLException {
        watchlist = new Watchlist(userId);
        wishlist = new Wishlist(userId);
        recommendations = new Movies();
        reviews = Reviews.getReviewsByUserId(userId);
        blacklisted = new Blacklist(observerId);
        recommendations = Recommender.getRecommendedMovies2(userId, limit);
        userInfo = User.getUser(userId);
	}

}
