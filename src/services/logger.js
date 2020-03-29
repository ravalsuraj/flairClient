import log4javascript from "log4javascript";
import config from "./../../public/settings.json";

var myLogger;
var ajaxAppender;
var jsonLayout;

export default {
  setSessionId(sessionId) {
    ajaxAppender.setSessionId(sessionId);
  },
  log(message) {
    if (!myLogger) {
      myLogger = log4javascript.getLogger();

      ajaxAppender = new log4javascript.AjaxAppender(config.LOGGER_SERVER_URL);
      jsonLayout = new log4javascript.JsonLayout();
      ajaxAppender.setLayout(jsonLayout);
      ajaxAppender.setTimed(true);
      ajaxAppender.setTimerInterval(config.LOG_INTERVAL);
      ajaxAppender.setSendAllOnUnload(true);
      ajaxAppender.setThreshold(log4javascript.Level.INFO);

      myLogger.addAppender(ajaxAppender);
    }
    console.log(message);
    myLogger.info(message);
  }
};
