/** user4advance.js —— 员工权配（pageUser + updateUserForAdvance + updateUserRole/Company） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, advanceIndex: null, roleIndex: null, companyIndex: null, advanceUserId: null, currentUid: null, companyChecks: [] };

    var statusMap = { 0: '在职', 1: '离职', 2: '休假', 3: '其他' };
    function stStatus(d) { var cls = { 0: 'layui-bg-green', 1: 'layui-bg-gray', 2: 'layui-bg-orange', 3: 'layui-bg-blue' }; return '<span class="layui-badge ' + (cls[d.status] || '') + '">' + (statusMap[d.status] || '---') + '<\/span>'; }

    app.post(api.system.queryRole, { timestamp: Date.now() }, function (res) {
        app.bindData($('#advanceForm [name="role.rid"]'), res.roleList, 'rid', 'name', true, function () { form.render('select'); });
    }, null, false);
    app.post(api.system.queryCompany, {}, function (res) { state.companyChecks = res.companys || []; app.bindData($('#advanceForm [name="companys"]'), res.companys, 'cid', 'name', true, function () { form.render('select'); }); }, null, false);

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'userId', title: '员工编号', width: 100 }, { field: 'loginId', title: '用户名', width: 120 },
                { field: 'userName', title: '姓名', width: 100 },
                { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.dept ? d.dept.name : '---'; } },
                { field: 'duty', title: '职位', width: 120, templet: function (d) { return d.duty ? d.duty.name : '---'; } },
                { field: 'role', title: '角色', width: 120, templet: function (d) { return d.role ? d.role.name : '---'; } },
                { field: 'phone', title: '联系方式', width: 140 }, { field: 'status', title: '状态', width: 90, templet: stStatus },
                { title: '操作', width: 420, fixed: 'right', toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, d = obj.data;
            if (ev === 'role') openRole(d);
            else if (ev === 'company') openCompany(d);
            else if (ev === 'right') showAdvance(d);
            else if (ev === 'resetPassword') resetPassword(d);
            else if (ev === 'defaultPassword') defaultPassword(d);
            else if (ev === 'logout') doLogout(d);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.personel.pageUser, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0;
            laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } });
        });
    }

    function showAdvance(d) {
        state.advanceUserId = d.userId;
        app.post(api.personel.queryUserByUserId, { 'user.userId': d.userId }, function (res) {
            var u = res.user || {};
            $('#advanceForm [name="isLogin"]').prop('checked', (u.isLogin & 1) == 1);
            $('#advanceForm [name="macs"]').prop('checked', (u.extranet & 1) == 1);
            $('#advanceForm [name="ips"]').prop('checked', (u.extranet & 2) == 2);
            $('#advanceForm [name="qcode"]').prop('checked', (u.extranet & 4) == 4);
            $('#advanceForm [name="webs"]').prop('checked', (u.extranet & 8) == 8);
            $('#advanceForm [name="pcs"]').prop('checked', (u.extranet & 16) == 16);
            if (u.role) $('#advanceForm [name="role.rid"]').val(u.role.rid);
            if (u.companys) $('#advanceForm [name="companys"]').val(u.companys);
            form.render('select');
            state.advanceIndex = layer.open({ type: 1, title: '员工信息配置', content: $('#advanceBox'), area: ['520px', 'auto'] });
        });
    }

    function doAdvanceSave() {
        var opt = { 'user.userId': state.advanceUserId, 'user.isLogin': $('#advanceForm [name="isLogin"]').prop('checked') ? 1 : -1 };
        var ex = 0;
        if ($('#advanceForm [name="macs"]').prop('checked')) ex += 1;
        if ($('#advanceForm [name="ips"]').prop('checked')) ex += 2;
        if ($('#advanceForm [name="qcode"]').prop('checked')) ex += 4;
        if ($('#advanceForm [name="webs"]').prop('checked')) ex += 8;
        if ($('#advanceForm [name="pcs"]').prop('checked')) ex += 16;
        opt['user.extranet'] = ex;
        opt['user.role.rid'] = $('#advanceForm [name="role.rid"]').val();
        opt['user.companys'] = $('#advanceForm [name="companys"]').val();
        app.post(api.personel.updateUserForAdvance, opt, function () { app.showAlert(app.success, '提交成功'); layer.close(state.advanceIndex); state.advanceIndex = null; });
    }

    function openRole(d) {
        state.currentUid = d.uid;
        app.post(api.personel.queryUserRole, { 'user.uid': d.uid }, function (res) {
            var html = '';
            $.each(res.userRoles || [], function (i, v) { html += '<span class="layui-badge layui-bg-blue" style="margin:2px;">' + (v.role ? v.role.name : '') + '<\/span>'; });
            $('#currentRoles').html(html || '<span style="color:#999;">暂无</span>');
            $('#selectRoles').html('');
            state.roleIndex = layer.open({ type: 1, title: '角色配置', content: $('#roleBox'), area: ['520px', 'auto'] });
            var rids = {};
            $.each(res.userRoles || [], function (i, v) { if (v.role) rids[v.role.rid] = true; });
            $('#roleName').val(''); $('#roleName').removeData('rids');
            $('#roleName').data('rids', rids);
            renderSelectRoles();
        });
    }

    function renderSelectRoles() {
        var html = '';
        var rids = $('#roleName').data('rids') || {};
        $.each(rids, function (k) { html += '<span class="layui-badge layui-bg-blue" style="margin:2px;" data-rid="' + k + '">' + k + ' <a href="javascript:;" style="color:#fff;margin-left:4px;">x</a><\/span>'; });
        $('#selectRoles').html(html || '<span style="color:#999;">未添加</span>');
        $('#selectRoles span').on('click', function () { var rid = $(this).attr('data-rid'); delete rids[rid]; $('#roleName').data('rids', rids); renderSelectRoles(); });
    }

    var roleTimer = null;
    $('#roleName').on('input', function () { clearTimeout(roleTimer); var kw = $.trim($(this).val()); if (!kw) return; roleTimer = setTimeout(function () { app.post(api.system.queryRoleByName, { 'role.name': kw }, function (res) { var list = res.roleList || []; if (list.length === 1) addRole(list[0]); }, null, false); }, 300); });
    function addRole(role) {
        var rids = $('#roleName').data('rids') || {};
        rids[role.rid] = role.name;
        $('#roleName').data('rids', rids).val('');
        renderSelectRoles();
    }

    function doRoleSave() {
        var rids = $('#roleName').data('rids') || {};
        var opt = { 'user.uid': state.currentUid }; var i = 0;
        $.each(rids, function (k) { opt['rids[' + i + ']'] = k; i++; });
        app.post(api.personel.updateUserRole, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.roleIndex); state.roleIndex = null; });
    }

    function openCompany(d) {
        state.currentUid = d.uid;
        app.post(api.personel.queryUserCompany, { 'user.uid': d.uid }, function (res) {
            var cur = {};
            $.each(res.userCompanys || [], function (i, v) { if (v.company) cur[v.company.cid] = true; });
            var html = '';
            $.each(state.companyChecks, function (i, c) { html += '<label style="display:inline-block;margin:4px 12px;"><input type="checkbox" name="corporab" value="' + c.cid + '"' + (cur[c.cid] ? ' checked' : '') + '> <span>' + c.name + '<\/span><\/label>'; });
            $('#companyChecks').html(html);
            var curHtml = '';
            $.each(res.userCompanys || [], function (i, v) { if (v.company) curHtml += '<span class="layui-badge layui-bg-blue" style="margin:2px;">' + v.company.name + '<\/span>'; });
            $('#currentCompanys').html(curHtml || '<span style="color:#999;">暂无</span>');
            state.companyIndex = layer.open({ type: 1, title: '公司配置', content: $('#companyBox'), area: ['560px', 'auto'] });
        });
    }

    function doCompanySave() {
        var opt = { 'user.uid': state.currentUid }; var i = 0;
        $('#companyBox input[name="corporab"]:checked').each(function () { opt['cids[' + i + ']'] = $(this).val(); i++; });
        app.post(api.personel.updateUserCompany, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.companyIndex); state.companyIndex = null; });
    }

    function resetPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')的密码吗?', function () { app.post(api.personel.resetPassword, { 'user.userId': d.userId }); }); }
    function defaultPassword(d) { app.showConfirm('确定要重置(' + (d.userName || '') + ')密码为默认密码?', function () { app.post(api.personel.defaultPassword, { 'user.userId': d.userId }); }); }
    function doLogout(d) {
        app.showConfirm('确定要登出该用户?', function () {
            app.postRaw('library', { url: { url: 'system.login.logout' } }, function () {}, function () {});
            // 兼容旧 com._post_(api.home.library, {api:'system.login.logout', userId, redis:0})
            var fd = new FormData();
            fd.append('api', 'system.login.logout');
            fd.append('userId', d.userId);
            fd.append('redis', 0);
            $.ajax({ url: (app.config.library || '') + 'library.do', data: fd, type: 'POST', dataType: 'json', contentType: false, processData: false, success: function () { app.showAlert(app.success, '操作成功'); }, error: function () { app.showAlert(app.error, '操作失败'); } });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAddRole').on('click', function () { var kw = $.trim($('#roleName').val()); if (!kw) return; app.post(api.system.queryRoleByName, { 'role.name': kw }, function (res) { var list = res.roleList || []; if (list.length) addRole(list[0]); }, null, false); });
    $('#btnRoleSave').on('click', doRoleSave);
    $('#btnRoleCancel').on('click', function () { layer.close(state.roleIndex); state.roleIndex = null; });
    $('#btnCompanySave').on('click', doCompanySave);
    $('#btnCompanyCancel').on('click', function () { layer.close(state.companyIndex); state.companyIndex = null; });
    $('#btnAdvanceSave').on('click', doAdvanceSave);
    $('#btnAdvanceCancel').on('click', function () { layer.close(state.advanceIndex); state.advanceIndex = null; });
});
}); // end app.ready
