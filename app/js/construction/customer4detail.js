/** app/js/construction/customer4detail.js —— 客户评分详情（旧 ace_wizard → layui tab）
 *  上下文：app.params.construction = { orderId }。
 *  每节点 tab：queryConstructerByOrderId → 工人卡片（头像/姓名 + 工地卫生/质量标准/沟通服务 三组
 *  layui rate（旧 raty 10 星 → 5 星）+ 评语）。按钮：评分(rateConstructer)/推送(sendConstructer)；
 *  整体保存 updateConstructerForRate（批量 constructers[i].rate/rate1/rate2/assessment）。 */
app.ready(function () {
layui.use(['element', 'rate', 'layer', 'jquery'], function () {
    var element = layui.element, rate = layui.rate, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.construction || {};
    var schedules = [];
    var rateInstances = {}; // key: field-crid → value

    $('#orderIdLabel').text(ctx.orderId || '-');
    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    function rateVal(field, crid) { return rateInstances[field + '-' + crid] != null ? rateInstances[field + '-' + crid] : 0; }

    function renderRate(elemId, field, crid, value) {
        value = value != null ? parseInt(value, 10) : 0;
        rateInstances[field + '-' + crid] = value;
        rate.render({
            elem: '#' + elemId,
            value: value,
            length: 5,
            theme: '#FFB800',
            text: false,
            choose: function (v) { rateInstances[field + '-' + crid] = v; }
        });
    }

    // —— 初始化 tab ——
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': ctx.orderId }, function (res) {
        var list = (res.constructionSchedules || []).sort(function (a, b) { return (a.schedule || 0) - (b.schedule || 0); });
        if (!list.length) { app.showAlert(app.warning, '无施工节点'); return; }
        schedules = list;

        var titles = '', contents = '';
        $.each(list, function (i, v) {
            var layId = 'sche_' + v.schedule;
            v._layId = layId;
            titles += '<li' + (i === 0 ? ' class="layui-this"' : '') + ' lay-id="' + layId + '" data-schedule="' + v.schedule + '">' + (v.node ? v.node.name : v.schedule) + '<\/li>';
            contents += '<div class="layui-tab-item' + (i === 0 ? ' layui-show' : '') + '" id="' + layId + '">'
                + '<h3 style="font-size:15px;margin:10px 0;">' + (v.node ? v.node.name : '') + '工人信息<\/h3>'
                + '<div id="s' + v.schedule + 'WorkerInfos"><\/div>'
                + '<\/div>';
        });
        $('#tabTitles').html(titles);
        $('#tabContent').html(contents);
        element.render('tab');
        loadPane(list[0]);
    });

    element.on('tab(nodeTab)', function (data) {
        var v = schedules[data.index];
        if (v) loadPane(v);
    });

    function loadPane(v) {
        var schedule = v.schedule;
        app.post(api.construction.queryConstructerByOrderId, {
            'constructer.orderId': ctx.orderId,
            'constructer.schedule': schedule,
            'constructer.csid': v.csid
        }, function (res) {
            var constructers = res.constructers || [];
            var $box = $('#s' + schedule + 'WorkerInfos');
            $box.html('');
            if (!constructers.length) {
                $box.html('<div class="layui-elem-quote layui-quote-nm">当前进度没有分配工人!<\/div>');
                return;
            }
            $.each(constructers, function (i, w) {
                var u = w.user || {};
                var card = '<div class="cw-worker" data-crid="' + w.crid + '">'
                    + '<div class="cw-photo"><img id="cwimg' + w.crid + '" style="display:none;"><div style="margin-top:4px;font-weight:bold;">' + (u.currentName || u.userName || '') + '<\/div><\/div>'
                    + '<div class="cw-form">'
                    + '<div class="cw-item"><label>工地卫生<\/label><div style="display:inline-block;" id="raty-' + w.crid + '"><\/div><\/div>'
                    + '<div class="cw-item"><label>质量标准<\/label><div style="display:inline-block;" id="raty1-' + w.crid + '"><\/div><\/div>'
                    + '<div class="cw-item"><label>沟通服务<\/label><div style="display:inline-block;" id="raty2-' + w.crid + '"><\/div><\/div>'
                    + '<div class="cw-item"><label>评语<\/label><textarea id="assessment' + w.crid + '" class="layui-textarea" style="width:60%;display:inline-block;">' + (w.assessment || '') + '<\/textarea><\/div>'
                    + '<div class="cw-item"><button type="button" class="layui-btn layui-btn-xs layui-btn-normal" data-rate="' + w.crid + '">评分<\/button>'
                    + '<button type="button" class="layui-btn layui-btn-xs" data-send="' + w.crid + '">推送<\/button><\/div>'
                    + '<\/div><\/div>';
                $box.append(card);
                if (u.userPhoto) app.showImg($('#cwimg' + w.crid), u.userPhoto, 90, 90, '');
                renderRate('raty-' + w.crid, 'rate', w.crid, w.rate);
                renderRate('raty1-' + w.crid, 'rate1', w.crid, w.rate1);
                renderRate('raty2-' + w.crid, 'rate2', w.crid, w.rate2);
            });

            // 评分（单工人）
            $box.find('button[data-rate]').off('click').on('click', function () {
                var crid = $(this).attr('data-rate');
                app.post(api.construction.rateConstructer, {
                    'constructer.crid': crid,
                    'constructer.rate': rateVal('rate', crid),
                    'constructer.rate1': rateVal('rate1', crid),
                    'constructer.rate2': rateVal('rate2', crid),
                    'constructer.assessment': $('#assessment' + crid).val()
                }, function () { app.showAlert(app.success, '评分成功'); });
            });
            // 推送（单工人）
            $box.find('button[data-send]').off('click').on('click', function () {
                app.post(api.construction.sendConstructer, { 'constructer.crid': $(this).attr('data-send') }, function () {
                    app.showAlert(app.success, '推送成功');
                });
            });
        });
    }

    // —— 整体保存 ——
    $('#btnSave').on('click', function () {
        var $workers = $('.cw-worker');
        if (!$workers.length) { app.showAlert(app.warning, '无可保存的工人评分'); return; }
        var options = {};
        $.each($workers, function (i, el) {
            var crid = $(el).attr('data-crid');
            options['constructers[' + i + '].crid'] = crid;
            options['constructers[' + i + '].rate'] = rateVal('rate', crid);
            options['constructers[' + i + '].rate1'] = rateVal('rate1', crid);
            options['constructers[' + i + '].rate2'] = rateVal('rate2', crid);
            options['constructers[' + i + '].assessment'] = $('#assessment' + crid).val();
        });
        app.post(api.construction.updateConstructerForRate, options, function () {
            app.showAlert(app.success, '操作成功');
        });
    });

    $('#btnBack').on('click', function () {
        if (window.parent && window.parent.layui) {
            try { parent.layer.closeAll(); return; } catch (e) {}
        }
        app.switchPage(api.index.customerServiceIndex.url);
    });
});
}); // end app.ready
