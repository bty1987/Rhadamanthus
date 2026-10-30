/** app/js/salary/salary.js —— 薪资管理（列表 + 添加 + 通过/拒绝/撤销）
 *  对齐旧 WebContent/js/salary/salary.js。
 *  pagetype=belong 时按当前登录用户过滤，隐藏归属人/操作人列与操作按钮。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, belong: false };

    var TYPE_MAP = { 0: '加', 1: '减' };
    var STATUS_MAP = { 0: '初始', 1: '通过', 2: '驳回', 3: '撤销' };
    var statusColor = { 0: 'layui-bg-gray', 1: 'layui-bg-green', 2: 'layui-bg-red', 3: 'layui-bg-orange' };
    var salaryType = {}, oneType = {}, twoType = {}, thrType = [], forType = [], twoTypeMap = {};
    var belongUserId = (app.params.userInfo && app.params.userInfo.user) ? app.params.userInfo.user.userId : '';

    // 旧页面通过 urlLoadParams.pagetype 区分；当前页面默认 list 模式
    function stB(d) { return '<span class="layui-badge ' + (statusColor[d.status] || 'layui-bg-gray') + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; }

    laydate.render({ elem: '#createTime', range: '~' });
    laydate.render({ elem: '#operateTime', range: '~' });

    app.post(api.ds.salary, {}, function (res) {
        salaryType = listToMap(res.type, 'id', 'name');
        oneType = listToMap(res.oneType, 'id', 'name');
        twoType = listToMap(res.twoType, 'id', 'name');
        twoTypeMap = listToMap(res.twoType, 'id', 'name');
        thrType = res.thrType || [];
        forType = res.forType || [];
        initTable(); query(1);
    });

    function listToMap(list, k, v) { var m = {}; if (list) { for (var i = 0; i < list.length; i++) m[list[i][k]] = list[i][v]; } return m; }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'comment', title: '说明', minWidth: 160, templet: function (d) { return (d.comment || '') + ' ' + (twoTypeMap[d.twotype] || ''); } },
                { field: 'user', title: '归属人', width: 110, hide: state.belong, templet: function (d) { return d.user ? (d.user.currentName || d.user.userName || '') : ''; } },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'money', title: '操作金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'operater', title: '操作人', width: 110, hide: state.belong, templet: function (d) { return d.operater ? (d.operater.currentName || '') : ''; } },
                { field: 'operateTime', title: '操作时间', width: 170, hide: state.belong },
                { title: '操作', width: 230, toolbar: '#rowToolbar', hide: state.belong } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'pass') pass(obj.data.sid);
            else if (obj.event === 'reject') reject(obj.data.sid);
            else if (obj.event === 'cancel') cancel(obj.data.sid);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        // 归属人单独取 userId 隐藏域
        var uid = $('#searchForm [name="userId"]').val();
        if (uid) { p['filters[' + c + '].field'] = 'userId'; p['filters[' + c + '].data'] = uid; p['filters[' + c + '].op'] = 'eq'; c++; }
        $('#searchForm [name]').not('[name="userId"]').each(function () {
            var v = $.trim($(this).val());
            if (!v) return;
            var n = $(this).attr('name');
            if (n === 'userId') return;
            p['filters[' + c + '].field'] = n;
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        var opt = $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (state.belong && belongUserId) opt['salary.user.userId'] = belongUserId;
        app.post(api.salary.pageSalary, opt, function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    // ===== 添加 =====
    function openEdit() {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#editForm [name="userId"]').val('');
        $('#salaryuser').val('');
        // 渲染级联类型下拉
        renderCascade();
        state.editIndex = layer.open({ type: 1, title: '添加薪资', content: $('#editBox'), area: ['720px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function renderCascade() {
        var $t1 = $('#type1'), $t2 = $('#type2'), $t3 = $('#type3'), $t4 = $('#type4');
        $t1.html('<option value="">请选择</option>');
        $t2.html('<option value="">请选择</option>');
        $t3.html('<option value="">请选择</option>');
        $t4.html('<option value="">请选择</option>');
        // type 一类 = type.id(0/1)
        app.post(api.ds.salary, {}, function (res) {
            var types = res.type || [];
            for (var i = 0; i < types.length; i++) $t1.append('<option value="' + types[i].id + '">' + types[i].name + '</option>');
            form.render('select');
        });
        form.render('select');
    }

    // 类型级联：type -> twoType -> thrType -> forType
    form.on('select(type1)', function (d) {
        var v = d.value; $('#type2').html('<option value="">请选择</option>'); $('#type3').html('<option value="">请选择</option>'); $('#type4').html('<option value="">请选择</option>');
        app.post(api.ds.salary, {}, function (res) {
            var list = res.twoType || [];
            for (var i = 0; i < list.length; i++) if (list[i].oneType == v) $('#type2').append('<option value="' + list[i].id + '">' + list[i].name + '</option>');
            form.render('select');
        });
    });
    form.on('select(type2)', function (d) {
        var v = d.value; $('#type3').html('<option value="">请选择</option>'); $('#type4').html('<option value="">请选择</option>');
        app.post(api.ds.salary, {}, function (res) {
            var list = res.thrType || [];
            for (var i = 0; i < list.length; i++) if (list[i].oneType == $('#type1').val() && list[i].twoType == v) $('#type3').append('<option value="' + list[i].id + '">' + list[i].name + '</option>');
            form.render('select');
        });
    });
    form.on('select(type3)', function (d) {
        var v = d.value; $('#type4').html('<option value="">请选择</option>');
        app.post(api.ds.salary, {}, function (res) {
            var list = res.forType || [];
            for (var i = 0; i < list.length; i++) if (list[i].oneType == $('#type1').val() && list[i].twoType == $('#type2').val() && list[i].thrType == v) $('#type4').append('<option value="' + list[i].id + '">' + list[i].name + '</option>');
            form.render('select');
        });
    });

    // 归属人 typeahead
    var ta = null;
    $('#salaryuser').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="userId"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0 }, function (res) {
                var users = res.autoFillKeyValue || res.users || [];
                if (users.length === 1) {
                    var u = users[0];
                    $('#salaryuser').val(u.value || u.currentName || u.userName);
                    $('#editForm [name="userId"]').val(u.key || u.userId);
                } else if (users.length > 1) showPick(users);
            });
        }, 300);
    });
    function showPick(list) {
        var html = '';
        $.each(list, function (i, u) {
            var k = u.key || u.userId, n = u.value || u.currentName || u.userName || '';
            html += '<div style="padding:6px 8px;cursor:pointer;border-bottom:1px solid #eee;" data-uid="' + k + '" data-name="' + n + '">' + n + (k ? ' (' + k + ')' : '') + '</div>';
        });
        layer.open({ type: 1, title: '选择归属人', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $('#salaryuser').val($(this).attr('data-name')); $('#editForm [name="userId"]').val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="userId"]').val();
        if (!uid) { app.showAlert(app.warning, '请选择归属人'); return; }
        app.post(api.salary.addSalary, {
            'salary.user.userId': uid,
            'salary.type': $('#type1').val(),
            'salary.onetype': $('#type2').val(),
            'salary.twotype': $('#type3').val(),
            'salary.thrtype': $('#type4').val(),
            'salary.money': $('#editForm [name="money"]').val(),
            'salary.comment': $('#editForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    // ===== 状态操作 =====
    function pass(sid) { app.showConfirm('确认通过?', function () { app.post(api.salary.passSalary, { 'salary.sid': sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function reject(sid) { app.showConfirm('确认拒绝?', function () { app.post(api.salary.rejectSalary, { 'salary.sid': sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function cancel(sid) { app.showConfirm('确认撤销?', function () { app.post(api.salary.cancelSalary, { 'salary.sid': sid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); $('#searchForm [name="userId"]').val(''); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
