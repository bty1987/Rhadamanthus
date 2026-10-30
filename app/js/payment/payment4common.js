/** app/js/payment/payment4common.js —— 客户款项汇总
 *  上下文：app.params.orderId（可选）。按装修单号查 4 类款项明细（pagePayment/pageDecorationPayment/pageSalesPayment/pageServicePayment by orderId）。
 *  打印：勾选 ptype(款项类型)+rtype(结算方式)→ app.params.printConf → popup payment2print。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    var decoration = {};
    var AT = { 0: '提款', 1: '收款' }; var APT = { 1: '合同额', 2: '主材额' };
    var AST = { 0: '初始', 1: '已付款', 2: '已退款', 3: '已确认', 4: '已结算' };
    var SSTATUS = { 0: '初始', 1: '已提交', 2: '已审批', 3: '已确认', 4: '已结算' };
    table.render({ elem: '#advanceTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'type', title: '收款类型', width: 100, templet: function (d) { return AT[d.type] || '-'; } }, { field: 'paymentType', title: '类型', width: 100, templet: function (d) { return APT[d.paymentType] || '-'; } }, { field: 'recharge', title: '操作金额', width: 120, templet: function (d) { return app.formatMoney(d.recharge); } }, { field: 'cash', title: '现金', width: 100, templet: function (d) { return app.formatMoney(d.cash); } }, { field: 'bank', title: '刷卡', width: 100, templet: function (d) { return app.formatMoney(d.bank); } }, { field: 'checkv', title: '银行', width: 100, templet: function (d) { return app.formatMoney(d.checkv); } }, { field: 'status', title: '状态', width: 90, templet: function (d) { return ({ 0: '初始', 1: '已付款', 2: '已确认' }[d.status] || '-'); } }, { field: 'comment', title: '备注', minWidth: 140 } ]] });
    table.render({ elem: '#decorationTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'paymentType', title: '款项', width: 140 }, { field: 'referMoney', title: '应收', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'cash', title: '现金', width: 100, templet: function (d) { return app.formatMoney(d.cash); } }, { field: 'bank', title: '刷卡', width: 100, templet: function (d) { return app.formatMoney(d.bank); } }, { field: 'checkv', title: '银行', width: 100, templet: function (d) { return app.formatMoney(d.checkv); } }, { field: 'paymentStatus', title: '状态', width: 90, templet: function (d) { return AST[d.paymentStatus] || '-'; } }, { field: 'comment', title: '备注', minWidth: 140 } ]] });
    table.render({ elem: '#salesTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'sales.no', title: '销售单号', width: 150, templet: function (d) { return d.sales ? d.sales.no : ''; } }, { field: 'type', title: '类型', width: 90, templet: function (d) { return ({ 0: '定金', 1: '补款', 2: '全额' }[d.type]) || '-'; } }, { field: 'referMoney', title: '应收', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'salesReceipt.cash', title: '现金', width: 100, templet: function (d) { return app.formatMoney(d.salesReceipt ? d.salesReceipt.cash : 0); } }, { field: 'salesReceipt.bank', title: '刷卡', width: 100, templet: function (d) { return app.formatMoney(d.salesReceipt ? d.salesReceipt.bank : 0); } }, { field: 'status', title: '状态', width: 90, templet: function (d) { return SSTATUS[d.status] || '-'; } }, { field: 'salesReceipt.comment', title: '备注', minWidth: 140, templet: function (d) { return d.salesReceipt ? (d.salesReceipt.comment || '') : ''; } } ]] });
    table.render({ elem: '#serviceTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'type', title: '类型', width: 100, templet: function (d) { return ({ 0: '服务费', 1: '预付款' }[d.type]) || '-'; } }, { field: 'serviceMoney', title: '服务费', width: 110, templet: function (d) { return app.formatMoney(d.serviceMoney); } }, { field: 'advanceMoney', title: '预付款', width: 110, templet: function (d) { return app.formatMoney(d.advanceMoney); } }, { field: 'serviceReceipt.cash', title: '现金', width: 100, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.cash : 0); } }, { field: 'serviceReceipt.bank', title: '刷卡', width: 100, templet: function (d) { return app.formatMoney(d.serviceReceipt ? d.serviceReceipt.bank : 0); } }, { field: 'status', title: '状态', width: 90, templet: function (d) { return SSTATUS[d.status] || '-'; } }, { field: 'comment', title: '备注', minWidth: 140 } ]] });
    function main(orderId) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (dr) {
            decoration = dr.decoration || {};
            var c = decoration.customer || {};
            var h = '<div style="padding:8px 16px;background:#fafafa;margin-bottom:8px;border-radius:4px;">'
                + '<span style="margin-right:24px;">客户: <b>' + (c.name || '') + '<\/b></span>'
                + '<span style="margin-right:24px;">装修单号: <b>' + (decoration.orderId || '') + '<\/b></span>'
                + '<span style="margin-right:24px;">楼盘: ' + (decoration.house && decoration.house.village ? decoration.house.village.name : '') + ' ' + (decoration.house ? decoration.house.houseNumber : '') + '<\/span>'
                + '<span>等级: ' + (decoration.grade || '') + '<\/span><\/div>';
            $('#infolist').html(h);
        });
        app.post(api.payment.pagePayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': orderId, 'filters[0].op': 'eq', 'filters[1].field': 'status', 'filters[1].data': 0, 'filters[1].op': 'ne' }, function (res) { table.reload('advanceTable', { data: (res.paging || {}).data || [] }); });
        app.post(api.payment.pageDecorationPayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': orderId, 'filters[0].op': 'eq' }, function (res) { table.reload('decorationTable', { data: (res.paging || {}).data || [] }); });
        app.post(api.payment.pageSalesPayment, { 'paging.noPage': 1, 'filters[0].field': 'sales.orderId', 'filters[0].data': orderId, 'filters[0].op': 'eq' }, function (res) { table.reload('salesTable', { data: (res.paging || {}).data || [] }); });
        app.post(api.payment.pageServicePayment, { 'paging.noPage': 1, 'filters[0].field': 'decoration.orderId', 'filters[0].data': orderId, 'filters[0].op': 'eq' }, function (res) { table.reload('serviceTable', { data: (res.paging || {}).data || [] }); });
    }
    $('#btnSearch').on('click', function () { var oid = $.trim($('#orderId').val()); if (!oid) { app.showAlert(app.warning, '请输入装修单号'); return; } main(oid); });
    $('#btnPrint').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="printConfForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">款项类型</label><div class="layui-input-block">'
            + '<input type="checkbox" name="ptype" value="0" title="预付款"><input type="checkbox" name="ptype" value="1" title="装修款"><input type="checkbox" name="ptype" value="3" title="销售款"><input type="checkbox" name="ptype" value="4" title="服务款"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">结算方式</label><div class="layui-input-block">'
            + '<input type="checkbox" name="rtype" value="1" title="现金"><input type="checkbox" name="rtype" value="2" title="刷卡"><input type="checkbox" name="rtype" value="3" title="银行"><input type="checkbox" name="rtype" value="4" title="分期"><input type="checkbox" name="rtype" value="5" title="对公"><input type="checkbox" name="rtype" value="6" title="预付款"><input type="checkbox" name="rtype" value="7" title="券"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: '打印配置', content: html, area: ['600px', 'auto'], btn: ['打印', '取消'], success: function () { layui.form.render('checkbox'); }, yes: function (i) {
            var ptype = []; var rtype = [];
            $('#printConfForm [name="ptype"]:checked').each(function () { ptype.push($(this).val()); });
            $('#printConfForm [name="rtype"]:checked').each(function () { rtype.push($(this).val()); });
            if (!ptype.length || !rtype.length) { app.showAlert(app.warning, '请勾选打印参数'); return; }
            layer.close(i);
            app.params.printConf = { decoration: decoration, ptype: ptype, rtype: rtype };
            app.popup(api.index.payment2printIndex.url, '打印款项明细');
        } });
    });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
    // 外部直接带入 orderId 时自动加载
    if (app.params.orderId) { $('#orderId').val(app.params.orderId); $('#orderIdDiv').hide(); main(app.params.orderId); }
});
}); // end app.ready
