/** app/js/report/scrolling4addreduce.js —— 增减项滚动大屏
 * ① 增减项明细滚动(×2)：api.quotation.pageAddReduce（若 quotation 未迁移则降级提示）
 * ② 增减项排名滚动：api.report.rankAddReduce → addReduceRankVOs。
 * 每 5 秒移除顶部条目并补充下一页，模拟旧版滚动效果。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;
    var intervals = [];
    var stopped = false;

    function startScroll() {
        stopped = false;
        ranks('scrolling4addreduce3', api.report.rankAddReduce, {});
        if (api.quotation && api.quotation.pageAddReduce) {
            scroll('scrolling4addreduce1', api.quotation.pageAddReduce, { 'addReduce.type': 0, 'addReduce.paytype': 0, 'addReduce.atttype': 0, 'statuses[0]': 0, 'statuses[1]': 1 }, 0);
            scroll('scrolling4addreduce2', api.quotation.pageAddReduce, { 'addReduce.type': 0, 'addReduce.paytype': 0, 'addReduce.atttype': 0, 'statuses[0]': 0, 'statuses[1]': 1 }, 1);
        } else {
            $('#scrolling4addreduce1,#scrolling4addreduce2').html('<li class="app-rpt-item" style="color:#999;">quotation 模块未接入，明细暂不可用</li>');
        }
    }

    function appendItem(id, html) { $('#' + id).append(html); }

    function scroll(id, ep, base, pageStart) {
        var opt = $.extend({}, base, { 'paging.rows': 30, 'paging.page': pageStart });
        app.post(ep, opt, function (res) {
            var data = (res.paging && res.paging.data) || [];
            $.each(data, function (i, v) { appendItem(id, itemQuotation(v)); });
            var iv = setInterval(function () {
                if (stopped || !$('#' + id).length) { clearInterval(iv); return; }
                var $first = $('#' + id).find('li').first();
                if ($first.length) $first.remove();
                if ($('#' + id).find('li').length < 20) {
                    opt['paging.page'] = (opt['paging.page'] || 0) + 2;
                    app.post(ep, opt, function (r) {
                        var d = (r.paging && r.paging.data) || [];
                        if (d.length < r.paging.rows) opt['paging.page'] = pageStart;
                        $.each(d, function (i, v) { appendItem(id, itemQuotation(v)); });
                    });
                }
            }, 5000);
            intervals.push(iv);
        });
    }

    function ranks(id, ep, base) {
        var opt = $.extend({}, base, { 'paging.rows': 10, 'paging.page': 1 });
        app.post(ep, opt, function (res) {
            var data = res.addReduceRankVOs || [];
            $.each(data, function (i, v) { appendItem(id, itemRank(v)); });
            var iv = setInterval(function () {
                if (stopped || !$('#' + id).length) { clearInterval(iv); return; }
                var $ul = $('#' + id); var $first = $ul.find('li').first();
                if ($first.length) { $first.remove(); $ul.append($first); }
            }, 5000);
            intervals.push(iv);
        });
    }

    function itemQuotation(v) {
        var d = v.decoration || {};
        var superName = (d.supervisor && d.supervisor.currentName) || '';
        var orderId = d.orderId || ''; var village = (d.house && d.house.village && d.house.village.name) || '';
        var houseNo = (d.house && d.house.houseNumber) || '';
        return '<li class="app-rpt-item"><b style="color:#01AAED;">' + superName + ' / ' + orderId + '</b>'
            + '<div style="color:#666;font-size:12px;">' + village + ' ' + houseNo + ' · ' + (v.createTime || '') + '</div>'
            + '<div style="color:#FF5722;">金额: ' + app.formatMoney(v.consPrice) + '</div></li>';
    }
    function itemRank(v) {
        return '<li class="app-rpt-item"><b style="color:#01AAED;">' + (v.name || '-') + '</b>'
            + '<div style="color:#666;font-size:12px;">总数: ' + (v.count != null ? v.count : '-') + ' · 总额: ' + app.formatMoney(v.total) + '</div></li>';
    }

    $('#stopscreen').on('click', function () {
        stopped = true;
        $.each(intervals, function (i, v) { clearInterval(v); }); intervals = [];
    });
    $('#fullscreen').on('click', function () {
        var el = document.getElementById('scrolling4addreduce');
        if (el.requestFullscreen) el.requestFullscreen();
    });

    startScroll();
});
});
