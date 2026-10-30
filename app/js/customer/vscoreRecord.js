/** app/js/customer/vscoreRecord.js —— 客户积分记录（旧 vscoreRecord.js → layui）
 *  上下文：app.params.customer = { id, unionId }。id==2 只读查看；否则可添加积分（raiseVscore）
 *  与通过/拒绝审核（updateVscoreRecordForStatus）。列表：pageVscoreRecordByUnionId；头部积分：queryVscoreByUnionId。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var E = customerCommon.ENUM;
    customerCommon.ensureApiStubs();
    var ctx = customerCommon.ctx('customer');
    var readonly = String(ctx.id) === '2';
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    if (ctx.unionId == null || ctx.unionId === '') { app.showAlert(app.warning, '缺少客户上下文'); return; }

    initTable();
    check();
    query(1);

    function initTable() {
        table.render({
            elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'operater', title: '操作人', width: 130, templet: function (d) { return d.operater ? (d.operater.currentName || '') : ''; } },
                { field: 'score', title: '积分操作', width: 110 },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return E.vscoreRecordType[d.type] != null ? E.vscoreRecordType[d.type] : (d.type != null ? d.type : ''); } },
                { field: 'status', title: '状态', width: 100, templet: function (d) { return customerCommon.badge(E.vscoreRecordStatus, d.status); } },
                { title: '操作', width: 150, fixed: 'right', toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var v = obj.data;
            if (obj.event === 'pass') {
                app.showConfirm('是否确认通过积分', function () {
                    app.post(api.customer.updateVscoreRecordForStatus, { 'vscoreRecord.vsrid': v.vsrid, 'vscoreRecord.status': 1 }, function () {
                        app.showAlert(app.success, '操作成功'); query(state.page); check();
                    });
                });
            } else if (obj.event === 'refuse') {
                app.showConfirm('是否确认拒绝积分', function () {
                    app.post(api.customer.updateVscoreRecordForStatus, { 'vscoreRecord.vsrid': v.vsrid, 'vscoreRecord.status': 2 }, function () {
                        app.showAlert(app.success, '操作成功'); query(state.page); check();
                    });
                });
            }
        });

        // 行工具条（只读模式不渲染操作列按钮）
        if (!$('#rowToolbar').length) {
            $('body').append(
                '<script type="text/html" id="rowToolbar">'
                + '{{# if(d.status == 0){ }}'
                + '<button class="layui-btn layui-btn-xs layui-btn-warm" lay-event="pass">通过</button>'
                + '<button class="layui-btn layui-btn-xs" lay-event="refuse">拒绝</button>'
                + '{{# } }}'
                + '<\/script>'
            );
        }
        if (readonly) {
            table.reload('resultTable', { cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'operater', title: '操作人', width: 130, templet: function (d) { return d.operater ? (d.operater.currentName || '') : ''; } },
                { field: 'score', title: '积分操作', width: 110 },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return E.vscoreRecordType[d.type] != null ? E.vscoreRecordType[d.type] : ''; } },
                { field: 'status', title: '状态', width: 100, templet: function (d) { return customerCommon.badge(E.vscoreRecordStatus, d.status); } }
            ]] });
        }
    }

    function check() {
        app.post(api.customer.queryVscoreByUnionId, { 'vscore.unionId': ctx.unionId }, function (res) {
            $('#result').text(res.vscore.score == null ? 0 : res.vscore.score);
        });
    }

    function query(pg) {
        state.page = pg || 1;
        var params = $.extend({}, customerCommon.buildFilters($('#searchForm')), {
            'unionId': ctx.unionId,
            'paging.page': state.page,
            'paging.rows': state.rows
        });
        app.post(api.customer.pageVscoreRecordByUnionId, params, function (res) {
            var pg2 = res.paging || { data: [], totalRecords: 0, totalPage: 0 };
            table.reload('resultTable', { data: pg2.data || [] });
            state.total = pg2.totalRecords || 0;
            laypage.render({
                elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30],
                layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
                jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); }
            });
        });
    }

    if (!readonly) {
        $('#btnAdd').on('click', function () {
            app.clearValidator();
            $('#editForm')[0].reset();
            state.editIndex = layer.open({ type: 1, title: '添加积分', content: $('#editBox'), area: ['420px', 'auto'] });
        });
        $('#btnSave').on('click', function () {
            if (app.validate('editForm')) return;
            app.post(api.customer.raiseVscore, {
                'vscore.unionId': ctx.unionId,
                'vscore.score': $('#editForm [name="vscore"]').val()
            }, function () {
                app.showAlert(app.success, '增加积分成功');
                layer.close(state.editIndex);
                state.editIndex = null;
                query(state.page);
            });
        });
        $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    } else {
        $('#btnAdd').hide();
    }
    $('#btnSearch').on('click', function () { query(1); });
});
}); // end app.ready
