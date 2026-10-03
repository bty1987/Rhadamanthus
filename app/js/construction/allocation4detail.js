/** app/js/construction/allocation4detail.js —— 工人分配详情（旧 ace_wizard → layui tab，状态机完整版）
 *  上下文：app.params.construction = { orderId }。每节点 tab：
 *  开工/完工按钮（begin/finish）+ 验证/通过（checkout 0/1）+ 进场/离场（enter/leave）+ 工人分配
 *  （addConstructer/deleteConstructer，工人选择用下拉搜索替代旧 typeahead）。 */
app.ready(function () {
layui.use(['element', 'form', 'layer', 'jquery'], function () {
    var element = layui.element, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.construction || {};
    var schedules = [];
    var workerOptions = null; // 工人下拉选项（懒加载一次）

    $('#orderIdLabel').text(ctx.orderId || '-');
    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    function loadWorkerOptions(cb) {
        if (workerOptions) { cb(workerOptions); return; }
        app.post(api.personel.queryUserByPinyin, { 'departmentType.name': '工程部', 'user.status': 0 }, function (res) {
            var html = '<option value="">请输入工人名称</option>';
            $.each(res.autoFillKeyValue || [], function (i, u) { html += '<option value="' + u.key + '">' + u.value + '<\/option>'; });
            workerOptions = html;
            cb(html);
        }, null, false);
    }

    // —— 构建 tab ——
    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': ctx.orderId }, function (res) {
        var list = (res.constructionSchedules || []).sort(function (a, b) {
            return ((a.node ? a.node.sort : a.schedule) || 0) - ((b.node ? b.node.sort : b.schedule) || 0);
        });
        if (!list.length) { app.showAlert(app.warning, '无施工节点'); return; }
        schedules = list;

        var titles = '', contents = '';
        $.each(list, function (i, v) {
            var sort = v.node ? v.node.sort : v.schedule;
            v._sort = sort;
            var layId = 'node_' + sort;
            titles += '<li' + (i === 0 ? ' class="layui-this"' : '') + ' lay-id="' + layId + '" data-schedule="' + sort + '">' + (v.node ? v.node.name : sort) + '<\/li>';
            contents += '<div class="layui-tab-item' + (i === 0 ? ' layui-show' : '') + '" id="' + layId + '">' + buildPane(sort, v.node ? v.node.name : '') + '<\/div>';
        });
        $('#tabTitles').html(titles);
        $('#tabContent').html(contents);
        element.render('tab');
        loadPane(list[0]._sort);
    });

    element.on('tab(nodeTab)', function (data) {
        var v = schedules[data.index];
        if (v) loadPane(v._sort);
    });

    function buildPane(sort, name) {
        return ''
            + '<h3 style="font-size:15px;margin:10px 0;">' + name + '信息<\/h3>'
            + '<div class="al-info-row"><label>开工时间<\/label><input class="layui-input" id="' + sort + 'StartTime" readonly><label style="margin-left:20px;">完工时间<\/label><input class="layui-input" id="' + sort + 'EndTime" readonly><\/div>'
            + '<div class="al-info-row"><label>进场时间<\/label><input class="layui-input" id="' + sort + 'EnterTime" readonly><label style="margin-left:20px;">出场时间<\/label><input class="layui-input" id="' + sort + 'LeaveTime" readonly><\/div>'
            + '<div class="al-info-row"><label>' + name + '状态<\/label><span id="' + sort + 'Status"><\/span>'
            + '<label style="margin-left:20px;">款项验证<\/label><span id="' + sort + 'paymentStatus"><\/span>'
            + '<label style="margin-left:20px;">进场状态<\/label><span id="' + sort + 'enterStatus"><\/span><\/div>'
            + '<div style="margin:12px 0;">'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal" id="' + sort + 'Success">开工<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-warm" id="' + sort + 'Salary">开放工费<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs" id="' + sort + 'Fail">完工<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-warm" id="' + sort + 'Valid">验证<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" id="' + sort + 'Pass">通过<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-normal" id="' + sort + 'Enter">进场<\/button>'
            + '<button type="button" class="layui-btn layui-btn-xs" id="' + sort + 'Leave">离场<\/button>'
            + '<\/div>'
            + '<h3 style="font-size:15px;margin:14px 0 6px;">工人信息<\/h3>'
            + '<div class="layui-form-item"><label class="layui-form-label">工人姓名<\/label>'
            + '<div class="layui-input-inline" style="width:240px;"><select id="' + sort + 'WorkerName" lay-search=""><option value="">请输入工人名称</option><\/select><\/div>'
            + '<button type="button" class="layui-btn layui-btn-sm" id="' + sort + 'WorkerSubmit">确认<\/button><\/div>'
            + '<div id="' + sort + 'WorkerInfos" style="overflow:hidden;min-height:50px;"><\/div>';
    }

    function loadPane(schedule) {
        var args = { 'constructionSchedule.orderId': ctx.orderId, 'constructionSchedule.schedule': schedule };
        app.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function (res) {
            var cs = res.constructionSchedule || {};

            $('#' + schedule + 'StartTime').val(cs.startTime || '');
            $('#' + schedule + 'EndTime').val(cs.endTime || '');
            $('#' + schedule + 'EnterTime').val(cs.enterTime || '');
            $('#' + schedule + 'LeaveTime').val(cs.leaveTime || '');
            $('#' + schedule + 'Status').html(constructionCommon.stateBadge(cs.status, ['初始', '开工', '完工', '工费']));
            $('#' + schedule + 'paymentStatus').html(constructionCommon.stateBadge(cs.checkout, ['验证', '通过']));
            $('#' + schedule + 'enterStatus').html(constructionCommon.stateBadge(cs.workStatus, ['初始', '进场', '离场']));

            bindFlow('#' + schedule + 'Success', api.construction.beginConstructionSchedule, function () {
                $('#' + schedule + 'Status').html(constructionCommon.stateBadge(1, ['初始', '开工', '完工', '工费']));
            }, cs, null);
            // 开放工费:开工后、完工前允许创建工费单(状态置3工费)
            bindFlow('#' + schedule + 'Salary', api.construction.updateConstructionScheduleForSalary, function () {
                $('#' + schedule + 'Status').html(constructionCommon.stateBadge(3, ['初始', '开工', '完工', '工费']));
            }, cs, null);
            bindFlow('#' + schedule + 'Fail', api.construction.finishConstructionSchedule, function () {
                $('#' + schedule + 'Status').html(constructionCommon.stateBadge(2, ['初始', '开工', '完工', '工费']));
            }, cs, null);
            bindFlow('#' + schedule + 'Valid', api.construction.checkoutConstructionSchedule, function () {
                $('#' + schedule + 'paymentStatus').html(constructionCommon.stateBadge(0, ['验证', '通过']));
            }, cs, 0);
            bindFlow('#' + schedule + 'Pass', api.construction.checkoutConstructionSchedule, function () {
                $('#' + schedule + 'paymentStatus').html(constructionCommon.stateBadge(1, ['验证', '通过']));
            }, cs, 1);
            bindFlow('#' + schedule + 'Enter', api.construction.enterConstructionSchedule, function () {
                $('#' + schedule + 'enterStatus').html(constructionCommon.stateBadge(1, ['初始', '进场', '离场']));
                app.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function (r) {
                    $('#' + schedule + 'EnterTime').val((r.constructionSchedule || {}).enterTime || '');
                });
            }, cs, null);
            bindFlow('#' + schedule + 'Leave', api.construction.leaveConstructionSchedule, function () {
                $('#' + schedule + 'enterStatus').html(constructionCommon.stateBadge(2, ['初始', '进场', '离场']));
                app.post(api.construction.queryConstructionScheduleByOrderIdASchedule, args, function (r) {
                    $('#' + schedule + 'LeaveTime').val((r.constructionSchedule || {}).leaveTime || '');
                });
            }, cs, null);

            // 查询工人
            app.post(api.construction.queryConstructerByOrderId, {
                'constructer.orderId': ctx.orderId,
                'constructer.csid': cs.csid,
                'constructer.cnid': cs.cnid
            }, function (r) { renderWorkers(schedule, r.constructers || []); }, null, false);

            // 工人下拉 + 添加
            loadWorkerOptions(function (html) {
                var $sel = $('#' + schedule + 'WorkerName');
                if ($sel.children().length <= 1) { $sel.html(html); form.render('select'); }
            });
            $('#' + schedule + 'WorkerSubmit').off('click').on('click', function () {
                var userId = $('#' + schedule + 'WorkerName').val();
                if (!userId) { app.showAlert(app.error, '工人名称不能为空'); return; }
                app.post(api.construction.addConstructer, {
                    'constructer.cid': cs.cid,
                    'constructer.csid': cs.csid,
                    'constructer.cnid': cs.cnid,
                    'constructer.user.userId': userId
                }, function (r) {
                    appendWorker(schedule, r.constructer);
                    app.showAlert(app.info, '工人信息提交成功!');
                });
            });
        });
    }

    function bindFlow(selector, apiName, after, cs, checkout) {
        $(selector).off('click').on('click', function () {
            var options = { 'constructionSchedule.csid': cs.csid };
            if (checkout != null) options['constructionSchedule.checkout'] = checkout;
            app.post(apiName, options, function () {
                app.showAlert(app.success, '操作成功');
                if (after) after();
            });
        });
    }

    function renderWorkers(schedule, constructers) {
        var $box = $('#' + schedule + 'WorkerInfos');
        $box.html('');
        if (!constructers.length) {
            $box.html('<div class="layui-elem-quote layui-quote-nm">当前进度没有分配工人!<\/div>');
            return;
        }
        $.each(constructers, function (i, w) { appendWorker(schedule, w); });
    }

    function appendWorker(schedule, worker) {
        var u = worker.user || {};
        var $box = $('#' + schedule + 'WorkerInfos');
        if ($box.children('.al-worker').length == 0) $box.html('');
        var $item = $('<div class="al-worker" id="worker' + worker.crid + '"><span class="al-del" title="移除">✕<\/span><img id="wimg' + worker.crid + '" style="display:none;"><div style="margin-top:4px;font-weight:bold;">' + (u.userName || u.currentName || '') + '<\/div><div style="color:#999;">' + (u.duty ? u.duty.name : (worker.dutyName || '')) + '<\/div><\/div>').appendTo($box);
        if (u.userPhoto) app.showImg($item.find('img'), u.userPhoto, 70, 70, '');
        $item.find('.al-del').on('click', function () {
            app.post(api.construction.deleteConstructer, { 'constructer.crid': worker.crid }, function () {
                $item.remove();
            });
        });
    }

    $('#btnBack').on('click', function () {
        if (window.parent && window.parent.layui) {
            try { parent.layer.closeAll(); return; } catch (e) {}
        }
        app.switchPage(app.params.historyPage || api.index.workerAllocationIndex.url);
    });
});
}); // end app.ready
