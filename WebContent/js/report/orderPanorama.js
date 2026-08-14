/**
 * 订单全景穿透（一户穿透）。
 *
 * 输入订单号，实时聚合展示 5 个业务域的全生命周期数据：
 *   订单(decoration) / 报价(quotation) / 施工(construction) / 收款(payment) / 主材(sales)
 *
 * 纯数据卡片展示，无图表。
 */
$(function() {

    var statusMap = {
        0: '初始', 1: '定金', 2: '预签', 3: '签约', 4: '重签',
        5: '废单', 6: '终止', 7: '决算', 8: '完工',
        20: '待审中', 30: '可终止', 32: '预签可终止', 33: '签约可终止'
    };

    var processMap = {
        '-1': '无施工记录', 0: '未完工', 1: '已完工'
    };

    com.focusPage("#fl_btn_searchDiv").on("click", function() {

        var orderId = com.focusPage("#orderIdSearch").val();

        if (orderId == null || orderId.trim() == "") {
            com.showAlert(com.warning, "请输入订单编号");
            return false;
        }

        com.post(api.report.queryOrderPanorama, { "orderId": orderId.trim() }, function(res) {
            render(res.panorama);
        });
    });

    // 回车触发查询
    com.focusPage("#orderIdSearch").keyup(function(e) {
        if (e.keyCode == 13) {
            com.focusPage("#fl_btn_searchDiv").trigger("click");
        }
    });

    function yuan(v) {
        return (v / 100).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function render(p) {

        var $wrap = com.focusPage("#panoramaWrap").html('');

        // ===== 订单基本信息 =====
        var $orderCard = card('订单信息', 'col-sm-12').appendTo($wrap);
        row($orderCard, '订单编号', p.orderId);
        row($orderCard, '订单状态', statusMap[p.status] || p.status, true);
        row($orderCard, '下单日期', p.createTime || '-');
        row($orderCard, '签约日期', p.contractTime || '-');
        row($orderCard, '签约额', '¥ ' + yuan(p.signAmount), true);

        var $row1 = $('<div></div>').addClass('row').appendTo($wrap);

        // ===== 报价信息 =====
        var $quoteCard = card('报价信息', 'col-sm-6').appendTo($row1);
        row($quoteCard, '报价额', '¥ ' + yuan(p.quotationAmount));
        row($quoteCard, '报价偏差', '¥ ' + yuan(p.diffAmount), true);

        // ===== 施工进度 =====
        var $constrCard = card('施工进度', 'col-sm-6').appendTo($row1);
        row($constrCard, '施工状态', processMap[String(p.constructionProcess)] || p.constructionProcess, true);
        row($constrCard, '开工日期', p.startTime || '-');
        row($constrCard, '完工日期', p.finishTime || '-');
        row($constrCard, '工期', p.period > 0 ? p.period + ' 天' : '-');

        var $row2 = $('<div></div>').addClass('row').appendTo($wrap);

        // ===== 收款情况 =====
        var $payCard = card('收款情况', 'col-sm-6').appendTo($row2);
        row($payCard, '收款总额', '¥ ' + yuan(p.collectAmount));
        row($payCard, '退款总额', '¥ ' + yuan(p.refundAmount));
        row($payCard, '净收款', '¥ ' + yuan(p.paidupAmount), true);
        if (p.signAmount > 0) {
            var rate = (p.paidupAmount / p.signAmount * 100).toFixed(1);
            row($payCard, '回款率', rate + '%', true);
        }

        // ===== 主材销售 =====
        var $salesCard = card('主材销售', 'col-sm-6').appendTo($row2);
        row($salesCard, '销售单数', p.salesCount + ' 单');
        row($salesCard, '销售总额', '¥ ' + yuan(p.salesAmount), true);
    }

    // 卡片容器
    function card(title, clazz) {
        var $box = $('<div></div>').addClass(clazz).css('margin-bottom', '10px');
        var $widget = $('<div></div>').addClass('widget-box').appendTo($box);
        var $header = $('<div></div>').addClass('widget-header').appendTo($widget);
        $('<h4></h4>').addClass('lighter').append($('<i></i>').addClass('icon-list-alt orange'))
            .append('&nbsp;' + title).appendTo($header);
        $('<div></div>').addClass('widget-body').append($('<div></div>').addClass('widget-main'))
            .appendTo($widget);
        $box.appendTo(com.focusPage("#panoramaWrap"));
        return $box.find('.widget-main');
    }

    // 键值行
    function row($card, name, value, highlight) {
        var $line = $('<div></div>').css({
            'padding': '6px 4px',
            'border-bottom': '1px dashed #eee',
            'overflow': 'hidden'
        });
        $('<span></span>').text(name + ':').css({ 'float': 'left', 'color': '#666' }).appendTo($line);
        $('<span></span>').text(value).css({
            'float': 'right',
            'font-weight': highlight ? 'bold' : 'normal',
            'color': highlight ? '#d9534f' : '#333'
        }).appendTo($line);
        $line.appendTo($card);
    }

});
