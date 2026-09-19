/** app/js/data/materialplannode.js —— 主材计划规则（公司级字典：CRUD + 启停）
 *  维度联动: 品牌模式下品类作为品牌筛选第一步, 后端解析品牌归属品类并快照两类名称。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var TYPE = { 0: '品类', 1: '品牌' };
    var ACTION = { 0: '下单', 1: '配送', 2: '到货' };
    var ANCHOR = { 0: '计划开工', 1: '计划完工', 2: '实际开工', 3: '实际完工' };
    var TYPE_BRAND = 1;

    function selOpts(dict, withEmpty) {
        var html = withEmpty ? '<option value=""></option>' : '';
        $.each(dict, function (k, v) { html += '<option value="' + k + '">' + v + '</option>'; });
        return html;
    }
    function stB(d) { var c = d.status == 0 ? 'layui-bg-green' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + (d.status == 0 ? '启用' : '停用') + '</span>'; }
    function offsetText(v) { return v > 0 ? '+' + v + '天' : v < 0 ? v + '天' : '当日'; }

    // 编辑弹窗下拉
    $('#type').html(selOpts(TYPE));
    $('#action').html(selOpts(ACTION));
    $('#anchor').html(selOpts(ANCHOR));
    form.render('select');

    app.post(api.data.queryConstructionNode, {}, function (res) {
        var html = '<option value=""></option>';
        $.each(res.constructionNodes || [], function (i, n) { html += '<option value="' + n.cnid + '">' + (n.name || '') + '</option>'; });
        $('#cnid').html(html);
        form.render('select');
    }, null, false);

    app.post(api.data.queryCategory, {}, function (res) {
        var html = '<option value=""></option>';
        $.each(res.categorys || [], function (i, c) { html += '<option value="' + c.cid + '">' + (c.name || '') + '</option>'; });
        $('#cid').html(html);
        form.render('select');
    }, null, false);

    function toggleBrand() { $('#brandGroup').toggle($('#type').val() == TYPE_BRAND); }
    function loadBrands(cid, selected) {
        if ($('#type').val() == TYPE_BRAND && cid) {
            app.post(api.data.queryBrandByCid, { 'brand.cid': cid }, function (res) {
                var html = '<option value=""></option>';
                $.each(res.brands || [], function (i, b) { html += '<option value="' + b.bid + '">' + (b.name || '') + '</option>'; });
                $('#bid').html(html).val(selected || '');
                form.render('select');
            }, null, false);
        } else {
            $('#bid').html('<option value=""></option>');
            form.render('select');
        }
    }
    form.on('select(type)', function () { toggleBrand(); });
    form.on('select(cid)', function (d) { loadBrands(d.value); });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'type', title: '维度', width: 80, templet: function (d) { return TYPE[d.type] || ''; } },
                { field: 'categoryName', title: '品类', width: 110 },
                { field: 'brandName', title: '品牌', width: 120 },
                { field: 'nodeName', title: '施工节点', width: 110 },
                { field: 'action', title: '动作', width: 80, templet: function (d) { return ACTION[d.action] || ''; } },
                { field: 'anchor', title: '时间锚点', width: 100, templet: function (d) { return ANCHOR[d.anchor] || ''; } },
                { field: 'offsetDay', title: '偏移天数', width: 90, templet: function (d) { return offsetText(d.offsetDay); } },
                { field: 'status', title: '状态', width: 80, templet: stB },
                { field: 'comment', title: '说明', minWidth: 130 },
                { field: 'createTime', title: '创建时间', width: 160 },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'enable') updSt(obj.data.mpnid, 0); else if (obj.event === 'disable') updSt(obj.data.mpnid, 1); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageMaterialPlanNode, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(d) {
        $('#editForm')[0].reset();
        state.editId = null;
        $('#type').val(0);
        $('#offsetDay').val('');
        if (d) {
            state.editId = d.mpnid;
            $('#type').val(d.type);
            $('#cid').val(d.cid);
            loadBrands(d.cid, d.bid);
            $('#cnid').val(d.cnid);
            $('#action').val(d.action);
            $('#anchor').val(d.anchor);
            $('#offsetDay').val(d.offsetDay);
            $('#comment').val(d.comment || '');
        }
        toggleBrand();
        form.render('select');
        state.editIndex = layer.open({ type: 1, title: d ? '编辑规则' : '添加规则', content: $('#editBox'), area: ['540px', 'auto'] });
    }
    function doSave() {
        var type = $('#type').val();
        if (type == TYPE_BRAND && !$('#bid').val()) { app.showAlert(app.warning, '请选择品牌'); return; }
        if (type != TYPE_BRAND && !$('#cid').val()) { app.showAlert(app.warning, '请选择品类'); return; }
        if (!$('#cnid').val()) { app.showAlert(app.warning, '请选择施工节点'); return; }

        var o = {
            'materialPlanNode.type': type,
            'materialPlanNode.cnid': $('#cnid').val(),
            'materialPlanNode.action': $('#action').val(),
            'materialPlanNode.anchor': $('#anchor').val(),
            'materialPlanNode.offsetDay': $('#offsetDay').val() === '' ? 0 : $('#offsetDay').val(),
            'materialPlanNode.comment': $('#comment').val()
        };
        if (type == TYPE_BRAND) o['materialPlanNode.bid'] = $('#bid').val();
        else o['materialPlanNode.cid'] = $('#cid').val();

        var ad = api.data.addMaterialPlanNode;
        if (state.editId) { o['materialPlanNode.mpnid'] = state.editId; ad = api.data.updateMaterialPlanNode; }

        app.post(ad, o, function () {
            app.showAlert(app.success, '保存成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }
    function updSt(id, s) { app.post(api.data.updateMaterialPlanNodeForStatus, { 'materialPlanNode.mpnid': id, 'materialPlanNode.status': s }, function () { app.showAlert(app.success, s == 0 ? '已启用' : '已停用'); query(state.page); }); }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
