import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { red } from "@material-ui/core/colors";

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
    background: "#F3EAC0",
  }
}));


export default function NotificationPanel(props) {
    const classes = useStyles();
    const slackAppCode = 'xoxp-2133673209201-2106286474327-2143800629986-812d637046ec92f0fabd15740b0b27d0'; //Put your Slack app code;
    let notifications = [];
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

    // Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
    const { WebClient, LogLevel } = require("@slack/web-api");

    // WebClient insantiates a client that can call API methods
    // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
    const client = new WebClient(slackAppCode, {
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.DEBUG
    });

    //Work around lots of error messages on console
    delete client["axios"].defaults.headers["User-Agent"];

  let conversationsStore = {};
  let messageStore = {};

  async function populateConversationStore() {
    try {
      // Call the conversations.list method using the WebClient
      const result = await client.conversations.list({types: "public_channel,private_channel,mpim,im"});
      saveConversations(result.channels);
    }
    catch (error) {
      console.error(error);
    }
  } 

  //Get the last time a conversation was read
  async function getLastRead(conversationId) {
    try {
      // Call the conversations.list method using the WebClient
      const result = await client.conversations.info({channel: conversationId});
      conversationsStore[conversationId].push(result["channel"]["last_read"]);
    }
    catch (error) {
      console.error(error);
    }
  } 

  //Gets all messages that were not opened yet
  async function populateMessages(){
    const keys = Object.keys(conversationsStore);
    for (const key in keys){
      let conversationId = keys[key];
      let ts = conversationsStore[conversationId][2];
      try {
        let result = await client.conversations.history({channel: conversationId});
        for (var messageCount in result["messages"]){
          if (ts<result["messages"][messageCount]["ts"]){
            messageStore[result["messages"][messageCount]["ts"]] = [result["messages"][messageCount], conversationId];
          }
        }
      }
      catch (error){
        console.log(error)
      }
    }
  }

  // Put conversations into the JavaScript object
  function saveConversations(conversationsArray) {
    let conversationId = '';
    
    conversationsArray.forEach(function(conversation){
      // Key conversation info on its unique ID
      conversationId = String(conversation["id"]);
      
      // Store the entire conversation object (you may not need all of the info)
      // Store information only if conversation is an unarchived im that is not a self-message and not sent from the Slack bot
      if ((conversation["is_archived"]===false && conversation["is_im"]===true &&
       conversation["user"]!==props.userID && conversation["user"]!=="USLACKBOT") || 
        (conversation["is_archived"]===false && conversation["is_im"]===false)){
          //Extracting the type of conversation from conversation object
          let type = (conversation["is_channel"] ? "channel" : (conversation["is_group"] ? "group" : (conversation["is_im"] ? "im" : "mpim")));
          conversationsStore[conversationId] = [];
          conversationsStore[conversationId].push(type);
          getLastRead(conversationId);
          conversationsStore[conversationId].push(conversation);
      }
    });
  }

  //Converts the data we have pulled into a format that can be parsed and understood
  //by our notification object
  async function populateNotifications(){
    const keys = Object.keys(messageStore);
    for (const key in keys){
      let notificationObj = {};
      let ts = keys[key];
      let message = messageStore[ts][0]["text"]
      let userID = messageStore[ts][0]["user"]
      let conversationID = (messageStore[ts][1])
      let channel = "";
      let userName = "A user"
      if (conversationsStore[conversationID][0] === "channel"){
        channel = conversationsStore[conversationID][1]["name"];
      }
      try {
        let result = await client.users.info({user: userID});
        userName = result["user"]["real_name"];
      }
      catch (error){
        console.log(error)
      }
      let update = ""
      if (channel===""){
        update = `${userName} dm-ed you saying "${message}"`
      } else {
        update = `${userName} said "${message}" on the #${channel} channel`
      }
      notificationObj["update"] = update;
      notificationObj["timestamp"] = parseFloat(ts)*1000;
      notifications.push(notificationObj);
    }
  }

  //Ensures objects are populated so following functions can retrieve and use them
  async function populateAll() {
    await populateConversationStore();
    await populateMessages();
    await populateNotifications();
  } 
  populateAll();
  console.log(notifications);

    return (
      <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className={classes.box}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>General settings</Typography>
          <Typography className={classes.secondaryHeading}>I am an accordion</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
            maximus est, id dignissim quam.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className={classes.box}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Users</Typography>
          <Typography className={classes.secondaryHeading}>
            You are currently not an owner
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus, varius pulvinar
            diam eros in elit. Pellentesque convallis laoreet laoreet.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} className={classes.box}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Advanced settings</Typography>
          <Typography className={classes.secondaryHeading}>
            Filtering has been entirely disabled for whole web server
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')} className={classes.box}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Personal data</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit amet egestas eros,
            vitae egestas augue. Duis vel est augue.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
    );
}
