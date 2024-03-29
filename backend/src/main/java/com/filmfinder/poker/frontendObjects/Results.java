package com.filmfinder.poker.frontendObjects;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import com.filmfinder.frontendObject.frontendObject;
import com.filmfinder.movie.Movie;
import com.google.gson.annotations.Expose;

import javassist.NotFoundException;

public class Results extends frontendObject {
    @Expose
    private int command = 7;
    @Expose
    private ArrayList<Movie> orderedMovies;
    @Expose
    private ArrayList<Integer> points;

    private ArrayList<Movie> movies;
    private HashMap<Integer, Integer> votes = new HashMap<Integer, Integer>();
    private int maxVote = 0;

    public Results() {}

    public Results(ArrayList<Movie> selectedMovies) {
        this.movies = selectedMovies;
        maxVote = selectedMovies.size();
    }

    public void addVote(ArrayList<Integer> preferences) {
        int i = 0;
        for (Integer id : preferences) {
            Integer prev = votes.get(id);
            if (prev == null) {
                prev = 0;
            }
            votes.put(id, prev + i);
            i++;
        }
        for (Movie m : movies) {
            int key = m.getMovieId();
            if (!preferences.contains(key)) {
                Integer prev = votes.get(key);
                if (prev == null) {
                    prev = 0;
                }
                votes.put(key, prev + maxVote);
            }
        }
    }

    public void countVote() throws NotFoundException, SQLException {
        orderedMovies = new ArrayList<Movie>();
        points = new ArrayList<Integer>();
        Map<Integer, Integer> sorted = sortByValue(votes);
        int i = 1;
        for (Integer key: sorted.keySet()) {
            orderedMovies.add(Movie.getMovie(key));
            points.add(i);
            i++;
        }
    }

    //https://stackoverflow.com/questions/8119366/sorting-hashmap-by-values
    private static Map<Integer, Integer> sortByValue(Map<Integer, Integer> unsortMap) {
        boolean order = true;
        List<Entry<Integer, Integer>> list = new LinkedList<>(unsortMap.entrySet());

        // Sorting the list based on values
        list.sort((o1, o2) -> order ? o1.getValue().compareTo(o2.getValue()) == 0
                ? o1.getKey().compareTo(o2.getKey())
                : o1.getValue().compareTo(o2.getValue()) : o2.getValue().compareTo(o1.getValue()) == 0
                ? o2.getKey().compareTo(o1.getKey())
                : o2.getValue().compareTo(o1.getValue()));
        return list.stream().collect(Collectors.toMap(Entry::getKey, Entry::getValue, (a, b) -> b, LinkedHashMap::new));

    }

    public String debugString() {
        String data = "Ordered movies:\n";
        int i = 0;
        for (Movie m: orderedMovies) {
            data += "\t" + m.getMovieId() +", " + points.get(i) + "\n";
            i++;
        }
        return data;
    }
}
