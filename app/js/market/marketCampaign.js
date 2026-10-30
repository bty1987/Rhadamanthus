/** app/js/market/marketCampaign.js —— 营销活动（CRUD + 发布/禁用）
 * budget 为金额字段，pageMarketCampaign/addMarketCampaign/updateMarketCampaign 已声明 tranargs（÷1000/×1000）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    laydate.render({ elem: '#startTime', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' });
    laydate.render({ elem: '#endTime', type: 'datetime', format: 'yyyy-MM-dd HH:mm:ss' });
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '活动名', minWidth: 160 },
                { field: 'budget', title: '预算', width: 110, align: 'right', templet: function (d) { return '¥' + app.formatMoney(d.budget); } },
                { field: 'startTime', title: '开始时间', width: 170, templet: function (d) { return app.dateFormat(d.startTime); } },
                { field: 'endTime', title: '结束时间', width: 170, templet: function (d) { return app.dateFormat(d.endTime); } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 210, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'publish') doPublish(obj.data.mcid);
            else if (obj.event === 'disable') doDisable(obj.data.mcid);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageMarketCampaign, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.mcid; ['mcid','name','budget','startTime','endTime','ownerId','regionId','comment'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑活动' : '添加活动', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var opt = { 'marketCampaign.name': $('#editForm [name="name"]').val(), 'marketCampaign.budget': $('#editForm [name="budget"]').val(), 'marketCampaign.startTime': $('#editForm [name="startTime"]').val(), 'marketCampaign.endTime': $('#editForm [name="endTime"]').val(), 'marketCampaign.ownerId': $('#editForm [name="ownerId"]').val(), 'marketCampaign.regionId': $('#editForm [name="regionId"]').val(), 'marketCampaign.comment': $('#editForm [name="comment"]').val() };
        var apiDef; if (state.editId) { opt['marketCampaign.mcid'] = state.editId; apiDef = api.market.updateMarketCampaign; } else { apiDef = api.market.addMarketCampaign; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doPublish(mcid) { app.showConfirm('确认发布该活动？', function () { app.post(api.market.publishMarketCampaign, { 'marketCampaign.mcid': mcid }, function () { app.showAlert(app.success, '已发布'); query(state.page); }); }); }
    function doDisable(mcid) { app.showConfirm('确认禁用？', function () { app.post(api.market.disableMarketCampaign, { 'marketCampaign.mcid': mcid }, function () { app.showAlert(app.success, '已禁用'); query(state.page); }); }); }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
