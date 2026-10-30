/** app/js/payment/paymentActivity.js —— 款项活动
 *  列表 + 更新弹窗（活动 select 从 queryActivityForValid 加载，填倍数/说明）。
 *  updatePaymentActivity({ paid, activity.aid, comment })。 */
app.ready(function () {
layui.use(['table', 'laypage', 'laydate', 'layer', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, laydate = layui.laydate, layer = layui.layer, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0 };
    var TYPE = { 0: '合同预付款', 1: '主材预付款', 2: '装修款', 3: '销售款', 4: '服务款' };
    function tpB(d) { return TYPE[d.type] || '-'; }
    laydate.render({ elem: '#createTime' });
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'orderId', title: '订单号', width: 160 }, { field: 'type', title: '类型', width: 110, templet: tpB }, { field: 'activity.name', title: '活动名称', width: 160, templet: function (d) { return d.activity ? d.activity.name : ''; } }, { field: 'realMoney', title: '实付额', width: 110, templet: function (d) { return app.formatMoney(d.realMoney); } }, { field: 'multiple', title: '倍数', width: 90 }, { field: 'createTime', title: '创建时间', width: 170 }, { field: 'comment', title: '说明', minWidth: 160 }, { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'update') openUpdate(obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.payment.pagePaymentActivity, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openUpdate(v) {
        app.post(api.information.queryActivityForValid, { 'activity.type': 0 }, function (res) {
            var acts = res.activitys || [];
            var opts = acts.map(function (a) { return '<option value="' + a.aid + '">' + a.name + '<\/option>'; }).join('');
            var html = '<div class="layui-form" style="padding:20px;" id="updForm">'
                + '<div class="layui-form-item"><label class="layui-form-label">活动</label><div class="layui-input-block"><select name="aid">' + opts + '</select></div></div>'
                + '<div class="layui-form-item"><label class="layui-form-label">说明</label><div class="layui-input-block"><textarea class="layui-textarea" name="comment">' + (v.comment || '') + '</textarea></div></div>'
                + '</div>';
            layer.open({ type: 1, title: '更新 - ' + v.orderId, content: html, area: ['500px', 'auto'], btn: ['保存', '取消'], yes: function (i) {
                var f = {}; $('#updForm [name]').each(function () { f[$(this).attr('name')] = $.trim($(this).val()); });
                app.post(api.payment.updatePaymentActivity, { 'paymentActivity.paid': v.paid, 'paymentActivity.activity.aid': f.aid, 'paymentActivity.comment': f.comment }, function () { layer.close(i); app.showAlert(app.success, '更新成功'); query(state.page); });
            } });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || '/views/home.html'); });
});
}); // end app.ready
