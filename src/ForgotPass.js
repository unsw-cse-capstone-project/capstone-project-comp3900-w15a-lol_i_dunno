import Header from './components/Header';

import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function ForgotPass(props) {
    const classes = useStyles();
  
    return (
        <React.Fragment>
            <Header isLoggedIn={props.loggedIn} handleLogout={props.handleLogout}/>
            <ForgotPassScreen />
        </React.Fragment>
        

    );
}

function ForgotPassScreen() {
  const classes = useStyles();
  const history = useHistory();

  const [email, setEmail] = React.useState('');
  const [wrong_credentials, setWrongCredentials] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = {
      email: email,
    };
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    fetch('/rest/auth/request_reset', requestOptions)
      .then(response => {
        if (response.ok) {
          history.push('/ResetPassword', data);
        } else {
          setWrongCredentials(true);
        }
      });
  }

  return (

    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Forgot Password?
        </Typography>
        <Typography component="h8" variant="h7">
          Enter your email below and we will send a verification code.
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={event => setEmail(event.target.value)}
          />
          { wrong_credentials &&
            <Typography variant="subtitle2" color="secondary">
              Sorry, that is not a valid email. Try again?
            </Typography>
          }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Send Code
          </Button>
        </form>
      </div>
    </Container>
  );
}