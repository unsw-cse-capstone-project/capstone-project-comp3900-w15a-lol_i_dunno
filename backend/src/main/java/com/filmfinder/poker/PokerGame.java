package com.filmfinder.poker;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;

import javax.management.InstanceAlreadyExistsException;

import com.filmfinder.movie.Movie;
import com.filmfinder.poker.frontendObjects.Players;
import com.filmfinder.poker.frontendObjects.Results;
import com.filmfinder.poker.frontendObjects.SelectedMovies;
import com.filmfinder.poker.frontendObjects.SelectionProgress;

import org.eclipse.jetty.websocket.api.Session;

import javassist.NotFoundException;

public class PokerGame {
    private HashMap<String, PokerPlayer> players = new HashMap<String, PokerPlayer>();
    private int gameId;

    protected PokerGame(int gameId) {
        this.gameId = gameId;
    }

    public ArrayList<Session> getSessions() {
        ArrayList<Session> sessions = new ArrayList<Session>();
        for (PokerPlayer pl: players.values()) {
            sessions.add(pl.getWebsocketConnection());
        }
        return sessions;
    }

    public PlayerData getPlayerData(Session session) throws NotFoundException {
        for (PokerPlayer p: players.values()) {
            if (p.getWebsocketConnection().equals(session)) {
                return new PlayerData(gameId, p.getNickname());
            }
        }
        throw new NotFoundException("Session doesn't exist");
    }

    public void addPlayer(String nickname, Session connection) throws InstanceAlreadyExistsException {
        if (players.containsKey(nickname)) {
            throw new InstanceAlreadyExistsException("Nickname already present");
        }
        players.put(nickname, new PokerPlayer(nickname, connection));
    }

    public Players getPlayers() {
        Players pls = new Players();
        for (PokerPlayer pl: players.values()) {
            pls.addPlayer(pl.getNickname());
        }
        return pls;
    }

    public void removePlayer(String nickname) {
        players.remove(nickname);
    }

    public SelectionProgress getSelectionProgress() {
        SelectionProgress sp = new SelectionProgress();
        for (PokerPlayer p: players.values()) {
            if (p.isFinishedSelection()) {
                sp.addDone(p.getNickname());
            } else {
                sp.addStillChoosing(p.getNickname());
            }
        }
        return sp;
    }

    public boolean addSelect(String nickname, ArrayList<Integer> movieIds) throws NotFoundException, SQLException {
        PokerPlayer p = players.get(nickname);
        p.addProposed(movieIds);
        for (PokerPlayer pl: players.values()) {
            if (!pl.isFinishedSelection()) {
                return false;
            }
        }
        return true;
    }

    // public void removeSelect(String nickname, int movieId) {
    //     PokerPlayer p = players.get(nickname);
    //     p.removeProposed(movieId);
    // }

    // public void finishSelect(String nickname) {
    //     PokerPlayer p = players.get(nickname);
    //     p.setFinishedSelection(true);
    // }

    /**
     * 
     * @return list of selections in json format
     */
    public SelectedMovies getSelectedMovies() {
        SelectedMovies sm = new SelectedMovies();
        for (PokerPlayer p: players.values()) {
            for (Movie m: p.getProposed().values()) {
                sm.addMovie(m);
            }
        }
        return sm;
    }

    public boolean addVote(String nickname, ArrayList<Integer> movieIds) throws NotFoundException, SQLException {
        PokerPlayer p = players.get(nickname);
        p.setVotes(movieIds);
        p.setSubmittedRanking(true);
        for (PokerPlayer pl: players.values()) {
            if (!pl.isSubmittedRanking()) {
                return false;
            }
        }
        return true;
    }

    public Results getResults() throws NotFoundException, SQLException {
        Results r = new Results(getSelectedMovies().getMovies());
        for (PokerPlayer p: players.values()) {
            r.addVote(p.getVotes());
        }
        r.countVote();
        return r;
    }
}
