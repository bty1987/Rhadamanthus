/** app/js/information/message.js —— 系统消息（列表 + 发送 + 标记已读 + 删除）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    function typeB(d) { return d.type == 0 ? '<span class="layui-badge layui-bg-blue">系统</span>' : '<span class="layui-badge layui-bg-cyan">个人</span>'; }
    function stB(d) { return d.status == 0 ? '<span class="layui-badge layui-bg-gray">未读</span>' : '<span class="layui-badge layui-bg-green">已读</span>'; }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'mid', title: '消息ID', width: 90 },
                { field: 'contents', title: '内容', minWidth: 200 },
                { field: 'type', title: '类型', width: 90, templet: typeB },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'sender', title: '发送人', width: 120, templet: function (d) { return d.sender ? d.sender.userName : ''; } },
                { field: 'createTime', title: '时间', width: 160 },
                { title: '操作', width: 170, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'read') markRead([obj.data.mid]);
            else if (obj.event === 'del') del(obj.data.mid);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageMessage, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openSend() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '发送消息', content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        app.post(api.information.sendMessage, {
            'message.receiver.userId': $('#editForm [name="receiverUserId"]').val(),
            'message.contents': $('#editForm [name="contents"]').val(),
            'message.type': 1
        }, function () { app.showAlert(app.success, '发送成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function markRead(mids) {
        var opt = {}; $.each(mids, function (i, v) { opt['mids[' + i + ']'] = v; });
        app.post(api.information.updateMessageForRead, opt, function () { app.showAlert(app.success, '已标记已读'); query(state.page); });
    }
    function del(mid) {
        app.showConfirm('确认删除该消息？', function () {
            app.post(api.information.deleteMessageById, { 'message.mid': mid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openSend);
    $('#btnRead').on('click', function () {
        var ck = table.checkStatus('resultTable').data || []; if (!ck.length) { app.showAlert(app.warning, '请选择消息'); return; }
        var mids = []; $.each(ck, function (i, v) { mids.push(v.mid); }); markRead(mids);
    });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
