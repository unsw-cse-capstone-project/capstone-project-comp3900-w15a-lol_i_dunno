import React, { useEffect, useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { useAsync, useFetch, IfFulfilled } from 'react-async';
import Paper from '@material-ui/core/Paper';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import { useHistory } from "react-router-dom";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const requestOptions = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

const useStyles = makeStyles((theme) => ({
  largeIcon: {
    width: 40,
    height: 40,
  },
  title: {
    textAlign: "center",
    fontSize: "calc(6px + 2vmin)",
    fontFamily: ['Montserrat', "sans-serif"],
  },
  right: {
    textAlign: "right",
  }
}));

export default function VoteCard(props) {
  const classes = useStyles();

  const [votedFor, setVotedFor] = useState(false);

  const toggleVotedFor = (event) => {
    if (props.onVoteMovie) {
      props.onVoteMovie(!votedFor);
    }

    setVotedFor(votedFor => !votedFor);
  };

  return (
    <Card style={{ width: 255, margin: 20 }} elevation={24}>
      <CardActionArea onClick={toggleVotedFor}>
        <CardMedia style={{ height: 370 }} image={props.imageUrl} />
        <CardContent>
          <div className="movieTitle">
            {props.title}
          </div>
          <div className={classes.right}>
            <FormControlLabel
              control={<Checkbox checked={votedFor}
              icon={<ClearIcon className={classes.largeIcon} />}
              checkedIcon={<CheckIcon className={classes.largeIcon} />} name="movie" />}
            />
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}