/** app/js/sales/sales2xg.js —— 销售单转出库单
 * type 来自 url ?type=xxx，默认 dompany。FULLPAYSTATUS_CONFIRM_SHORT = 3。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'laydate', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, batchSids: null, storehouses: [] };
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || 'dompany';
    var API_MAP = {
        pompany: api.sales.pageSalesForPompany,
        dompany: api.sales.pageSalesForDompany,
        supplier: api.sales.pageSalesForSupplier,
        balance: api.sales.pageSalesForBalance,
        advance: api.sales.pageSalesForAdvance
    };
    var listApi = API_MAP[pageType] || api.sales.pageSalesForDompany;
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认', 3: '已完成', 4: '已完结' };
    var FULLPAY_CONFIRM = 3;

    initTable(); query(1); laydate.render({ elem: '#manifestTime' });
    loadStorehouses();

    function loadStorehouses() {
        app.post(api.inventory.queryStorehouseForSelf, {}, function (res) {
            state.storehouses = $.map(res.storehouses || [], function (v) { return v.status == 0 ? v : null; });
        });
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'no', title: '销售单号', width: 140 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'address', title: '楼盘地址', width: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } },
                { field: 'customer', title: '客户', width: 110, templet: function (d) { return (d.customer && d.customer.name) || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110 },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return STATUS[d.status] != null ? STATUS[d.status] : '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'xg') openXg([obj.data]); });
        table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.goods ? d.goods.name + ' ' + d.goods.no : '-'); } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'num', title: '销售数量', width: 100 },
                { field: 'xg', title: '已出库', width: 100, templet: function (d) { return d.xgnum || 0; } },
                { field: 'outnum', title: '剩余数量', width: 100, templet: function (d) { return app.utils.accSub(d.num, d.xgnum || 0); } },
                { field: 'outprice', title: '出库单价', width: 130, templet: function (d) { return '<input type="number" class="layui-input itemPrice" data-siid="' + d.siid + '" value="' + app.formatMoney(d.selling) + '" style="width:100px;height:30px;">'; } },
                { field: 'pnum', title: '出库数量', width: 130, templet: function (d) { return '<input type="number" class="layui-input itemNum" data-siid="' + d.siid + '" value="0" style="width:100px;height:30px;">'; } },
                { field: 'storehouse', title: '出货仓库', width: 160, templet: function (d) { var opts = '<select class="itemStore" data-siid="' + d.siid + '">'; $.each(state.storehouses, function (i, s) { opts += '<option value="' + s.shid + '">' + (s.name || '') + '</option>'; }); opts += '</select>'; return opts; } } ]] });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openXg(rows) {
        var sids = [], invalid = [];
        $.each(rows, function (i, v) { sids.push(v.sid); if (v.fullpayStatus != FULLPAY_CONFIRM) invalid.push(v.no); });
        if (invalid.length) { app.showAlert(app.warning, '销售单 ' + invalid.join(',') + ' 补款未确认，无法转出库单'); return; }
        state.batchSids = sids;
        var opt = {}, a = sids.length == 1 ? api.sales.querySalesItemBySid : api.sales.querySalesItemBySids;
        if (sids.length == 1) opt['sales.sid'] = sids[0];
        else $.each(sids, function (i, sid) { opt['sids[' + i + ']'] = sid; });
        app.post(a, opt, function (res) {
            table.reload('itemTable', { data: res.salesItems || [] });
            form.render();
            state.editIndex = layer.open({ type: 1, title: sids.length > 1 ? '批量转出库单' : '转出库单', content: $('#editBox'), area: ['1000px', '70%'] });
        });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var checks = table.checkStatus('itemTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择需要转出库单的商品'); return; }
        var opt = { 'manifest.comment': $('#editForm [name="comment"]').val(), 'manifest.manifestTime': $('#editForm [name="manifestTime"]').val() };
        $.each(state.batchSids, function (i, sid) { opt['sids[' + i + ']'] = sid; });
        var valid = true;
        $.each(checks, function (i, v) {
            var price = parseFloat($('.itemPrice[data-siid="' + v.siid + '"]').val()) || 0;
            var num = parseFloat($('.itemNum[data-siid="' + v.siid + '"]').val()) || 0;
            var outnum = app.utils.accSub(v.num, v.xgnum || 0);
            var shid = $('.itemStore[data-siid="' + v.siid + '"]').val();
            if (num > outnum) { app.showAlert(app.warning, '转出库数量大于剩余数量'); valid = false; return false; }
            opt['manifestItems[' + i + '].siid'] = v.siid;
            opt['manifestItems[' + i + '].goods.gid'] = v.goods ? v.goods.gid : '';
            opt['manifestItems[' + i + '].color.cid'] = v.color ? v.color.cid : '';
            opt['manifestItems[' + i + '].format.fid'] = v.format ? v.format.fid : '';
            opt['manifestItems[' + i + '].outstorehouse.shid'] = shid;
            opt['manifestItems[' + i + '].outprice'] = price;
            opt['manifestItems[' + i + '].num'] = num;
        });
        if (!valid) return;
        app.post(api.inventory.addManifestForXG, opt, function () {
            app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null;
            $('#editForm [name="comment"]').val(''); $('#editForm [name="manifestTime"]').val('');
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnBatchXg').on('click', function () {
        var checks = table.checkStatus('resultTable').data;
        if (!checks.length) { app.showAlert(app.warning, '请选择销售单'); return; }
        openXg(checks);
    });
    $('#xgSaveBtn').on('click', doSave);
});
}); // end app.ready
