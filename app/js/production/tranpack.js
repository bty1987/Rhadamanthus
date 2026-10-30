/** app/js/production/tranpack.js —— 运输包装（分页列表 + 状态流转 + 二维码）
 * 列表 pageTranpack；状态流转：instoreTranpack/planTranPack/tranTranpack/mountTranpack/completeTranpack/lossTranpack。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, qrcodeIndex: null };
    var TS = { 0: '初始', 1: '仓库', 2: '物流', 3: '运输', 4: '安装', 5: '完成', 6: '丢失', 7: '失效' };
    var TYPE = { 0: '外协', 1: '五金', 2: '计划' };
    function stB(d) { var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-cyan', 2: 'layui-bg-orange', 3: 'layui-bg-purple', 4: 'layui-bg-blue', 5: 'layui-bg-green', 6: 'layui-bg-red', 7: 'layui-bg-gray' }; return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (TS[d.status] || '-') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'type', title: '订单类型', width: 100, templet: function (d) { return TYPE[d.type] || '-'; } },
                { field: 'sender', title: '送货人', width: 110, templet: function (d) { return d.sender ? d.sender.userName : ''; } },
                { field: 'mounter', title: '安装人', width: 110, templet: function (d) { return d.mounter ? d.mounter.userName : ''; } },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'planTime', title: '物流时间', width: 150 },
                { field: 'tranTime', title: '送货时间', width: 150 }, { field: 'mountTime', title: '安装时间', width: 150 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 540, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageTranpack, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function handle(ev, v) {
        var map = { instore: ['1', api.production.instoreTranpack], receipt: ['2', api.production.planTranPack], transport: ['3', api.production.tranTranpack], install: ['4', api.production.mountTranpack], complete: ['5', api.production.completeTranpack], loss: ['6', api.production.lossTranpack] };
        if (ev === 'qrcode') { showQrcode(v); return; }
        if (map[ev]) {
            var status = map[ev][0], apiDef = map[ev][1];
            app.showConfirm('是否确认?', function () {
                app.post(apiDef, { 'tranpack.tid': v.tid, 'tranpack.status': status }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
            });
        }
    }
    function showQrcode(v) {
        var $box = $('#qrcodeBox').empty();
        $box.append('<div id="qrcanvas" style="display:inline-block;"></div>');
        $box.append('<p style="margin-top:10px;">单号: ' + v.no + '</p>');
        state.qrcodeIndex = layer.open({ type: 1, title: '二维码', content: $('#qrcodeBox'), area: ['280px', '320px'] });
        // 用 layui 内置无二维码库，回退为文本展示
        try {
            if (window.qrcode) { window.qrcode(document.getElementById('qrcanvas'), { text: 'fanglinserver:' + v.no, width: 200, height: 200 }); }
            else { $('#qrcanvas').html('<div style="width:200px;height:200px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;word-break:break-all;padding:8px;">fanglinserver:' + v.no + '</div>'); }
        } catch (e) { $('#qrcanvas').html('<div style="width:200px;height:200px;border:1px solid #ddd;display:flex;align-items:center;justify-content:center;word-break:break-all;padding:8px;">fanglinserver:' + v.no + '</div>'); }
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
});
}); // end app.ready
