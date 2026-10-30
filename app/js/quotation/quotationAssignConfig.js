/** app/js/quotation/quotationAssignConfig.js —— 预算分配配置
 *  列表：pageQuotationAssignConfig（公司/状态）；新增 createQuotationAssignConfig（公司/部门/自动分配/启用）；
 *  启停 updateQuotationAssignConfigForStatus；删除 deleteQuotationAssignConfig。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };

    app.post(api.system.queryCompany, {}, function (res) {
        app.bindData($('#companySel'), res.companys || [], 'cid', 'name', false);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'company', title: '公司', width: 160, templet: function (d) { return d.company ? d.company.name : ''; } },
            { field: 'department', title: '部门', width: 140, templet: function (d) { return d.department ? d.department.name : '所有部门'; } },
            { field: 'enabled', title: '状态', width: 80, templet: function (d) { return qc.badge(E.assignConfigEnabled, d.enabled); } },
            { field: 'autoAssign', title: '分配方式', width: 90, templet: function (d) { return E.assignConfigAutoAssign[d.autoAssign] != null ? E.assignConfigAutoAssign[d.autoAssign] : d.autoAssign; } },
            { field: 'createTime', title: '创建时间', width: 165 },
            { field: 'updateTime', title: '更新时间', width: 165 },
            { title: '操作', width: 150, toolbar: '#rowToolbar' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationAssignConfig, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit() {
        $('#editBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '新增分配配置', content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$('#companySel').val()) { app.showAlert(app.warning, '请选择公司'); return; }
                var options = {
                    'quotationAssignConfig.company.cid': $('#companySel').val(),
                    'quotationAssignConfig.autoAssign': $('#autoAssign').val(),
                    'quotationAssignConfig.enabled': $('#enabled').val()
                };
                if ($('#departmentSel').val()) options['quotationAssignConfig.department.deptId'] = $('#departmentSel').val();
                app.post(api.quotation.createQuotationAssignConfig, options, function () {
                    app.showAlert(app.success, '新增成功');
                    layer.close(idx); query(1);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'toggle') {
            app.post(api.quotation.updateQuotationAssignConfigForStatus, { 'quotationAssignConfig.qacid': v.qacid, 'quotationAssignConfig.enabled': v.enabled == 1 ? 0 : 1 }, function () { query(state.page); });
        } else if (obj.event === 'del') {
            app.showConfirm('确定删除该配置?', function () {
                app.post(api.quotation.deleteQuotationAssignConfig, { 'quotationAssignConfig.qacid': v.qacid }, function () {
                    app.showAlert(app.info, '删除成功'); query(state.page);
                });
            });
        }
    });

    $('#btnAdd').on('click', openEdit);
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
