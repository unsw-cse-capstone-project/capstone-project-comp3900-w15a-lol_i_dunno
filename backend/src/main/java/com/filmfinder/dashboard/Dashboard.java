package com.filmfinder.dashboard;

import java.sql.SQLException;
import java.util.ArrayList;

import com.filmfinder.db.ReviewDB;
import com.filmfinder.frontendObject.frontendObject;
import com.filmfinder.movie.Movies;
import com.filmfinder.movieLists.Watchlist;
import com.filmfinder.movieLists.Wishlist;
import com.filmfinder.review.Reviews;
import com.filmfinder.user.User;
import com.filmfinder.user.Users;
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
    private Users blacklisted;

    public Dashboard(int userId) throws NotFoundException, SQLException {
        watchlist = new Watchlist(userId);
        wishlist = new Wishlist(userId);
        //TODO implement recommendation and blacklisted functions
        recommendations = new Movies();
        reviews = ReviewDB.getReviewsByUserId(userId);
        blacklisted = new Users(new ArrayList<User>());
    }

}
