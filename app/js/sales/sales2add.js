/** app/js/sales/sales2add.js —— 销售单添项
 * 上下文：app.params.sales.sales = {sid,...}
 * 选商品 → 添加到列表 → 提交 addSalesItem 批量添项。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var ctx = (app.params.sales && app.params.sales.sales) || {};
    var state = { goods: null, items: [], sdata: {}, preTotal: 0 };

    initTable(); loadSales(); bindGoods();

    function initTable() {
        table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goodsName', title: '商品', width: 200 },
                { field: 'colorName', title: '颜色', width: 100 },
                { field: 'formatInfo', title: '规格', width: 130 },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.selling); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'remark', title: '备注', minWidth: 120 },
                { title: '操作', width: 90, toolbar: '#itemToolbar' } ]] });
        table.on('tool(itemTable)', function (obj) { if (obj.event === 'del') { obj.del(); state.items.splice(obj.data.LAY_TABLE_INDEX, 1); recomputeTotal(); } });
    }
    function loadSales() {
        app.post(api.sales.querySalesBySid, { 'sales.sid': ctx.sid }, function (res) {
            state.sdata = res.sales || {};
            $('#orderId').val(state.sdata.orderId);
            $('#customer').val(state.sdata.customer ? state.sdata.customer.name : '');
            $('#salesman').val(state.sdata.salesman ? state.sdata.salesman.currentName : '');
            $('#instorer').val(state.sdata.instorer ? state.sdata.instorer.currentName : '');
            $('#guider').val(state.sdata.guider ? state.sdata.guider.currentName : '');
            $('#brands').val((state.sdata.brand ? state.sdata.brand.name : '') + '-' + (state.sdata.category || ''));
            $('#coupon').val(state.sdata.coupon);
            $('#couponInfo').val(state.sdata.couponInfo);
            $('#totals').val(state.sdata.total);
            $('#pretotals').val(state.sdata.total);
            $('#comment').val(state.sdata.comment);
            $('#orderAddr').val((state.sdata.house && state.sdata.house.village ? state.sdata.house.village.name : '') + ' ' + (state.sdata.house ? state.sdata.house.houseNumber : ''));
            state.preTotal = parseFloat(state.sdata.total) || 0;
        });
    }
    function bindGoods() {
        $('#goods').on('blur', function () {
            var v = $.trim($(this).val());
            if (!v) return;
            app.post(api.data.queryGoodsByName, { 'goods.name': v }, function (res) {
                var list = res.goodes || res.goods || [];
                if (list.length == 1) fillLeft(list[0]);
                else if (list.length > 1) {
                    var html = '<div style="padding:10px;">';
                    $.each(list, function (i, it) { html += '<div class="gp" data-idx="' + i + '" style="padding:6px;cursor:pointer;border-bottom:1px solid #eee;">' + it.name + ' ' + (it.no || '') + '</div>'; });
                    html += '</div>';
                    var idx = layer.open({ type: 1, title: '选择商品', content: html, area: ['400px', '60%'], success: function () { $('.gp').on('click', function () { var i = parseInt($(this).attr('data-idx')); layer.close(idx); fillLeft(list[i]); }); } });
                }
            });
        });
    }
    function fillLeft(v) {
        state.goods = v;
        $('#goods').val(v.name); $('#goodsNo').val(v.no); $('#measurementUnit').val(v.measurementUnit);
        app.post(api.data.queryPriceByGid, { 'price.gid': v.gid }, function (res) {
            var prices = res.prices || [];
            if (prices.length) {
                var p = prices[0];
                $('#purchase').val(p.selling); $('#discount').val(1); $('#disPrice').val(p.selling);
                $('#postDis').val(1); $('#selling').val(p.selling); $('#num').val(1); $('#total').val(p.selling);
            } else { app.showAlert(app.warning, '该商品暂无价格信息,请录入'); }
        });
        app.post(api.data.queryColorForEnableByGid, { 'color.gid': v.gid }, function (res) {
            var opts = ''; $.each(res.colors || [], function (i, c) { opts += '<option value="' + c.cid + '">' + c.name + '</option>'; });
            $('#color').html(opts || '<option value="">无</option>'); form.render();
        });
        app.post(api.data.queryFormatForEnableByGid, { 'format.gid': v.gid }, function (res) {
            var opts = ''; $.each(res.formats || [], function (i, f) { opts += '<option value="' + f.fid + '">' + f.info + '</option>'; });
            $('#format').html(opts || '<option value="">无</option>'); form.render();
        });
    }
    function recompute() {
        var purchase = parseFloat($('#purchase').val()) || 0;
        var discount = parseFloat($('#discount').val()) || 1;
        var postDis = parseFloat($('#postDis').val()) || 1;
        var num = parseFloat($('#num').val()) || 1;
        var disPrice = app.utils.changeThrDecimal(app.utils.accMul(purchase, discount));
        var selling = app.utils.changeThrDecimal(app.utils.accMul(disPrice, postDis));
        var total = app.utils.changeThrDecimal(app.utils.accMul(selling, num));
        $('#disPrice').val(disPrice); $('#selling').val(selling); $('#total').val(total);
    }
    $('#discount,#postDis,#num').on('input', recompute);
    function addItem() {
        if (!state.goods) { app.showAlert(app.warning, '请先选择商品'); return; }
        state.items.push({
            gid: state.goods.gid, goodsName: state.goods.name + ' ' + (state.goods.no || ''),
            cid: $('#color').val(), colorName: $('#color option:selected').text(),
            fid: $('#format').val(), formatInfo: $('#format option:selected').text(),
            purchase: parseFloat($('#purchase').val()) || 0, discount: parseFloat($('#discount').val()) || 1,
            disPrice: parseFloat($('#disPrice').val()) || 0, postDis: parseFloat($('#postDis').val()) || 1,
            selling: parseFloat($('#selling').val()) || 0, num: parseFloat($('#num').val()) || 1,
            total: parseFloat($('#total').val()) || 0, remark: $('#remark').val()
        });
        table.reload('itemTable', { data: state.items });
        recomputeTotal();
        $('#goodsForm')[0].reset(); state.goods = null; $('#color').html(''); $('#format').html(''); form.render();
    }
    function recomputeTotal() {
        var add = 0;
        $.each(state.items, function (i, v) { add = app.utils.accAdd(add, v.total); });
        $('#totals').val(app.utils.accAdd(state.preTotal, add));
    }
    function doSubmit() {
        if (!state.items.length) { app.showAlert(app.warning, '请添加销售项'); return; }
        function next(i) {
            if (i >= state.items.length) {
                app.showAlert(app.success, '添项成功');
                state.items = []; table.reload('itemTable', { data: [] });
                loadSales();
                return;
            }
            var v = state.items[i];
            var opt = {
                'salesItem.sales.sid': ctx.sid,
                'salesItem.goods.gid': v.gid,
                'salesItem.color.cid': v.cid,
                'salesItem.format.fid': v.fid,
                'salesItem.purchase': v.purchase,
                'salesItem.selling': v.selling,
                'salesItem.discount': v.discount,
                'salesItem.disPrice': v.disPrice,
                'salesItem.postDis': v.postDis,
                'salesItem.price': v.selling,
                'salesItem.num': v.num,
                'salesItem.total': v.total,
                'salesItem.comment': v.remark,
                'salesItem.rawCtype': 0, 'salesItem.rawCvalue': 0,
                'salesItem.ctype': 0, 'salesItem.cvalue': 0
            };
            app.post(api.sales.addSalesItem, opt, function () { next(i + 1); });
        }
        next(0);
    }
    $('#btnAddItem').on('click', addItem);
    $('#submit').on('click', doSubmit);
});
}); // end app.ready
