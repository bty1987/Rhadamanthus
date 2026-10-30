/** app/js/customer/feedbackComplaintDept.js —— 投诉部门（旧 feedbackComplaintDept.js → layui）
 *  上下文：app.params.customer.{fcid, deptType}。列表：queryFeedbackComplaintDept（fcid）。
 *  添加：addFeedbackComplaintDept（部门类型→部门/职务级联、责任人、问题三级分类）；删除 deleteFeedbackComplaintDept。
 *  问题分类：queryFeedbackComplaintProblem（deptTypes 参数按 deptType 中文名映射）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    customerCommon.ensureApiStubs();
    var ctx = customerCommon.ctx('customer');
    var fcid = ctx.fcid;
    var state = { editIndex: null, userId: null };

    if (fcid == null || fcid === '') { app.showAlert(app.warning, '缺少投诉上下文'); return; }

    // —— 问题分类级联（按投诉部门类型过滤） ——
    var DEPT_TYPE_MAP = { '设计': 1, '工程': 2, '主材': 3, '尺源': 4, '未知': 5 };
    function loadProblems($sel, extra) {
        var options = {};
        if (extra && extra.length) {
            $.each(extra, function (i, t) { if (DEPT_TYPE_MAP[t] != null) options['deptTypes[' + i + ']'] = DEPT_TYPE_MAP[t]; });
        }
        app.post(api.customer.queryFeedbackComplaintProblem, options, function (res) {
            app.bindData($sel, res.feedbackComplaintProblems || [], 'fcpid', 'name', '请选择');
            form.render('select');
        });
    }
    var deptTypeArr = (ctx.deptType || '').split(',');
    loadProblems($('#firstLevelSel'), ctx.deptType ? deptTypeArr : null);

    form.on('select(firstLevelFilter)', function (obj) {
        loadProblems($('#secondarySel'), obj.value ? [obj.value] : null);
    });
    form.on('select(secondaryFilter)', function (obj) {
        loadProblems($('#problemTypeSel'), obj.value ? [obj.value] : null);
    });

    // —— 部门类型 → 部门/职务 ——
    app.post(api.communion.queryDepartmentType, {}, function (res) {
        app.bindData($('#deptTypeSel'), res.departmentTypes || [], 'dtid', 'name', true);
        form.render('select');
    });
    form.on('select(deptTypeFilter)', function (obj) {
        if (!obj.value) return;
        app.post({ url: 'queryDutyByDtid.do' }, { 'duty.departmentType.dtid': obj.value }, function (res) {
            app.bindData($('#dutySel'), res.dutys || res.duties || [], 'did', 'name', true);
            form.render('select');
        });
        app.post(api.communion.queryDepartmentByDtid, { 'dept.type.dtid': obj.value }, function (res) {
            app.bindData($('#deptSel'), res.deptList || res.departments || [], 'did', 'name', true);
            form.render('select');
        });
    });

    table.render({
        elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[
            { type: 'numbers', title: '#', width: 60 },
            { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? (d.dept.name || '') : ''; } },
            { field: 'duty', title: '职务', width: 120, templet: function (d) { return d.duty ? (d.duty.name || '') : ''; } },
            { field: 'dutyUser', title: '责任人', width: 110, templet: function (d) { return d.dutyUser ? (d.dutyUser.userName || '') : ''; } },
            { field: 'firstLevel', title: '一级分类', width: 120, templet: function (d) { return d.firstLevel ? (d.firstLevel.name || '') : ''; } },
            { field: 'secondary', title: '二级分类', width: 130, templet: function (d) { return d.secondary ? (d.secondary.name || '') : ''; } },
            { field: 'problemType', title: '问题类型', width: 140, templet: function (d) { return d.problemType ? (d.problemType.name || '') : ''; } },
            { title: '操作', width: 100, fixed: 'right', toolbar: '#rowToolbar' }
        ]]
    });
    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.post(api.customer.deleteFeedbackComplaintDept, { 'feedbackComplaintDept.fcdid': obj.data.fcdid }, function () {
                app.showAlert(app.success, '操作成功');
                query();
            });
        }
    });
    if (!$('#rowToolbar').length) {
        $('body').append(
            '<script type="text/html" id="rowToolbar">'
            + '<button class="layui-btn layui-btn-danger layui-btn-xs" lay-event="del"><i class="layui-icon layui-icon-delete"></i>删除</button>'
            + '<\/script>'
        );
    }

    function query() {
        app.post(api.customer.queryFeedbackComplaintDept, { 'feedbackComplaintDept.fcid': fcid }, function (res) {
            table.reload('resultTable', { data: res.feedbackComplaintDepts || [] });
        });
    }
    query();

    $('#btnAdd').on('click', function () {
        app.clearValidator();
        $('#editForm')[0].reset();
        form.render('select');
        state.userId = null;
        loadProblems($('#firstLevelSel'), ctx.deptType ? deptTypeArr : null);
        $('#secondarySel').html('<option value="">请选择</option>');
        $('#problemTypeSel').html('<option value="">请选择</option>');
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加投诉部门', content: $('#editBox'), area: ['560px', 'auto'] });
    });
    $('#btnPickUser').on('click', function () {
        customerCommon.userPicker(function (u) {
            state.userId = u.userId;
            $('#dutyUserName').val(u.currentName);
        });
    });
    $('#btnSave').on('click', function () {
        if (app.validate('editForm')) return;
        if (!state.userId) { app.showAlert(app.warning, '请选择责任人'); return; }
        app.post(api.customer.addFeedbackComplaintDept, {
            'feedbackComplaintDept.fcid': fcid,
            'feedbackComplaintDept.dept.did': $('#editForm [name="dept"]').val(),
            'feedbackComplaintDept.duty.did': $('#editForm [name="duty"]').val(),
            'feedbackComplaintDept.dutyUser.userId': state.userId,
            'feedbackComplaintDept.firstLevel.fcpid': $('#editForm [name="firstLevel"]').val(),
            'feedbackComplaintDept.secondary.fcpid': $('#editForm [name="secondary"]').val(),
            'feedbackComplaintDept.problemType.fcpid': $('#editForm [name="problemType"]').val()
        }, function () {
            app.showAlert(app.success, '操作成功');
            layer.close(state.editIndex);
            state.editIndex = null;
            query();
        });
    });
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
