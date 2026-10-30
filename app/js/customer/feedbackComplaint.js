/** app/js/customer/feedbackComplaint.js —— 反馈投诉（旧 feedbackComplaint.js → layui）
 *  上下文：app.params.customer.vid（feedback.fid）+ app.params.decoration.orderId。
 *  投诉列表：queryFeedbackComplaint（fid）；反馈记录：queryFeedbackRecord（fid）。
 *  添加 addFeedbackComplaint / 编辑 updateFeedbackComplaint；完成 finishFeedbackComplaint；
 *  投诉部门（弹 feedbackComplaintDept，params.customer.{fcid, deptType}）；
 *  图片：queryFeedbackDrawingBySid 画廊 + 上传 addFeedbackDrawing(type=2) + 删除 deleteFeedbackDrawing。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var ctx = customerCommon.ctx('customer');
    var vid = ctx.vid;
    var orderId = customerCommon.ctx('decoration').orderId;
    var state = { editIndex: null, drawingIndex: null, fcid: null, resUrl: null };

    if (vid == null || vid === '') { app.showAlert(app.warning, '缺少反馈上下文'); return; }

    // —— 装修单信息 ——
    if (orderId) {
        app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': orderId }, function (res) {
            var d = res.decoration;
            if (d) {
                $('#btnBack').after('<span style="margin-left:12px;">装修单号：<b>' + (d.orderId || '') + '<\/b> 客户：<b>'
                    + (d.customer ? d.customer.name : '') + '<\/b> 小区：<b>' + (d.village ? d.village.name : '') + (d.houseNumber || '') + '<\/b><\/span>');
            }
        });
    }

    // —— 部门类型多选（checkbox，值为中文名，逗号拼接） ——
    function renderDeptTypeChecks() {
        var html = '';
        $.each(E.complaintDeptType, function (k, v) {
            html += '<label style="margin-right:14px;white-space:nowrap;"><input type="checkbox" name="complaintDeptType" value="' + v + '" title="' + v + '"><\/label>';
        });
        $('#choiceDeptType').html(html);
        form.render('checkbox');
    }
    renderDeptTypeChecks();

    // 信息来源 0平台私聊/9第三方平台 → 显示升级渠道
    form.on('select(sourceFilter)', function (obj) {
        if (obj.value == 0 || obj.value == 9) $('#upgradeSourceGroup').show();
        else { $('#editForm [name="upgradeSource"]').val(0); $('#upgradeSourceGroup').hide(); }
        form.render('select');
    });

    // —— 投诉列表 ——
    table.render({
        elem: '#complaintTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 110 },
            { field: 'source', title: '渠道', width: 110, templet: function (d) { return E.complaintSource[d.source] != null ? E.complaintSource[d.source] : ''; } },
            { field: 'upgradeSource', title: '升级渠道', width: 100, templet: function (d) { return E.guaranteeUpgradeSource[d.upgradeSource] != null ? E.guaranteeUpgradeSource[d.upgradeSource] : ''; } },
            { field: 'phone', title: '电话', width: 115 },
            { field: 'upgrade', title: '是否升级', width: 100, templet: function (d) { return E.complaintUpgrade[d.upgrade] != null ? E.complaintUpgrade[d.upgrade] : ''; } },
            { field: 'urgency', title: '紧急程度', width: 90, templet: function (d) { return E.complaintUrgency[d.urgency] != null ? E.complaintUrgency[d.urgency] : ''; } },
            { field: 'deptType', title: '部门类型', width: 120 },
            { field: 'content', title: '问题总述', minWidth: 160 },
            { field: 'appeal', title: '客户诉求', minWidth: 140 },
            { field: 'results', title: '处理结果', minWidth: 140, templet: function (d) { return E.complaintResults[d.results] != null ? E.complaintResults[d.results] : ''; } },
            { title: '操作', width: 250, fixed: 'right', toolbar: '#complaintToolbar' }
        ]]
    });
    table.on('tool(complaintTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'complaintDept') {
            app.params.customer = $.extend({}, app.params.customer, { fcid: v.fcid, deptType: v.deptType });
            app.popup(api.index.feedbackComplaintDeptIndex.url, '投诉部门');
        } else if (obj.event === 'finish') {
            app.post(api.customer.finishFeedbackComplaint, { 'feedbackComplaint.fcid': v.fcid }, function () {
                app.showAlert(app.success, '完成成功');
                queryComplaints();
            });
        } else if (obj.event === 'drawing') {
            state.fcid = v.fcid;
            managedrawing(v);
        }
    });
    if (!$('#complaintToolbar').length) {
        $('body').append(
            '<script type="text/html" id="complaintToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="edit">编辑</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-danger" lay-event="complaintDept">投诉部门</button>'
            + '<button class="layui-btn layui-btn-xs" lay-event="finish">完成</button>'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="drawing">图片</button>'
            + '<\/script>'
        );
    }

    // —— 反馈记录列表 ——
    table.render({
        elem: '#recordTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'feedback', title: '装修单号', width: 120, templet: function (d) { return d.feedback ? (d.feedback.orderId || '') : ''; } },
            { field: 'handler', title: '处理人', width: 110, templet: function (d) { return d.handler ? (d.handler.userName || '') : ''; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) {
                var s = d.feedback ? d.feedback.status : '';
                return customerCommon.badge(E.feedbackStatus, s);
            } },
            { field: 'operateTime', title: '处理时间', width: 165 },
            { field: 'comment', title: '备注', minWidth: 200 }
        ]]
    });

    function queryComplaints() {
        app.post(api.customer.queryFeedbackComplaint, { 'feedbackComplaint.fid': vid }, function (res) {
            table.reload('complaintTable', { data: res.feedbackComplaints || [] });
        });
    }
    function queryRecords() {
        app.post(api.customer.queryFeedbackRecord, { 'feedbackRecord.feedback.fid': vid }, function (res) {
            table.reload('recordTable', { data: res.feedbackRecords || [] });
        });
    }
    queryComplaints();
    queryRecords();

    // —— 添加/编辑 ——
    function openEdit(v) {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render();
        state.resUrl = null;
        $('#showImg').hide();
        $('#upgradeSourceGroup').hide();
        state.fcid = null;
        if (v) {
            state.fcid = v.fcid;
            $('#editForm [name="orderId"]').val(v.orderId);
            $('#editForm [name="phone"]').val(v.phone);
            $('#editForm [name="source"]').val(v.source);
            $('#editForm [name="upgrade"]').val(v.upgrade);
            $('#editForm [name="urgency"]').val(v.urgency);
            $('#editForm [name="content"]').val(v.content);
            $('#editForm [name="appeal"]').val(v.appeal);
            $('#editForm [name="results"]').val(v.results);
            $('#editForm [name="upgradeSource"]').val(v.upgradeSource != null ? v.upgradeSource : 0);
            if (v.source == 0 || v.source == 9) $('#upgradeSourceGroup').show();
            var checkArray = (v.deptType || '').split(',');
            $('#choiceDeptType input[name="complaintDeptType"]').each(function () {
                $(this).prop('checked', $.inArray($(this).val(), checkArray) !== -1);
            });
            form.render('select'); form.render('checkbox');
        } else if (orderId) {
            $('#editForm [name="orderId"]').val(orderId);
        }
        state.editIndex = layer.open({ type: 1, title: v ? '编辑投诉' : '添加投诉', content: $('#editBox'), area: ['640px', '90%'] });
    }

    $('#btnAdd').on('click', function () { openEdit(null); });

    // 表单内图片上传（uploadOther，media 服务）
    app.upload({
        elem: '#btnUpload', url: 'uploadOther.do',
        done: function (res) {
            state.resUrl = res.resUrl;
            app.showImg($('#showImg'), res.resUrl, 60, 60);
        }
    });

    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        var selectedValues = $('#choiceDeptType input[name="complaintDeptType"]:checked').map(function () { return $(this).val(); }).get();
        var options = {
            'feedbackComplaint.fid': vid,
            'feedbackComplaint.orderId': $('#editForm [name="orderId"]').val(),
            'feedbackComplaint.source': $('#editForm [name="source"]').val(),
            'feedbackComplaint.upgradeSource': $('#editForm [name="upgradeSource"]').val(),
            'feedbackComplaint.phone': $('#editForm [name="phone"]').val(),
            'feedbackComplaint.upgrade': $('#editForm [name="upgrade"]').val(),
            'feedbackComplaint.urgency': $('#editForm [name="urgency"]').val(),
            'feedbackComplaint.deptType': selectedValues.join(','),
            'feedbackComplaint.content': $('#editForm [name="content"]').val(),
            'feedbackComplaint.appeal': $('#editForm [name="appeal"]').val(),
            'feedbackComplaint.results': $('#editForm [name="results"]').val()
        };
        var isEdit = state.fcid != null;
        if (isEdit) options['feedbackComplaint.fcid'] = state.fcid;
        app.post(isEdit ? api.customer.updateFeedbackComplaint : api.customer.addFeedbackComplaint, options, function (res) {
            var fcid = isEdit ? state.fcid : (res.feedbackComplaint ? res.feedbackComplaint.fcid : null);
            // 新增时带图片 → 追加 feedbackDrawing(type=2)
            if (!isEdit && state.resUrl && fcid != null) {
                app.post(api.customer.addFeedbackDrawing, {
                    'feedbackDrawing.fid': vid,
                    'feedbackDrawing.sid': fcid,
                    'feedbackDrawing.path': state.resUrl,
                    'feedbackDrawing.type': 2
                });
            }
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            queryComplaints();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // —— 图片管理（画廊 + 上传 + 删除） ——
    function managedrawing(v) {
        $('#feedbackDrawing').empty();
        state.drawingIndex = layer.open({ type: 1, title: '投诉图片', content: $('#drawingBox'), area: ['640px', 'auto'] });
        app.post(api.customer.queryFeedbackDrawingBySid, { 'feedbackDrawing.sid': v.fcid }, function (res) {
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
                'feedbackDrawing.fid': vid,
                'feedbackDrawing.sid': state.fcid,
                'feedbackDrawing.path': res.resUrl,
                'feedbackDrawing.type': 2
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

    // —— 返回 ——
    $('#btnBack').on('click', function () {
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else app.switchPage(customerCommon.ctx('historyPage').url || api.index.feedbackIndex.url);
        } catch (e) { app.switchPage(api.index.feedbackIndex.url); }
    });
});
}); // end app.ready
