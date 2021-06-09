import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '20px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    color: "#5E376D",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: "#747080",
  },
  box:
  {
    background: "#FFFEF2",
    padding: "10px"
  },
  button:
  {
    margin: theme.spacing(1),
    margin: "15px",
    padding: "10px"
  },
  text: {
    margin: theme.spacing(1),
    width: '25ch',
  },
  check: {
    margin: theme.spacing(1),
    padding: "0px",
    margin: "0px"
  },
}));


export default function NotificationPanel(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [checked, setChecked] = React.useState(false);

    //handles logic with Accordion components for expansion and contraction
    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    //Toggles Read/Unread status
    const handleCheckChange = (event) => {
      setChecked(event.target.checked);

      const client = createClient();

      
      client.conversations.mark({channel: props.conversationID, ts: parseFloat(props.timestamp)/1000});

    };

    function createClient() {
      const { WebClient, LogLevel } = require("@slack/web-api");

      // WebClient insantiates a client that can call API methods
      // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
      const client = new WebClient(props.slackAppCode, {
      // LogLevel can be imported and used to make debugging simpler
            logLevel: LogLevel.DEBUG
      });

      //Work around lots of error messages on console
      delete client["axios"].defaults.headers["User-Agent"];
      return client;
    }

    //Updates message based on what is written in the textfield
    function handleKeyChange(e){
        setMessage(e.target.value);
    };
    
    //Delegates sending message if enter key is pressed
    function sendKey(e){
        if (e.charCode === 13){
            e.preventDefault();
            sendMessage();
          }
    }
    function sendMessage(){
        if (message !== ""){
            const client = createClient();

            //sends message to Slack Channel
            client.chat.postMessage({channel: props.conversationID, text: message});
        }
    }


    //gets time difference between present time and passed in time
    function timeSince(date) {

        var seconds = Math.floor((new Date() - date) / 1000);
      
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }

    return (
      <Accordion expanded={expanded === `panel${String(props.id)}`} onChange={handleChange(`panel${String(props.id)}`)} className={classes.box}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls= {`panel${String(props.id)}bh-content`}
          id={`panel${String(props.id)}bh-header`}
        >
          <Typography className={classes.heading}><b>{props.channel}</b></Typography>
          <Typography className={classes.secondaryHeading}>{timeSince(props.timestamp)}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {`${props.userName}: ${props.message}`}
          </Typography>
          <Checkbox
            className={classes.check}
            checked={checked}
            onChange={handleCheckChange}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </AccordionDetails>
        <Button color="secondary" className={classes.button} href={props.redirectURL}>
            <b>Go to Slack</b>
        </Button>
        <br/>
        <TextField className = {classes.text} required id="standard-required" label="Respond" onChange={handleKeyChange} defaultValue="" onKeyPress={sendKey}/>
        <Button color="secondary" className={classes.button} onClick={sendMessage}>
            <b>Send</b>
        </Button>
      </Accordion>
    );
}
