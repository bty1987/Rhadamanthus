/** app/js/material/materialPreBalance.js —— 主材预结（列表 + 复选框 + 预结/完结 + 子项/抹零操作）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, malingIndex: null };
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'checkbox', width: 50 },
                { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '主材单号', width: 140 },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: function (d) { return (d.house && d.house.village ? d.house.village.name : '') + ' ' + (d.house ? d.house.houseNumber : ''); } },
                { field: 'brand', title: '品牌', width: 120 },
                { field: 'customer.name', title: '客户', width: 100, templet: function (d) { return d.customer ? d.customer.name : ''; } },
                { field: 'salesman.currentName', title: '业务员', width: 100, templet: function (d) { return d.salesman ? d.salesman.currentName : ''; } },
                { field: 'total', title: '总价', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'maling', title: '抹零', width: 90 },
                { field: 'venderMaling', title: '厂商抹零', width: 90 },
                { field: 'coupon', title: '券值', width: 90 },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'fullpayTime', title: '补款时间', width: 160 },
                { field: 'comment', title: '备注', minWidth: 140 },
                { title: '操作', width: 160, toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'item') goDetail(obj.data);
            else if (obj.event === 'maling') openMaling(obj.data);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.material.pageMaterialForPreBalance, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function goDetail(v) { app.params.materialPreBalance = { msoId: v.mid }; app.switchPage(api.index.materialPreBalanceDetailIndex.url); }
    function openMaling(v) {
        $('#malingForm')[0].reset();
        $('#malingForm [name="mid"]').val(v.mid);
        $('#malingForm [name="malingTotal"]').val(app.utils.accAdd(v.maling, v.venderMaling));
        $('#malingForm [name="oldMaling"]').val(v.maling);
        $('#malingForm [name="oldVenderMaling"]').val(v.venderMaling);
        $('#malingForm [name="venderMaling"]').val(0);
        state.malingIndex = layer.open({ type: 1, title: '抹零 - ' + v.no, content: $('#malingBox'), area: ['520px', 'auto'] });
    }
    function doMalingSave() {
        if (app.validate('malingForm')) return;
        var mid = $('#malingForm [name="mid"]').val();
        var total = parseFloat($('#malingForm [name="malingTotal"]').val());
        var vm = parseFloat($('#malingForm [name="venderMaling"]').val());
        if (vm > total) { app.showAlert(app.error, '修改厂商抹零不能超过抹零总数'); return; }
        app.post(api.material.updateMaterialForMaling, { 'material.mid': mid, 'material.maling': app.utils.accSub(total, vm), 'material.venderMaling': vm }, function () { app.showAlert(app.success, '保存成功'); layer.close(state.malingIndex); query(state.page); });
    }
    function batch(action) {
        var ck = table.checkStatus('resultTable').data;
        if (!ck.length) { app.showAlert(app.warning, action == 'pre' ? '请选择要进行预结的订单' : '请选择要进行完结的订单'); return; }
        var o = {};
        ck.forEach(function (v, i) { o['mids[' + i + ']'] = v.mid; });
        var url = action == 'pre' ? api.material.preBalanceMaterial : api.material.passBalanceMaterial;
        var label = action == 'pre' ? '预结' : '完结';
        layer.confirm('确定' + label + '选中的 ' + ck.length + ' 个订单?', function (i) {
            app.post(url, o, function () { layer.close(i); app.showAlert(app.success, label + '成功'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnPreBalance').on('click', function () { batch('pre'); });
    $('#btnPassBalance').on('click', function () { batch('pass'); });
    $('#btnMalingSave').on('click', doMalingSave);
    $('#btnMalingCancel').on('click', function () { layer.close(state.malingIndex); });
});
}); // end app.ready
