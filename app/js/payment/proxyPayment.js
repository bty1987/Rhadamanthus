/** app/js/payment/proxyPayment.js —— 代收款
 *  列表 + 创建代付款(addProxyPayment) + 收款/退款弹窗(collectProxyPayment/refundProxyPayment，现金/刷卡/转账三通道) + 批量确认(confirmProxyPayment)。
 *  type: 0=收款,1=退款。status: 0=初始,1=已收款,2=已退款,3=已确认。
 *  collect/refund 三通道：proxyReceipt.cash/bank/checkv，实收合计需等于 referMoney。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '收款', 1: '退款' };
    var STATUS = { 0: '初始', 1: '已收款', 2: '已退款', 3: '已确认' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 1 ? 'layui-bg-green' : d.status == 2 ? 'layui-bg-red' : d.status == 3 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 50 }, { type: 'numbers', title: '#', width: 60 }, { field: 'title', title: '标题', width: 160 }, { field: 'name', title: '名称', width: 140 }, { field: 'phone', title: '电话', width: 140 }, { field: 'address', title: '地址', minWidth: 160 }, { field: 'type', title: '类型', width: 80, templet: tpB }, { field: 'referMoney', title: '应收', width: 110, templet: function (d) { return app.formatMoney(d.referMoney); } }, { field: 'realMoney', title: '实收', width: 110, templet: function (d) { return app.formatMoney(d.proxyReceipt ? d.proxyReceipt.realMoney : 0); } }, { field: 'status', title: '状态', width: 90, templet: stB }, { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'collect') { if (v.type != 0 || v.status != 0) { app.showAlert(app.warning, '仅初始收款可操作'); return; } openCollect(v, 'collect'); }
        else if (obj.event === 'refund') { if (v.type != 1 || v.status != 0) { app.showAlert(app.warning, '仅初始退款可操作'); return; } openCollect(v, 'refund'); }
    });
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pageProxyPayment, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    query(1);
    function openCollect(v, mode) {
        var title = mode === 'refund' ? '退款 - ' + v.name : '收款 - ' + v.name;
        var html = '<div class="layui-form" style="padding:20px;" id="colForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">应收金额</label><div class="layui-input-block"><input class="layui-input" value="' + app.formatMoney(v.referMoney) + '" disabled></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">现金</label><div class="layui-input-block"><input class="layui-input" name="cash" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">刷卡</label><div class="layui-input-block"><input class="layui-input" name="bank" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">转账</label><div class="layui-input-block"><input class="layui-input" name="checkv" value="0"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">备注</label><div class="layui-input-block"><input class="layui-input" name="comment"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: title, content: html, area: ['500px', 'auto'], btn: [mode === 'refund' ? '退款' : '收款', '取消'], yes: function (i) {
            var f = {}; $('#colForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            var real = app.utils.accAdd(app.utils.accAdd(parseFloat(f.cash) || 0, parseFloat(f.bank) || 0), parseFloat(f.checkv) || 0);
            if (Math.abs(real - parseFloat(v.referMoney)) > 0.01) { app.showAlert(app.warning, '实收合计与应收不等'); return; }
            var url = mode === 'refund' ? api.payment.refundProxyPayment : api.payment.collectProxyPayment;
            var opts = { 'proxyPayment.ppid': v.ppid, 'proxyReceipt.comment': f.comment, 'proxyReceipt.cash': f.cash, 'proxyReceipt.bank': f.bank, 'proxyReceipt.checkv': f.checkv };
            app.post(url, opts, function () { layer.close(i); app.showAlert(app.success, (mode === 'refund' ? '退款' : '收款') + '成功'); query(state.page); });
        } });
    }
    $('#btnCreate').on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="createForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">标题</label><div class="layui-input-block"><input class="layui-input" name="title" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">名称</label><div class="layui-input-block"><input class="layui-input" name="name" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">电话</label><div class="layui-input-block"><input class="layui-input" name="phone"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">地址</label><div class="layui-input-block"><input class="layui-input" name="address"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">金额</label><div class="layui-input-block"><input class="layui-input" name="money" data-rule="required"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: '创建代付款', content: html, area: ['500px', 'auto'], btn: ['创建', '取消'], yes: function (i) {
            var f = {}; $('#createForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (!f.title || !f.name || !f.money) { app.showAlert(app.warning, '请填写必填项'); return; }
            app.post(api.payment.addProxyPayment, { 'proxyPayment.title': f.title, 'proxyPayment.name': f.name, 'proxyPayment.phone': f.phone, 'proxyPayment.address': f.address, 'proxyPayment.referMoney': f.money }, function () { layer.close(i); app.showAlert(app.success, '创建成功'); query(state.page); });
        } });
    });
    $('#btnConfirm').on('click', function () {
        var ck = table.checkStatus('resultTable').data;
        if (!ck.length) { app.showAlert(app.warning, '请选择要确认的代付款'); return; }
        var opts = {}; ck.forEach(function (v, i) { opts['ppids[' + i + ']'] = v.ppid; });
        app.showConfirm('确定将选中项置为已确认?', function () { app.post(api.payment.confirmProxyPayment, opts, function () { app.showAlert(app.success, '确认成功'); query(state.page); }); });
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
