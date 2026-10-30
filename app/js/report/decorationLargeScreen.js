/** app/js/report/decorationLargeScreen.js —— 装修数据大屏（Elasticsearch 聚合 → echarts）
 * 原 G2 版改写：直接 POST 聚合查询到 ES（decoration-create-* / decoration-contract-*），用 echarts 渲染。
 * 注意：ES 地址（192.168.5.22:9200）需生产网内可达、同源/允许跨域；离线时图表为空。每 5 分钟刷新。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var URL = {
        create: 'http://192.168.5.22:9200/decoration-create-*/_search',
        contract: 'http://192.168.5.22:9200/decoration-contract-*/_search'
    };
    var companyName = (app.params.company && app.params.company.name) || '';
    var gte = new Date(2017, 1, 1).getTime(), lte = Date.now();
    var charts = {};

    function es(url, body, cb) {
        $.ajax({ url: url, data: JSON.stringify(body), type: 'POST', dataType: 'json', contentType: 'application/json',
            success: cb, error: function (e) { console.warn('ES 不可达:', url, e); } });
    }
    function render(id, option) {
        try { if (!charts[id]) charts[id] = echarts.init($('#' + id)[0]); charts[id].setOption(option, true); } catch (e) { console.error(id, e); }
    }
    function num(id, v) { $('#' + id).text(v != null ? v : '-'); }
    function dateAgg(field, subField, sumField, subSize) {
        return { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { } } ] } },
            _source: { excludes: [] }, aggs: { '2': { date_histogram: { field: field, interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 } } } };
    }
    function buildHist(field, sumField, withTerms, termField, termSize) {
        var q = { size: 0, query: { bool: { must: [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { } } ] } }, _source: { excludes: [] }, aggs: { '2': { date_histogram: { field: field, interval: '1d', time_zone: 'Asia/Shanghai', min_doc_count: 1 }, aggs: {} } } };
        q.query.bool.must[1].range[field] = { gte: gte, lte: lte, format: 'epoch_millis' };
        if (withTerms) q.aggs['2'].aggs['3'] = { terms: { field: termField, size: termSize || 10, order: { '1': 'desc' } }, aggs: { '1': { sum: { field: sumField } } } };
        return q;
    }
    function buildSum(field, sumField, nameFilter) {
        var must = [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { } } ];
        if (nameFilter) must.push({ match_phrase: { 'company.keyword': { query: nameFilter } } });
        var q = { size: 0, query: { bool: { must: must, must_not: [] } }, _source: { excludes: [] }, aggs: { '1': { sum: { field: sumField } } } };
        q.query.bool.must[1].range[field] = { gte: gte, lte: lte, format: 'epoch_millis' };
        return q;
    }
    function buildTerms(field, sumField, termField, size, nameFilter) {
        var must = [ { query_string: { query: '*', analyze_wildcard: true } }, { range: { } } ];
        if (nameFilter) must.push({ match_phrase: { 'company.keyword': { query: nameFilter } } });
        var q = { size: 0, query: { bool: { must: must, must_not: [] } }, _source: { excludes: [] }, aggs: { '2': { terms: { field: termField, size: size || 10, order: { '1': 'desc' } }, aggs: { '1': { sum: { field: sumField } } } } } };
        q.query.bool.must[1].range[field] = { gte: gte, lte: lte, format: 'epoch_millis' };
        return q;
    }

    function begin() {
        // 公司天级量尺数走势（多公司线）
        es(URL.create, buildHist('createTime', 'designerRate', true, 'company.keyword', 5), function (res) {
            var dates = [], companies = {}, companySet = [];
            $.each((res.aggregations['2'].buckets || []), function (i, v) {
                dates.push(new Date(v.key).toLocaleDateString());
                $.each(v['3'].buckets, function (j, b) { if (companySet.indexOf(b.key) == -1) companySet.push(b.key); companies[b.key] = companies[b.key] || {}; companies[b.key][i] = b.doc_count; });
            });
            var series = companySet.map(function (c) { var d = []; for (var k = 0; k < dates.length; k++) d.push(companies[c][k] || 0); return { name: c, type: 'line', data: d, smooth: true }; });
            render('CompanyDaysLevelScaleRuleTrend', { title: { text: '公司天级量尺数走势', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, legend: { top: 20, type: 'scroll' }, grid: { top: 60 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: series });
        });
        // 公司天级签单数走势
        es(URL.contract, buildHist('contractTime', 'designerRate', true, 'company.keyword', 10), function (res) {
            var dates = [], companies = {}, companySet = [];
            $.each((res.aggregations['2'].buckets || []), function (i, v) {
                dates.push(new Date(v.key).toLocaleDateString());
                $.each(v['3'].buckets, function (j, b) { if (companySet.indexOf(b.key) == -1) companySet.push(b.key); companies[b.key] = companies[b.key] || {}; companies[b.key][i] = b.doc_count; });
            });
            var series = companySet.map(function (c) { var d = []; for (var k = 0; k < dates.length; k++) d.push(companies[c][k] || 0); return { name: c, type: 'line', data: d, smooth: true }; });
            render('CompanyDaysToSignASingleNumberOfTrends', { title: { text: '公司天级签单数走势', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, legend: { top: 20, type: 'scroll' }, grid: { top: 60 }, xAxis: { type: 'category', data: dates }, yAxis: { type: 'value' }, series: series });
        });
        // 量尺总数
        es(URL.create, buildSum('createTime', 'designerRate'), function (res) { num('TheTotalNumberOfRuler', res.aggregations['1'].value); });
        // 签单总额
        es(URL.contract, buildSum('contractTime', 'designerRate'), function (res) { num('TheTotalNumberOfSignings', res.aggregations['1'].value.toFixed(2)); });
        // 公司量尺占比
        es(URL.create, buildTerms('createTime', 'designerRate', 'company.keyword', 5, companyName), function (res) {
            var arr = []; $.each((res.aggregations['2'].buckets || []), function (i, v) { arr.push({ name: v.key, value: v['1'].value }); });
            render('TheTotalNumberOfCompanyScale', { title: { text: '公司量尺占比', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, legend: { bottom: 0, type: 'scroll' }, series: [{ type: 'pie', radius: ['30%', '55%'], data: arr }] });
        });
        // 公司签单占比
        es(URL.contract, buildTerms('contractTime', 'designerRate', 'company.keyword', 5, companyName), function (res) {
            var arr = []; $.each((res.aggregations['2'].buckets || []), function (i, v) { arr.push({ name: v.key, value: v['1'].value }); });
            render('TheTotalNumberOfCompanySignings', { title: { text: '公司签单占比', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'item' }, legend: { bottom: 0, type: 'scroll' }, series: [{ type: 'pie', radius: ['30%', '55%'], data: arr }] });
        });
        // 设计师签单 TOP10
        es(URL.contract, buildTerms('contractTime', 'designerRate', 'designerName.keyword', 10), function (res) {
            var arr = []; $.each((res.aggregations['2'].buckets || []), function (i, v) { arr.push({ name: v.key, value: v['1'].value }); });
            arr.sort(function (a, b) { return a.value - b.value; });
            render('DesignerSignNumberTOP10', { title: { text: '设计师签单数 TOP10', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, grid: { left: 60 }, xAxis: { type: 'value' }, yAxis: { type: 'category', data: arr.map(function (a) { return a.name; }) }, series: [{ type: 'bar', data: arr.map(function (a) { return a.value; }) }] });
        });
        // 业务员签单 TOP10
        es(URL.contract, buildTerms('contractTime', 'designerRate', 'salesmanName.keyword', 10), function (res) {
            var arr = []; $.each((res.aggregations['2'].buckets || []), function (i, v) { arr.push({ name: v.key, value: v['1'].value }); });
            arr.sort(function (a, b) { return a.value - b.value; });
            render('SalesmanSignedNumberTOP10', { title: { text: '业务员签单数 TOP10', left: 'center', textStyle: { fontSize: 14 } }, tooltip: { trigger: 'axis' }, grid: { left: 60 }, xAxis: { type: 'value' }, yAxis: { type: 'category', data: arr.map(function (a) { return a.name; }) }, series: [{ type: 'bar', data: arr.map(function (a) { return a.value; }) }] });
        });
    }

    $('#fullScreen').on('click', function () { var el = document.getElementById('dlsPage'); if (el.requestFullscreen) el.requestFullscreen(); });

    begin();
    setInterval(begin, 300000); // 5 分钟刷新
});
});
