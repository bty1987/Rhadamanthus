/** app/js/information/vpayment.js —— 大活动收款（列表 + 创建 + 收款）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, addIndex: null, collectIndex: null, collectVpids: [] };

    var TYPE_MAP = { 0: '定金', 1: '诚意金', 2: '活动款', 3: '其他' };
    function stB(d) { return '<span class="layui-badge ' + (d.status == 1 ? 'layui-bg-green' : 'layui-bg-gray') + '">' + (d.status == 1 ? '已付款' : '未付款') + '<\/span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'mno', title: '会员号', width: 120 },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return d.category || '---'; } },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.brand || '---'; } },
                { field: 'money', title: '应收金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'status', title: '状态', width: 100, templet: stB },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'collecter', title: '收款人', width: 110, templet: function (d) { return d.collecter ? d.collecter.currentName : ''; } },
                { field: 'collectTime', title: '收款时间', width: 160 },
                { field: 'comment', title: '备注', minWidth: 160 },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'collect') openCollect(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.information.pageVpayment, $.extend({}, buildFilters(), { 'vpayment.status': 0, 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openAdd() {
        app.clearValidator(); $('#addForm')[0].reset(); form.render('select');
        state.addIndex = layer.open({ type: 1, title: '添加收款', content: $('#addBox'), area: ['600px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveAdd() {
        if (app.validate('addForm')) return;
        var brand = $('#addForm [name="brand"]').val();
        var opt = {
            'vpayment.mno': $('#addForm [name="mno"]').val(),
            'vpayment.orderId': $('#addForm [name="orderId"]').val(),
            'vpayment.type': $('#addForm [name="type"]').val(),
            'vpayment.category': brand.split('-')[1] || '',
            'vpayment.brand': brand.split('-')[0] || brand,
            'vpayment.money': $('#addForm [name="money"]').val(),
            'vpayment.comment': $('#addForm [name="comment"]').val()
        };
        app.post(api.information.createVpayment, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addIndex); state.addIndex = null; query(state.page); });
    }
    function openCollect(d) {
        app.clearValidator(); $('#collectForm')[0].reset();
        state.collectVpids = [d.vpid];
        $('#collectForm [name="vpids"]').val(d.vpid);
        $('#collectForm [name="referMoney"]').val(d.money);
        state.collectIndex = layer.open({ type: 1, title: '收款', content: $('#collectBox'), area: ['640px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveCollect() {
        if (app.validate('collectForm')) return;
        var referMoney = parseFloat($('#collectForm [name="referMoney"]').val());
        var realMoney = parseFloat($('#collectForm [name="cash"]').val() || 0) + parseFloat($('#collectForm [name="bank"]').val() || 0) + parseFloat($('#collectForm [name="coupon"]').val() || 0);
        if (referMoney != realMoney) { app.showAlert(app.warning, '当前实收款项总数与应收款项不等，请核实再进行提交！'); return; }
        var opt = {
            'vreceipt.cash': $('#collectForm [name="cash"]').val(),
            'vreceipt.bank': $('#collectForm [name="bank"]').val(),
            'vreceipt.bankInfo': $('#collectForm [name="bankInfo"]').val(),
            'vreceipt.coupon': $('#collectForm [name="coupon"]').val(),
            'vreceipt.couponInfo': $('#collectForm [name="couponInfo"]').val(),
            'vreceipt.comment': $('#collectForm [name="comment"]').val()
        };
        $.each(state.collectVpids, function (i, v) { opt['vpayments[' + i + '].vpid'] = v; });
        app.post(api.information.collectVpayment, opt, function () { app.showAlert(app.success, '收款成功'); layer.close(state.collectIndex); state.collectIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSaveAdd').on('click', doSaveAdd);
    $('#btnCancelAdd').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnSaveCollect').on('click', doSaveCollect);
    $('#btnCancelCollect').on('click', function () { layer.close(state.collectIndex); state.collectIndex = null; });
});
}); // end app.ready
