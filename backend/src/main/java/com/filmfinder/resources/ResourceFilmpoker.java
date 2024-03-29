package com.filmfinder.resources;

import javax.ws.rs.Path;
import javax.ws.rs.Consumes;
import javax.ws.rs.CookieParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.DELETE;

import com.filmfinder.templates.EndFilmpokerTemplate;
import com.filmfinder.poker.PokerManager;
import com.filmfinder.auth.CredentialHandler;
import com.filmfinder.db.UtilDB;

@Path("filmpoker/")
public class ResourceFilmpoker {
    
    @CookieParam("auth_token")
    private String token;

    @POST
    @Path("create_game/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createGameId() {

        int userId;
        try {
            userId = UtilDB.getUserId(CredentialHandler.decodeToken(token));
        } catch (Exception e) {
            return Response.status(400).entity("invalid token").build();
        }
        try {
            int gameId = PokerManager.instantiate();
            String message = "{\"gameId\": "+gameId+"}";
            return Response.status(200).entity(message).build();
        } catch (Exception e) {
            return Response.status(400).entity(e.getMessage()).build();
        }
    }

    @POST
    @Path("end_game/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response joinGameWithId(EndFilmpokerTemplate data) {
        int gameId = data.getGameId();
        try {
            PokerManager.endGame(gameId);
            return Response.status(200).entity("Ended successfully").build();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return Response.status(400).entity("unknown error").build();
        }
    }
}
