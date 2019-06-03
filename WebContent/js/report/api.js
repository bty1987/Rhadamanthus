$(function () {
    com.charts("reportDiv", "gender", {"api": "log.logReport.DayLevelTrend", "mongo": "log"}, "col-xs-12", {"height": "500px"})
    com.charts("reportDiv", "apis", {"api": "log.logReport.serverRequest", "mongo": "log"}, "col-xs-12", {"height": "500px"})
});