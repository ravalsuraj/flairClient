/******************************************************
 * 
 * Logger Module that sends browser logs to the server
 * at periodic intervals. Server can then use server-side 
 * logging to save logs to file appender
 * 
 * This logger uses the log4javascript library for 
 * sending logs to the server.
 * 
 ****************************************************/

import log4javascript from "log4javascript";
import config from "./../../public/settings.json";
import api from "./api"
var myLogger;
var ajaxAppender;
var jsonLayout;
var loggerSetup = false;
export default {
  setSessionId(sessionId) {
    ajaxAppender.setSessionId(sessionId);
  },
  log(message) {
    if (!myLogger && !loggerSetup) {
      loggerSetup = true;
      myLogger = log4javascript.getLogger();
      api
        .getConfig()
        .then(resp => {

          ajaxAppender = new log4javascript.AjaxAppender(resp.data.LOGGER_SERVER_URL);
          jsonLayout = new log4javascript.JsonLayout();
          ajaxAppender.setLayout(jsonLayout);

          //setTimed = true means logs will be sent to the server in batches, at timed intervals
          ajaxAppender.setTimed(true);

          //Sets the interval at which logs will be sent from client to server
          ajaxAppender.setTimerInterval(config.LOG_INTERVAL);

          //Sends all pending logs to the server when the client browser window is closed
          ajaxAppender.setSendAllOnUnload(true);

          //set minimum log level to send to server
          ajaxAppender.setThreshold(log4javascript.Level.INFO);

          //add the appender to initialize logging
          myLogger.addAppender(ajaxAppender);

          //log the first message
          console.log(message);
          myLogger.info(message);
        }).catch(err => {
          console.error("warning! client logger not setup correctly as logger server IP could not be retreived. err=" + JSON.stringify(err))
        })
    } else {
      console.log(message);
      myLogger.info(message);
    }
  }
};
