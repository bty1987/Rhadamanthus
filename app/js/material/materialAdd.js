/** app/js/material/materialAdd.js —— 主材添项（向已存在的子订单追加明细行）
 * 加载现有子订单基本信息后，行内编辑新增项，提交 addMaterialItem（批量）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var sub = app.params.materialSubOrder || {};
    var ctx = app.params.materialOrder || {};
    var rows = [];
    var TYPE = { 1: '标准', 2: '员工自购', 3: '老总关系' };
    fillHead(); initTable(); loadExisting(); addRow();
    function fillHead() {
        $('#headForm [name="msoNo"]').val(sub.msoNo || '');
        $('#headForm [name="customerName"]').val(sub.customerName || ctx.customerName || '');
        $('#headForm [name="orderAddr"]').val(sub.orderAddr || ctx.orderAddr || '');
        $('#materialOrderBrand').text(sub.materialBrand || '');
        form.render();
    }
    function loadExisting() {
        if (!sub.msoId) return;
        app.post(api.material.queryMaterialByMid, { 'material.mid': sub.msoId }, function (res) {
            var m = res.material || {};
            $('#headForm [name="type"]').val(TYPE[m.type] || '');
            $('#headForm [name="comment"]').val(m.comment || '');
            $('#originalTotalSpan').text(app.formatMoney(m.total));
            $('#totalSpan').text(app.formatMoney(m.total));
            form.render();
        });
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
    function recount(d) { var r = rows.filter(function (x) { return x._rid === d._rid; })[0]; if (!r) return; $.extend(r, d); if (r.salePrice && r.postDiscount) { r.price = app.utils.changeTwoDecimal(app.utils.accMul(parseFloat(r.salePrice), parseFloat(r.postDiscount))); } if (r.price && r.num) { r.total = app.utils.changeTwoDecimal(app.utils.accMul(parseFloat(r.price), parseFloat(r.num))); } table.reload('resultTable', { data: rows }); cyclTotal(); }
    function cyclTotal() { var t = 0; rows.forEach(function (r) { t = app.utils.accAdd(t, parseFloat(r.total || 0)); }); $('#totalSpan').text(app.formatMoney(t)); }
    function submit() {
        if (!rows.length) { app.showAlert(app.warning, '请添加型号进行提交'); return; }
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (!r.name) { app.showAlert(app.warning, '第' + (i + 1) + '行名称不能为空'); return; }
            if (!/^(\d+|\d+\.\d{1,4})$/.test(r.salePrice || '')) { app.showAlert(app.warning, '第' + (i + 1) + '行折扣价格式错误'); return; }
            if (!/^(\d+|\d+\.\d{1,4})$/.test(r.num || '') || parseFloat(r.num) <= 0) { app.showAlert(app.warning, '第' + (i + 1) + '行数量格式错误'); return; }
        }
        var o = { 'material.mid': sub.msoId };
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
        app.post(api.material.addMaterialItem, o, function () { app.showAlert(app.success, '添加成功'); app.switchPage(api.index.materialIndex.url); });
    }
    $('#btnAdd').on('click', addRow);
    $('#btnSubmit').on('click', submit);
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialIndex.url); });
});
}); // end app.ready
