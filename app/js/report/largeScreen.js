/** app/js/report/largeScreen.js —— 系统监控大屏（Elasticsearch → echarts）
 * 原 G2 版改写：POST 聚合到 ES（logstash 与 monitor 索引），echarts 渲染。
 *   ① 天级请求走势 ② 请求总数/当日数 ③ 服务器天级请求 ④ 人员天级 TOP10 ⑤ API 天级 TOP ⑥ 服务器温度走势。
 * 地图（原 G2 geo + /ds/largeScreen.json）新版暂未迁移，保留占位。
 * ES 地址（192.168.5.21:9200）需生产网内可达；离线时图表为空。每 1 分钟刷新。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var URL = { logstash: 'http://192.168.5.21:9200/logstash-*/_search', monitor: 'http://192.168.5.21:9200/monitor-*/_search' };
    var charts = {};

    function es(url, body, cb) {
        $.ajax({ url: url, data: JSON.stringify(body), type: 'POST', dataType: 'json', contentType: 'application/json',
            success: cb, error: function (e) { console.warn('ES 不可达:', url, e); } });
    }
    function render(id, option) {
        try { if (!charts[id]) charts[id] = echarts.init($('#' + id)[0]); charts[id].setOption(option, true); } catch (e) { console.error(id, e); }
    }
    function num(id, v) { $('#' + id).text(v != null ? v : '-'); }
    function getMyDate(str) {
        var d = new Date(str), z = function (n) { return n < 10 ? '0' + n : '' + n; };
        return d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate()) + ' ' + z(d.getHours()) + ':' + z(d.getMinutes()) + ':' + z(d.getSeconds());
    }

    function begin() {
        var now = Date.now();
        // ① 天级请求走势（近 60 天）
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: now - 5412506000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '2': { date_histogram: { field: '@timestamp', interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 } } } }, function (res) {
            var dates = [], counts = [];
            $.each((res.aggregations['2'].buckets || []), function (i, v) { dates.push(getMyDate(v.key)); counts.push(v.doc_count); });
            render('InterfaceRequestsForMouth', { title: { text: '天级请求数走势', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, grid: { top: 50 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: [{ type: 'line', data: counts, areaStyle: {}, smooth: true }] });
        });
        // ② 请求总数（全量）
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: 1483200000000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: {} }, function (res) { num('InterfaceRequestsAll', res.hits && res.hits.total); });
        // ② 当日请求（24h）
        var today = new Date(); today.setHours(0, 0, 0, 0);
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: today.getTime(), lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '2': { date_range: { field: '@timestamp', ranges: [{ from: 'now-24h/h', to: 'now' }] } } } }, function (res) {
            var b = (res.aggregations['2'].buckets || [])[0]; num('InterfaceRequestsDay', b ? b.doc_count : 0);
        });
        // ③ 服务器天级请求
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: now - 5412506000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '2': { date_histogram: { field: '@timestamp', interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 }, aggs: { '3': { terms: { field: 'host.keyword', size: 10, order: { _count: 'desc' } } } } } } }, function (res) {
            var dates = [], srv = {}, set = [];
            $.each((res.aggregations['2'].buckets || []), function (i, v) { dates.push(getMyDate(v.key)); $.each(v['3'].buckets, function (j, b) { if (set.indexOf(b.key) == -1) set.push(b.key); srv[b.key] = srv[b.key] || []; srv[b.key].push(b.doc_count); }); });
            var series = set.map(function (s) { return { name: s, type: 'line', data: srv[s], smooth: true }; });
            render('InterfaceRequestsForDayAll', { title: { text: '服务器天级请求', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, legend: { top: 20, type: 'scroll' }, grid: { top: 60 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: series });
        });
        // ④ 人员天级请求 TOP10
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: now - 2733418000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '3': { terms: { field: 'info.keyword', size: 10, order: { _count: 'desc' } }, aggs: { '4': { date_histogram: { field: '@timestamp', interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 } } } } } }, function (res) {
            var dates = [], usr = {}, set = [];
            $.each((res.aggregations['3'].buckets || []), function (i, v) {
                if (set.indexOf(v.key) == -1) set.push(v.key); usr[v.key] = usr[v.key] || {};
                $.each(v['4'].buckets, function (j, b) { if (dates.indexOf(getMyDate(b.key)) == -1) dates.push(getMyDate(b.key)); usr[v.key][j] = b.doc_count; });
            });
            var series = set.map(function (u) { var d = []; for (var k = 0; k < dates.length; k++) d.push(usr[u][k] || 0); return { name: u, type: 'line', data: d, smooth: true }; });
            render('InterfaceRequestsForDayByUserId', { title: { text: '人员天级请求 TOP10', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, legend: { top: 20, type: 'scroll' }, grid: { top: 60 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: series });
        });
        // ⑤ API 天级请求 TOP
        es(URL.logstash, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { '@timestamp': { gte: now - 2733418000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '2': { date_histogram: { field: '@timestamp', interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 }, aggs: { '3': { terms: { field: 'api.keyword', size: 7, order: { _count: 'desc' } } } } } } }, function (res) {
            var dates = [], api = {}, set = [];
            $.each((res.aggregations['2'].buckets || []), function (i, v) { dates.push(getMyDate(v.key)); $.each(v['3'].buckets, function (j, b) { if (set.indexOf(b.key) == -1) set.push(b.key); api[b.key] = api[b.key] || []; api[b.key].push(b.doc_count); }); });
            var series = set.map(function (a) { return { name: a, type: 'line', data: api[a], smooth: true }; });
            render('ApiInterfaceRequestsForDay', { title: { text: 'API 天级请求数 TOP', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, legend: { top: 20, type: 'scroll' }, grid: { top: 60 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: series });
        });
        // ⑥ 服务器温度走势（近 8 小时）
        es(URL.monitor, { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { match_phrase: { _type: { query: 'TP' } } }, { range: { timestamp: { gte: today.getTime() - 2733418000, lte: now, format: 'epoch_millis' } } } ] } }, aggs: { '3': { terms: { field: 'name.keyword', size: 10, order: { '1': 'desc' } }, aggs: { '1': { avg: { field: 'temperature' } } } } } }, function (res) {
            var names = [], vals = [];
            $.each((res.aggregations['3'].buckets || []), function (i, v) { names.push(v.key); vals.push(v['1'].value); });
            render('TemperatureTrend', { title: { text: '服务器平均温度', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis', valueFormatter: function (v) { return v + ' °C'; } }, grid: { top: 50 }, xAxis: { type: 'category', data: names }, yAxis: { type: 'value', name: '°C' }, series: [{ type: 'bar', data: vals }] });
        });
    }

    $('#fullScreen').on('click', function () { var el = document.getElementById('lsPage'); if (el.requestFullscreen) el.requestFullscreen(); });

    begin();
    setInterval(begin, 60000); // 1 分钟刷新
});
});
