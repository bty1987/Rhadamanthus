/** app/js/market/eperson.js —— 优秀员工（CRUD + 头像上传）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);

    app.uploadImage({ elem: '#imgUpload', done: function (res) { $('#editForm [name="imgUrl"]').val(res.resUrl); app.showImg($('#personImg'), res.resUrl, 80, 80, ''); } });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'imgUrl', title: '头像', width: 70, align: 'center', templet: function (d) { return d.imgUrl ? '<img src="' + d.imgUrl + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">' : ''; } },
                { field: 'name', title: '姓名', width: 100 },
                { field: 'type', title: '类型', width: 110 },
                { field: 'phone', title: '电话', width: 130 },
                { field: 'experience', title: '经验', width: 110 },
                { field: 'info', title: '简介', minWidth: 160 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageEperson, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; $('#personImg').hide();
        if (d) { state.editId = d.euid; ['euid','name','imgUrl','phone','type','experience','info'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); if (d.imgUrl) app.showImg($('#personImg'), d.imgUrl, 80, 80, ''); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑员工' : '添加员工', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'eperson.name': $('#editForm [name="name"]').val(), 'eperson.imgUrl': $('#editForm [name="imgUrl"]').val(), 'eperson.phone': $('#editForm [name="phone"]').val(), 'eperson.type': $('#editForm [name="type"]').val(), 'eperson.experience': $('#editForm [name="experience"]').val(), 'eperson.info': $('#editForm [name="info"]').val() };
        var apiDef; if (state.editId) { opt['eperson.euid'] = state.editId; apiDef = api.market.updateEperson; } else { apiDef = api.market.addEperson; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
