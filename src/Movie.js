import Header from './components/Header';
import PublicReview from './components/PublicReview'
import MovieCard from './components/MovieCard';
import './css/Movie.css';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Switch from '@material-ui/core/Switch';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import { useAsync, useFetch, IfFulfilled, IfPending } from 'react-async';
import { useLocation } from 'react-router-dom';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

import _ from 'lodash';


const useStyles = makeStyles((theme) => ({
  '@global': {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 770,
  },
  fixedHeightReviews: {
    height: 500,
  },
  largeIcon: {
    width: 40,
    height: 40,
  },
  center: {
    textAlign: "center",
    fontFamily: ["Montserrat", "sans-serif"],
},
}));

const requestOptions = {
  method: 'GET',
  headers: { 
    'Accept': 'application/json',
    'Content-Type': 'application/json' 
  }
};

export default function Movie(props) {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const fixedHeightPaperReview = clsx(classes.paper, classes.fixedHeightReviews);
  const location = useLocation();
  const movieId = parseInt(location.pathname.split('/').pop(), 10);

  const [alertOpen, setAlertOpen] = React.useState(false);
  const handleAlertClose = () => {
    setAlertOpen(false);
    window.location.reload();
  };

  const [watched, setWatched] = useState(false);
  const [wished, setWished] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewUpdated, setReviewUpdated] = useState(0);

  const movieData = useFetch(`/rest/movies/${movieId}`, requestOptions, { defer: true });
  useEffect(movieData.run, [movieId, rating, reviewUpdated]);

  const loadUserData = async () => {
    const userRequestOptions = { 
      ...requestOptions,
      method: 'POST',
      body: JSON.stringify({ limit: 10 }) 
    };
    const userDataResponse = await fetch('/rest/user/dashboard', userRequestOptions);
    
    const data = await userDataResponse.json();
    const { reviews, watchlist, wishlist } = data;
    const myReview = _.find(reviews, review => review.movieId === movieId);
    if (myReview) {
      setRating(myReview.rating);
      setHasReview(true);
    } else {
      setRating(0);
      setHasReview(false);
    };

    const inWishlist = _.find(wishlist.movies, movie => movie.movieId === movieId);
    setWished(inWishlist);

    const inWatchlist = _.find(watchlist.movies, movie => movie.movieId === movieId);
    setWatched(inWatchlist);
  };

  const userData = useAsync({ deferFn: loadUserData });
  useEffect(userData.run, [movieId]);

  const similarMoviesData = useFetch(`/rest/movies/${movieId}/similar`, requestOptions, { defer: true });
  useEffect(similarMoviesData.run, [movieId]);

  const updateWishlist = useFetch('/rest/user/wishlist', requestOptions, { defer: true });
  const updateWatchlist = useFetch('/rest/user/watchedlist', requestOptions, { defer: true });
  const updateRating = useFetch(`/rest/rating/${movieId}`, requestOptions, { defer: true });
  const updateReview = useFetch(`/rest/review/${movieId}`, requestOptions, { defer: true });

  const toggleWishlist = (event) => {
    if (props.loggedIn) {
       if (wished) {
        updateWishlist.run({
          method: 'DELETE',
          body: JSON.stringify({ movieId: movieId })
        });
      } else {
        updateWishlist.run({
          method: 'POST',
          body: JSON.stringify({ movieId: movieId })
        });
      };
      setWished(wished => !wished);
    }
    else {
      setAlertOpen(true);
    }
  };

  const toggleWatched = (event) => {
    if (props.loggedIn) {
      if (watched) {
        updateWatchlist.run({
          method: 'DELETE',
          body: JSON.stringify({ movieId: movieId })
        });
      } else {
        updateWatchlist.run({
          method: 'POST',
          body: JSON.stringify({ movieId: movieId })
        });
      };
       setWatched(watched => !watched);
    }
    else {
      setAlertOpen(true);
    }
  }

  const changeRating = (event, newRating) => {
    if (props.loggedIn) {
      if (hasReview) {
        updateRating.run({
          method: 'PUT',
          body: JSON.stringify({
            rating: (newRating ? newRating : 0)
          })
        });
      } else {
        updateRating.run({
          method: 'POST',
          body: JSON.stringify({
            rating: (newRating ? newRating : 0)
          })
        });
      }
      setRating(newRating);
    }
    else {
      setAlertOpen(true);
    }
  };

  const handleResults = ({ movies }) => {
    if (movies[0] === undefined) {
        return (
            <Container component="main" maxWidth="lg">
            <div className={classes.center}>
                <h2>No results found</h2>
                <SentimentVeryDissatisfiedIcon />
            </div>
            </Container>
        );
    }
    else {
        const searchResults = movies.map(({ movieId, name, year, imageUrl, averageRating }) => {
            return (
                <MovieCard key={movieId} movieId={movieId} title={name} yearReleased={year} imageUrl={imageUrl} rating={averageRating}/>
            );
        });
        return searchResults;
    }
};

  return (
    <React.Fragment>
      <CssBaseline />
      <Header isLoggedIn={props.loggedIn} handleLogout={props.handleLogout}/>
      <AlertDialog alertOpen={alertOpen} handleAlertClose={handleAlertClose}/>
      <IfFulfilled state={movieData}>
        { ({ movie, reviews }) =>
          <div>            
            <div className="title">
              <h1>{movie.name}</h1>
            </div>
            <IfPending state={userData}>
              {() =>
                <Box className="title" component="fieldset" mb={3} borderColor="transparent">
                  <CircularProgress color="inherit" />
                </Box>
              }
            </IfPending>
            <IfFulfilled state={userData}>
              {() =>
                <Box className="title" component="fieldset" mb={3} borderColor="transparent">
                  <Rating 
                  name="user-rating-special" 
                  precision={0.5} 
                  value={rating} 
                  size="large" 
                  onChange={changeRating}/>
                </Box>
              }
            </IfFulfilled>
            <Container component="main" maxWidth="lg">
              <Grid container spacing={3}>
                {/* Movie Card */}
                <Grid item>
                  <Paper className={fixedHeightPaper}>
                    <MoviePoster movieId={movie.movieId} movieGenreList={movie.genres} movieImageUrl={movie.imageUrl} movieRating={movie.averageRating} />
                    <div className="title">
                      <FormControlLabel
                        control={<Checkbox checked={wished} onChange={toggleWishlist} icon={<FavoriteBorder className={classes.largeIcon}/>} checkedIcon={<Favorite className={classes.largeIcon}/>} name="wishlist" />}
                      />
                      <FormControlLabel
                        control={<Switch checked={watched} onChange={toggleWatched} name="seen" color="primary"/>}
                        label="Seen"
                      />
                    </div>
                  </Paper>
                </Grid>
                {/* Information */}
                <Grid item xs={7} >
                  <Paper className={fixedHeightPaper}>
                    <div className="heading">
                      Movie Details
                    </div>
                    <div className="text">
                      {movie.description}
                    </div>
                    <div className="heading">
                      Directors
                    </div>
                    <div className="text">
                      {[movie.directors].join(", ")}
                    </div>
                    <div className="heading">
                      Release Date
                    </div>
                    <div className="text">
                      {movie.year}
                    </div>
                    <div className="right">
                      <ReviewButton 
                        loggedIn={props.loggedIn}
                        setAlertOpen={setAlertOpen}
                        movieId={movieId}
                        hasReview={hasReview}
                        updateReview={updateReview}
                        reloadMovieData={movieData}
                        reviewUpdated={setReviewUpdated}
                      />  
                    </div>
                  </Paper>
                </Grid>
                {/* Reviews */}
                <Container component="main" maxWidth="md">
                  <Grid item xs={12}>
                    <Paper className={fixedHeightPaperReview} variant="outlined">
                        <Grid container spacing={1}>
                          {reviews.map(({ comment, rating, post_date, user, movieName, movieId }) => 
                            <PublicReview loggedIn={props.loggedIn} text={comment} rating={rating} postDate={post_date} user={user} title={movieName} movieId={movieId}/>
                          )}
                        </Grid>
                    </Paper>
                  </Grid>
                </Container>
              </Grid>
            </Container>
            {/* Similar Movies */}
            <div className="title">
              <h1>Similar Movies</h1>
            </div>
            <Container component="main" maxWidth="lg">
            <div className="container">
              <IfFulfilled state={similarMoviesData}>
                {handleResults}
              </IfFulfilled>
              </div>
            </Container>
          </div>
        }
      </IfFulfilled>
      <IfPending state={movieData}>
        <Backdrop className={classes.backdrop} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </IfPending>
    </React.Fragment>
  );
}

function MoviePoster(props) {
  return (
    <Card style={{width: 350, margin: 20, backgroundColor: "#282828"}}>
      <CardActionArea>
        <CardMedia style={{height: 480}} image={props.movieImageUrl}/>
        <CardContent>
          <div className='title'>
            <Box component="fieldset" mb={-1} borderColor="transparent">
              <Rating name="movie-poster-special" precision={0.1} value={props.movieRating} readOnly/>
            </Box>
            {props.movieGenreList.map(genre => <Chip label={genre} style={{margin: 5}}/>)}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function ReviewButton(props) {
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState('');

  const openReviewDialogBox = () => {
    setOpen(true);
  };

  const closeReviewDialogBox = () => {
    setOpen(false);
  };

  const submitReview = (event) => {
    event.preventDefault();
    if (props.loggedIn) {
      if (props.hasReview) {
        props.updateReview.run({
          method: 'PUT',
          body: JSON.stringify({
            comment: newComment,
          })
        });
      } else {
        props.updateReview.run({
          method: 'POST',
          body: JSON.stringify({
            comment: newComment,
          })
        });
      };

      props.reviewUpdated((counter) => counter + 1);
    }
    else {
      props.setAlertOpen(true);
    }
  };

  return (
    <div>
      <Button variant="outlined" color="white" onClick={openReviewDialogBox}>
        Leave a Review
      </Button>
      <Dialog fullScreen={true} open={open} onClose={closeReviewDialogBox} aria-labelledby="form-dialog-title">
        <form onSubmit={submitReview}>
          <DialogTitle id="form-dialog-title">Review</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your review here...
            </DialogContentText>
            <TextField
              autoFocus
              multiline
              rowsMax={10}
              margin="dense"
              id="review"
              label=""
              fullWidth
              onChange={(event) => setNewComment(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeReviewDialogBox} color="primary">
              Cancel
            </Button>
            <Button onClick={closeReviewDialogBox} color="primary" type="submit">
              Leave Review
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

function AlertDialog(props) {

  return (
    <div>
      <Dialog
        open={props.alertOpen}
        onClose={props.handleAlertClose}
      >
        <DialogTitle id="alert-dialog-title">{"You must be logged in to do this"}</DialogTitle>
        <DialogActions>
          <Button onClick={props.handleAlertClose} color="primary">
            Close
          </Button>
          <Button href="/Login" color="primary" autoFocus>
            Log In
          </Button>
          <Button href="/Signup" color="primary" autoFocus>
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}