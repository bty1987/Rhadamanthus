/** app/js/approval/approvalFlow.js —— 审批流程定义列表（P2-P3 新引擎）
  pageApprovalFlow；启停 updateApprovalFlowForStatus；删除 deleteApprovalFlow；
  编辑/新增→ popup approvalFlowCreate.html，通过 app.params.approvalFlow = {flowId} 传上下文 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    // 业务类型映射(对应 ApprovalPO.APPROVAL_TYPE_*)
    var businessTypeMap = {
        1: '客户信息', 2: '小区', 3: '装修归属', 4: '报价折扣', 5: '装修退款',
        6: '主材退款', 7: '主材外部退款', 8: '装修活动', 9: '主材全款',
        10: '销售退款', 11: '清单DB', 12: '销售折扣', 13: '人事',
        14: '客户来源-装修', 16: '装修整装', 17: '客户来源', 18: '销售收款',
        19: '装修终审', 20: '客户来源变更', 21: '客户机会', 22: '报价优惠',
        23: '优惠', 24: '装饰合同', 25: '客户机会停用', 26: '预付款提现',
        100: '通用审批'
    };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '流程名称', minWidth: 160 },
                { field: 'code', title: '编码', width: 180 },
                { field: 'businessType', title: '业务类型', width: 130, templet: function (d) { return businessTypeMap[d.businessType] || d.businessType; } },
                { field: 'version', title: '版本', width: 80 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } },
                { title: '操作', width: 230, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'edit') { app.params.approvalFlow = { flowId: v.flowId }; app.popup(api.index.createApprovalFlowIndex.url, '编辑流程', null, { area: ['720px', '90%'] }); }
            else if (ev === 'status') doToggle(v);
            else if (ev === 'del') doDel(v);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.approval.pageApprovalFlow, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function doToggle(v) {
        var target = v.status == 0 ? 1 : 0, label = target == 0 ? '启用' : '禁用';
        app.showConfirm('确认' + label + '该流程?', function () { app.post(api.approval.updateApprovalFlowForStatus, { 'flow.flowId': v.flowId, 'flow.status': target }, function () { app.showAlert(app.success, '已' + label); query(state.page); }); });
    }
    function doDel(v) {
        app.showConfirm('确认删除该流程定义?关联的节点将一并删除。', function () { app.post(api.approval.deleteApprovalFlow, { 'flow.flowId': v.flowId }, function () { app.showAlert(app.success, '删除成功'); query(state.page); }); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { app.params.approvalFlow = null; app.popup(api.index.createApprovalFlowIndex.url, '添加流程', null, { area: ['720px', '90%'] }); });
});
}); // end app.ready
