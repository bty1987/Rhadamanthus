/** app/js/information/awardPurchase.js —— 奖品采购（列表 + 创建 + 采购/入库/结算/撤销）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, addIndex: null, instoreIndex: null, balanceIndex: null };

    var STATUS_MAP = { 0: '初始化', 1: '采购中', 2: '已入库', 3: '已结算', 4: '已撤销' };
    function stB(d) {
        var cls = d.status == 3 ? 'layui-bg-green' : d.status == 4 ? 'layui-bg-gray' : d.status == 1 ? 'layui-bg-blue' : d.status == 2 ? 'layui-bg-orange' : 'layui-bg-red';
        return '<span class="layui-badge ' + cls + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>';
    }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'awardStock', title: '库存', minWidth: 160, templet: function (d) { return d.awardStock ? d.awardStock.name : ''; } },
                { field: 'inprice', title: '入库价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.inprice); } },
                { field: 'baprice', title: '结算价', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.baprice); } },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'surplus', title: '剩余数量', width: 100, align: 'right' },
                { field: 'status', title: '状态', width: 100, templet: stB },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'purchaser', title: '采购员', width: 110, templet: function (d) { return d.purchaser ? d.purchaser.userName : ''; } },
                { field: 'purchaseTime', title: '采购时间', width: 160 },
                { field: 'instorer', title: '入库员', width: 110, templet: function (d) { return d.instorer ? d.instorer.userName : ''; } },
                { field: 'instoreTime', title: '入库时间', width: 160 },
                { field: 'balanceTime', title: '仓储时间', width: 160 },
                { field: 'activity', title: '活动名称', width: 130 },
                { field: 'dept', title: '部门', width: 130 },
                { field: 'comment', title: '备注', minWidth: 160 },
                { title: '操作', width: 270, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'purchase') purchase(obj.data.apid);
            else if (obj.event === 'instore') openInstore(obj.data);
            else if (obj.event === 'balance') openBalance(obj.data);
            else if (obj.event === 'cancel') cancel(obj.data.apid);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageAwardPurchase, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openAdd() {
        app.clearValidator(); $('#addForm')[0].reset();
        state.addIndex = layer.open({ type: 1, title: '创建采购', content: $('#addBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveAdd() {
        if (app.validate('addForm')) return;
        app.post(api.information.addAwardPurchase, {
            'awardPurchase.awardStock.asId': $('#addForm [name="asId"]').val(),
            'awardPurchase.num': $('#addForm [name="num"]').val(),
            'awardPurchase.activity': $('#addForm [name="activity"]').val(),
            'awardPurchase.dept': $('#addForm [name="dept"]').val(),
            'awardPurchase.comment': $('#addForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '创建成功'); layer.close(state.addIndex); state.addIndex = null; query(state.page); });
    }
    function purchase(apid) {
        app.showConfirm('确认采购？', function () { app.post(api.information.purchaseAwardPurchase, { 'awardPurchase.apid': apid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
    }
    function openInstore(d) {
        app.clearValidator(); $('#instoreForm')[0].reset();
        $('#instoreForm [name="apid"]').val(d.apid);
        state.instoreIndex = layer.open({ type: 1, title: '入库', content: $('#instoreBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveInstore() {
        if (app.validate('instoreForm')) return;
        app.post(api.information.instoreAwardPurchase, {
            'awardPurchase.apid': $('#instoreForm [name="apid"]').val(),
            'awardPurchase.inprice': $('#instoreForm [name="inprice"]').val(),
            'awardPurchase.num': $('#instoreForm [name="warehousing"]').val()
        }, function () { app.showAlert(app.success, '入库成功'); layer.close(state.instoreIndex); state.instoreIndex = null; query(state.page); });
    }
    function openBalance(d) {
        app.clearValidator(); $('#balanceForm')[0].reset();
        $('#balanceForm [name="apid"]').val(d.apid);
        state.balanceIndex = layer.open({ type: 1, title: '结算', content: $('#balanceBox'), area: ['440px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveBalance() {
        if (app.validate('balanceForm')) return;
        app.post(api.information.balanceAwardPurchase, {
            'awardPurchase.apid': $('#balanceForm [name="apid"]').val(),
            'awardPurchase.baprice': $('#balanceForm [name="baprice"]').val()
        }, function () { app.showAlert(app.success, '结算成功'); layer.close(state.balanceIndex); state.balanceIndex = null; query(state.page); });
    }
    function cancel(apid) {
        app.showConfirm('确认撤销？', function () { app.post(api.information.cancelAwardPurchase, { 'awardPurchase.apid': apid }, function () { app.showAlert(app.success, '已撤销'); query(state.page); }); });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSaveAdd').on('click', doSaveAdd);
    $('#btnCancelAdd').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnSaveInstore').on('click', doSaveInstore);
    $('#btnCancelInstore').on('click', function () { layer.close(state.instoreIndex); state.instoreIndex = null; });
    $('#btnSaveBalance').on('click', doSaveBalance);
    $('#btnCancelBalance').on('click', function () { layer.close(state.balanceIndex); state.balanceIndex = null; });
});
}); // end app.ready
