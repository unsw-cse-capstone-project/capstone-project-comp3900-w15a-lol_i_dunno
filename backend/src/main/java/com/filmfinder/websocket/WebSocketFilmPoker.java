package com.filmfinder.websocket;

import java.io.IOException;

import com.filmfinder.poker.PokerGame;
import com.filmfinder.poker.PokerManager;
import com.google.gson.Gson;

import org.eclipse.jetty.websocket.api.Session;
import org.eclipse.jetty.websocket.api.annotations.WebSocket;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketMessage;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketConnect;
import org.eclipse.jetty.websocket.api.annotations.OnWebSocketClose;

@WebSocket
public class WebSocketFilmPoker {

    private Gson gson = new Gson();
    private int gameId = -1;

    @OnWebSocketConnect
    public void onConnect(Session session) throws IOException {
        System.out.println(session.getRemoteAddress().getHostString() + " connected!");
        // sessions.put(gameId, session);
    }
 
    @OnWebSocketClose
    public void onClose(Session session, int status, String reason) {
        System.out.println(session.getRemoteAddress().getHostString() + " closed!");
    }

    @OnWebSocketMessage
    public void onText(Session session, String message) throws IOException {
        System.out.println("Message received:" + message);
        
        Data data = gson.fromJson(message, Data.class);
        
        if (data.getCommand() != Data.JOINGAME && gameId == -1) {

        }
        String response = null;
        PokerGame pg = null;

        if (data.getCommand() == Data.JOINGAME) {
            int gameId = data.getGameId();
            pg = PokerManager.getGame(gameId);
            if (pg != null) {
                // pg.addPlayer(userId, nickname);
                this.gameId = gameId;
            } else {
                // game doesn't exist.
            }
            // send message and return.
            session.getRemote().sendString(response);
        }

        pg = PokerManager.getGame(this.gameId);
        switch (data.getCommand()) {
            case Data.GETNICK:
                response = pg.getNickPlayerString();
                break;
            
            case Data.ADDSELECT:
                response = pg.getSelectionsJson();
                break;
            case Data.REMOVESELECT:
                // pg.removeSelect(userId, movieId);
                response = "{command }";
                break;
            case Data.GETSELECTED:

                break;
            case Data.VOTE:

                break;
            case Data.RESULTS:
                break;

            case Data.DONESELECT:
                break;
        }

        if (session.isOpen()) {
            session.getRemote().sendString(response);
        }
    }   

}
