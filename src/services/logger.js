import log4javascript from "log4javascript";
var myLogger;
var ajaxAppender;
var jsonLayout;

export default {
  log(message) {
    if (!myLogger) {
      myLogger = log4javascript.getLogger();

      ajaxAppender = new log4javascript.AjaxAppender("http://192.168.110.99:9093/log");
      jsonLayout = new log4javascript.JsonLayout();
      ajaxAppender.setLayout(jsonLayout);
      ajaxAppender.setSessionId(sessionStorage.getItem("loggableSessionId"));
      ajaxAppender.setThreshold(log4javascript.Level.INFO);
      myLogger.addAppender(ajaxAppender);
    }
    myLogger.info("-+-" + JSON.stringify(message));
  }
};
