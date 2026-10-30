/** app/js/market/ecase.js —— 装修案例（CRUD + 状态 + 图片管理）
 * 图片管理：点"图片"打开弹窗，上传/删除该案例的多张图（epicture）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null, picCid: null };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'comment', title: '描述', minWidth: 200 },
                { field: 'area', title: '面积', width: 100 },
                { field: 'cycle', title: '周期', width: 100 },
                { field: 'designer', title: '设计师', width: 110 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return d.status == 0 ? '<span class="layui-badge layui-bg-green">启用</span>' : '<span class="layui-badge layui-bg-gray">禁用</span>'; } },
                { title: '操作', width: 320, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var d = obj.data;
            if (obj.event === 'edit') openEdit(d);
            else if (obj.event === 'enable') updateStatus(d.ecid, 0);
            else if (obj.event === 'disable') updateStatus(d.ecid, 1);
            else if (obj.event === 'pics') openPics(d);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.market.pageEcase, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) { state.editId = d.ecid; ['ecid','comment','area','cycle','designer'].forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑案例' : '添加案例', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        var opt = { 'ecase.comment': $('#editForm [name="comment"]').val(), 'ecase.area': $('#editForm [name="area"]').val(), 'ecase.cycle': $('#editForm [name="cycle"]').val(), 'ecase.designer': $('#editForm [name="designer"]').val() };
        var apiDef; if (state.editId) { opt['ecase.ecid'] = state.editId; apiDef = api.market.updateEcase; } else { apiDef = api.market.addEcase; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function updateStatus(ecid, status) { app.post(api.market.updateEcaseForStatus, { 'ecase.ecid': ecid, 'ecase.status': status }, function () { app.showAlert(app.success, status == 0 ? '已启用' : '已禁用'); query(state.page); }); }

    // ===== 图片管理弹窗 =====
    function openPics(d) {
        state.picCid = d.ecid;
        var html = '<div style="padding:16px;">'
            + '<div id="picList" style="margin-bottom:16px;"></div>'
            + '<button type="button" class="layui-btn" id="casePicUpload"><i class="layui-icon layui-icon-upload"></i>上传案例图片</button>'
            + '</div>';
        var idx = layer.open({ type: 1, title: '案例图片 - ' + (d.comment || ''), content: html, area: ['640px', '480px'], success: function () {
            loadPics();
            // 上传
            app.uploadImage({ elem: '#casePicUpload', done: function (res) {
                app.post(api.market.addEpicture, { 'epicture.cid': state.picCid, 'epicture.url': res.resUrl, 'epicture.type': 0 }, function () { app.showAlert(app.success, '上传成功'); loadPics(); });
            }});
        }});
        function loadPics() {
            app.post(api.market.queryEpictureByCid, { 'epicture.cid': state.picCid }, function (res) {
                var pics = res.epictures || [];
                var h = '';
                if (!pics.length) { h = '<div style="color:#999;text-align:center;padding:20px;">暂无图片</div>'; }
                $.each(pics, function (i, p) {
                    h += '<div style="display:inline-block;margin:8px;position:relative;">'
                        + '<img src="' + p.url + '" style="width:120px;height:90px;object-fit:cover;border-radius:4px;border:1px solid #e8e8e8;">'
                        + '<button type="button" class="layui-btn layui-btn-danger layui-btn-xs" style="position:absolute;top:-8px;right:-8px;border-radius:50%;width:20px;height:20px;padding:0;" data-epid="' + p.epid + '">×</button>'
                        + '</div>';
                });
                $('#picList').html(h);
                $('#picList button[data-epid]').on('click', function () {
                    var epid = $(this).attr('data-epid');
                    app.showConfirm('确认删除该图片？', function () { app.post(api.market.deleteEpicture, { 'epicture.epid': epid }, function () { app.showAlert(app.success, '已删除'); loadPics(); }); });
                });
            });
        }
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
