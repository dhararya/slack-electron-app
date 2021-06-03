import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import NotificationPanel from '../src/NotificationPanel.js'

//Copyright notice
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
  //permanent code given by slack when user is authenticated
  const [permCode, setpermCode] = useState("");
  //userID on slack
  const [userID, setuserID] = useState("");

  //Retrieves the temprorary access code followed by the permanent code
  function accessCode(){
      const url = window.location.href;
      let start = url.indexOf("code=")+5
      let end = url.indexOf("&");
      let tempCode = url.slice(start, end); 
      //Fill these in
      const CLIENT_ID = '2133673209201.2118031791525';
      const CLIENT_SECRET = '26ff289859cc40a74228df1ea498ff2b';

      axios.get(`https://slack.com/api/oauth.v2.access?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${tempCode}`)
      .then((response) => {
        setpermCode(response["data"]["authed_user"]["access_token"]);
        setuserID(response["data"]["authed_user"]["id"]);
      });

  }

  //Conditionally renders sign in button if user not signed in
  //Notification bell is the user is signed in
  function renderScreen(){
    if (window.location.href === "http://localhost:3000/"){
      return (
        <div className={classes.paper}>
  
          <form className={classes.form} noValidate>
          <a href="https://slack.com/oauth/v2/authorize?user_scope=identity.basic&client_id=2133673209201.2118031791525">
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
      if (permCode===""){
        accessCode();
      }
      return (
          <NotificationPanel permCode={permCode} userID={userID}/>
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