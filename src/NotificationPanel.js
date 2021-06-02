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
    const slackAppCode = 'xoxp-2133673209201-2106286474327-2123875675954-257d0c17781f6a2ffe223137c49bd803';

    // Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
    const { WebClient, LogLevel } = require("@slack/web-api");

    // WebClient insantiates a client that can call API methods
    // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
    const client = new WebClient(slackAppCode, {
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.DEBUG
    });

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

  async function populateMessages(){
    const keys = Object.keys(conversationsStore);
    for (const key in keys){
      let conversationId = keys[key];
      let ts = conversationsStore[conversationId][1];
      try {
        let result = await client.conversations.history({channel: conversationId});
        console.log(result["messages"])
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
      }
    });
  }


  async function populateAll() {
    await populateConversationStore();
    await populateMessages();
    console.log(messageStore);
  } 
  populateAll();
  

    let data = [
        {
          "update":"70 new employees are shifted",
          "timestamp":1596119688264
        },
        {
          "update":"Time to take a Break, TADA!!!",
          "timestamp":1596119686811
        }
      ];

    return (
        <div className = {classes.conatiner}>
            <NotifyMe
                data={data}
                storageKey='notific_key'
                notific_key='timestamp'
                notific_value='update'
                heading='Notification Alerts'
                sortedByKey={true}
                showDate={true}
                size={96}
                color="yellow"
            />
        </div>
    );
}
