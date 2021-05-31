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
                size={64}
                color="yellow"
            />
        </div>
    );
}
