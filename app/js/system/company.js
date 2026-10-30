/** app/js/system/company.js —— 公司管理（CRUD + 状态切换 + 组织关联）
 * 字段：no/code/name/shortname/fullname/address/corporation/phone/atttype/block/drganization/srganization/status
 * atttype 业务类型取自 ds/system.json；block 板段固定 0/1
 * 组织关联用 queryOrganization 下拉（替代旧 typeahead） */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, orgIndex: null, editId: null, orgRow: null, atttypeMap: {} };

    loadAtttype(); loadOrganizations(); initTable(); query(1);

    function loadAtttype() {
        app.post(api.ds.system, {}, function (res) {
            state.atttypeMap = {};
            var list = res.atttype || [];
            var html = '<option value="">请选择</option>';
            for (var i = 0; i < list.length; i++) {
                var it = list[i];
                state.atttypeMap[it.key] = it.value;
                html += '<option value="' + it.key + '">' + it.value + '</option>';
            }
            $('#atttypeSel').html(html);
            form.render('select');
        });
    }

    function loadOrganizations() {
        app.post(api.system.queryOrganization, {}, function (res) {
            var orgs = res.organizations || [];
            var html = '<option value="">无</option>';
            $.each(orgs, function (i, o) { html += '<option value="' + o.oid + '">' + o.name + '</option>'; });
            $('#drganizationSel').html(html);
            $('#srganizationSel').html(html);
            form.render('select');
        });
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'no', title: '编号', width: 80 },
                { field: 'name', title: '名称', minWidth: 160 },
                { field: 'shortname', title: '短名', width: 120 },
                { field: 'corporation', title: '法人', width: 100 },
                { field: 'phone', title: '电话', width: 120 },
                { field: 'atttype', title: '业务类型', width: 100, templet: function (d) { return state.atttypeMap[d.atttype] || '---'; } },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用<\/span>' : '<span class="layui-badge layui-bg-gray">禁用<\/span>'; } },
                { title: '操作', width: 280, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'org') openOrg(obj.data);
            else if (obj.event === 'enable') updateStatus(obj.data.cid, 0);
            else if (obj.event === 'disable') updateStatus(obj.data.cid, 1);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (v === '' || v == null) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.system.pageCompany, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.cid;
            $('#editForm [name="cid"]').val(d.cid);
            $('#editForm [name="no"]').val(d.no).prop('disabled', true);
            $('#editForm [name="code"]').val(d.code);
            $('#editForm [name="name"]').val(d.name);
            $('#editForm [name="shortname"]').val(d.shortname);
            $('#editForm [name="fullname"]').val(d.fullname);
            $('#editForm [name="address"]').val(d.address);
            $('#editForm [name="corporation"]').val(d.corporation);
            $('#editForm [name="phone"]').val(d.phone);
            $('#editForm [name="atttype"]').val(d.atttype);
            $('#editForm [name="block"]').val(d.block);
        } else {
            $('#editForm [name="no"]').prop('disabled', false);
        }
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑公司' : '添加公司', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var opt = {
            'company.no': $('#editForm [name="no"]').val(),
            'company.code': $('#editForm [name="code"]').val(),
            'company.name': $('#editForm [name="name"]').val(),
            'company.shortname': $('#editForm [name="shortname"]').val(),
            'company.fullname': $('#editForm [name="fullname"]').val(),
            'company.address': $('#editForm [name="address"]').val(),
            'company.corporation': $('#editForm [name="corporation"]').val(),
            'company.phone': $('#editForm [name="phone"]').val(),
            'company.atttype': $('#editForm [name="atttype"]').val(),
            'company.block': $('#editForm [name="block"]').val()
        };
        var apiDef;
        if (state.editId) { opt['company.cid'] = state.editId; apiDef = api.system.updateCompany; }
        else { apiDef = api.system.addCompany; }
        app.post(apiDef, opt, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function openOrg(d) {
        state.orgRow = d;
        $('#orgForm [name="drganization"]').val(d.drganization ? d.drganization.oid : '');
        $('#orgForm [name="srganization"]').val(d.srganization ? d.srganization.oid : '');
        form.render('select');
        state.orgIndex = layer.open({ type: 1, title: '组织关联 - ' + d.name, content: $('#orgBox'), area: ['480px', 'auto'] });
    }

    function doOrgSave() {
        var d = state.orgRow;
        app.post(api.system.updateCompany, {
            'company.cid': d.cid,
            'company.no': d.no, 'company.code': d.code, 'company.name': d.name,
            'company.shortname': d.shortname, 'company.fullname': d.fullname,
            'company.address': d.address, 'company.corporation': d.corporation,
            'company.phone': d.phone, 'company.atttype': d.atttype, 'company.block': d.block,
            'company.drganization.oid': $('#orgForm [name="drganization"]').val(),
            'company.srganization.oid': $('#orgForm [name="srganization"]').val()
        }, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.orgIndex); state.orgIndex = null; query(state.page);
        });
    }

    function updateStatus(cid, status) {
        app.post(api.system.updateCompanyForStatus, { 'company.cid': cid, 'company.status': status }, function () {
            app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page);
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
    $('#btnOrgSave').on('click', doOrgSave);
    $('#btnOrgCancel').on('click', function () { layer.close(state.orgIndex); state.orgIndex = null; });
});
}); // end app.ready
