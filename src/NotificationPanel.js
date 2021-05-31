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


export default function MusicalGIF(props) {
    const classes = useStyles();
    const slackAppCode = 'xoxp-2133673209201-2106286474327-2133731794705-b9769bd6443fcddf4433f7d1aa92479c';

    // Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
    const { WebClient, LogLevel } = require("@slack/web-api");

    // WebClient insantiates a client that can call API methods
    // When using Bolt, you can use either `app.client` or the `client` passed to listeners.
    const client = new WebClient(slackAppCode, {
      // LogLevel can be imported and used to make debugging simpler
      logLevel: LogLevel.DEBUG
    });

  let conversationsStore = {};

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

  // Put conversations into the JavaScript object
  function saveConversations(conversationsArray) {
    let conversationId = '';
    
    conversationsArray.forEach(function(conversation){
      // Key conversation info on its unique ID
      conversationId = conversation["id"];
      
      // Store the entire conversation object (you may not need all of the info)
      conversationsStore[conversationId] = conversation;
    });
  }

  populateConversationStore();
  console.log(conversationsStore);

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
