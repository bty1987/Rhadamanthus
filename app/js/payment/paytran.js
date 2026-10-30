/** app/js/payment/paytran.js —— 转换款/POS推送
 *  列表 + 创建转换款弹窗 + 撤销/验证/删除/微信推送/POS推送。
 *  paytran.type: 0=预付款,1=装修款,2=主材款,3=销售款,4=服务款,5=活动款,6=转换款。
 *  atttype: 0=装修,1=主材。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var STATUS = { 0: '初始', 1: '已推送', 2: '成功', 3: '失败' };
    function stB(d) { var s = STATUS[d.status] || ('状态' + d.status); var c = d.status == 2 ? 'layui-bg-green' : d.status == 3 ? 'layui-bg-red' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    function attB(d) { return d.atttype == 0 ? '装修' : '主材'; }
    laydate.render({ elem: '#createTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderId', title: '装修单号', width: 160 }, { field: 'atttype', title: '业务类型', width: 90, templet: attB }, { field: 'no', title: '收据名称', width: 160 }, { field: 'sn', title: '机器编号', width: 140 }, { field: 'status', title: '状态', width: 90, templet: stB }, { field: 'money', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.money); } }, { field: 'creater.currentName', title: '创建人', width: 100, templet: function (d) { return d.creater ? d.creater.currentName : ''; } }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'pushTime', title: '推送时间', width: 170 }, { title: '操作', width: 400, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data, ev = obj.event;
            if (v.status != 0 && ev !== 'pos') { app.showAlert(app.warning, '仅初始状态可操作'); return; }
            if (ev === 'cancel') doAct(api.payment.cancelPaytran, { 'paytran.ptid': v.ptid }, '撤销完成');
            else if (ev === 'check') doAct(api.payment.checkPaytran, { 'paytran.ptid': v.ptid }, '验证完成');
            else if (ev === 'delete') doAct(api.payment.deletePaytran, { 'paytran.ptid': v.ptid }, '删除成功');
            else if (ev === 'wechat') app.showConfirm('是否发送付款通知', function () { app.post(api.payment.sendPaytran, { 'paytran.ptid': v.ptid }, function () { app.showAlert(app.info, '发送成功'); }); });
            else if (ev === 'pos') openPos(v);
        });
    }
    function doAct(url, opts, msg) { app.post(url, opts, function () { app.showAlert(app.info, msg); query(state.page); }); }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pagePaytran, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openPos(v) {
        var html = '<div class="layui-form" style="padding:20px;"><div class="layui-form-item"><label class="layui-form-label">推送方式</label><div class="layui-input-block"><select id="posWay"><option value="0">微信</option><option value="1">短信</option></select></div></div></div>';
        layer.open({ type: 1, title: 'POS推送 - ' + v.no, content: html, area: ['400px', 'auto'], btn: ['推送', '取消'], yes: function (i) {
            app.post(api.payment.posPay, { 'paytran.ptid': v.ptid, 'paytran.way': $('#posWay').val() }, function () { layer.close(i); app.showAlert(app.info, '推送成功'); query(state.page); });
        } });
    }
    // 创建转换款
    var createBtn = $('<button class="layui-btn" style="margin-left:10px;"><i class="layui-icon layui-icon-add-1"><\/i>创建转换款<\/button>').appendTo('#searchForm .layui-form-item');
    createBtn.on('click', function () {
        var html = '<div class="layui-form" style="padding:20px;" id="createForm">'
            + '<div class="layui-form-item"><label class="layui-form-label">装修单号</label><div class="layui-input-block"><input class="layui-input" name="orderId"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">金额</label><div class="layui-input-block"><input class="layui-input" name="money" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">业务类型</label><div class="layui-input-block"><select name="atttype"><option value="0">装修</option><option value="1">主材</option></select></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">收据名称</label><div class="layui-input-block"><input class="layui-input" name="no" data-rule="required"></div></div>'
            + '<div class="layui-form-item"><label class="layui-form-label">机器编号</label><div class="layui-input-block"><input class="layui-input" name="sn" data-rule="required"></div></div>'
            + '</div>';
        layer.open({ type: 1, title: '创建转换款', content: html, area: ['500px', 'auto'], btn: ['创建', '取消'], yes: function (i) {
            var f = {}; $('#createForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
            if (!f.money || !f.no || !f.sn) { app.showAlert(app.warning, '请填写必填项'); return; }
            app.post(api.payment.addPaytran, { 'paytran.orderId': f.orderId, 'paytran.money': f.money, 'paytran.type': 6, 'paytran.atttype': f.atttype, 'paytran.no': f.no, 'paytran.sn': f.sn, 'paytran.way': 0 }, function () { layer.close(i); app.showAlert(app.success, '创建成功'); query(state.page); });
        } });
    });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
