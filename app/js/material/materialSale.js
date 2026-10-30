/** app/js/material/materialSale.js —— 主材销售单（新建：表头 + 明细行录入，提交 addMaterial）
 * 行内可编辑表格：用户填写 num/salePrice/postDiscount 后由 change 事件重算 price/total。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.materialOrder || {};
    var saleType = app.params.materialSaleType || 'sale';
    var rows = []; // 编辑态行数据
    fillHead();
    initTable();
    addRow();
    function fillHead() {
        $('#headForm [name="orderId"]').val(ctx.orderId || '');
        $('#headForm [name="customerName"]').val(ctx.customerName || '');
        $('#headForm [name="orderAddr"]').val(ctx.orderAddr || '');
        $('#headForm [name="salesmanName"]').val(ctx.designerName || '');
        form.render();
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 50 },
                { field: 'name', title: '名称', width: 140, edit: 'text' },
                { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 100 },
                { field: 'measurementUnit', title: '单位', width: 70 },
                { field: 'unitPrice', title: '标价', width: 90 },
                { field: 'discount', title: '折扣', width: 70 },
                { field: 'salePrice', title: '折扣价', width: 100, edit: 'text' },
                { field: 'postDiscount', title: '折让', width: 80, edit: 'text' },
                { field: 'price', title: '售价', width: 100, edit: 'text' },
                { field: 'num', title: '数量', width: 80, edit: 'text' },
                { field: 'total', title: '总价', width: 100 },
                { field: 'packageName', title: '套餐', width: 100, edit: 'text' },
                { field: 'comment', title: '备注', width: 140, edit: 'text' },
                { title: '操作', width: 90, toolbar: '#rowToolbar' }
            ]] });
        table.on('edit(resultTable)', function (obj) { recount(obj.data); });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') { rows = rows.filter(function (r) { return r._rid !== obj.data._rid; }); table.reload('resultTable', { data: rows }); cyclTotal(); } });
    }
    function addRow() { var rid = 'r' + Date.now() + Math.floor(Math.random() * 1000); rows.push({ _rid: rid, name: '', category: '', brand: '', measurementUnit: '', unitPrice: '', discount: '', salePrice: '', postDiscount: '1', price: '', num: '1', total: '', packageName: '', comment: '' }); table.reload('resultTable', { data: rows }); }
    function recount(d) {
        var r = rows.filter(function (x) { return x._rid === d._rid; })[0];
        if (!r) return;
        $.extend(r, d);
        if (r.salePrice && r.postDiscount) { r.price = app.utils.changeTwoDecimal(app.utils.accMul(parseFloat(r.salePrice), parseFloat(r.postDiscount))); }
        if (r.price && r.num) { r.total = app.utils.changeTwoDecimal(app.utils.accMul(parseFloat(r.price), parseFloat(r.num))); }
        table.reload('resultTable', { data: rows });
        cyclTotal();
    }
    function cyclTotal() { var t = 0; rows.forEach(function (r) { t = app.utils.accAdd(t, parseFloat(r.total || 0)); }); $('#totalSpan').text(app.formatMoney(t)); }
    function submit() {
        if (!rows.length) { app.showAlert(app.warning, '请添加型号进行提交'); return; }
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (!r.name) { app.showAlert(app.warning, '第' + (i + 1) + '行名称不能为空'); return; }
            if (!/^(\d+|\d+\.\d{1,4})$/.test(r.salePrice || '')) { app.showAlert(app.warning, '第' + (i + 1) + '行折扣价格式错误'); return; }
            if (!/^(\d+|\d+\.\d{1,4})$/.test(r.num || '') || parseFloat(r.num) <= 0) { app.showAlert(app.warning, '第' + (i + 1) + '行数量格式错误'); return; }
        }
        var o = {};
        o['material.orderId'] = ctx.orderId;
        o['material.house.hid'] = ctx.hid;
        o['material.customer.cid'] = ctx.customerId;
        o['material.customer.name'] = ctx.customerName;
        o['material.type'] = $('#headForm [name="type"]').val();
        o['material.comment'] = $('#headForm [name="comment"]').val();
        o['material.salesman.userId'] = '';
        o['material.materialer.userId'] = '';
        o['material.instorer.userId'] = '';
        o['material.bid'] = '';
        rows.forEach(function (r, i) {
            o['materialItems[' + i + '].name'] = r.name;
            o['materialItems[' + i + '].category'] = r.category;
            o['materialItems[' + i + '].brand'] = r.brand;
            o['materialItems[' + i + '].measurementUnit'] = r.measurementUnit;
            o['materialItems[' + i + '].unitPrice'] = r.unitPrice;
            o['materialItems[' + i + '].discount'] = r.discount;
            o['materialItems[' + i + '].salePrice'] = r.salePrice;
            o['materialItems[' + i + '].postDiscount'] = r.postDiscount;
            o['materialItems[' + i + '].price'] = r.price;
            o['materialItems[' + i + '].num'] = r.num;
            o['materialItems[' + i + '].total'] = r.total;
            o['materialItems[' + i + '].packageName'] = r.packageName;
            o['materialItems[' + i + '].comment'] = r.comment;
            o['materialItems[' + i + '].prePoint'] = 0;
        });
        app.post(api.material.addMaterial, o, function () { app.showAlert(app.success, '添加成功'); app.switchPage(api.index.materialIndex.url); });
    }
    $('#btnAdd').on('click', addRow);
    $('#btnSubmit').on('click', submit);
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialIndex.url); });
});
}); // end app.ready
