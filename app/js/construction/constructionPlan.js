/** app/js/construction/constructionPlan.js —— 施工计划（订单维度：生成/添加/编辑/排序/删除）
 *  上下文：app.params.construction = { decoration: {...}, drawlineTime }。
 *  列含推算时间（工程开始/结束、主材开始/结束，基于 drawlineTime 累加）。
 *  节点下拉来自 constructionPace/constructionPaceNode（添加时选 pace 节点）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var pageConfig = constructionCommon.getPageConfig('constructionPlan');
    var construction = app.params.construction || {};
    var state = { cpid: null, startTime: null, endTime: null, comStartTime: null, prenum: 0, postnum: 0, pace: { cpid: 0 } };

    var orderId = construction.decoration ? construction.decoration.orderId : construction.orderId;
    $('#orderIdLabel').text(orderId || '-');
    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    function resetTimes() {
        state.startTime = new Date(construction.drawlineTime);
        state.endTime = new Date(construction.drawlineTime);
        state.comStartTime = new Date(construction.drawlineTime);
        state.prenum = 0;
        state.postnum = 0;
    }
    resetTimes();

    // 添加节点下拉（constructionPace → constructionPaceNode）
    app.post(api.data.queryConstructionPace, { 'constructionPace.lowerArea': construction.decoration && construction.decoration.house ? construction.decoration.house.innerArea : '' }, function (res) {
        if (res.constructionPace && res.constructionPace.cpid) state.pace = res.constructionPace;
        app.post(api.data.queryConstructionPaceNode, { 'constructionPaceNode.cpid': state.pace.cpid }, function (r) {
            var html = '';
            $.each(r.constructionPaceNodes || [], function (i, n) { html += '<option value="' + n.cpnid + '">' + (n.name || '') + '<\/option>'; });
            $('#name').html(html);
            form.render('select');
        });
    }, null, false);

    function fmt(d) { return app.dateFormat(d, 'yyyy-MM-dd'); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'orderId', title: '装修单', width: 100 },
            { field: 'nodeName', title: '工程节点', width: 110, templet: function (d) { return d.node ? d.node.name : ''; } },
            { field: 'phase', title: '施工节点', width: 100 },
            { field: 'connum', title: '工程天数', width: 90 },
            { field: 'prenum', title: '前置间隔', width: 90 },
            { field: 'postnum', title: '后置间隔', width: 90 },
            { field: 'comnum', title: '主材天数', width: 90 },
            { field: 'period', title: '进场周期', width: 90 },
            { field: 'material', title: '配套主材', width: 120 },
            { field: 'conStartTime', title: '工程开始时间', width: 110, templet: function (d) {
                state.startTime.setDate(state.startTime.getDate() + d.prenum + state.postnum);
                state.prenum = d.prenum;
                return fmt(state.startTime);
            } },
            { field: 'conEndTime', title: '工程结束时间', width: 110, templet: function (d) {
                state.startTime.setDate(state.startTime.getDate() + d.connum);
                state.postnum = d.postnum;
                state.endTime = new Date(state.startTime);
                return fmt(state.startTime);
            } },
            { field: 'comStartTime', title: '主材开始时间', width: 110, templet: function (d) {
                state.comStartTime = new Date(state.startTime);
                state.comStartTime.setDate(state.startTime.getDate());
                return fmt(state.comStartTime);
            } },
            { field: 'comEndTime', title: '主材结束时间', width: 110, templet: function (d) {
                var t = new Date(state.comStartTime);
                t.setDate(state.startTime.getDate() + d.comnum);
                return fmt(t);
            } },
            { field: 'createTime', title: '创建时间', width: 150 },
            { field: 'content', title: '注释', width: 130 },
            { field: 'comment', title: '说明', minWidth: 130 },
            { title: '操作', width: 260, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') {
            state.cpid = v.cpid;
            $('#comnum').val(v.comnum);
            $('#connum').val(v.connum);
            $('#prenum').val(v.prenum);
            $('#postnum').val(v.postnum);
            $('#content').val(v.content);
            $('#editcomment').val(v.comment);
            layer.open({ type: 1, title: '编辑施工计划', content: $('#editConstructionPlanBox'), area: ['520px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    app.post(api.construction.updateConstructionPlan, {
                        'constructionPlan.cpid': state.cpid,
                        'constructionPlan.comnum': $('#comnum').val(),
                        'constructionPlan.connum': $('#connum').val(),
                        'constructionPlan.prenum': $('#prenum').val(),
                        'constructionPlan.postnum': $('#postnum').val(),
                        'constructionPlan.content': $('#content').val(),
                        'constructionPlan.comment': $('#editcomment').val()
                    }, function () {
                        app.showAlert(app.success, '操作成功');
                        resetTimes();
                        layer.close(idx); query();
                    });
                } });
        } else if (obj.event === 'up' || obj.event === 'down') {
            app.post(api.construction.moveConstructionPlan, {
                'constructionPlan.cpid': v.cpid,
                'constructionPlan.sort': obj.event === 'up' ? v.sort - 1 : v.sort + 1
            }, function () {
                resetTimes();
                query();
            });
        } else if (obj.event === 'del') {
            app.post(api.construction.deleteConstructionPlan, { 'constructionPlan.cpid': v.cpid }, function () {
                app.showAlert(app.success, '删除成功');
                resetTimes();
                query();
            });
        }
    });

    // 生成
    $('#makeBtn').on('click', function () {
        app.post(api.construction.makeConstructionPlan, { 'constructionPlan.orderId': orderId }, function () {
            app.showAlert(app.success, '操作成功');
            resetTimes();
            query();
        });
    });

    // 添加
    $('#constructionPlanBtn').on('click', function () {
        layer.open({ type: 1, title: '添加施工计划', content: $('#constructionPlanBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.construction.addConstructionPlan, {
                    'constructionPlan.cpid': $('#name').val(),
                    'constructionPlan.orderId': orderId,
                    'constructionPlan.connumStartTime': construction.drawlineTime,
                    'constructionPlan.comment': $('#comment').val()
                }, function () {
                    app.showAlert(app.success, '操作成功');
                    resetTimes();
                    layer.close(idx); query();
                });
            } });
    });

    // 打印
    $('#printBtn').on('click', function () {
        app.params.construction = construction;
        app.popup(api.index.constructionPlan2print.url, '工程施工进度计划表', null, { area: ['85%', '90%'] });
    });

    function query() {
        app.post(api.construction.queryConstructionPlanByOrderId, { 'constructionPlan.orderId': orderId }, function (res) {
            resetTimes();
            table.reload('resultTable', { data: res.constructionPlans || [] });
        });
    }
    query();
});
}); // end app.ready
