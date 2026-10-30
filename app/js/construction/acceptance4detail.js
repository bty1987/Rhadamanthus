/** app/js/construction/acceptance4detail.js —— 验收详情（客户验收评分）
 *  上下文：app.params.construction = { orderId }。
 *  queryAcceptance 回填（基本信息 + 22 项评分 + 描述）；施工人员按节点分组展示；
 *  保存 updateAcceptance（评分值经 layui rate 收集）。 */
app.ready(function () {
layui.use(['rate', 'laydate', 'layer', 'jquery'], function () {
    var rate = layui.rate, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.construction || {};
    var options = {};

    // 22 项评分字段（与旧 ratyIds 一致）
    var ratyIds = ['waterwayQuality', 'waterwayServer', 'waterwayHygiene', 'circuitQuality', 'circuitServer', 'circuitHygiene',
        'bricklayQuality', 'bricklayServer', 'bricklayHygiene', 'carpentQuality', 'carpentServer', 'carpentHygiene',
        'oilQuality', 'oilServer', 'oilHygiene', 'supervisQuality', 'supervisServer', 'supervisHygiene',
        'materialQuality', 'materialServer', 'multiple', 'internal'];
    var desIds = ['waterwayDes', 'circuitDes', 'bricklayDes', 'carpentDes', 'oilDes', 'supervisDes', 'materialDes', 'question', 'propose', 'acceptanceTime'];
    var baseInfos = ['orderId', 'customer', 'orderAddr', 'designer', 'supervisName', 'contractCode', 'waterwayWorkerName', 'circuitWorkerName', 'bricklayWorkerName', 'carpentWorkerName', 'oilWorkerName'];
    var ratyValues = {}; // 当前评分值

    $('#orderIdLabel').text(ctx.orderId || '-');
    laydate.render({ elem: '#acceptanceTime', format: 'yyyy-MM-dd' });

    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    // —— 评分控件渲染（旧 raty → layui rate，1-5 星）——
    function renderRates(acceptanceInfo) {
        for (var i = 1; i <= ratyIds.length; i++) {
            (function (idx, field) {
                ratyValues[field] = acceptanceInfo[field] != null ? parseInt(acceptanceInfo[field], 10) : 0;
                rate.render({
                    elem: '#raty' + idx,
                    value: ratyValues[field],
                    length: 5,
                    theme: '#FFB800',
                    text: false,
                    choose: function (value) { ratyValues[field] = value; }
                });
            })(i, ratyIds[i - 1]);
        }
    }

    // —— 加载验收信息 ——
    app.post(api.construction.queryAcceptance, { 'acceptance.orderId': ctx.orderId }, function (res) {
        var info = res.acceptance || {};
        options['acceptance.actId'] = info.actId;

        $.each(baseInfos, function (i, name) { $('#' + name).val(info[name] != null ? info[name] : ''); });
        renderRates(info);
        $.each(desIds, function (i, id) {
            if (id === 'acceptanceTime') { $('#' + id).val(info[id] ? info[id].substring(0, 10) : ''); return; }
            $('#' + id).val(info[id] || '');
        });
    });

    // —— 施工人员（按施工节点分组）——
    var scheNames = {};
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': ctx.orderId }, function (res) {
        $.each(res.constructionSchedules || [], function (i, v) {
            scheNames[v.schedule] = v.node ? v.node.name : v.schedule;
            $('<div class="accept-worker-group"><h5 style="margin:8px 0 4px;color:#666;">' + scheNames[v.schedule] + '<\/h5><div id="sche' + v.schedule + '"><\/div><\/div>').appendTo($('#constructerDiv'));
        });
    }, null, false);

    app.post(api.construction.queryConstructerByOrderId, { 'constructer.orderId': ctx.orderId }, function (res) {
        var constructers = res.constructers || [];
        if (!constructers.length) {
            $('#constructerDiv').html('<div class="layui-elem-quote layui-quote-nm">当前订单没有分配工人!<\/div>');
            return;
        }
        $.each(constructers, function (i, c) {
            var u = c.user || {};
            var $box = $('#sche' + c.schedule);
            if (!$box.length) $box = $('#constructerDiv');
            var $item = $('<div class="worker-item"><\/div>').appendTo($box);
            if (u.userPhoto) {
                var $img = $('<img>').appendTo($item);
                app.showImg($img, u.userPhoto, 50, 50, '');
            }
            $item.append('<span>' + (u.userName || '') + '<\/span> <span style="color:#999;">' + (u.duty ? u.duty.name : '') + '<\/span>');
        });
    }, null, false);

    // —— 保存 ——
    $('#saveBtn').on('click', function () {
        if (!$('#acceptanceTime').val()) { app.showAlert(app.warning, '请填写验收日期'); return; }
        for (var i = 0; i < ratyIds.length; i++) {
            options['acceptance.' + ratyIds[i]] = ratyValues[ratyIds[i]] != null ? ratyValues[ratyIds[i]] : 0;
        }
        $.each(desIds, function (i, id) {
            options['acceptance.' + id] = $('#' + id).val() || '';
        });
        options['acceptance.orderId'] = ctx.orderId;

        app.post(api.construction.updateAcceptance, options, function () {
            app.showAlert(app.success, '提交成功!');
        });
    });

    $('#backBtn').on('click', function () {
        if (window.parent && window.parent.layui) {
            try { parent.layer.closeAll(); return; } catch (e) {}
        }
        app.switchPage(api.index.acceptanceIndex.url);
    });
});
}); // end app.ready
