package com.filmfinder.resources;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.MediaType;

import java.util.HashSet;
import java.util.Iterator;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.filmfinder.Search.Search;
import com.filmfinder.movie.Movie;
import com.filmfinder.templates.SearchTemplate;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

@Path("search/")
public class ResourceSearch {

    @POST
    @Path("search")
    //@Consumes(MediaType.APPLICATION_JSON)
    //@Produces(MediaType.APPLICATION_JSON)
    public Response search(String searchString) {
        ArrayList<Integer> results = new ArrayList<Integer>();
        try {
            results = Search.getMovieIdsBySearch(searchString, 10);
        } catch (Exception e) { 
            return Response.status(200).entity("bad search query").build();
        }
        JsonObject returnData = new JsonObject();
        Gson gson = new Gson();
        JsonArray jsonMatches = gson.toJsonTree(results).getAsJsonArray();
        returnData.add("results", jsonMatches);
        return Response.status(400).entity(gson.toJson(returnData)).build();
        
    }

}