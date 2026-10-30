/** app/js/balance/balanceDccount.js —— 扣款账户
 * balanceDccount.status: 0有效(VALID)/1失效(UNVALID)；type: 0类型A/1类型B。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'laydate', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, laydate = layui.laydate, form = layui.form, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, createIndex: null, updateIndex: null, bdid: null };
    var STATUS_VALID = 0, STATUS_UNVALID = 1;
    initTable(); query(1);

    laydate.render({ elem: '#startTime' });
    laydate.render({ elem: '#endTime' });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'belonger', title: '归属人', width: 110, templet: function (d) { return (d.belonger && d.belonger.currentName) || '-'; } },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return (d.creater && d.creater.currentName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'startTime', title: '开始时间', width: 130 },
                { field: 'endTime', title: '结束时间', width: 130 },
                { field: 'cutpay', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.cutpay); } },
                { field: 'surplus', title: '余额', width: 110, templet: function (d) { return app.formatMoney(d.surplus); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = d.status == 0 ? '有效' : '失效'; var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 320, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'detail') goDetail(v);
            else if (ev === 'update') openUpdate(v);
            else if (ev === 'valid') doStatus(v, STATUS_VALID);
            else if (ev === 'invalid') doStatus(v, STATUS_UNVALID);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'eq'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(api.balance.pageBalanceDccount, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function goDetail(v) {
        app.params.balance = { bdid: v.bdid };
        app.popup(api.index.balanceDccountDetailIndex.url, '明细 - ' + v.name, null, { area: ['90%', '70%'] });
    }

    function openCreate() { app.clearValidator(); $('#createForm')[0].reset(); state.createIndex = layer.open({ type: 1, title: '创建扣款账户', content: $('#createBox'), area: ['500px', 'auto'] }); }
    function doCreate() {
        if (app.validate('createForm')) return;
        app.post(api.balance.addBalanceDccount, {
            'balanceDccess.belonger.userId': $('#createForm [name="belonger.userId"]').val(),
            'balanceDccess.name': $('#createForm [name="name"]').val(),
            'balanceDccess.type': $('#createForm [name="type"]').val(),
            'balanceDccess.comment': $('#createForm [name="comment"]').val(),
            'balanceDccess.startTime': $('#createForm [name="startTime"]').val(),
            'balanceDccess.endTime': $('#createForm [name="endTime"]').val(),
            'balanceDccess.cutpay': $('#createForm [name="cutpay"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.createIndex); state.createIndex = null; query(state.page); });
    }

    function openUpdate(v) {
        app.clearValidator();
        state.bdid = v.bdid;
        $('#updateForm [name="name"]').val(v.name);
        state.updateIndex = layer.open({ type: 1, title: '更新名称 - ' + v.name, content: $('#updateBox'), area: ['480px', 'auto'] });
    }
    function doUpdate() {
        if (app.validate('updateForm')) return;
        app.post(api.balance.updateBalanceDccount, {
            'balanceDccess.bdid': state.bdid,
            'balanceDccess.name': $('#updateForm [name="name"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.updateIndex); state.updateIndex = null; query(state.page); });
    }
    function doStatus(v, ns) {
        app.post(api.balance.updateBalanceDccountForStatus, { 'balanceDccess.bdid': v.bdid, 'balanceDccess.status': ns }, function () {
            app.showAlert(app.success, '操作成功'); query(state.page);
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnCreate').on('click', openCreate);
    $('#btnCreateConfirm').on('click', doCreate);
    $('#btnCreateCancel').on('click', function () { layer.close(state.createIndex); state.createIndex = null; });
    $('#btnUpdateConfirm').on('click', doUpdate);
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });
});
}); // end app.ready
