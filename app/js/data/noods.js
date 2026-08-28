/** app/js/data/noods.js —— noods管理（CRUD + 状态 + 计算标识 + 集团定材引用）
 *  type=group 集团版:创建弹窗完整表单自建(pnid=0);缺省/company 公司版:创建弹窗选择集团定材
 *  (queryNoodsForGroup 查 company=0)→ 名称/售价/结算价只读快照+calc快照随提交,仅浮动量可编辑。
 *  引用行(pnid>0)编辑同样仅浮动量;后端 addNoods/updateNoods 不变,pnid 随 VO 进出。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null, pnid: null, calc: null };
    var pageType = (function (k) { var m = location.search.match(new RegExp('[?&]' + k + '=([^&]+)')); return m ? m[1] : ''; })('type');
    var isCompany = pageType != 'group';
    var F = ['nid','name','selling','balance','surplus'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    function cbB(d) { var c = d.calc == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.calc == 0 ? '计算' : '不计算') + '<\/span>'; }
    function refB(d) { return d.pnid > 0 ? '<span class="layui-badge layui-bg-blue">引用<\/span>' : ''; }
    initTable(); initGroupTypeahead(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'selling', title: '售价', width: 90, templet: function (d) { return app.formatMoney(d.selling); } }, { field: 'balance', title: '结算价', width: 90, templet: function (d) { return app.formatMoney(d.balance); } }, { field: 'surplus', title: '浮动量', width: 90 }, { field: 'pnid', title: '引用', width: 70, templet: refB }, { field: 'calc', title: '计算标识', width: 90, templet: cbB }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.nid, 0); else if (obj.event === 'disable') updSt(obj.data.nid, 1); });
    }
    // 集团定材选择器:输入≥2字符异步查 company=0 启用行,选中后只读回填快照
    function initGroupTypeahead() {
        var $inp = $('#noodSel'), $list = $('#noodSelList');
        $inp.on('input', function () {
            var kw = $.trim($inp.val());
            state.pnid = null; state.calc = null; setReadOnly(false);
            if (kw.length < 2) { $list.hide().empty(); return; }
            app.post(api.data.queryNoodsForGroup, { 'noods.name': kw }, function (res) {
                var rows = res.noodes || [];
                $list.empty().toggle(rows.length > 0);
                $.each(rows, function (i, v) {
                    $('<div class="noods-sel-item"></div>').text(v.name).data('row', v).appendTo($list);
                });
            });
        }).on('blur', function () { setTimeout(function () { $list.hide(); }, 200); });
        $list.on('mousedown', '.noods-sel-item', function () {
            var v = $(this).data('row');
            state.pnid = v.nid; state.calc = v.calc;
            $inp.val(v.name);
            $('#editForm [name="name"]').val(v.name);
            $('#editForm [name="selling"]').val(v.selling != null ? v.selling : 0);
            $('#editForm [name="balance"]').val(v.balance != null ? v.balance : 0);
            setReadOnly(true);
            $list.hide();
        });
    }
    function setReadOnly(ro) {
        $('#editForm [name="name"]').prop('readonly', ro);
        $('#editForm [name="selling"]').prop('readonly', ro);
        $('#editForm [name="balance"]').prop('readonly', ro);
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageNoods, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; state.pnid = null; state.calc = null;
        $('#noodSel').val(''); $('#noodSelList').hide().empty();
        var isRef = d && d.pnid > 0;
        // 集团选择行仅公司版添加时显示;公司版添加名称/售价/结算价初始只读待选择回填,引用行编辑同样只读
        $('#noodSel').closest('.layui-form-item').toggle(!d && isCompany);
        setReadOnly(isRef || (!d && isCompany));
        if (d) {
            state.editId = d.nid; state.pnid = d.pnid;
            F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); });
        }
        state.editIndex = layer.open({ type: 1, title: d ? (isRef ? '编辑(引用行,仅浮动量)' : '编辑') : (isCompany ? '添加(引用集团定材)' : '添加'), content: $('#editBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {};
        F.forEach(function (k) { o['noods.' + k] = $('#editForm [name="' + k + '"]').val(); });
        var ad;
        if (state.editId) {
            o['noods.nid'] = state.editId; o['noods.pnid'] = state.pnid != null ? state.pnid : 0;
            ad = api.data.updateNoods;
        } else {
            delete o['noods.nid'];
            if (isCompany) { // 公司版创建必须引用集团定材,携带 pnid 与集团 calc 快照
                if (state.pnid == null) { app.showAlert(app.warning, '请选择集团定材'); return; }
                o['noods.pnid'] = state.pnid; o['noods.calc'] = state.calc;
            }
            ad = api.data.addNoods;
        }
        app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updSt(id, s) { app.post(api.data.updateNoodsForStatus, { 'noods.nid': id, 'noods.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
