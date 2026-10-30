/** app/js/report/api.js —— 接口日志大屏（library 代理 → echarts）
 * 图表：dayLevelTrend / hostRequestsSeven / userRequestsSeven / apiRequestsSeven (mongo log)
 *       education4group / total4group (mongo communion) / getSensors (mongo monitor)
 * 数字：requestCount / intradayCount (mongo log)。全屏切换。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    function libChart(apiKey, mongo, id) {
        app.postRaw({ url: 'library' }, { api: apiKey, mongo: mongo }, function (res) {
            var option = (res && res.option) ? res.option : res;
            try { echarts.init($('#' + id)[0]).setOption(option || {}); } catch (e) { console.error(id, e); }
        });
    }
    function libNumber(apiKey, mongo, id) {
        app.postRaw({ url: 'library' }, { api: apiKey, mongo: mongo }, function (res) {
            $('#' + id).text(res != null ? res : '-');
        });
    }

    libChart('log.logReport.dayLevelTrend', 'log', 'InterfaceRequestsForMouth');
    libChart('log.logReport.hostRequestsSeven', 'log', 'InterfaceRequestsForDayAll');
    libChart('log.logReport.userRequestsSeven', 'log', 'InterfaceRequestsForDayByUserId');
    libChart('log.logReport.apiRequestsSeven', 'log', 'ApiInterfaceRequestsForDay');
    libChart('user.report.education4group', 'communion', 'education');
    libChart('user.report.total4group', 'communion', 'company');
    libChart('system.flask_monitor.getSensors', 'monitor', 'TemperatureTrend');
    libNumber('log.logReport.requestCount', 'log', 'InterfaceRequestsForAll');
    libNumber('log.logReport.intradayCount', 'log', 'InterfaceRequestsDay');

    var fs = false;
    $('#fullScreen').on('click', function () {
        fs = !fs;
        var el = document.getElementById('apiPage');
        if (fs && el.requestFullscreen) el.requestFullscreen();
        else if (!fs && document.exitFullscreen) document.exitFullscreen();
    });
    $(document).on('keyup', function (e) { if (e.keyCode == 27) fs = false; });
});
});
