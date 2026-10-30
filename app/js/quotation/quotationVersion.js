/** app/js/quotation/quotationVersion.js —— 报价版本管理
 *  列表：pageQuotationVersion（编号/名称/类型搜索）；
 *  编辑：add/updateQuotationVersion（名称/车运费比例折扣/管理费比例折扣/税金比例折扣/类型/偏移量/备注）；
 *  行操作：导出报价项(pageQuotationItem)、导出定额材料(api.data.pageNormood)、导出定额工费(api.data.pageNormrice)、
 *  默认(updateQuotationVersionForDefault)、启停(updateQuotationVersionForStatus)。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var E = quotationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0, no: null };

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'no', title: '编号', width: 90 },
            { field: 'name', title: '版本名称', width: 140 },
            { field: 'trafficRate', title: '车运费比例', width: 100 },
            { field: 'trafficDiscount', title: '车运费折扣', width: 100, templet: function (d) { return E.versionTrafficDiscount[d.trafficDiscount] != null ? E.versionTrafficDiscount[d.trafficDiscount] : ''; } },
            { field: 'manageRate', title: '管理费比例', width: 100 },
            { field: 'manageDiscount', title: '管理费折扣', width: 100, templet: function (d) { return E.versionManageDiscount[d.manageDiscount] != null ? E.versionManageDiscount[d.manageDiscount] : ''; } },
            { field: 'taxRate', title: '税金比例', width: 90 },
            { field: 'taxDiscount', title: '税金折扣', width: 90, templet: function (d) { return E.versionTaxDiscount[d.taxDiscount] != null ? E.versionTaxDiscount[d.taxDiscount] : ''; } },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.versionType[d.type] != null ? E.versionType[d.type] : ''; } },
            { field: 'defaultFlag', title: '默认', width: 80, templet: function (d) { return d.defaultFlag == 1 ? quotationCommon.badge({ 1: '默认', 0: '非默认' }, d.defaultFlag) : '非默认'; } },
            { field: 'offset', title: '偏移量', width: 80 },
            { field: 'comment', title: '备注', minWidth: 140 },
            { title: '操作', width: 440, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationVersion, $.extend({}, quotationCommon.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // —— 编辑弹窗 ——
    function openEdit(v) {
        state.no = v ? v.no : null;
        if (v) {
            $('#name').val(v.name); $('#trafficRate').val(v.trafficRate); $('#manageRate').val(v.manageRate); $('#taxRate').val(v.taxRate);
            $('#type').val(v.type); $('#offset').val(v.offset); $('#comment').val(v.comment);
            $('#trafficDiscount').prop('checked', v.trafficDiscount == 1);
            $('#manageDiscount').prop('checked', v.manageDiscount == 1);
        } else {
            $('#editForm')[0].reset();
            $('#trafficDiscount').prop('checked', false); $('#manageDiscount').prop('checked', false);
            $('#type').val(0);
        }
        form.render(null, 'editForm');
        layer.open({ type: 1, title: state.no ? '编辑报价版本' : '添加报价版本', content: $('#editBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写版本名称'); return; }
                var url = api.quotation.addQuotationVersion;
                var options = {
                    'quotationVersion.name': $('#name').val(),
                    'quotationVersion.trafficRate': $('#trafficRate').val(),
                    'quotationVersion.trafficDiscount': $('#trafficDiscount').prop('checked') ? 1 : 0,
                    'quotationVersion.manageRate': $('#manageRate').val(),
                    'quotationVersion.manageDiscount': $('#manageDiscount').prop('checked') ? 1 : 0,
                    'quotationVersion.taxRate': $('#taxRate').val(),
                    'quotationVersion.taxDiscount': $('input[name="taxDiscount"]:checked').val() != null ? $('input[name="taxDiscount"]:checked').val() : 0,
                    'quotationVersion.type': $('#type').val(),
                    'quotationVersion.offset': $('#offset').val(),
                    'quotationVersion.comment': $('#comment').val()
                };
                if (state.no) { url = api.quotation.updateQuotationVersion; options['quotationVersion.no'] = state.no; }
                app.post(url, options, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 导出 ——
    function checkExport() {
        if (!state.total) { app.showAlert(app.warning, '请通过条件进行查询'); return false; }
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值 , 不能完成导出动作'); return false; }
        return true;
    }
    function expdebjx(v) {
        if (!checkExport()) return;
        app.post(api.quotation.pageQuotationItem, { 'paging.noPage': 1, 'filters[0].field': 'versionId', 'filters[0].data': v.no, 'filters[0].op': 'eq' }, function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, item) {
                item.discount = item.discount == 0 ? '不打折' : '打折';
                item.status = E.versionStatus[item.status] != null ? E.versionStatus[item.status] : item.status;
            });
            table.exportFile('resultTable', data, 'csv', '报价项');
        });
    }
    function expdecl(v) {
        if (!checkExport()) return;
        app.post(api.data.pageNormood, { 'paging.noPage': 1, 'filters[0].field': 'quotationItem.quotationVersion.no', 'filters[0].data': v.no, 'filters[0].op': 'eq' }, function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, item) {
                item.status = E.versionStatus[item.status] != null ? E.versionStatus[item.status] : '---';
            });
            table.exportFile('resultTable', data, 'csv', '定额材料');
        });
    }
    function expdegf(v) {
        if (!checkExport()) return;
        app.post(api.data.pageNormrice, { 'paging.noPage': 1, 'filters[0].field': 'quotationItem.quotationVersion.no', 'filters[0].data': v.no, 'filters[0].op': 'eq' }, function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, item) {
                item.status = E.versionStatus[item.status] != null ? E.versionStatus[item.status] : '---';
            });
            table.exportFile('resultTable', data, 'csv', '定额工费');
        });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'expItem') expdebjx(v);
        else if (obj.event === 'expNood') expdecl(v);
        else if (obj.event === 'expRice') expdegf(v);
        else if (obj.event === 'default') {
            app.post(api.quotation.updateQuotationVersionForDefault, { 'quotationVersion.no': v.no, 'quotationVersion.defaultFlag': v.defaultFlag == 1 ? 0 : 1 }, function () { query(state.page); });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updateQuotationVersionForStatus, { 'quotationVersion.no': v.no, 'quotationVersion.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
