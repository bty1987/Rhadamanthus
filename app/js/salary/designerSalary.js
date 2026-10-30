/** app/js/salary/designerSalary.js —— 设计师工费（列表 + 添加/修改 + 通过/驳回/删除）
 *  对齐旧 WebContent/js/salary/designerSalary.js。
 *  旧页面使用 adddesignerSalary/updatedesignerSalary（小写 d），后端实际接口名为
 *  addDesignerSalary/updateDesignerSalary（见 api 定义），此处用规范名。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, updateIndex: null };

    var STATUS_MAP = { 0: '初始', 1: '通过', 2: '驳回', 3: '撤销' };
    var statusColor = { 0: 'layui-bg-gray', 1: 'layui-bg-green', 2: 'layui-bg-red', 3: 'layui-bg-orange' };
    function stB(d) { return '<span class="layui-badge ' + (statusColor[d.status] || 'layui-bg-gray') + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>'; }

    laydate.render({ elem: '#createTime', range: '~' });
    laydate.render({ elem: '#approveTime', range: '~' });

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'duser', title: '设计师', width: 120, templet: function (d) { return d.duser ? (d.duser.userName || '') : ''; } },
                { field: 'cuser', title: '创建人', width: 110, templet: function (d) { return d.cuser ? (d.cuser.userName || '') : ''; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'auser', title: '审批人', width: 110, templet: function (d) { return d.auser ? (d.auser.userName || '') : '无'; } },
                { field: 'approveTime', title: '审批时间', width: 170, templet: function (d) { return d.approveTime || '无'; } },
                { field: 'salary', title: '金额', width: 110, align: 'right', templet: function (d) { return app.formatMoney(d.salary); } },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 290, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'adopt') adopt(obj.data.dsid);
            else if (obj.event === 'refuse') refuse(obj.data.dsid);
            else if (obj.event === 'edit') openUpdate(obj.data);
            else if (obj.event === 'del') del(obj.data.dsid);
        });
    }

    function buildFilters() {
        var p = {}, c = 0;
        $('#searchForm [name]').each(function () {
            var v = $.trim($(this).val()); if (!v) return;
            p['filters[' + c + '].field'] = $(this).attr('name');
            p['filters[' + c + '].data'] = v;
            p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn';
            c++;
        });
        return p;
    }
    function query(page) {
        state.page = page || 1;
        app.post(api.salary.pageDesignerSalary, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {};
            table.reload('resultTable', { data: pg.data || [] });
            state.total = pg.totalRecords || 0;
            renderPage();
        });
    }
    function renderPage() {
        laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
    }

    // ===== 添加：typeahead 选用户 =====
    function openEdit() {
        app.clearValidator();
        $('#editForm')[0].reset();
        $('#editForm [name="uid"]').val('');
        $('#designersalaryuser').val('');
        state.editIndex = layer.open({ type: 1, title: '创建设计师工费', content: $('#editBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    var ta = null;
    $('#designersalaryuser').on('input', function () {
        var kw = $.trim($(this).val());
        $('#editForm [name="uid"]').val('');
        clearTimeout(ta);
        if (!kw) return;
        ta = setTimeout(function () {
            app.post(api.personel.queryUserByPinyin, { pinyinName: kw, 'user.status': 0 }, function (res) {
                var users = res.autoFillKeyValue || res.users || [];
                if (users.length === 1) {
                    var u = users[0];
                    $('#designersalaryuser').val(u.value || u.currentName || u.userName);
                    $('#editForm [name="uid"]').val(u.key || u.userId);
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
        layer.open({ type: 1, title: '选择设计师', content: $('<div id="userPick" style="max-height:320px;overflow:auto;">' + html + '</div>'), area: ['320px', 'auto'], success: function () {
            $('#userPick > div').on('click', function () { $('#designersalaryuser').val($(this).attr('data-name')); $('#editForm [name="uid"]').val($(this).attr('data-uid')); layer.closeAll(); });
        } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="uid"]').val();
        if (!uid) { app.showAlert(app.warning, '请选择设计师'); return; }
        app.post(api.salary.addDesignerSalary, {
            'designerSalary.duser.uid': uid,
            'designerSalary.salary': $('#editForm [name="salary"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }

    // ===== 修改 =====
    function openUpdate(d) {
        app.clearValidator();
        $('#updateForm')[0].reset();
        $('#updateForm [name="dsid"]').val(d.dsid);
        $('#updateForm [name="userShow"]').val(d.duser ? (d.duser.userName || '') : '');
        $('#updateForm [name="salary"]').val(d.salary);
        state.updateIndex = layer.open({ type: 1, title: '修改设计师工费', content: $('#updateBox'), area: ['500px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doUpdate() {
        if (app.validate('updateForm')) return;
        app.post(api.salary.updateDesignerSalary, {
            'designerSalary.dsid': $('#updateForm [name="dsid"]').val(),
            'designerSalary.salary': $('#updateForm [name="salary"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.updateIndex); state.updateIndex = null; query(state.page); }, function () {
            app.showAlert(app.error, '工费状态不可操作');
        });
    }

    // ===== 状态操作 =====
    function adopt(dsid) { app.post(api.salary.adoptDesignerSalary, { 'designerSalarys[0].dsid': dsid }, function () { query(state.page); }, function () { app.showAlert(app.error, '工费状态不可操作'); }); }
    function refuse(dsid) { app.post(api.salary.rejectDesignerSalary, { 'designerSalarys[0].dsid': dsid }, function () { query(state.page); }, function () { app.showAlert(app.error, '工费状态不可操作'); }); }
    function del(dsid) { app.showConfirm('确认删除?', function () { app.post(api.salary.deleteDesignerSalary, { 'designerSalary.dsid': dsid }, function () { query(state.page); }, function () { app.showAlert(app.error, '工费状态不可操作'); }); }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnUpdate').on('click', doUpdate);
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });
});
}); // end app.ready
