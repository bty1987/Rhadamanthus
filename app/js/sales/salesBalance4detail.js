/** app/js/sales/salesBalance4detail.js —— 销售单结算项明细
 * 上下文：app.params.sales.sid, app.params.sales.dompany = true|false
 * dompany=true 时显示销售单摘要并支持预结 + 改结算。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var sid = (app.params.sales && app.params.sales.sid) || null;
    var dompany = (app.params.sales && app.params.sales.dompany === true) || (app.params.sales && app.params.sales.dompany === 'true');
    var state = { editIndex: null };
    initTable();
    if (dompany) loadSummary();
    loadItems();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.goods && d.goods.name) ? (d.goods.name + ' ' + d.goods.no) : '-'; } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.selling); } },
                { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.disPrice); } },
                { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'rawCtype', title: '原结算', width: 90, templet: function (d) { return d.rawCtype == 0 ? '底价' : '点位'; } },
                { field: 'rawCvalue', title: '原结算值', width: 100, templet: function (d) { return app.formatMoney(d.rawCvalue); } },
                { field: 'ctype', title: '结算', width: 90, templet: function (d) { return d.ctype == 0 ? '底价' : '点位'; } },
                { field: 'cvalue', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.cvalue); } },
                { field: 'profit', title: '利润', width: 100, templet: function (d) { return app.formatMoney(calcProfit(d)); } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        if (!dompany) { table.reload('resultTable', { cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'goods', title: '商品', width: 200, templet: function (d) { return (d.goods && d.goods.name) ? (d.goods.name + ' ' + d.goods.no) : '-'; } }, { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } }, { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } }, { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.selling); } }, { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.disPrice); } }, { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.price); } }, { field: 'num', title: '数量', width: 80 }, { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } }, { field: 'ctype', title: '结算', width: 90, templet: function (d) { return d.ctype == 0 ? '底价' : '点位'; } }, { field: 'cvalue', title: '结算值', width: 100, templet: function (d) { return app.formatMoney(d.cvalue); } }, { field: 'comment', title: '备注', minWidth: 140 } ]] }); }
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'ctype') openEdit(obj.data); });
    }
    function calcProfit(v) {
        if (v.ctype == 1) return app.utils.accMul(app.utils.accSub(v.price, app.utils.accMul(v.disPrice, app.utils.accSub(1, v.cvalue))), v.num);
        return app.utils.accMul(app.utils.accSub(v.price, v.cvalue), v.num);
    }
    function loadSummary() {
        app.post(api.sales.querySalesBySid, { 'sales.sid': sid }, function (res) {
            var v = res.sales || {};
            var addr = (v.house && v.house.village ? v.house.village.name : '') + ' ' + (v.house ? v.house.houseNumber : '');
            var html = '<div style="border:1px solid #e6e6e6;padding:10px;margin-bottom:10px;">'
                + '<h3 style="margin:0 0 8px 0;">销售单号: ' + (v.no || '') + ' <small style="color:#999;">(' + (v.orderId || '') + ')</small></h3>'
                + '<div class="layui-row layui-col-space10">'
                + '<div class="layui-col-md4"><strong>楼盘地址:</strong> ' + addr + '</div>'
                + '<div class="layui-col-md2"><strong>客户:</strong> ' + (v.customer ? v.customer.name : '') + '</div>'
                + '<div class="layui-col-md2"><strong>渠道:</strong> ' + (v.salesman ? v.salesman.currentName : '') + '</div>'
                + '<div class="layui-col-md2"><strong>部门:</strong> ' + (v.dept ? v.dept.name : '') + '</div>'
                + '<div class="layui-col-md2"><strong>分区:</strong> ' + (v.region ? v.region.name : '') + '</div>'
                + '<div class="layui-col-md2"><strong>导购:</strong> ' + (v.guider ? v.guider.currentName : '') + '</div>'
                + '<div class="layui-col-md2"><strong>驻店:</strong> ' + (v.instorer ? v.instorer.currentName : '') + '</div>'
                + '<div class="layui-col-md2"><strong>品牌:</strong> ' + (v.brand ? v.brand.name : '') + '</div>'
                + '<div class="layui-col-md2"><strong>定金:</strong> ' + app.formatMoney(v.depositpay) + '</div>'
                + '<div class="layui-col-md2"><strong>补款:</strong> ' + app.formatMoney(v.fullpay) + '</div>'
                + '<div class="layui-col-md2"><strong>总额:</strong> ' + app.formatMoney(v.total) + '</div>'
                + '<div class="layui-col-md2"><strong>抹零:</strong> ' + app.formatMoney(v.maling) + '</div>'
                + '<div class="layui-col-md2"><strong>厂商抹零:</strong> ' + app.formatMoney(v.venderMaling) + '</div>'
                + '<div class="layui-col-md2"><strong>券值:</strong> ' + app.formatMoney(v.coupon) + '</div>'
                + '</div>'
                + '<div style="margin-top:8px;"><button type="button" class="layui-btn layui-btn-sm" id="btnPreBalance"><i class="layui-icon layui-icon-rmb"></i>预结算</button></div>'
                + '</div>';
            $('#salesSummary').html(html);
            $('#btnPreBalance').on('click', function () { doPreBalance(v); });
        });
    }
    function loadItems() {
        if (!sid) return;
        app.post(api.sales.querySalesItemBySid, { 'sales.sid': sid }, function (res) {
            table.reload('resultTable', { data: res.salesItems || [] });
        });
    }
    function doPreBalance(v) {
        app.showConfirm('确定要将单号为 ' + v.no + ' 的销售单进行预结吗?', function () {
            app.post(api.sales.preSalesBalance, { 'sid[0]': v.sid }, function () { app.showAlert(app.success, '预结成功'); });
        });
    }
    function openEdit(v) {
        app.clearValidator();
        $('#editForm [name="siid"]').val(v.siid);
        $('#editForm [name="ctype"]').val(v.ctype);
        $('#editForm [name="cvalue"]').val(v.cvalue);
        form.render();
        state.editIndex = layer.open({ type: 1, title: '改结算 - ' + (v.goods ? v.goods.name : ''), content: $('#editBox'), area: ['420px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.sales.updateSalesItemForBalance, {
            'salesItem.siid': $('#editForm [name="siid"]').val(),
            'salesItem.ctype': $('#editForm [name="ctype"]').val(),
            'salesItem.cvalue': $('#editForm [name="cvalue"]').val()
        }, function () { app.showAlert(app.success, '更改成功'); layer.close(state.editIndex); state.editIndex = null; loadItems(); });
    }
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
