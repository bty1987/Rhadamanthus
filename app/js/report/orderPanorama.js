/** app/js/report/orderPanorama.js —— 订单全景穿透（一户穿透）
 * 输入订单号，实时聚合展示 5 个业务域的全生命周期数据：
 *   订单(decoration) / 报价(quotation) / 施工(construction) / 收款(payment) / 主材(sales)
 * 纯数据卡片展示，无图表。 */
app.ready(function () {
layui.use(['jquery'], function () {
    var $ = layui.jquery;

    var statusMap = {
        0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签',
        5: '废单', 6: '终止', 7: '决算', 8: '完工',
        20: '待审中', 30: '可终止', 32: '预签可终止', 33: '签约可终止'
    };

    var processMap = {
        '-1': '无施工记录', 0: '未完工', 1: '已完工'
    };

    $('#btnSearch').on('click', function () {
        var orderId = $.trim($('#orderIdSearch').val());
        if (!orderId) { app.showAlert(app.warning, '请输入订单编号'); return; }
        app.post(api.report.queryOrderPanorama, { orderId: orderId }, function (res) {
            render(res.panorama || {});
        });
    });

    // 回车触发查询
    $('#orderIdSearch').keyup(function (e) {
        if (e.keyCode == 13) $('#btnSearch').trigger('click');
    });

    function yuan(v) {
        return ((v || 0) / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function render(p) {
        var $wrap = $('#panoramaWrap').html('');

        // ===== 订单基本信息 =====
        var $orderCard = card('订单信息', 12, $wrap);
        row($orderCard, '订单编号', p.orderId);
        row($orderCard, '订单状态', statusMap[p.status] || p.status, true);
        row($orderCard, '下单日期', p.createTime || '-');
        row($orderCard, '签约日期', p.contractTime || '-');
        row($orderCard, '签约额', '¥ ' + yuan(p.signAmount), true);

        var $row1 = $('<div class="layui-row layui-col-space15"><\/div>').appendTo($wrap);

        // ===== 报价信息 =====
        var $quoteCard = card('报价信息', 6, $row1);
        row($quoteCard, '报价额', '¥ ' + yuan(p.quotationAmount));
        row($quoteCard, '报价偏差', '¥ ' + yuan(p.diffAmount), true);

        // ===== 施工进度 =====
        var $constrCard = card('施工进度', 6, $row1);
        row($constrCard, '施工状态', processMap[String(p.constructionProcess)] || p.constructionProcess, true);
        row($constrCard, '开工日期', p.startTime || '-');
        row($constrCard, '完工日期', p.finishTime || '-');
        row($constrCard, '工期', p.period > 0 ? p.period + ' 天' : '-');

        var $row2 = $('<div class="layui-row layui-col-space15"><\/div>').appendTo($wrap);

        // ===== 收款情况 =====
        var $payCard = card('收款情况', 6, $row2);
        row($payCard, '收款总额', '¥ ' + yuan(p.collectAmount));
        row($payCard, '退款总额', '¥ ' + yuan(p.refundAmount));
        row($payCard, '净收款', '¥ ' + yuan(p.paidupAmount), true);
        if (p.signAmount > 0) {
            var rate = (p.paidupAmount / p.signAmount * 100).toFixed(1);
            row($payCard, '回款率', rate + '%', true);
        }

        // ===== 主材销售 =====
        var $salesCard = card('主材销售', 6, $row2);
        row($salesCard, '销售单数', p.salesCount + ' 单');
        row($salesCard, '销售总额', '¥ ' + yuan(p.salesAmount), true);
    }

    // 卡片容器（layui card）：整卡挂到 $wrap，返回卡体
    function card(title, md, $wrap) {
        var $box = $('<div class="layui-col-md' + md + '"><div class="layui-card"><div class="layui-card-header">' +
            title + '<\/div><div class="layui-card-body"><\/div><\/div><\/div>');
        $box.css('margin-bottom', '10px').appendTo($wrap);
        return $box.find('.layui-card-body');
    }

    // 键值行
    function row($card, name, value, highlight) {
        $('<div class="pano-row"><span class="pano-name">' + name + ':<\/span><span class="pano-value' +
            (highlight ? ' pano-highlight' : '') + '"><\/span><\/div>')
            .find('.pano-value').text(value == null ? '-' : value).end().appendTo($card);
    }
});
});
