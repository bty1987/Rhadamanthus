/** app/js/data/constructionNode.js —— 施工节点（CRUD + 状态 + 集团节点关联）
 *  pcnid 关联集团行(company=0):无快照全字段自由,选中仅记录 pcnid,建行即定不可换绑(update 不透传)。
 *  分公司账号创建必选集团节点(前端承载约束,后端零校验);集团账号(自有行company=0)隐藏选择器自建集团行。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null, pcnid: null, isGroupView: null };
    var F = ['cnid','name','precheck','postcheck','stacheck','fincheck','accessoryLimit','salaryLimit','salaryFloor','timeLimit','kino','kiname'];
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '禁用') + '<\/span>'; }
    function refB(d) { return d.pcnid > 0 ? '<span class="layui-badge layui-bg-blue">已关联<\/span>' : ''; }
    initTable(); initGroupTypeahead(); probeGroupView(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'name', title: '节点名', minWidth: 140 }, { field: 'pcnid', title: '关联', width: 70, templet: refB }, { field: 'precheck', title: '开工款比', width: 90 }, { field: 'postcheck', title: '完工款比', width: 90 }, { field: 'accessoryLimit', title: '辅料限额', width: 100, templet: function (d) { return app.formatMoney(d.accessoryLimit); } }, { field: 'salaryLimit', title: '工费限额', width: 100, templet: function (d) { return app.formatMoney(d.salaryLimit); } }, { field: 'salaryFloor', title: '工费保底额', width: 100, templet: function (d) { return app.formatMoney(d.salaryFloor); } }, { field: 'timeLimit', title: '工期', width: 70 }, { field: 'kino', title: '金蝶编号', width: 100 }, { field: 'status', title: '状态', width: 80, templet: stB }, { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.cnid, 0); else if (obj.event === 'disable') updSt(obj.data.cnid, 1); });
    }
    // 账号形态探测(数据驱动,不引身份接口):自有行company=0 → 集团账号;自有行为空时按集团目录有无数据兜底判定
    function probeGroupView() {
        app.post(api.data.queryConstructionNode, {}, function (res) {
            var rows = res.constructionNodes || [];
            if (rows.length > 0) {
                state.isGroupView = rows[0].company === 0;
            } else {
                app.post(api.data.queryConstructionNodeForGroup, {}, function (res2) {
                    state.isGroupView = (res2.constructionNodes || []).length === 0;
                });
            }
        });
    }
    // 集团工程节点选择器:输入≥2字符异步查 company=0 启用行,选中仅记录 pcnid(无快照,字段仍全部自由编辑)
    function initGroupTypeahead() {
        var $inp = $('#nodeSel'), $list = $('#nodeSelList');
        $inp.on('input', function () {
            var kw = $.trim($inp.val());
            state.pcnid = null;
            if (kw.length < 2) { $list.hide().empty(); return; }
            app.post(api.data.queryConstructionNodeForGroup, { 'constructionNode.name': kw }, function (res) {
                var rows = res.constructionNodes || [];
                $list.empty().toggle(rows.length > 0);
                $.each(rows, function (i, v) {
                    $('<div class="node-sel-item"></div>').text(v.name).data('row', v).appendTo($list);
                });
            });
        }).on('blur', function () { setTimeout(function () { $list.hide(); }, 200); });
        $list.on('mousedown', '.node-sel-item', function () {
            var v = $(this).data('row');
            state.pcnid = v.cnid;
            $inp.val(v.name);
            $list.hide();
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageConstructionNode, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; state.pcnid = null;
        $('#nodeSel').val(''); $('#nodeSelList').hide().empty();
        // 集团选择行仅分公司账号添加时显示;编辑不显示(关联建行即定,换绑走运维SQL)
        $('#nodeSelItem').toggle(!d && state.isGroupView !== true);
        if (d) { state.editId = d.cnid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑节点' : '添加节点', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var o = {};
        F.forEach(function (k) { o['constructionNode.' + k] = $('#editForm [name="' + k + '"]').val(); });
        var ad;
        if (state.editId) {
            o['constructionNode.cnid'] = state.editId;
            ad = api.data.updateConstructionNode;
        } else {
            delete o['constructionNode.cnid'];
            // 分公司创建必须先选集团节点;集团账号自建集团行不带pcnid
            if (state.isGroupView === false && state.pcnid == null) { app.showAlert(app.warning, '请选择集团工程节点（集团没有的节点请先在集团下维护）'); return; }
            if (state.pcnid != null) { o['constructionNode.pcnid'] = state.pcnid; }
            ad = api.data.addConstructionNode;
        }
        app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updSt(id, s) { app.post(api.data.updateConstructionNodeForStatus, { 'constructionNode.cnid': id, 'constructionNode.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已禁用'); query(state.page); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
