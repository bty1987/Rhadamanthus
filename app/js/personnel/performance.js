/** performance.js —— 绩效管理（pagePerformance / addPreformance） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    var typeMap = { 0: '月度', 1: '季度', 2: '年度', 3: '其他' };
    var levelMap = { 0: 'A', 1: 'B', 2: 'C', 3: 'D' };

    app.bindData($('#editForm [name="type"]'), [{ key: 0, value: '月度' }, { key: 1, value: '季度' }, { key: 2, value: '年度' }, { key: 3, value: '其他' }], 'key', 'value', true, function () { form.render('select'); });
    app.bindData($('#editForm [name="level"]'), [{ key: 0, value: 'A' }, { key: 1, value: 'B' }, { key: 2, value: 'C' }, { key: 3, value: 'D' }], 'key', 'value', true, function () { form.render('select'); });
    laydate.render({ elem: '#editForm [name="startTime"]' });
    laydate.render({ elem: '#editForm [name="endTime"]' });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'user', title: '员工', width: 120, templet: function (d) { return d.user ? d.user.userName : '---'; } },
                { field: 'type', title: '类型', width: 100, templet: function (d) { return typeMap[d.type] || '---'; } },
                { field: 'value', title: '得分', width: 100 },
                { field: 'level', title: '等级', width: 90, templet: function (d) { return levelMap[d.level] || '---'; } },
                { field: 'startTime', title: '开始时间', width: 120 },
                { field: 'endTime', title: '结束时间', width: 120 },
                { field: 'work', title: '工作', minWidth: 160 },
                { field: 'content', title: '说明', minWidth: 160 } ]] });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pagePerformance, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    var ta = null;
    $('#users').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="user.userId"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'departmentType.name': '', 'user.status': 0 }, function (res) {
                var users = res.users || [];
                if (users.length === 1) { $('#users').val(users[0].currentName || users[0].userName); $('#editForm [name="user.userId"]').val(users[0].userId); }
                else if (users.length > 1) { showPick(users); }
            });
        }, 300);
    });
    function showPick(list) {
        var html = '';
        $.each(list, function (i, u) { html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + u.userId + '" data-name="' + (u.currentName || u.userName || '') + '">' + (u.currentName || u.userName || '') + (u.userId ? ' (' + u.userId + ')' : '') + '</div>'; });
        layer.open({ type: 1, title: '选择员工', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $('#users').val($(this).attr('data-name')); $('#editForm [name="user.userId"]').val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="user.userId"]').val(''); $('#users').val('');
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: '添加绩效', content: $('#editBox'), area: ['560px', '90%'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="user.userId"]').val();
        if (!uid) { app.showAlert(app.warning, '请选择员工'); return; }
        if ($('#editForm [name="startTime"]').val() >= $('#editForm [name="endTime"]').val()) { app.showAlert(app.warning, '开始时间应小于结束时间'); return; }
        app.post(api.personel.addPreformance, {
            'performance.user.userId': uid,
            'performance.type': $('#editForm [name="type"]').val(),
            'performance.value': $('#editForm [name="value"]').val(),
            'performance.level': $('#editForm [name="level"]').val(),
            'performance.startTime': $('#editForm [name="startTime"]').val(),
            'performance.endTime': $('#editForm [name="endTime"]').val(),
            'performance.work': $('#editForm [name="work"]').val(),
            'performance.content': $('#editForm [name="content"]').val()
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
