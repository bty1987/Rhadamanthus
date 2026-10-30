/** app/js/information/worksheet.js —— 工单（列表 + 添加 + 处理 + 完成 + 取消 + 图片上传）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, addIndex: null, handIndex: null };

    var STATUS_MAP = { 0: '待处理', 1: '已处理', 2: '已完成', 3: '已取消' };
    function stB(d) {
        var cls = d.status == 0 ? 'layui-bg-orange' : d.status == 1 ? 'layui-bg-blue' : d.status == 2 ? 'layui-bg-green' : 'layui-bg-gray';
        return '<span class="layui-badge ' + cls + '">' + (STATUS_MAP[d.status] || '---') + '<\/span>';
    }

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'module', title: '模块', width: 120 },
                { field: 'content', title: '内容', minWidth: 200 },
                { field: 'creater', title: '创建人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'createTime', title: '创建时间', width: 160 },
                { field: 'handler', title: '处理人', width: 110, templet: function (d) { return d.handler ? d.handler.currentName : ''; } },
                { field: 'handTime', title: '处理时间', width: 160 },
                { field: 'status', title: '状态', width: 100, templet: stB },
                { field: 'result', title: '结果', minWidth: 160 },
                { title: '操作', width: 240, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'handle') openHandle(obj.data);
            else if (obj.event === 'finish') finish(obj.data.wsid);
            else if (obj.event === 'cancel') cancel(obj.data.wsid);
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageWorksheet, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openAdd() {
        app.clearValidator(); $('#addForm')[0].reset();
        state.addIndex = layer.open({ type: 1, title: '添加工单', content: $('#addBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveAdd() {
        if (app.validate('addForm')) return;
        app.post(api.information.addWorksheet, {
            'worksheet.module': $('#addForm [name="module"]').val(),
            'worksheet.content': $('#addForm [name="content"]').val(),
            'worksheet.path': $('#addForm [name="path"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.addIndex); state.addIndex = null; query(state.page); });
    }
    function openHandle(d) {
        app.clearValidator(); $('#handForm')[0].reset();
        $('#handForm [name="wsid"]').val(d.wsid);
        state.handIndex = layer.open({ type: 1, title: '处理工单', content: $('#handBox'), area: ['480px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSaveHandle() {
        if (app.validate('handForm')) return;
        app.post(api.information.handleWorksheet, {
            'worksheet.wsid': $('#handForm [name="wsid"]').val(),
            'worksheet.result': $('#handForm [name="result"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.handIndex); state.handIndex = null; query(state.page); });
    }
    function finish(wsid) { app.showConfirm('确认完成该工单？', function () { app.post(api.information.finishWorksheet, { 'worksheet.wsid': wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }
    function cancel(wsid) { app.showConfirm('确认取消该工单？', function () { app.post(api.information.cancelWorksheet, { 'worksheet.wsid': wsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); }); }

    upload.render({ elem: '#btnUpload', url: app.config.media + (window.appUploadUrl || 'uploadOther.do'), accept: 'images', exts: 'jpg|jpeg|gif|png', size: 5120, data: { uploadType: 0 }, before: function () { layer.load(); }, done: function (res) { layer.closeAll('loading'); if (res.errorCode == 0) { $('#addForm [name="path"]').val(res.resUrl); $('#addForm [name="pathShow"]').val(res.strutsUploadsFileName || '已上传'); } else { layer.msg(res.errorMessage || '上传失败'); } } });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSaveAdd').on('click', doSaveAdd);
    $('#btnCancelAdd').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnSaveHand').on('click', doSaveHandle);
    $('#btnCancelHand').on('click', function () { layer.close(state.handIndex); state.handIndex = null; });
});
}); // end app.ready
