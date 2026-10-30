/** app/js/quotation/quotationAssignUserRuleItem.js —— 规则明细
 *  列表：queryQuotationAssignUserRuleItem（qaurid，tranargs company/department）；
 *  新增 createQuotationAssignUserRuleItemWithRule（部门/装修类型）；删除 deleteQuotationAssignUserRuleItem。
 *  上下文：app.params.quotation.assignUserRule。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var qctx = qc.ctx('quotation') || {};
    var rule = qctx.assignUserRule || {};
    var qaurid = rule.qaurid;

    $('#ruleLabel').text('规则明细 - ' + (rule.user ? rule.user.currentName : qaurid || '-'));

    // 部门下拉
    if (api.communion && api.communion.queryDepartment) {
        app.post(api.communion.queryDepartment, { 'department.company.cid': rule.company ? rule.company.cid : '' }, function (res) {
            app.bindData($('#departmentSel'), res.departments || [], 'deptId', 'name', true);
            form.render('select');
        }, null, false);
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'company', title: '公司', width: 150, templet: function (d) { return d.company ? d.company.name : (typeof d.company === 'string' ? d.company : ''); } },
            { field: 'department', title: '部门', width: 150, templet: function (d) { return d.department ? (typeof d.department === 'string' ? d.department : d.department.name) : '所有部门'; } },
            { field: 'decorationType', title: '装修类型', width: 100, templet: function (d) { return E.assignDecorationType[d.decorationType] != null ? E.assignDecorationType[d.decorationType] : (d.decorationType != null ? d.decorationType : ''); } },
            { title: '操作', width: 90, toolbar: '#rowToolbar' } ]] });

    function query() {
        if (!qaurid) return;
        app.post(api.quotation.queryQuotationAssignUserRuleItem, { 'quotationAssignUserRuleItem.qaurid': qaurid }, function (res) {
            table.reload('resultTable', { data: res.quotationAssignUserRuleItems || [] });
        });
    }
    query();

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.showConfirm('确定删除该明细?', function () {
                app.post(api.quotation.deleteQuotationAssignUserRuleItem, { 'quotationAssignUserRuleItem.qauriid': obj.data.qauriid }, function () {
                    app.showAlert(app.info, '删除成功'); query();
                });
            });
        }
    });

    $('#btnAdd').on('click', function () {
        $('#editBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '新增明细', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.createQuotationAssignUserRuleItemWithRule, $.extend({
                    'quotationAssignUserRule.qaurid': qaurid,
                    'quotationAssignUserRuleItem.decorationType': $('#decorationType').val()
                }, $('#departmentSel').val() ? { 'quotationAssignUserRuleItem.department.deptId': $('#departmentSel').val() } : {}), function () {
                    app.showAlert(app.success, '新增成功');
                    layer.close(idx); query();
                });
            } });
    });

    $('#btnBack').on('click', function () { app.closePopup(); });
});
}); // end app.ready
