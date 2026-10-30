/** app/js/sales/sales2supple.js —— 销售单补单
 * 上下文：app.params.sales.sales = {sid,...}
 * 列出原单的销售项，每行填"数量"，提交时调用 addSales 生成新单。 */
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var ctx = (app.params.sales && app.params.sales.sales) || {};
    var sid = ctx.sid;
    var sdata = {}, priceArray = [], otherStatus = null, hid = null, dompanys = null, cid = null;

    initTable(); loadSales(); loadItems();

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'goods', title: '商品', width: 220, templet: function (d) { return (d.goods ? d.goods.name + ' ' + d.goods.no : '-'); } },
                { field: 'color', title: '颜色', width: 100, templet: function (d) { return (d.color && d.color.name) || '-'; } },
                { field: 'format', title: '规格', width: 130, templet: function (d) { return (d.format && d.format.info) || '-'; } },
                { field: 'selling', title: '售价', width: 100, templet: function (d) { return app.formatMoney(d.selling); } },
                { field: 'disPrice', title: '折扣价', width: 100, templet: function (d) { return app.formatMoney(d.disPrice); } },
                { field: 'price', title: '折让价', width: 100, templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '原数量', width: 90 },
                { field: 'priceType', title: '类型', width: 90, templet: function (d) { return d.priceType == '0' ? '正价' : '特价'; } },
                { field: 'comment', title: '备注', minWidth: 140 },
                { field: 'inputNum', title: '补单数量', width: 130, align: 'center', templet: function (d) { return '<input type="number" class="layui-input" name="inputNumber" data-idx="' + d.LAY_TABLE_INDEX + '" value="0" style="width:90px;height:30px;margin:0 auto;">'; } } ]] });
    }
    function loadSales() {
        app.post(api.sales.querySalesBySid, { 'sales.sid': sid }, function (res) {
            sdata = res.sales || {}; otherStatus = sdata.otherStatus;
            $('#SupplementOrderId').val(sdata.orderId);
            $('#customerName').val(sdata.customer ? sdata.customer.name : '');
            $('#brands').val((sdata.brand ? sdata.brand.name : '') + '-' + (sdata.category || ''));
            $('#orderAddr').val((sdata.house && sdata.house.village ? sdata.house.village.name : '') + ' ' + (sdata.house ? sdata.house.houseNumber : ''));
            // 取装修单通用信息
            app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': sdata.orderId }, function (data) {
                var d = data.decoration || {};
                dompanys = d.dompany; cid = d.customer ? d.customer.cid : null; hid = d.house ? d.house.hid : null;
            });
        });
    }
    function loadItems() {
        app.post(api.sales.querySalesItemBySid, { 'sales.sid': sid }, function (data) {
            var list = data.salesItems || [];
            priceArray = list.map(function (v) { return v.price; });
            table.reload('resultTable', { data: list });
        });
    }
    // 监听数量变化计算总额
    $(document).on('change', 'input[name="inputNumber"]', function () {
        var total = 0;
        $('input[name="inputNumber"]').each(function (i, el) {
            var val = parseFloat($(el).val()) || 0;
            if (val) total = app.utils.accAdd(total, app.utils.accMul(val, priceArray[i] || 0));
        });
        $('#totals').val(total);
    });
    function doSubmit() {
        var opt = {
            'sales.orderId': $('#SupplementOrderId').val(),
            'sales.customer.cid': cid,
            'sales.guider.userId': '', 'sales.instorer.userId': '', 'sales.salesman.userId': '',
            'sales.brand.bid': sdata.brand ? sdata.brand.bid : '',
            'sales.supplier.userId': sdata.supplier ? sdata.supplier.userId : '',
            'sales.coupon': $('#SupplementCoupon').val() ? app.utils.changeThrDecimal(parseFloat($('#SupplementCoupon').val())) : 0,
            'sales.comment': $('#comment').val(),
            'sales.maling': $('#SupplementMaling').val() ? app.utils.changeThrDecimal(parseFloat($('#SupplementMaling').val())) : 0,
            'sales.total': isNaN(parseFloat($('#totals').val())) ? 0 : app.utils.changeThrDecimal(parseFloat($('#totals').val())),
            'sales.house.hid': hid,
            'sales.dompanys': dompanys,
            'sales.otherStatus': otherStatus,
            'sales.grade': sdata.grade,
            'sales.type': sdata.type
        };
        var couponInfo = $('#SupplementCoupon').val();
        opt['sales.couponInfo'] = (!couponInfo || couponInfo == 0) ? ' ' : '#:' + couponInfo + '#';
        // 收集填了数量的项
        var rows = $('.layui-table-body table tr').toArray();
        var items = [];
        // 通过 table cache 取数据更可靠
        var cache = layui.table.cache.resultTable || [];
        $.each(cache, function (i, v) {
            var inputEl = $('input[name="inputNumber"][data-idx="' + v.LAY_TABLE_INDEX + '"]');
            if (inputEl.length === 0) return true;
            var num = inputEl.val();
            if (num && num != 0) {
                items.push({ v: v, num: num });
            }
        });
        if (!items.length) { app.showAlert(app.warning, '请填写正确的补单数量'); return; }
        $.each(items, function (i, it) {
            var v = it.v;
            opt['salesItems[' + i + '].goods.gid'] = v.goods ? v.goods.gid : '';
            opt['salesItems[' + i + '].color.cid'] = v.color ? v.color.cid : '';
            opt['salesItems[' + i + '].format.fid'] = v.format ? v.format.fid : '';
            opt['salesItems[' + i + '].purchase'] = v.purchase;
            opt['salesItems[' + i + '].selling'] = v.selling;
            opt['salesItems[' + i + '].discount'] = v.discount;
            opt['salesItems[' + i + '].disPrice'] = v.disPrice;
            opt['salesItems[' + i + '].postDis'] = v.postDis;
            opt['salesItems[' + i + '].price'] = v.price;
            opt['salesItems[' + i + '].num'] = it.num;
            opt['salesItems[' + i + '].total'] = app.utils.changeThrDecimal(app.utils.accMul(it.num, v.price));
            opt['salesItems[' + i + '].comment'] = v.comment;
            opt['salesItems[' + i + '].rawCtype'] = v.rawCtype;
            opt['salesItems[' + i + '].rawCvalue'] = v.rawCvalue;
            opt['salesItems[' + i + '].ctype'] = v.rawCtype;
            opt['salesItems[' + i + '].cvalue'] = v.rawCvalue;
            opt['salesItems[' + i + '].priceType'] = v.priceType;
        });
        app.post(api.sales.addSales, opt, function () {
            app.showAlert(app.success, '补单成功');
            $('input[name="inputNumber"]').val(0);
            $('#totals').val('');
        });
    }
    $('#submit').on('click', doSubmit);
});
}); // end app.ready
