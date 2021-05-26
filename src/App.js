import React, {useState} from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Slack Electron App
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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


export default function SignIn() {
  const classes = useStyles();
  const [isLogged, setisLogged] =  useState(false);

  function renderScreen(){
    if (!isLogged){
      return (
        <div className={classes.paper}>
  
          <form className={classes.form} noValidate>
          <a href="https://slack.com/oauth/v2/authorize?user_scope=identity.basic&client_id=896143073510.2114279949665">
            <img 
            alt="Sign in with Slack" 
            align="center"
            height="100" width="402" 
            src="https://platform.slack-edge.com/img/sign_in_with_slack.png" 
            srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" 
          />
            </a>
          </form>
        </div>
      )
    } else {
      return (
          <div className={classes.paper}>
            <h2>Hi</h2>
          </div>
      )
    }
  }
   
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {renderScreen()}
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}