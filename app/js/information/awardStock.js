/** app/js/information/awardStock.js —— 奖品库存（列表 + 添加/编辑 + 启用/禁用 + 入库/出库/盘点）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, opIndex: null, editId: null, opFlag: null, opId: null };

    var TYPE_MAP = { 0: '物品', 1: '券', 2: '红包' };
    var SUBTYPE_MAP = { 0: '其他', 1: '采购' };
    var ROOM_MAP = { 0: '主库', 1: '分库' };
    function stB(d) { return '<span class="layui-badge ' + (d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 110 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'subtype', title: '子类', width: 90, templet: function (d) { return SUBTYPE_MAP[d.subtype] || '---'; } },
                { field: 'storeroom', title: '库房', width: 90, templet: function (d) { return ROOM_MAP[d.storeroom] || '---'; } },
                { field: 'format', title: '规格', width: 110 },
                { field: 'unitPrice', title: '价格', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.unitPrice); } },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'in') openOp(obj.data, 3);
            else if (obj.event === 'out') openOp(obj.data, 2);
            else if (obj.event === 'check') openOp(obj.data, 1);
            else if (obj.event === 'status') toggleStatus(obj.data.asId, obj.data.status);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageAwardStock, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.asId;
            $('#editForm [name="asId"]').val(d.asId);
            ['no', 'name', 'num', 'format', 'content'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); });
            $('#editForm [name="type"]').val(d.type);
            $('#editForm [name="subtype"]').val(d.subtype);
            $('#editForm [name="storeroom"]').val(d.storeroom);
            $('#editForm [name="isStock"]').val(d.isStock);
            $('#editForm [name="isPrefor"]').val(d.isPrefor);
            $('#editForm [name="isPayment"]').val(d.isPayment);
            $('#editForm [name="price"]').val(d.unitPrice);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑奖品' : '添加奖品', content: $('#editBox'), area: ['720px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'awardStock.content': $('#editForm [name="content"]').val(),
            'awardStock.isPrefor': $('#editForm [name="isPrefor"]').val(),
            'awardStock.isStock': $('#editForm [name="isStock"]').val(),
            'awardStock.isPayment': $('#editForm [name="isPayment"]').val(),
            'awardStock.storeroom': $('#editForm [name="storeroom"]').val(),
            'awardStock.subtype': $('#editForm [name="subtype"]').val(),
            'awardStock.format': $('#editForm [name="format"]').val()
        };
        var apiDef;
        if (state.editId) { opt['awardStock.asId'] = state.editId; apiDef = api.information.updateAwardStock; }
        else {
            opt['awardStock.no'] = $('#editForm [name="no"]').val();
            opt['awardStock.name'] = $('#editForm [name="name"]').val();
            opt['awardStock.type'] = $('#editForm [name="type"]').val();
            opt['awardStock.num'] = $('#editForm [name="num"]').val();
            opt['awardStock.price'] = $('#editForm [name="price"]').val();
            apiDef = api.information.addAwardStock;
        }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    function openOp(d, flag) {
        app.clearValidator(); $('#opForm')[0].reset();
        state.opId = d.asId; state.opFlag = flag;
        $('#opForm [name="asId"]').val(d.asId);
        $('#opForm [name="no2"]').val(d.no);
        $('#opForm [name="name2"]').val(d.name);
        $('#opForm [name="nownum"]').val(d.num);
        $('#rowIn').hide(); $('#rowOut').hide(); $('#rowCheck').hide();
        var title = '库存操作';
        if (flag == 3) { $('#rowIn').show(); title = '入库'; }
        else if (flag == 2) { $('#rowOut').show(); title = '出库'; }
        else if (flag == 1) { $('#rowCheck').show(); title = '盘点'; }
        form.render('select');
        state.opIndex = layer.open({ type: 1, title: title, content: $('#opBox'), area: ['720px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doOpSave() {
        var opt = { 'awardStock.asId': state.opId };
        var apiDef;
        if (state.opFlag == 1) { apiDef = api.information.checkAwardStock; opt['awardStock.num'] = $('#opForm [name="checknum"]').val(); }
        else if (state.opFlag == 2) { apiDef = api.information.updateAwardStockForXG; opt['awardStock.num'] = $('#opForm [name="warehousend"]').val(); opt['awardStock.price'] = $('#opForm [name="price2out"]').val(); opt['awardStock.subtype'] = $('#opForm [name="awardRecordSubtypeOut"]').val(); }
        else if (state.opFlag == 3) { apiDef = api.information.updateAwardStockForCG; opt['awardStock.num'] = $('#opForm [name="warehousing"]').val(); opt['awardStock.price'] = $('#opForm [name="price2"]').val(); opt['awardStock.subtype'] = $('#opForm [name="awardRecordSubtype"]').val(); }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.opIndex); state.opIndex = null; query(state.page); });
    }
    function toggleStatus(asId, cur) {
        var newStatus = cur == 0 ? 1 : 0;
        app.showConfirm(newStatus == 0 ? '确认启用？' : '确认禁用？', function () {
            app.post(api.information.updateAwardStockForStatus, { 'awardStock.asId': asId, 'awardStock.status': newStatus }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnOpSave').on('click', doOpSave);
    $('#btnOpCancel').on('click', function () { layer.close(state.opIndex); state.opIndex = null; });
});
}); // end app.ready
