/** app/js/report/monitor.js —— 服务器温度监控（library 代理 → echarts）
 * system.flask_monitor.getSensors，mongo=monitor。library 返回 echarts option 直接渲染。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    app.postRaw({ url: 'library' }, { api: 'system.flask_monitor.getSensors', mongo: 'monitor' }, function (res) {
        var option = (res && res.option) ? res.option : res;
        try { echarts.init($('#sensors')[0]).setOption(option || {}); } catch (e) { console.error('sensors', e); }
    });
});
});
