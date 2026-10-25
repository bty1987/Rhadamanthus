/** app/js/sales/salesDelivery.js —— 销售送货管理
 * pagetype: init|check|confirm|finish|balance|supplier|instorer。
 * 不同 pagetype 选择不同接口：pageSalesDeliveryItem / pageSalesDeliveryItemForSupplier / pageSalesDeliveryItemForInstorer。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.pagetype) || 'init';
    var state = { page: 1, rows: 10, total: 0, editIndex: null, tranIndex: null, curSdiid: null };
    var listApi = api.sales.pageSalesDeliveryItem;
    if (pageType == 'supplier') listApi = api.sales.pageSalesDeliveryItemForSupplier;
    else if (pageType == 'instorer') listApi = api.sales.pageSalesDeliveryItemForInstorer;
    // 公司过滤维度, 对齐老版页面映射: tran/check=装修公司(dompany), 其余=销售公司(company)
    var companyType = (pageType == 'tran' || pageType == 'check') ? 'sales.dompany' : 'company';
    var STATUS = { 0: '初始', 1: '部分', 2: '已送', 3: '已确认', 4: '已完成' };
    laydate.render({ elem: '#protranTime' });
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'salesNo', title: '销售单号', width: 140, templet: function (d) { return (d.sales && d.sales.no) || '-'; } },
                { field: 'orderId', title: '装修单号', width: 140, templet: function (d) { return (d.sales && d.sales.orderId) || '-'; } },
                { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.salesItem && d.salesItem.goods) ? (d.salesItem.goods.name + ' ' + d.salesItem.goods.no) : '-'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.salesItem && d.salesItem.goods) ? d.salesItem.goods.brand : '-'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return (d.salesItem && d.salesItem.goods) ? d.salesItem.goods.category : '-'; } },
                { field: 'num', title: '订单数量', width: 100, templet: function (d) { return d.salesItem ? d.salesItem.num : '-'; } },
                { field: 'initnum', title: '初始数量', width: 100 },
                { field: 'trnum', title: '配送数量', width: 100 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status == 4 ? 'layui-bg-green' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'tranTime', title: '配送时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'edit') openEdit(v);
            else if (ev === 'tran') openTran(v);
            else if (ev === 'check') doAction(api.sales.checkSalesDeliveryItem, v);
            else if (ev === 'confirm') doAction(api.sales.confirmSalesDeliveryItem, v);
            else if (ev === 'finish') doFinish(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows, 'companyType': companyType }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(v) {
        app.clearValidator();
        $('#editForm [name="sdiid"]').val(v.sdiid);
        $('#editForm [name="protranTime"]').val(v.protranTime ? v.protranTime.substring(0, 10) : '');
        $('#editForm [name="comment"]').val(v.comment || '');
        if (pageType != 'init') $('#editForm [name="protranTime"]').attr('disabled', 'disabled'); else $('#editForm [name="protranTime"]').removeAttr('disabled');
        state.editIndex = layer.open({ type: 1, title: '编辑配送', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        app.post(api.sales.updateSalesDeliveryItem, {
            'salesDeliveryItems[0].sdiid': $('#editForm [name="sdiid"]').val(),
            'salesDeliveryItems[0].protranTime': $('#editForm [name="protranTime"]').val(),
            'salesDeliveryItems[0].comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function openTran(v) {
        app.clearValidator();
        state.curSdiid = v.sdiid;
        $('#tranGoodsName').val(v.salesItem && v.salesItem.goods ? v.salesItem.goods.name : '');
        $('#tranOrderNum').val(v.salesItem ? v.salesItem.num : '');
        $('#tranNum').val('');
        state.tranIndex = layer.open({ type: 1, title: '配送', content: $('#tranBox'), area: ['480px', 'auto'] });
    }
    function doTranSave() {
        if (app.validate('tranForm')) return;
        app.post(api.sales.tranSalesDeliveryItem, {
            'salesDeliveryItems[0].sdiid': state.curSdiid,
            'salesDeliveryItems[0].trnum': $('#tranNum').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.tranIndex); state.tranIndex = null; query(state.page); });
    }
    function doAction(a, v) {
        app.post(a, { 'salesDeliveryItems[0].sdiid': v.sdiid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doFinish(v) {
        app.showConfirm('确认销售项配送完结?', function () {
            app.post(api.sales.finishSalesDeliveryItem, { 'salesDeliveryItems[0].sdiid': v.sdiid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnTranSave').on('click', doTranSave);
    $('#btnTranCancel').on('click', function () { layer.close(state.tranIndex); state.tranIndex = null; });
});
}); // end app.ready
