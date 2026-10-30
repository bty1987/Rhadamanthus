/** app/js/sales/sales2pu.js —— 销售单转采购单
 * type 来自 url ?type=xxx（app.params.urlLoadParams.type），默认 pompany。
 * FULLPAYSTATUS_CONFIRM_SHORT = 3（补款已确认）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'laydate', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, batchSids: null };
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || 'pompany';
    // 不同 type 不同接口
    var API_MAP = {
        pompany: api.sales.pageSalesForPompany,
        dompany: api.sales.pageSalesForDompany,
        supplier: api.sales.pageSalesForSupplier,
        balance: api.sales.pageSalesForBalance,
        advance: api.sales.pageSalesForAdvance
    };
    var listApi = API_MAP[pageType] || api.sales.pageSalesForPompany;
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认', 3: '已完成', 4: '已完结' };
    var BAL = { 0: '未结算', 1: '预结', 2: '厂商结算', 3: '平台结算', 4: '已结算' };
    var FULLPAY_CONFIRM = 3;

    initTable(); query(1); laydate.render({ elem: '#deliveryTime' });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'no', title: '销售单号', width: 140 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'address', title: '楼盘地址', width: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } },
                { field: 'customer', title: '客户', width: 110, templet: function (d) { return (d.customer && d.customer.name) || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110 },
                { field: 'salesman', title: '渠道', width: 110, templet: function (d) { return (d.salesman && d.salesman.currentName) || '-'; } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return STATUS[d.status] != null ? STATUS[d.status] : '-'; } },
                { field: 'balanceStatus', title: '结算', width: 90, templet: function (d) { return BAL[d.balanceStatus] != null ? BAL[d.balanceStatus] : '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'purchase') openPurchase([obj.data]); });
        table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.goods ? d.goods.name + ' ' + d.goods.no : '-'); } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'num', title: '销售数量', width: 100 },
                { field: 'pu', title: '已转采购', width: 100, templet: function (d) { return d.punum || 0; } },
                { field: 'outnum', title: '剩余数量', width: 100, templet: function (d) { return app.utils.accSub(d.num, d.punum || 0); } },
                { field: 'inprice', title: '采购单价', width: 130, templet: function (d) { return '<input type="number" class="layui-input itemPrice" data-siid="' + d.siid + '" value="' + app.formatMoney(d.purchase) + '" style="width:100px;height:30px;">'; } },
                { field: 'pnum', title: '采购数量', width: 130, templet: function (d) { return '<input type="number" class="layui-input itemNum" data-siid="' + d.siid + '" value="0" style="width:100px;height:30px;">'; } } ]] });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openPurchase(rows) {
        // 校验补款状态
        var sids = [], invalid = [];
        $.each(rows, function (i, v) { sids.push(v.sid); if (v.fullpayStatus != FULLPAY_CONFIRM) invalid.push(v.no); });
        if (invalid.length) { app.showAlert(app.warning, '销售单 ' + invalid.join(',') + ' 补款未确认，无法转采购单'); return; }
        state.batchSids = sids;
        var opt = {};
        if (sids.length == 1) opt['sales.sid'] = sids[0];
        else $.each(sids, function (i, sid) { opt['sids[' + i + ']'] = sid; });
        var api = sids.length == 1 ? api.sales.querySalesItemBySid : api.sales.querySalesItemBySids;
        app.post(api, opt, function (res) {
            table.reload('itemTable', { data: res.salesItems || [] });
            state.editIndex = layer.open({ type: 1, title: sids.length > 1 ? '批量转采购单' : '转采购单', content: $('#editBox'), area: ['900px', '70%'] });
        });
    }
    function doSave() {
        var checks = table.checkStatus('itemTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择需要转采购单的商品'); return; }
        var opt = {
            'purchase.comment': $('#editForm [name="comment"]').val(),
            'purchase.deliveryTime': $('#editForm [name="deliveryTime"]').val()
        };
        $.each(state.batchSids, function (i, sid) { opt['sids[' + i + ']'] = sid; });
        var valid = true;
        $.each(checks, function (i, v) {
            var price = parseFloat($('.itemPrice[data-siid="' + v.siid + '"]').val()) || 0;
            var num = parseFloat($('.itemNum[data-siid="' + v.siid + '"]').val()) || 0;
            var outnum = app.utils.accSub(v.num, v.punum || 0);
            if (num > outnum) { app.showAlert(app.warning, '转采购数量大于剩余数量'); valid = false; return false; }
            opt['purchaseItems[' + i + '].siid'] = v.siid;
            opt['purchaseItems[' + i + '].goods.gid'] = v.goods ? v.goods.gid : '';
            opt['purchaseItems[' + i + '].color.cid'] = v.color ? v.color.cid : '';
            opt['purchaseItems[' + i + '].format.fid'] = v.format ? v.format.fid : '';
            opt['purchaseItems[' + i + '].inprice'] = price;
            opt['purchaseItems[' + i + '].num'] = num;
        });
        if (!valid) return;
        app.post(api.inventory.addPurchase, opt, function () {
            app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null;
            $('#editForm [name="comment"]').val(''); $('#editForm [name="deliveryTime"]').val('');
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnBatchPu').on('click', function () {
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择销售单'); return; }
        openPurchase(checks);
    });
    $('#puSaveBtn').on('click', doSave);
});
}); // end app.ready
