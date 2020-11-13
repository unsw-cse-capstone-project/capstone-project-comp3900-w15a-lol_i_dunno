package com.filmfinder.poker;

import java.util.HashMap;

public class PokerManager {
    private static HashMap<Integer, PokerGame> games = new HashMap<Integer, PokerGame>();
    
    /**
     * Function gets instance of game with id gameId
     * Creates game if game doesn't exist
     * @param gameId
     * @return PokerData
     */
    public static PokerGame getGame(int gameId) {
        PokerGame pd = games.get(gameId);
        if (pd == null) {
            pd = new PokerGame();
        }
        return pd;
    }
}