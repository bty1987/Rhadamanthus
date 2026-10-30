/** app/js/sales/sales.js —— 销售单主页
 * type=sales|dompany|pompany|supplier|advance。type=activity 自动跳转 salesActivity。
 * sales.status: 0初始/1已推送/2已确认/3已完成/4已完结/5已废单
 * sales.isAffirm: 0否/1是/2审批中；depositpayStatus/fullpayStatus/balanceStatus。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || 'sales';
    // activity 自动跳转
    if (pageType == 'activity') { app.switchPage(api.index.salesActivityIndex.url); return; }
    var state = { page: 1, rows: 10, total: 0, ascIndex: null, moneyIndex: null, curMoney: null };
    var API_MAP = {
        sales: api.sales.pageSales,
        dompany: api.sales.pageSalesForDompany,
        pompany: api.sales.pageSalesForPompany,
        supplier: api.sales.pageSalesForSupplier,
        advance: api.sales.pageSalesForAdvance
    };
    var listApi = API_MAP[pageType] || api.sales.pageSales;
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认', 3: '已完成', 4: '已完结', 5: '已废单' };
    var AFFIRM = { 0: '否', 1: '是', 2: '审批中' };
    var BAL = { 0: '未结算', 1: '预结', 2: '厂商结算', 3: '平台结算', 4: '已结算' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '销售单号', width: 140 },
                { field: 'orderId', title: '装修单号', width: 140 },
                { field: 'address', title: '楼盘地址', width: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } },
                { field: 'customer', title: '客户', width: 110, templet: function (d) { return (d.customer && d.customer.name) || '-'; } },
                { field: 'brand', title: '品牌', width: 140, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110 },
                { field: 'salesman', title: '渠道', width: 110, templet: function (d) { return (d.salesman && d.salesman.currentName) || '-'; } },
                { field: 'instorer', title: '驻店', width: 110, templet: function (d) { return (d.instorer && d.instorer.currentName) || '-'; } },
                { field: 'guider', title: '导购', width: 110, templet: function (d) { return (d.guider && d.guider.currentName) || '-'; } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'depositpay', title: '定金', width: 100, templet: function (d) { return app.formatMoney(d.depositpay); } },
                { field: 'fullpay', title: '补款', width: 100, templet: function (d) { return app.formatMoney(d.fullpay); } },
                { field: 'maling', title: '抹零', width: 90, templet: function (d) { return app.formatMoney(app.utils.accAdd(d.maling, d.venderMaling)); } },
                { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'grade', title: '等级', width: 80 },
                { field: 'isAffirm', title: '确认', width: 90, templet: function (d) { return AFFIRM[d.isAffirm] != null ? AFFIRM[d.isAffirm] : '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 3 ? 'layui-bg-green' : d.status == 5 ? 'layui-bg-black' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'balanceStatus', title: '结算', width: 90, templet: function (d) { return BAL[d.balanceStatus] != null ? BAL[d.balanceStatus] : '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 700, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'add') goAdd(v);
            else if (ev === 'item') goItem(v);
            else if (ev === 'money') openMoney(v);
            else if (ev === 'supple') goSupple(v);
            else if (ev === 'collect') goCollect(v);
            else if (ev === 'activity') goActivity(v);
            else if (ev === 'refund') goRefund(v);
            else if (ev === 'send') doSend(v);
            else if (ev === 'asc') openAscription(v);
            else if (ev === 'profile') goProfile(v);
            else if (ev === 'unpay') doUnpay(v);
            else if (ev === 'finish') doFinish(v);
            else if (ev === 'terminal') doTerminal(v);
            else if (ev === 'print') doPrint(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function passCtx(v) { app.params.sales = { sales: v, dompany: pageType, type: 'sales' }; }
    function goAdd(v) { passCtx(v); app.popup(api.index.addSalesItemsIndex.url, '添项', null, { area: ['90%', '80%'] }); }
    function goItem(v) { passCtx(v); app.popup(api.index.salesItemDetialIndex.url, '项目', null, { area: ['90%', '80%'] }); }
    function goSupple(v) { passCtx(v); app.popup(api.index.salesSupplement.url, '补单', null, { area: ['90%', '80%'] }); }
    function goCollect(v) { passCtx(v); app.params.sales.type = 'sales'; app.popup(api.index.salesCollectionIndex.url, '收款', null, { area: ['90%', '80%'] }); }
    function goActivity(v) { passCtx(v); app.popup(api.index.salesActivityIndex.url, '活动', null, { area: ['90%', '80%'] }); }
    function goRefund(v) { passCtx(v); app.params.flag = 'sales'; app.popup(api.index.refundsItemDetialIndex.url, '退货', null, { area: ['90%', '80%'] }); }
    function goProfile(v) {
        app.params.sales = { orderId: v.orderId, sid: v.sid, type: v.type };
        app.popup('/views/sales/salesProfile4detail.html', '满意度', null, { area: ['90%', '80%'] });
    }
    function doPrint(v) {
        app.params.sales = { sales: v, flag: 'fullPay' };
        app.popup(api.index.salesPrintIndex.url, '销售单打印', null, { area: ['900px', '600px'] });
    }
    function doSend(v) { app.post(api.sales.sendSales, { 'sales.sid': v.sid }, function () { app.showAlert(app.success, '推送成功'); }); }
    function doUnpay(v) { app.post(api.sales.unpaySales, { 'sales.sid': v.sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }
    function doFinish(v) {
        app.showConfirm('确定要将单号为 ' + v.no + ' 的销售单更新为完结状态吗?', function () {
            app.post(api.sales.finishSales, { 'sales.sid': v.sid }, function () { app.showAlert(app.success, '更新成功'); query(state.page); });
        });
    }
    function doTerminal(v) {
        app.showConfirm('确认销售单(' + v.no + ')为废单?', function () {
            app.post(api.sales.terminalSales, { 'sales.sid': v.sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function openMoney(v) {
        if (v.fullpayStatus == 3) { app.showAlert(app.warning, '款项正在审批中，无法进行操作'); return; }
        state.curMoney = v;
        $('#moneyForm [name="sid"]').val(v.sid);
        $('#mTotal').val(app.formatMoney(v.total));
        $('#mDeposit').val(app.formatMoney(v.depositpay));
        $('#mFull').val(app.formatMoney(v.fullpay));
        $('#mCoupon').val(app.formatMoney(v.coupon));
        $('#mMaling').val(app.formatMoney(app.utils.accAdd(v.maling, v.venderMaling)));
        // 按钮随款项状态显隐(-1初始/0提交中/1已付款/2已确认);双提交中(0,0)只放补款撤销,定金撤销后端因补款已存在必拒(150040)
        $('#mBtnDeposit').toggleClass('layui-hide', !(v.depositpayStatus == -1 && v.fullpayStatus == -1));
        $('#mBtnDepositCancel').toggleClass('layui-hide', !(v.depositpayStatus == 0 && v.fullpayStatus == -1));
        $('#mBtnFull').toggleClass('layui-hide', !(v.fullpayStatus == -1 && v.depositpayStatus != 0));
        $('#mBtnFullCancel').toggleClass('layui-hide', v.fullpayStatus != 0);
        state.moneyIndex = layer.open({ type: 1, title: '款项 - ' + v.no, content: $('#moneyBox'), area: ['600px', 'auto'], btn: ['关闭'] });
        $('#mBtnDeposit').off('click').on('click', function () { doPay(v, 2); });
        $('#mBtnFull').off('click').on('click', function () { doPay(v, 3); });
        $('#mBtnDepositCancel').off('click').on('click', function () {
            app.post(api.payment.cancelSalesPaymentForDeposit, { 'salesPayment.sales.sid': v.sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
        $('#mBtnFullCancel').off('click').on('click', function () {
            app.post(api.payment.cancelSalesPaymentForFullpay, { 'salesPayment.sales.sid': v.sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }
    function doPay(v, paymentType) {
        layer.prompt({ title: '请输入收款金额', value: app.formatMoney(paymentType == 2 ? v.depositpay : v.fullpay) }, function (val, i) {
            if (!/^\d+(\.\d{1,2})?$/.test(val) || parseFloat(val) <= 0) { app.showAlert(app.error, '金额格式错误'); return; }
            var isDeposit = paymentType == 2;
            var opt = isDeposit ? { 'salesPayment.sales.sid': v.sid, 'salesPayment.type': 2, 'salesPayment.referMoney': val } : { 'salesPayment.sales.sid': v.sid, 'salesPayment.referMoney': val };
            app.post(isDeposit ? api.payment.addSalesPaymentForDeposit : api.payment.addSalesPaymentForFullpay, opt, function () {
                layer.close(i); app.showAlert(app.success, '操作成功'); query(state.page);
            }, function () { layer.close(i); });
        });
    }
    function openAscription(v) {
        $('#ascForm [name="sid"]').val(v.sid);
        $('#ascForm [name="salesman.userId"]').val(v.salesman ? v.salesman.userId : '');
        $('#ascForm [name="instorer.userId"]').val(v.instorer ? v.instorer.userId : '');
        $('#ascForm [name="guider.userId"]').val(v.guider ? v.guider.userId : '');
        $('#ascForm [name="supplier.userId"]').val(v.supplier ? v.supplier.userId : '');
        state.ascIndex = layer.open({ type: 1, title: '改归属 - ' + v.no, content: $('#ascBox'), area: ['480px', 'auto'] });
    }
    function doAscSave() {
        app.post(api.sales.updateSalesForBelong, {
            'sales.sid': $('#ascForm [name="sid"]').val(),
            'sales.salesman.userId': $('#ascForm [name="salesman.userId"]').val(),
            'sales.instorer.userId': $('#ascForm [name="instorer.userId"]').val(),
            'sales.guider.userId': $('#ascForm [name="guider.userId"]').val(),
            'sales.supplier.userId': $('#ascForm [name="supplier.userId"]').val()
        }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.ascIndex); state.ascIndex = null; query(state.page); });
    }
    function goCreate() {
        // 新建销售单：跳到 sales2create
        app.popup('/views/sales/sales2create.html?type=' + pageType, '创建销售单', null, { area: ['95%', '90%'] });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnCreate').on('click', goCreate);
    $('#btnAscSave').on('click', doAscSave);
    $('#btnAscCancel').on('click', function () { layer.close(state.ascIndex); state.ascIndex = null; });
});
}); // end app.ready
