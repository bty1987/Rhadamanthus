/** app/js/approval/approvalForm.js —— 审批表单定义列表（P2-P3 新引擎）
  pageApprovalForm；启停 updateApprovalFormForStatus；删除 deleteApprovalForm；
  编辑/新增→ popup approvalFormCreate.html，通过 app.params.approvalForm = {formId} 传上下文 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '表单名称', minWidth: 160 },
                { field: 'code', title: '编码', width: 180 },
                { field: 'flowId', title: '关联流程ID', width: 120 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } },
                { title: '操作', width: 230, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'edit') { app.params.approvalForm = { formId: v.formId }; app.popup(api.index.createApprovalFormIndex.url, '编辑表单', null, { area: ['90%', '85%'] }); }
            else if (ev === 'status') doToggle(v);
            else if (ev === 'del') doDel(v);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.approval.pageApprovalForm, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function doToggle(v) {
        var target = v.status == 0 ? 1 : 0, label = target == 0 ? '启用' : '禁用';
        app.showConfirm('确认' + label + '该表单?', function () { app.post(api.approval.updateApprovalFormForStatus, { 'form.formId': v.formId, 'form.status': target }, function () { app.showAlert(app.success, '已' + label); query(state.page); }); });
    }
    function doDel(v) {
        app.showConfirm('确认删除该表单?关联的字段将一并删除。', function () { app.post(api.approval.deleteApprovalForm, { 'form.formId': v.formId }, function () { app.showAlert(app.success, '删除成功'); query(state.page); }); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { app.params.approvalForm = null; app.popup(api.index.createApprovalFormIndex.url, '添加表单', null, { area: ['90%', '85%'] }); });
});
}); // end app.ready
