package com.filmfinder.poker.frontendObjects;

import java.util.ArrayList;

import com.filmfinder.frontendObject.frontendObject;
import com.google.gson.annotations.Expose;

public class Players extends frontendObject {
    @Expose
    private int command = 8;
    @Expose
    private ArrayList<String> players = new ArrayList<String>();

    public Players() {}
    public void addPlayer(String nickname) {
        players.add(nickname);
    }

    public void removePlayer(String nickname) {
        players.remove(nickname);
    }
}
