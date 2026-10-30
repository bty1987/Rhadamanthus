/** app/js/sales/sales2create.js —— 创建销售单
 * 左侧选商品（typeahead/popup 选择），右侧填订单信息，下方明细列表，提交 addSales。 */
app.ready(function () {
layui.use(['table', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { goods: null, brand: null, items: [], orderId: '', customer: null, salesman: null, dompany: null, hid: null, suppliers: [], bid: null };
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || 'sales';
    if (pageType == 'profit') $('#typeGroup').hide();

    initTable(); bindGoods();

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
    function bindGoods() {
        // 简单 typeahead：商品名输入后失焦查询
        var $g = $('#goods');
        $g.on('blur', function () {
            var v = $.trim($g.val());
            if (!v) return;
            app.post(api.data.queryGoodsByName, { 'goods.name': v }, function (res) {
                var list = res.goodes || res.goods || [];
                if (list.length == 1) { fillLeft(list[0]); }
                else if (list.length > 1) {
                    // 弹出选择
                    var html = '<div style="padding:10px;">';
                    $.each(list, function (i, it) { html += '<div class="goods-pick" data-idx="' + i + '" style="padding:6px;cursor:pointer;border-bottom:1px solid #eee;">' + it.name + ' ' + (it.no || '') + '</div>'; });
                    html += '</div>';
                    var idx = layer.open({ type: 1, title: '选择商品', content: html, area: ['400px', '60%'], success: function () {
                        $('.goods-pick').on('click', function () { var i = parseInt($(this).attr('data-idx')); layer.close(idx); fillLeft(list[i]); });
                    } });
                }
            });
        });
    }
    function fillLeft(v) {
        state.goods = v;
        $('#goods').val(v.name);
        $('#goodsNo').val(v.no);
        $('#category').val(v.category);
        $('#brand').val(v.brand);
        $('#measurementUnit').val(v.measurementUnit);
        // 价格信息
        app.post(api.data.queryPriceByGid, { 'price.gid': v.gid }, function (res) {
            var prices = res.prices || [];
            if (prices.length) {
                var p = prices[0];
                $('#purchase').val(p.selling);
                $('#discount').val(1); $('#disPrice').val(p.selling);
                $('#postDis').val(1); $('#selling').val(p.selling);
                $('#num').val(1); $('#total').val(p.selling);
            } else { app.showAlert(app.warning, '该商品暂无价格信息,请录入'); }
        });
        // 颜色
        app.post(api.data.queryColorForEnableByGid, { 'color.gid': v.gid }, function (res) {
            var opts = ''; $.each(res.colors || [], function (i, c) { opts += '<option value="' + c.cid + '">' + c.name + '</option>'; });
            $('#color').html(opts || '<option value="">无</option>'); form.render();
        });
        // 规格
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
        var it = {
            gid: state.goods.gid, goodsName: state.goods.name + ' ' + (state.goods.no || ''),
            cid: $('#color').val(), colorName: $('#color option:selected').text(),
            fid: $('#format').val(), formatInfo: $('#format option:selected').text(),
            purchase: parseFloat($('#purchase').val()) || 0,
            discount: parseFloat($('#discount').val()) || 1,
            disPrice: parseFloat($('#disPrice').val()) || 0,
            postDis: parseFloat($('#postDis').val()) || 1,
            selling: parseFloat($('#selling').val()) || 0,
            num: parseFloat($('#num').val()) || 1,
            total: parseFloat($('#total').val()) || 0,
            remark: $('#remark').val()
        };
        state.items.push(it);
        table.reload('itemTable', { data: state.items });
        recomputeTotal();
        // 清空左侧
        $('#goodsForm')[0].reset(); state.goods = null;
        $('#color').html(''); $('#format').html(''); form.render();
    }
    function recomputeTotal() {
        var t = 0;
        $.each(state.items, function (i, v) { t = app.utils.accAdd(t, v.total); });
        $('#totals').val(t);
    }
    // 品牌选择
    $('#brands').on('blur', function () {
        var v = $.trim($(this).val());
        if (!v) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': v, 'brand.atttype': 0 }, function (res) {
            var list = res.brands || [];
            if (list.length) { state.brand = list[0]; state.bid = list[0].bid; $('#brands').val(list[0].name + '-' + list[0].category); loadSupplier(list[0]); }
        });
    });
    function loadSupplier(b) {
        app.post(api.communion.queryBrandSupplier, { 'brandSupplier.brand.bid': b.bid }, function (res) {
            state.suppliers = $.map(res.brandSuppliers || [], function (v) { return v.supplier; });
            var opts = ''; $.each(state.suppliers, function (i, s) { opts += '<option value="' + s.userId + '">' + (s.currentName || '') + '</option>'; });
            $('#supplier').html(opts); form.render();
        });
    }
    // 订单号失焦自动带出
    $('#orderId').on('blur', function () {
        var oid = $.trim($(this).val());
        if (!oid) return;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': oid }, function (res) {
            var d = res.decoration || {};
            state.customer = d.customer; state.dompany = d.dompany;
            state.hid = d.house ? d.house.hid : null;
            $('#customer').val(d.customer ? d.customer.name : '');
            $('#orderAddr').val((d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''));
        });
    });
    function doSubmit() {
        if (app.validate('orderForm')) return;
        if (!state.items.length) { app.showAlert(app.warning, '请添加销售项'); return; }
        var opt = {
            'sales.orderId': $('#orderId').val(),
            'sales.customer.cid': state.customer ? state.customer.cid : '',
            'sales.salesman.userId': '', 'sales.instorer.userId': '', 'sales.guider.userId': '',
            'sales.brand.bid': state.bid || '',
            'sales.supplier.userId': $('#supplier').val(),
            'sales.coupon': $('#coupon').val() ? app.utils.changeThrDecimal(parseFloat($('#coupon').val())) : 0,
            'sales.couponInfo': $('#couponInfo').val() ? '#' + $('#couponInfo').val() + ':' + $('#coupon').val() + '#' : ' ',
            'sales.comment': $('#comment').val(),
            'sales.maling': $('#maling').val() ? app.utils.changeThrDecimal(parseFloat($('#maling').val())) : 0,
            'sales.total': app.utils.changeThrDecimal(parseFloat($('#totals').val()) || 0),
            'sales.house.hid': state.hid,
            'sales.dompanys': state.dompany,
            'sales.type': $('#type').val()
        };
        $.each(state.items, function (i, v) {
            opt['salesItems[' + i + '].goods.gid'] = v.gid;
            opt['salesItems[' + i + '].color.cid'] = v.cid;
            opt['salesItems[' + i + '].format.fid'] = v.fid;
            opt['salesItems[' + i + '].purchase'] = v.purchase;
            opt['salesItems[' + i + '].selling'] = v.selling;
            opt['salesItems[' + i + '].discount'] = v.discount;
            opt['salesItems[' + i + '].disPrice'] = v.disPrice;
            opt['salesItems[' + i + '].postDis'] = v.postDis;
            opt['salesItems[' + i + '].price'] = v.selling;
            opt['salesItems[' + i + '].num'] = v.num;
            opt['salesItems[' + i + '].total'] = v.total;
            opt['salesItems[' + i + '].comment'] = v.remark;
            opt['salesItems[' + i + '].rawCtype'] = 0; opt['salesItems[' + i + '].rawCvalue'] = 0;
            opt['salesItems[' + i + '].ctype'] = 0; opt['salesItems[' + i + '].cvalue'] = 0;
        });
        app.post(api.sales.addSales, opt, function () {
            app.showAlert(app.success, '创建成功');
            doRefresh();
        });
    }
    function doRefresh() {
        $('#goodsForm')[0].reset(); $('#orderForm')[0].reset();
        state.goods = null; state.brand = null; state.items = []; state.bid = null;
        $('#color').html(''); $('#format').html(''); $('#supplier').html(''); form.render();
        table.reload('itemTable', { data: [] });
        $('#totals').val('');
    }
    $('#btnAddItem').on('click', addItem);
    $('#submit').on('click', doSubmit);
    $('#refresh').on('click', doRefresh);
});
}); // end app.ready
