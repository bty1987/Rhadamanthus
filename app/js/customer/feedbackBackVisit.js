/** app/js/customer/feedbackBackVisit.js —— 反馈回访（旧 feedbackBackVisit.js → layui）
 *  上下文：app.params.fid + app.params.decoration.orderId。
 *  回访列表：queryFeedbackBackVisit（fid）；添加：addFeedbackBackVisit（满意度/结果/开头语等问卷字段）
 *  + 可选图片 addFeedbackDrawing(type=3)；反馈记录：queryFeedbackRecord；图片画廊 queryFeedbackDrawingBySid。 */
app.ready(function () {
layui.use(['table', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var fid = customerCommon.ctx('fid') || customerCommon.ctx('customer').vid;
    var orderId = customerCommon.ctx('decoration').orderId;
    var state = { editIndex: null, drawingIndex: null, fbid: null, resUrl: null, praiserId: null };

    if (fid == null || fid === '') { app.showAlert(app.warning, '缺少反馈上下文'); return; }

    laydate.render({ elem: '#praiseTime', type: 'date' });
    laydate.render({ elem: '#finishTime', type: 'date' });

    if (orderId) {
        app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': orderId }, function (res) {
            var d = res.decoration;
            if (d) {
                $('#btnBack').after('<span style="margin-left:12px;">装修单号：<b>' + (d.orderId || '') + '<\/b> 客户：<b>'
                    + (d.customer ? d.customer.name : '') + '<\/b><\/span>');
            }
        });
    }

    // —— 回访列表 ——
    table.render({
        elem: '#backVisitTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'fid', title: '反馈ID', width: 90 },
            { field: 'pleased', title: '维修满意度', width: 100, templet: function (d) { return E.backVisitPleased[d.pleased] != null ? E.backVisitPleased[d.pleased] : ''; } },
            { field: 'result', title: '维修结果', width: 100, templet: function (d) { return E.backVisitResult[d.result] != null ? E.backVisitResult[d.result] : ''; } },
            { field: 'praiser', title: '受表扬工人', width: 100, templet: function (d) { return d.praiser ? (d.praiser.userName || '') : ''; } },
            { field: 'praiseType', title: '表扬形式', width: 100, templet: function (d) { return E.backVisitPraiseType[d.praiseType] != null ? E.backVisitPraiseType[d.praiseType] : ''; } },
            { field: 'praiseTime', title: '表扬日期', width: 110 },
            { field: 'finishTime', title: '整体完工日期', width: 110 },
            { field: 'workDays', title: '维修周期', width: 90 },
            { field: 'complaint', title: '回访内容', minWidth: 150 },
            { field: 'praise', title: '表扬内容', minWidth: 130 },
            { field: 'openWords', title: '开头语', width: 120, templet: function (d) { return E.backVisitOpenWords[d.openWords] != null ? E.backVisitOpenWords[d.openWords] : ''; } },
            { field: 'contactSoonFlag', title: '24h联系', width: 100, templet: function (d) { return E.backVisitContactSoonFlag[d.contactSoonFlag] != null ? E.backVisitContactSoonFlag[d.contactSoonFlag] : ''; } },
            { field: 'refuseComment', title: '拒绝评价原因', minWidth: 130 },
            { field: 'perforFlag', title: '师傅按时上门', width: 110, templet: function (d) { return E.backVisitPerforFlag[d.perforFlag] != null ? E.backVisitPerforFlag[d.perforFlag] : ''; } },
            { field: 'resultFlag', title: '报修解决', width: 90, templet: function (d) { return E.backVisitResultFlag[d.resultFlag] != null ? E.backVisitResultFlag[d.resultFlag] : ''; } },
            { field: 'resultComment', title: '未解决记录', minWidth: 130 },
            { field: 'contactFlag', title: '事后联系', width: 100, templet: function (d) { return E.backVisitContactFlag[d.contactFlag] != null ? E.backVisitContactFlag[d.contactFlag] : ''; } },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#backVisitToolbar' }
        ]]
    });
    table.on('tool(backVisitTable)', function (obj) {
        if (obj.event === 'drawing') {
            state.fbid = obj.data.fbid;
            managedrawing(obj.data);
        }
    });
    if (!$('#backVisitToolbar').length) {
        $('body').append(
            '<script type="text/html" id="backVisitToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="drawing">图片</button>'
            + '<\/script>'
        );
    }

    // —— 反馈记录 ——
    table.render({
        elem: '#recordTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'feedback', title: '装修单号', width: 120, templet: function (d) { return d.feedback ? (d.feedback.orderId || '') : ''; } },
            { field: 'handler', title: '处理人', width: 110, templet: function (d) { return d.handler ? (d.handler.userName || '') : ''; } },
            { field: 'feedback', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.feedbackStatus, d.feedback ? d.feedback.status : null); } },
            { field: 'operateTime', title: '处理时间', width: 165 },
            { field: 'comment', title: '备注', minWidth: 200 }
        ]]
    });

    function queryBackVisits() {
        app.post(api.customer.queryFeedbackBackVisit, { 'feedbackBackVisit.fid': fid }, function (res) {
            table.reload('backVisitTable', { data: res.feedbackBackVisits || [] });
        });
    }
    function queryRecords() {
        app.post(api.customer.queryFeedbackRecord, { 'feedbackRecord.feedback.fid': fid }, function (res) {
            table.reload('recordTable', { data: res.feedbackRecords || [] });
        });
    }
    queryBackVisits();
    queryRecords();

    // —— 添加回访 ——
    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.resUrl = null;
        state.praiserId = null;
        $('#showImg').hide();
        state.editIndex = layer.open({ type: 1, title: '添加回访', content: $('#editBox'), area: ['640px', '90%'] });
    });
    $('#btnPickPraiser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.praiserId = u.userId;
            $('#praiserName').val(u.currentName);
        });
    });
    app.upload({
        elem: '#btnUpload', url: 'uploadOther.do',
        done: function (res) {
            state.resUrl = res.resUrl;
            app.showImg($('#showImg'), res.resUrl, 60, 60);
        }
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var option = {
            'feedbackBackVisit.fid': fid,
            'feedbackBackVisit.praiser.userId': state.praiserId != null ? state.praiserId : '',
            'feedbackBackVisit.result': $('#editForm [name="result"]').val(),
            'feedbackBackVisit.pleased': $('#editForm [name="pleased"]').val(),
            'feedbackBackVisit.praiseType': $('#editForm [name="praiseType"]').val(),
            'feedbackBackVisit.openWords': $('#editForm [name="openWords"]').val(),
            'feedbackBackVisit.contactSoonFlag': $('#editForm [name="contactSoonFlag"]').val(),
            'feedbackBackVisit.perforFlag': $('#editForm [name="perforFlag"]').val(),
            'feedbackBackVisit.resultFlag': $('#editForm [name="resultFlag"]').val(),
            'feedbackBackVisit.contactFlag': $('#editForm [name="contactFlag"]').val(),
            'feedbackBackVisit.workDays': $('#editForm [name="workDays"]').val(),
            'feedbackBackVisit.praiseTime': $('#editForm [name="praiseTime"]').val(),
            'feedbackBackVisit.finishTime': $('#editForm [name="finishTime"]').val(),
            'feedbackBackVisit.complaint': $('#editForm [name="complaint"]').val(),
            'feedbackBackVisit.praise': $('#editForm [name="praise"]').val(),
            'feedbackBackVisit.refuseComment': $('#editForm [name="refuseComment"]').val(),
            'feedbackBackVisit.resultComment': $('#editForm [name="resultComment"]').val()
        };
        app.post(api.customer.addFeedbackBackVisit, option, function (res) {
            var fbid = res.feedbackBackVisit ? res.feedbackBackVisit.fbid : null;
            if (state.resUrl && fbid != null) {
                app.post(api.customer.addFeedbackDrawing, {
                    'feedbackDrawing.fid': fid,
                    'feedbackDrawing.sid': fbid,
                    'feedbackDrawing.path': state.resUrl,
                    'feedbackDrawing.type': 3
                });
            }
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            queryBackVisits();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // —— 图片管理 ——
    function managedrawing(v) {
        $('#feedbackDrawing').empty();
        state.drawingIndex = layer.open({ type: 1, title: '回访图片', content: $('#drawingBox'), area: ['640px', 'auto'] });
        app.post(api.customer.queryFeedbackDrawingBySid, { 'feedbackDrawing.sid': v.fbid }, function (res) {
            $.each(res.feedbackDrawings || [], function (i, d) { appendGallery(d); });
        }, null, false);
    }
    function appendGallery(d) {
        var src = /^[a-z]+:\/\//.test(d.path || '') ? d.path : (app.config.media || '') + (d.path || '');
        var $li = $('<li style="display:inline-block;margin:8px;position:relative;"></li>').attr('id', 'imgLi_' + d.fdid).appendTo('#feedbackDrawing');
        $li.append('<a href="' + src + '" target="_blank"><img src="' + src + '" width="160" height="160" style="object-fit:cover;"><\/a>');
        $li.append('<div style="text-align:center;font-size:12px;">' + (d.name || '') + ' ' + (d.createTime || '') + '<\/div>');
        $li.append('<button type="button" class="layui-btn layui-btn-danger layui-btn-xs" style="position:absolute;top:2px;right:2px;" data-fdid="' + d.fdid + '"><i class="layui-icon layui-icon-delete"><\/i><\/button>');
    }
    app.upload({
        elem: '#btnDrawingUpload', url: 'uploadOther.do',
        done: function (res) {
            app.post(api.customer.addFeedbackDrawing, {
                'feedbackDrawing.fid': fid,
                'feedbackDrawing.sid': state.fbid,
                'feedbackDrawing.path': res.resUrl,
                'feedbackDrawing.type': 3
            }, function (r) {
                appendGallery(r.feedbackDrawing);
            });
        }
    });
    $('#feedbackDrawing').on('click', 'button[data-fdid]', function () {
        var fdid = $(this).data('fdid');
        app.post(api.customer.deleteFeedbackDrawing, { 'feedbackDrawing.fdid': fdid }, function () {
            $('#imgLi_' + fdid).remove();
        });
    });

    $('#btnBack').on('click', function () {
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else app.switchPage(api.index.feedbackIndex.url);
        } catch (e) { app.switchPage(api.index.feedbackIndex.url); }
    });
});
}); // end app.ready
