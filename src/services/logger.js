import log4javascript from "log4javascript";
import config from "./../../public/settings.json";
var myLogger;
var ajaxAppender;
var jsonLayout;

export default {
  log(message) {
    if (!myLogger) {
      myLogger = log4javascript.getLogger();

      ajaxAppender = new log4javascript.AjaxAppender(config.DGFT.MIDDLEWARE.URL + "/log");
      jsonLayout = new log4javascript.JsonLayout();
      ajaxAppender.setLayout(jsonLayout);
      ajaxAppender.setSessionId(sessionStorage.getItem("loggableSessionId"));
      ajaxAppender.setThreshold(log4javascript.Level.INFO);
      myLogger.addAppender(ajaxAppender);
    }
    console.log(message);
    myLogger.info("-+-" + message);
  }
};
