/** app/js/payment/paymentContract.js —— 款项支付签约合同
 *  列表 + 查看/公司签（选印章）/客户签/已签(affix)/失效(expire)/归档(filing)/下载 + 通知类（sendPaymentContract type 1~4）。
 *  status: 0=初始,1=有效,2=已签,3=归档,4=失效。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var PTYPE = { 0: '合同预付款', 1: '主材预付款', 2: '装修款', 3: '销售款', 4: '服务款' };
    var STATUS = { 0: '初始', 1: '有效', 2: '已签', 3: '归档', 4: '失效' };
    function ptB(d) { return PTYPE[d.paymentType] || '-'; }
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 3 ? 'layui-bg-green' : d.status == 4 ? 'layui-bg-red' : d.status == 2 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    var signets = [];
    app.post(api.data.querySignet, {}, function (res) { signets = res.signets || []; });
    laydate.render({ elem: '#createTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderId', title: '订单号', width: 160 }, { field: 'paymentType', title: '款项类型', width: 110, templet: ptB }, { field: 'creater.currentName', title: '创建人', width: 100, templet: function (d) { return d.creater ? d.creater.currentName : ''; } }, { field: 'signner.currentName', title: '签署人', width: 100, templet: function (d) { return d.signner ? d.signner.currentName : ''; } }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'comsignTime', title: '公司签时间', width: 170 }, { field: 'cussignTime', title: '客户签时间', width: 170 }, { field: 'status', title: '状态', width: 90, templet: stB }, { title: '操作', width: 380, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (ev === 'view') app.post(api.payment.viewPaymentContract, { 'paymentContract.pcid': v.pcid }, function (res) { if (res.redirect) window.open(res.redirect); });
            else if (ev === 'comsign') openComsign(v);
            else if (ev === 'cussign') openCussign(v);
            else if (ev === 'download') downloadContract(v);
            else if (ev === 'notify') sendNotify(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pagePaymentContract, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openComsign(v) {
        var opts = signets.map(function (s) { return '<option value="' + s.sid + '">' + s.name + '<\/option>'; }).join('');
        var html = '<div class="layui-form" style="padding:20px;"><div class="layui-form-item"><label class="layui-form-label">签章</label><div class="layui-input-block"><select id="signetSel">' + opts + '</select></div></div></div>';
        layer.open({ type: 1, title: '公司签 - ' + v.orderId, content: html, area: ['450px', 'auto'], btn: ['签署', '取消'], yes: function (i) {
            app.post(api.payment.signPaymentContractForCompany, { 'paymentContract.pcid': v.pcid, 'signet.sid': $('#signetSel').val() }, function () { layer.close(i); app.showAlert(app.success, '操作成功'); query(state.page); });
        } });
    }
    function openCussign(v) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v.orderId }, function (res) {
            var cid = res.decoration && res.decoration.customer ? res.decoration.customer.cid : '';
            app.post(api.payment.signPaymentContractForCustomer, { 'paymentContract.pcid': v.pcid, 'customer.cid': cid }, function (r) { if (r.redirect) window.open(r.redirect); });
        });
    }
    function downloadContract(v) {
        if (v.status == 3 && v.download) window.open(v.download);
        else if (v.path) window.open(app.config.media + v.path);
    }
    function sendNotify(v) {
        var html = '<div class="layui-form" style="padding:20px;"><div class="layui-form-item"><label class="layui-form-label">通知类型</label><div class="layui-input-block"><select id="notifyType"><option value="1">签名通知</option><option value="2">客签通知</option><option value="3">查看通知</option><option value="4">下载通知</option></select></div></div></div>';
        layer.open({ type: 1, title: '发送通知', content: html, area: ['400px', 'auto'], btn: ['发送', '取消'], yes: function (i) {
            var tp = $('#notifyType').val();
            app.showConfirm('是否发送通知?', function () {
                app.post(api.payment.sendPaymentContract, { 'paymentContract.pcid': v.pcid, 'paymentContract.type': tp }, function () { layer.close(i); app.showAlert(app.success, '发送成功'); });
            });
        } });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
