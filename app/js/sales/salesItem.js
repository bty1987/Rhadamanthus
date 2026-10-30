/** app/js/sales/salesItem.js —— 销售项明细
 * 上下文：app.params.sales.sales = {sid,...}, app.params.sales.dompany
 * 按钮（退货/整单退/补单/导入）按 fullpayStatus / status / dompany / type 显隐。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var ctx = (app.params.sales && app.params.sales.sales) || {};
    var dompany = app.params.sales && app.params.sales.dompany;
    var state = { sdata: {}, editIndex: null, refundIndex: null, salesItem: null, approvalType: 0 };
    var DELIVERY = { 0: '未送', 1: '部分', 2: '已送', 3: '已确认', 4: '已完成' };
    var FULLPAY_CONFIRM = 3, STATUS_WAST = 7;
    initTable(); loadSales();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goods', title: '商品', width: 220, templet: function (d) { return (d.goods ? d.goods.name + ' ' + d.goods.no : '-'); } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.selling); } },
                { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.disPrice); } },
                { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'ctype', title: '结算', width: 90, templet: function (d) { return d.ctype == 0 ? '底价' : '点位'; } },
                { field: 'cvalue', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.cvalue); } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDel(obj.data);
        });
    }
    function loadSales() {
        app.post(api.sales.querySalesBySid, { 'sales.sid': ctx.sid }, function (res) {
            state.sdata = res.sales || {};
            // 按状态显隐
            var fullpayOK = (state.sdata.fullpayStatus == FULLPAY_CONFIRM || state.sdata.status == STATUS_WAST);
            if ((!fullpayOK) || dompany == 'pompany') {
                $('#btnRefund,#btnFullRefund,#btnReOrder').hide();
            }
            if (state.sdata.type == 1) $('#btnRefund').hide();
            loadItems();
        });
    }
    function loadItems() {
        app.post(api.sales.querySalesItemBySid, { 'sales.sid': ctx.sid }, function (res) {
            var list = res.salesItems || [];
            // 组织父子层级
            var map = {}, roots = [];
            $.each(list, function (i, v) { map[v.siid] = v; v.children = []; });
            $.each(list, function (i, v) { if (v.psiid && map[v.psiid]) map[v.psiid].children.push(v); else roots.push(v); });
            var flat = [];
            function walk(arr, lv) { $.each(arr, function (i, v) { v._lv = lv || 0; flat.push(v); if (v.children && v.children.length) walk(v.children, (lv || 0) + 1); }); }
            walk(roots, 0);
            table.reload('resultTable', { data: flat });
        });
    }
    function openEdit(v) {
        app.clearValidator();
        state.salesItem = v;
        $('#editForm [name="siid"]').val(v.siid);
        $('#editForm [name="num"]').val(v.num);
        $('#editForm [name="comment"]').val(v.comment || '');
        $('#editForm [name="oldNum"]').val(v.num);
        $('#editForm [name="oldTotal"]').val(v.total);
        state.editIndex = layer.open({ type: 1, title: '编辑 - ' + (v.goods ? v.goods.name : ''), content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doEditSave() {
        if (app.validate('editForm')) return;
        var num = parseFloat($('#editForm [name="num"]').val()) || 0;
        var v = state.salesItem;
        var total = app.utils.changeThrDecimal(app.utils.accMul(num, v.price));
        // 重算销售单总额
        var priceTotal = 0;
        var cache = layui.table.cache.resultTable || [];
        $.each(cache, function (i, it) { priceTotal = app.utils.accAdd(priceTotal, app.utils.changeThrDecimal(app.utils.accMul(it.num, it.price))); });
        priceTotal = app.utils.changeThrDecimal(app.utils.accAdd(app.utils.accSub(priceTotal, v.total), total));
        app.post(api.sales.updateSalesItem, {
            'salesItem.siid': v.siid,
            'salesItem.num': num,
            'salesItem.total': total,
            'salesItem.comment': $('#editForm [name="comment"]').val(),
            'sales.total': priceTotal
        }, function () {
            app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; loadItems();
        });
    }
    function doDel(v) {
        app.showConfirm('确认删除该销售项?', function () {
            app.post(api.sales.deleteSalesItem, { 'salesItem.siid': v.siid }, function () {
                app.showAlert(app.success, '删除成功'); loadItems();
            });
        });
    }
    function openRefund(type) {
        state.approvalType = type;
        $('#refundForm [name="approvalType"]').val(type);
        $('#refundTotal,#approver,#designDept,#refundDes').val('');
        state.refundIndex = layer.open({ type: 1, title: type == 0 ? '整单退货' : '部分退货', content: $('#refundBox'), area: ['500px', 'auto'] });
    }
    function doRefundSubmit() {
        if (app.validate('refundForm')) return;
        var args = JSON.stringify([
            { name: '订单号', value: state.sdata.orderId },
            { name: '销售单号', value: state.sdata.no },
            { name: '设计部', value: $('#designDept').val() },
            { name: '品牌', value: state.sdata.brand ? state.sdata.brand.name : '' },
            { name: '实退款金额(元)', value: $('#refundTotal').val() },
            { name: '办理状态', value: state.approvalType == 0 ? '全部退' : '部分退' },
            { name: '结算状态', value: state.sdata.balanceStatus },
            { name: '退货原因', value: $('#refundDes').val() },
            { name: '备注', value: state.sdata.comment || '' }
        ]);
        app.post(api.approval.submitApprovalForSalesRefund, {
            'approval.receiver.userId': $('#approver').val(),
            'approval.comment': $('#refundDes').val(),
            'approvalSalesRefund.sid': ctx.sid,
            'approvalSalesRefund.type': state.approvalType,
            'approvalSalesRefund.refund': $('#refundTotal').val(),
            'forms': args
        }, function () {
            app.showAlert(app.success, '操作成功'); layer.close(state.refundIndex); state.refundIndex = null;
        });
    }
    function reOrder() {
        app.params.sales.sales = state.sdata; app.params.sales.dompany = dompany;
        app.popup(api.index.salesSupplement.url, '补单', null, { area: ['90%', '80%'] });
    }
    function doImport() {
        // 触发文件选择
        var $f = $('<input type="file" accept=".xls,.xlsx" style="display:none;">').appendTo('body');
        $f.on('change', function () {
            var f = this.files[0]; if (!f) return;
            app.showAlert(app.info, '导入功能需要后端配合，请使用后端导入接口');
            $f.remove();
        });
        $f.click();
    }
    $('#btnEditSave').on('click', doEditSave);
    $('#btnEditCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnApproveSave').on('click', doRefundSubmit);
    $('#btnApproveCancel').on('click', function () { layer.close(state.refundIndex); state.refundIndex = null; });
    $('#btnRefund').on('click', function () { openRefund(1); });
    $('#btnFullRefund').on('click', function () { openRefund(0); });
    $('#btnReOrder').on('click', reOrder);
    $('#btnImport').on('click', doImport);
});
}); // end app.ready
