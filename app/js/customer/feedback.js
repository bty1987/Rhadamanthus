/** app/js/customer/feedback.js —— 客户反馈（旧 feedback.js → layui）
 *  列表：pageFeedback（装修单号/电话/类型/状态/创建时间范围等检索）。
 *  添加：addFeedback；行操作：图片（queryFeedbackDrawing 画廊）；记录（弹 feedbackRecord vid=fid）；
 *  接收 receiveFeedback；完成 finishFeedback；投诉/维修/回访（带 handoff 打开对应页）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var state = { page: 1, rows: 10, total: 0, editIndex: null, drawingIndex: null };

    customerCommon.dateRange('#createTime');

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'picture', title: '图片', width: 90, templet: function (d) {
                if (!d.picture) return '';
                return '<img src="' + (app.config.media || '') + d.picture + '" width="40" height="40" style="object-fit:cover;border-radius:2px;">';
            } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.feedbackSourceType[d.type] != null ? E.feedbackSourceType[d.type] : ''; } },
            { field: 'orderId', title: '装修单号', width: 120 },
            { field: 'phone', title: '电话', width: 120 },
            { field: 'company', title: '公司', width: 90 },
            { field: 'content', title: '说明', minWidth: 180 },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'receiver', title: '接收人', width: 90, templet: function (d) { return d.receiver ? (d.receiver.userName || '') : ''; } },
            { field: 'receiveTime', title: '接收时间', width: 165 },
            { field: 'handler', title: '处理人', width: 90, templet: function (d) { return d.handler ? (d.handler.userName || '') : ''; } },
            { field: 'handleTime', title: '处理时间', width: 165 },
            { field: 'finisher', title: '完成人', width: 90, templet: function (d) { return d.finisher ? (d.finisher.userName || '') : ''; } },
            { field: 'finishTime', title: '完成时间', width: 165 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.feedbackStatus, d.status); } },
            { title: '操作', width: 330, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'drawing') {
            manageDrawing(v.fid);
        } else if (obj.event === 'record') {
            app.params.customer = $.extend({}, app.params.customer, { vid: v.fid });
            app.popup(api.index.feedRecordIndex.url, '记录');
        } else if (obj.event === 'receive') {
            app.showConfirm('确认要接收吗?', function () {
                app.post(api.customer.receiveFeedback, { 'feedback.fid': v.fid }, function () {
                    app.showAlert(app.success, '接收成功');
                    query(state.page);
                });
            });
        } else if (obj.event === 'done') {
            app.showConfirm('确认要完成吗?', function () {
                app.post(api.customer.finishFeedback, { 'feedback.fid': v.fid }, function () {
                    app.showAlert(app.success, '完成成功');
                    query(state.page);
                });
            });
        } else if (obj.event === 'complaint') {
            handoff(v, api.index.feedComplaintIndex.url, '反馈投诉');
        } else if (obj.event === 'guarantee') {
            handoff(v, api.index.feedbackGuaranteeIndex.url, '反馈维修');
        } else if (obj.event === 'backVisit') {
            app.params.fid = v.fid;
            app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
            app.params.historyPage = api.index.feedbackIndex.url;
            app.popup(api.index.feedBackVisitIndex.url, '反馈回访', null, { area: ['90%', '90%'] });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="drawing">图片</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="record">记录</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="receive">接收</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="done">完成</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="complaint">投诉</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="guarantee">维修</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="backVisit">回访</button>'
            + '<\/script>'
        );
    }

    // 转投诉/转维修 handoff（旧 switchPage → iframe 下用弹窗承载）
    function handoff(v, url, title) {
        app.params.fid = v.fid;
        app.params.customer = $.extend({}, app.params.customer, { vid: v.fid });
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId });
        app.params.historyPage = api.index.feedbackIndex.url;
        app.popup(url, title, null, { area: ['90%', '90%'] });
    }

    // —— 图片画廊 ——
    function manageDrawing(fid) {
        $('#feedbackDrawing').empty();
        state.drawingIndex = layer.open({ type: 1, title: '反馈图片', content: $('#drawingBox'), area: ['640px', 'auto'] });
        app.post(api.customer.queryFeedbackDrawing, { 'feedback.fid': fid }, function (res) {
            $.each(res.feedbackDrawings || [], function (i, drawing) {
                var $li = $('<li style="display:inline-block;margin:8px;position:relative;"></li>').appendTo('#feedbackDrawing');
                var src = /^[a-z]+:\/\//.test(drawing.path || '') ? drawing.path : (app.config.media || '') + (drawing.path || '');
                $li.append('<a href="' + src + '" target="_blank"><img src="' + src + '" width="180" height="180" style="object-fit:cover;"><\/a>');
                $li.append('<div style="text-align:center;font-size:12px;">' + (drawing.name || '') + ' ' + (drawing.createTime || '') + '<\/div>');
            });
        }, null, false);
    }

    function query(pg) {
        state.page = pg || 1;
        app.post(api.customer.pageFeedback, $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'paging.page': state.page,
            'paging.rows': state.rows
        }), function (res) {
            var p = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }
    query(1);

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加反馈', content: $('#editBox'), area: ['520px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        app.post(api.customer.addFeedback, {
            'feedback.orderId': $('#editForm [name="orderId"]').val(),
            'feedback.phone': $('#editForm [name="phone"]').val(),
            'feedback.feedbackType': $('#editForm [name="feedbackType"]').val(),
            'feedback.content': $('#editForm [name="content"]').val()
        }, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query(state.page);
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
});
}); // end app.ready
