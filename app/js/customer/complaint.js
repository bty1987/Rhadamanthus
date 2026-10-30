/** app/js/customer/complaint.js —— 投诉内容（旧 complaint.js → layui）
 *  上下文：app.params.customer.aid（complain.cid）。列表：queryComplaint。
 *  添加 addComplaint（类型/人员→部门/品牌/内容）；跟踪 trackComplack（写）；跟踪内容 queryComplack（看）；
 *  完结 finishComplaint（status==1）；关闭 closeComplaint（status==2）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var cid = customerCommon.ctx('customer').aid;
    var state = { editIndex: null, trackIndex: null, complackIndex: null, ctid: null, uid: null, did: null, bid: null };

    if (cid == null || cid === '') { app.showAlert(app.warning, '缺少投诉上下文'); return; }

    // —— 人员选择（带出部门） ——
    $('#btnPickStaff').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.uid = u.userId;
            state.did = u.dept ? u.dept.deptId : null;
            $('#staffName').val(u.currentName);
            $('#deptName').val(u.dept ? (u.dept.deptName || '') : '');
        });
    });

    // —— 品牌检索 ——
    $('#brandName').on('input', function () {
        var kw = $.trim($(this).val());
        if (!kw) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': kw }, function (res) {
            var $list = $('#brandList').empty();
            $.each((res.brands || []).slice(0, 10), function (i, b) {
                $('<a style="margin-right:10px;cursor:pointer;color:#01AAED;">').text(b.alias || b.name).data('bid', b.bid).appendTo($list);
            });
        });
    });
    $('#brandList').on('click', 'a', function () {
        state.bid = $(this).data('bid');
        $('#brandName').val($(this).text());
        $('#brandList').empty();
    });

    // —— 投诉列表 ——
    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'staff', title: '人员', width: 110, templet: function (d) { return d.staff ? (d.staff.currentName || '') : ''; } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.complaintType[d.type] != null ? E.complaintType[d.type] : ''; } },
            { field: 'dept', title: '部门', width: 130, templet: function (d) { return d.dept ? (d.dept.name || '') : ''; } },
            { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.brand ? (d.brand.name || '') : ''; } },
            { field: 'creater', title: '创建人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
            { field: 'updater', title: '操作人', width: 100, templet: function (d) { return d.updater ? (d.updater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'updateTime', title: '操作时间', width: 165 },
            { field: 'finishTime', title: '完成时间', width: 165 },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return customerCommon.badge(E.complaintStatus, d.status); } },
            { field: 'content', title: '内容', minWidth: 180 },
            { title: '操作', width: 220, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'complackView') {
            queryComplack(v.ctid);
        } else if (obj.event === 'complack') {
            state.ctid = v.ctid;
            $('#trackForm')[0].reset();
            app.clearValidator();
            state.trackIndex = layer.open({ type: 1, title: '跟踪', content: $('#trackBox'), area: ['480px', 'auto'] });
        } else if (obj.event === 'finish') {
            app.post(api.customer.finishComplaint, { 'complaint.ctid': v.ctid }, function () {
                app.showAlert(app.success, '操作成功');
                queryComplaint();
            });
        } else if (obj.event === 'close') {
            app.post(api.customer.closeComplaint, { 'complaint.ctid': v.ctid }, function () {
                app.showAlert(app.success, '操作成功');
                queryComplaint();
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="complackView">跟踪内容</button>'
            + '{{# if(d.status == 0){ }}<button class="layui-btn layui-btn-xs" lay-event="complack">跟踪</button>{{# } }}'
            + '{{# if(d.status == 1){ }}<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="finish">完结</button>{{# } }}'
            + '{{# if(d.status == 2){ }}<button class="layui-btn layui-btn-xs layui-btn-normal" lay-event="close">关闭</button>{{# } }}'
            + '<\/script>'
        );
    }

    // —— 跟踪内容列表 ——
    table.render({
        elem: '#complackTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'comment', title: '跟踪内容', minWidth: 200 },
            { field: 'operater', title: '操作人', width: 120, templet: function (d) { return d.operater ? (d.operater.currentName || '') : ''; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'operateTime', title: '操作时间', width: 165 }
        ]]
    });

    function queryComplaint() {
        app.post(api.customer.queryComplaint, { 'complaint.cid': cid }, function (res) {
            table.reload('resultTable', { data: res.complaints || [] });
        });
    }
    function queryComplack(ctid) {
        state.complackIndex = layer.open({ type: 1, title: '跟踪内容', content: $('#complackBox'), area: ['640px', 'auto'] });
        app.post(api.customer.queryComplack, { 'complack.ctid': ctid }, function (res) {
            table.reload('complackTable', { data: res.complacks || [] });
        }, null, false);
    }
    queryComplaint();

    // —— 添加 ——
    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.uid = null; state.did = null; state.bid = null;
        $('#brandList').empty();
        state.editIndex = layer.open({ type: 1, title: '添加投诉内容', content: $('#editBox'), area: ['560px', 'auto'] });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.uid) { app.showAlert(app.warning, '请选择人员'); return; }
        app.post(api.customer.addComplaint, {
            'complaint.cid': cid,
            'complaint.dept.did': state.did != null ? state.did : '',
            'complaint.staff.uid': state.uid,
            'complaint.brand.bid': state.bid != null ? state.bid : '',
            'complaint.type': $('#editForm [name="type"]').val(),
            'complaint.content': $('#editForm [name="content"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            queryComplaint();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });

    // —— 跟踪 ——
    $('#btnTrackSave').on('click', function () {
        if (app.validate('trackForm')) return;
        app.post(api.customer.trackComplack, {
            'complack.cid': cid,
            'complack.ctid': state.ctid,
            'complack.comment': $('#trackForm [name="comment"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.trackIndex);
            state.trackIndex = null;
            queryComplaint();
        });
    });
    $('#btnTrackCancel').on('click', function () { layer.close(state.trackIndex); state.trackIndex = null; });

    $('#btnBack').on('click', function () {
        try {
            if (parent && parent.layui) parent.layui.layer.closeAll();
            else layer.closeAll();
        } catch (e) { layer.closeAll(); }
    });
});
}); // end app.ready
