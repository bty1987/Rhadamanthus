/** userRequire.js —— 人员需求（PageUserRequire / addUserRequire / approveUserRequire / refuseUserRequire / finishUserRequire） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    var statusMap = { 0: '初始', 1: '通过', 2: '拒绝', 3: '完成' };
    var typeMap = { 0: '招聘', 1: '培训' };
    function stStatus(d) {
        var cls = { 0: 'layui-bg-blue', 1: 'layui-bg-green', 2: 'layui-bg-red', 3: 'layui-bg-gray' };
        return '<span class="layui-badge ' + (cls[d.status] || '') + '">' + (statusMap[d.status] || '---') + '<\/span>';
    }
    function stType(d) { return typeMap[d.type] != null ? '<span class="layui-badge layui-bg-cyan">' + typeMap[d.type] + '<\/span>' : '---'; }

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'creater', title: '创建人', width: 120, templet: function (d) { return d.creater ? d.creater.userName : '---'; } },
                { field: 'dept', title: '归属部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'receiveId', title: '接收人', width: 120, templet: function (d) { return d.receiveId ? d.receiveId.currentName : '---'; } },
                { field: 'content', title: '需求内容', minWidth: 200 },
                { field: 'type', title: '类型', width: 90, templet: stType },
                { field: 'status', title: '状态', width: 90, templet: stStatus },
                { field: 'approveTime', title: '审批时间', width: 160 },
                { field: 'finishTime', title: '完成时间', width: 160 },
                { title: '操作', width: 240, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'approve') doApprove(obj.data);
            else if (obj.event === 'refuse') doRefuse(obj.data);
            else if (obj.event === 'complete') doComplete(obj.data);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.PageUserRequire, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset(); form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加需求', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.personel.addUserRequire, {
            'userRequire.content': $('#editForm [name="content"]').val(),
            'userRequire.type': $('#editForm [name="type"]').val()
        }, function () {
            app.showAlert(app.success, '创建成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }
    function doApprove(d) { app.showConfirm('是否确认通过审批?', function () { app.post(api.personel.approveUserRequire, { 'userRequire.urid': d.urid }, function () { app.showAlert(app.success, '审批通过'); query(state.page); }); }); }
    function doRefuse(d) { app.showConfirm('是否确认拒绝审批?', function () { app.post(api.personel.refuseUserRequire, { 'userRequire.urid': d.urid }, function () { app.showAlert(app.success, '审批拒绝'); query(state.page); }); }); }
    function doComplete(d) { app.showConfirm('是否确认完成审批?', function () { app.post(api.personel.finishUserRequire, { 'userRequire.urid': d.urid }, function () { app.showAlert(app.success, '审批完成'); query(state.page); }); }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
