/** app/js/sales/salesActivity.js —— 销售活动单（pageSalesActivity）
 * 操作：添项/项目/款项/活动/退货/归属/完结。
 * sales.status: 0初始/1已推送/2已确认/3已完成/4已完结
 * sales.isAffirm: 0否/1是/2审批中；depositpayStatus/fullpayStatus 同 material。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, ascIndex: null };
    var STATUS = { 0: '初始', 1: '已推送', 2: '已确认', 3: '已完成', 4: '已完结' };
    var AFFIRM = { 0: '否', 1: '是', 2: '审批中' };
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
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'depositpay', title: '定金', width: 100, templet: function (d) { return app.formatMoney(d.depositpay); } },
                { field: 'fullpay', title: '补款', width: 100, templet: function (d) { return app.formatMoney(d.fullpay); } },
                { field: 'maling', title: '抹零', width: 90, templet: function (d) { return app.formatMoney(app.utils.accAdd(d.maling, d.venderMaling)); } },
                { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'isAffirm', title: '确认', width: 90, templet: function (d) { return AFFIRM[d.isAffirm] != null ? AFFIRM[d.isAffirm] : '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 3 ? 'layui-bg-green' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { title: '操作', width: 480, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'add') goAdd(v);
            else if (ev === 'item') goItem(v);
            else if (ev === 'money') openMoney(v);
            else if (ev === 'activity') goActivity(v);
            else if (ev === 'refund') goRefund(v);
            else if (ev === 'asc') openAscription(v);
            else if (ev === 'finish') doFinish(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.sales.pageSalesActivity, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function passCtx(v) { app.params.sales = { sales: v, type: 'activity' }; }
    function goAdd(v) { passCtx(v); app.popup(api.index.addSalesItemsIndex.url, '添项', null, { area: ['90%', '80%'] }); }
    function goItem(v) { passCtx(v); app.params.sales.dompany = 'activity'; app.popup(api.index.salesItemDetialIndex.url, '项目', null, { area: ['90%', '80%'] }); }
    function goActivity(v) { passCtx(v); app.popup(api.index.salesActivityIndex.url, '活动', null, { area: ['90%', '80%'] }); }
    function goRefund(v) { passCtx(v); app.params.flag = 'sales'; app.popup(api.index.refundsItemDetialIndex.url, '退货', null, { area: ['90%', '80%'] }); }
    function openMoney(v) {
        var html = '<div class="layui-form" style="padding:20px;">'
            + '<div class="layui-form-item"><label class="layui-form-label">总价</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.total) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">定金</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.depositpay) + '" disabled></div><div class="layui-input-inline"><button type="button" class="layui-btn" id="mBtnDeposit">交款</button></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">补款</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.fullpay) + '" disabled></div><div class="layui-input-inline"><button type="button" class="layui-btn" id="mBtnFull">交款</button></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">券额</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(v.coupon) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">抹零</label><div class="layui-input-inline"><input class="layui-input" value="' + app.formatMoney(app.utils.accAdd(v.maling, v.venderMaling)) + '" disabled></div></div>'
            + '</div>';
        var idx = layer.open({ type: 1, title: '款项 - ' + v.no, content: html, area: ['600px', 'auto'], btn: ['关闭'] });
        $('#mBtnDeposit').on('click', function () { doPay(v, 2, idx); });
        $('#mBtnFull').on('click', function () { doPay(v, 3, idx); });
    }
    function doPay(v, paymentType, idx) {
        layer.prompt({ title: '请输入收款金额', value: app.formatMoney(paymentType == 2 ? v.depositpay : v.fullpay) }, function (val, i) {
            if (!/^\d+(\.\d{1,2})?$/.test(val) || parseFloat(val) <= 0) { app.showAlert(app.error, '金额格式错误'); return; }
            app.post(api.payment.addSalesPaymentForDeposit, { 'salesPayment.sales.sid': v.sid, 'salesPayment.type': paymentType, 'salesPayment.referMoney': val }, function () {
                layer.close(i); if (idx) layer.close(idx); app.showAlert(app.success, '收款成功'); query(state.page);
            }, function () {
                // 兜底
                layer.close(i); if (idx) layer.close(idx);
            });
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
    function doFinish(v) {
        app.showConfirm('确定要将单号为 ' + v.no + ' 的销售单更新为完结状态吗?', function () {
            app.post(api.sales.finishSales, { 'sales.sid': v.sid }, function () { app.showAlert(app.success, '更新成功'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAscSave').on('click', doAscSave);
    $('#btnAscCancel').on('click', function () { layer.close(state.ascIndex); state.ascIndex = null; });
});
}); // end app.ready
