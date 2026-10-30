/** avenger.js —— 复仇者管理（pageAvenger + updateUserForAdvance） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, advanceIndex: null, currentUid: null, currentUserId: null, advanceUserId: null };
    var pageType = getUrlParam('type') || '';
    function getUrlParam(k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; }

    loadInit();
    initTable(); query(1);

    function loadInit() {
        app.post(api.system.queryRole, { timestamp: Date.now() }, function (res) {
            app.bindData($('#advanceForm [name="role.rid"]'), res.roleList, 'rid', 'name', true, function () { form.render('select'); });
        }, null, false);
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '编号', width: 100 }, { field: 'loginId', title: '用户名', width: 120 }, { field: 'userName', title: '姓名', width: 120 },
                { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140 },
                { title: '操作', width: 320, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'right') showAdvance(d);
            else if (ev === 'resetPassword') resetPassword(d);
            else if (ev === 'defaultPassword') defaultPassword(d);
        });
    }

    function showAdvance(d) {
        state.advanceUserId = d.userId;
        app.post(api.personel.queryUserByUserId, { 'user.userId': d.userId }, function (res) {
            var u = res.user || {};
            $('#advanceForm [name="isLogin"]').prop('checked', (u.isLogin & 1) == 1);
            $('#advanceForm [name="extranet"]').prop('checked', u.extranet == 1);
            if (u.role) $('#advanceForm [name="role.rid"]').val(u.role.rid);
            form.render('select');
            state.advanceIndex = layer.open({ type: 1, title: '员工信息配置', content: $('#advanceBox'), area: ['520px', 'auto'] });
        });
    }

    function doAdvanceSave() {
        var opt = {
            'user.userId': state.advanceUserId,
            'user.isLogin': $('#advanceForm [name="isLogin"]').prop('checked') ? 1 : -1,
            'user.extranet': $('#advanceForm [name="extranet"]').prop('checked') ? 1 : 0,
            'user.role.rid': $('#advanceForm [name="role.rid"]').val()
        };
        app.post(api.personel.updateUserForAdvance, opt, function () { app.showAlert(app.success, '提交成功'); layer.close(state.advanceIndex); state.advanceIndex = null; });
    }

    function resetPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')的密码吗?', function () { app.post(api.personel.resetPassword, { 'user.userId': d.userId }); }); }
    function defaultPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')密码为默认密码?', function () { app.post(api.personel.defaultPassword, { 'user.userId': d.userId }); }); }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageAvenger, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdvanceSave').on('click', doAdvanceSave);
    $('#btnAdvanceCancel').on('click', function () { layer.close(state.advanceIndex); state.advanceIndex = null; });
});
}); // end app.ready
