/** app/js/market/card.js —— 名片管理（列表 + 编辑 + 头像上传）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    initTable(); query(1);

    app.uploadImage({ elem: '#photoUpload', done: function (res) { $('#editForm [name="userPhoto"]').val(res.resUrl); app.showImg($('#cardPhoto'), res.resUrl, 80, 80, ''); } });

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'userPhoto', title: '头像', width: 70, align: 'center', templet: function (d) { return d.userPhoto ? '<img src="' + d.userPhoto + '" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">' : ''; } },
                { field: 'userName', title: '姓名', width: 100 },
                { field: 'phone', title: '电话', width: 130 },
                { field: 'profession', title: '职业', width: 110 },
                { field: 'industry', title: '行业', width: 110 },
                { field: 'address', title: '地址', minWidth: 160 },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageCard, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; $('#cardPhoto').hide();
        if (d) { state.editId = d.caid; ['caid','userName','userPhoto','phone','profession','industry','address','info'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); if (d.userPhoto) app.showImg($('#cardPhoto'), d.userPhoto, 80, 80, ''); }
        state.editIndex = layer.open({ type: 1, title: '编辑名片', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'card.caid': state.editId, 'card.userName': $('#editForm [name="userName"]').val(), 'card.userPhoto': $('#editForm [name="userPhoto"]').val(), 'card.phone': $('#editForm [name="phone"]').val(), 'card.profession': $('#editForm [name="profession"]').val(), 'card.industry': $('#editForm [name="industry"]').val(), 'card.address': $('#editForm [name="address"]').val(), 'card.info': $('#editForm [name="info"]').val() };
        app.post(api.market.updateCard, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
