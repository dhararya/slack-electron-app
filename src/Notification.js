import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';


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
  }
}));


export default function NotificationPanel(props) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

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
        </AccordionDetails>
        <Button color="secondary" className={classes.button} href={props.redirectURL}>
            <b>Go to Slack</b>
        </Button>
      </Accordion>
    );
}
