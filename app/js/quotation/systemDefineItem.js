/** app/js/quotation/systemDefineItem.js —— 系统定义项
 *  列表：pageSystemDefineItem（名称/大类/工种）；编辑：add/updateSystemDefineItem（SI_00001 编号，价格 tranargs）；
 *  删除 deleteSystemDefineItem；状态 updateSystemDefineItemForStatus；打折 updateSystemDefineItemForDiscount。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var state = { page: 1, rows: 10, total: 0, sdiid: null };

    app.post(api.data.queryMeasurementUnit, {}, function (res) {
        app.bindData($('#measurementUnit'), res.measurementUnits, 'id', 'name', false);
        form.render('select');
    }, null, false);
    app.post(api.quotation.queryQuotationBigCategory, {}, function (res) {
        app.bindData($('#quotationBigCategory'), res.quotationBigCategorys, 'id', 'name', false);
        app.bindData($('#sBigCategory'), res.quotationBigCategorys, 'id', 'name', true);
        form.render('select');
    }, null, false);
    app.post(api.data.queryWorkType, {}, function (res) {
        app.bindData($('#workType'), res.workTypes, 'id', 'name', false);
        app.bindData($('#sWorkType'), res.workTypes, 'id', 'name', true);
        form.render('select');
    }, null, false);

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 160, fixed: 'left' },
            { field: 'no', title: '编号', width: 100 },
            { field: 'bigCategory', title: '大类', width: 100, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 70, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'unitPrice', title: '原单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
            { field: 'comment', title: '说明', minWidth: 130 },
            { title: '操作', width: 280, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageSystemDefineItem, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.sdiid = v ? v.sdiid : null;
        $('#no').prop('disabled', !!v).val(v ? v.no : '');
        $('#name').val(v ? v.name : '');
        $('#quotationBigCategory').val(v ? v.bigCategory.id : '');
        $('#workType').val(v ? v.workType.id : '');
        $('#measurementUnit').val(v ? v.unit.id : '');
        $('#addPrice').val(v ? v.addPrice : '');
        $('#unitPrice').val(v ? v.unitPrice : '');
        $('#subPrice').val(v ? v.subPrice : '');
        $('#comment').val(v ? v.comment : '');
        form.render('select');
        layer.open({ type: 1, title: state.sdiid ? '编辑系统定义项' : '添加系统定义项', content: $('#editBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!state.sdiid && !/^SI_\d{5}$/.test($('#no').val())) { app.showAlert(app.warning, '请以SI_作为前缀 , 之后以五个位数字组成(如SI_00001).'); return; }
                var url = api.quotation.addSystemDefineItem;
                var options = {
                    'systemDefineItem.no': $('#no').val(),
                    'systemDefineItem.name': $('#name').val(),
                    'systemDefineItem.bigCategory.id': $('#quotationBigCategory').val(),
                    'systemDefineItem.unit.id': $('#measurementUnit').val(),
                    'systemDefineItem.workType.id': $('#workType').val(),
                    'systemDefineItem.addPrice': $('#addPrice').val(),
                    'systemDefineItem.unitPrice': $('#unitPrice').val(),
                    'systemDefineItem.subPrice': $('#subPrice').val(),
                    'systemDefineItem.comment': $('#comment').val()
                };
                if (state.sdiid) { url = api.quotation.updateSystemDefineItem; options['systemDefineItem.sdiid'] = state.sdiid; }
                app.post(url, options, function () {
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'del') {
            app.showConfirm('确定删除当前系统定义项吗?', function () {
                app.post(api.quotation.deleteSystemDefineItem, { 'systemDefineItem.sdiid': v.sdiid }, function () { query(state.page); });
            });
        } else if (obj.event === 'status') {
            app.post(api.quotation.updateSystemDefineItemForStatus, { 'systemDefineItem.sdiid': v.sdiid, 'systemDefineItem.status': v.status == 1 ? 0 : 1 }, function () { query(state.page); });
        } else if (obj.event === 'discount') {
            app.post(api.quotation.updateSystemDefineItemForDiscount, { 'systemDefineItem.sdiid': v.sdiid, 'systemDefineItem.discount': v.discount == 1 ? 0 : 1 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
