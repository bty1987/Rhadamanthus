$(function () {
    var largeScreen = {
        fullScreen: com.focusPage('#fullScreen'),
    };

    var chart1 = com.charts("InterfaceRequestsForMouth", "mouth", {"api": "log.logReport.dayLevelTrend", "mongo": "log"}, "col-xs-12", {"height": "250px"},"dark");
    var chart2 = com.charts("InterfaceRequestsForDayAll", "dayAll", {"api": "log.logReport.hostRequestsSeven", "mongo": "log"}, "col-xs-12", {"height": "250px"},"dark");
    var chart3 = com.charts("InterfaceRequestsForDayByUserId", "byUserId", {"api": "log.logReport.userRequestsSeven", "mongo": "log"}, "col-xs-12", {"height": "500px"},"dark");
    var chart4 = com.charts("ApiInterfaceRequestsForDay", "day", {"api": "log.logReport.apiRequestsSeven", "mongo": "log"}, "col-xs-12", {"height": "500px"},"dark");

    com._post_(api.home.library, {"api":"log.logReport.requestCount", "mongo": "log"}, function (res) {
        com.focusPage("#InterfaceRequestsForAll").html(res)
    });
    com._post_(api.home.library, {"api":"log.logReport.intradayCount", "mongo": "log"}, function (res) {
        com.focusPage("#InterfaceRequestsDay").html(res)
    });

    largeScreen.fullScreen.on('click', function () {
        largeScreen.fullScreen.parents('.page-content').addClass('full-Screen').css('background-color', '#333333');
        largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '#fff');
        largeScreen.fullScreen.hide();
        com.focusPage('#InterfaceRequestsForAll').css('color', '#FDFEFF');
        com.focusPage('#InterfaceRequestsDay').css('color', '#FDFEFF')
    });

    $(document).keyup(function (event) {

        if (event.keyCode == 27) {
            largeScreen.fullScreen.parents('.page-content').removeClass('full-Screen').css('background-color', '');
            largeScreen.fullScreen.parents('.page-content').find('h3').css('color', '');
            largeScreen.fullScreen.show();
            com.focusPage('#InterfaceRequestsForAll').css('color', '');
            com.focusPage('#InterfaceRequestsDay').css('color', '');
        }
    });

    window.onresize = function () {
        chart1.resize();
        chart2.resize();
        chart3.resize();
        chart4.resize();
    }

});
