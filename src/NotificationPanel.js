import React from "react";
import NotifyMe from 'react-notification-timeline';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    conatiner: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }
  }));


export default function NotificationPanel(props) {
    const classes = useStyles();
    const slackAppCode; //Put your Slack app code;
    let notifications = [];

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
        <div className = {classes.conatiner}>
            <NotifyMe
                data={notifications}
                storageKey='notific_key'
                notific_key='timestamp'
                notific_value='update'
                heading='Slack Notification Alerts'
                sortedByKey={false}
                showDate={true}
                size={96}
                color="red"
            />
        </div>
    );
}
