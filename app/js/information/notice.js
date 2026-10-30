/** app/js/information/notice.js —— 公告管理（列表 + 添加/编辑 + 删除 + 附件上传）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, laydate = layui.laydate, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };

    var TYPE_MAP = { 1: '公告', 2: '活动' };
    var PRIORITY_MAP = { 0: '普通', 1: '紧急' };
    var PUBLIC_MAP = { 0: '公开', 1: '不公开', 2: '部门' };
    function pubB(d) { return '<span class="layui-badge ' + (d.isPublic == 0 ? 'layui-bg-green' : d.isPublic == 2 ? 'layui-bg-blue' : 'layui-bg-gray') + '">' + (PUBLIC_MAP[d.isPublic] || '---') + '<\/span>'; }
    function priB(d) { return '<span class="layui-badge ' + (d.priority == 1 ? 'layui-bg-red' : 'layui-bg-blue') + '">' + (PRIORITY_MAP[d.priority] || '普通') + '<\/span>'; }

    laydate.render({ elem: '#startTime' });
    laydate.render({ elem: '#endTime' });

    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'theme', title: '主题', minWidth: 180 },
                { field: 'creater', title: '发布人', width: 110, templet: function (d) { return d.creater ? d.creater.currentName : ''; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE_MAP[d.type] || '---'; } },
                { field: 'priority', title: '优先级', width: 90, templet: priB },
                { field: 'isPublic', title: '公开', width: 90, templet: pubB },
                { field: 'startTime', title: '开始时间', width: 160 },
                { field: 'endTime', title: '结束时间', width: 160 },
                { field: 'fileName', title: '附件', width: 110, templet: function (d) { return d.fileName ? '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="download">查看</a>' : '无'; } },
                { title: '操作', width: 160, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'edit') openEdit(obj.data);
            else if (obj.event === 'del') doDelete(obj.data.nid);
            else if (obj.event === 'download') { if (obj.data.filePath) window.open(app.config.media + obj.data.filePath); }
        });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.information.pageNotice, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset(); state.editId = null;
        if (d) {
            state.editId = d.nid;
            $('#editForm [name="nid"]').val(d.nid);
            $('#editForm [name="noticeId"]').val(d.noticeId);
            $('#editForm [name="userId"]').val(d.creater ? d.creater.userId : '');
            $('#editForm [name="theme"]').val(d.theme);
            $('#editForm [name="type"]').val(d.type);
            $('#editForm [name="priority"]').val(d.priority);
            $('#editForm [name="startTime"]').val(d.startTime);
            $('#editForm [name="endTime"]').val(d.endTime);
            $('#editForm [name="isPublic"]').val(d.isPublic);
            $('#editForm [name="exPublic"]').val(d.exPublic);
            $('#editForm [name="contents"]').val(d.contents);
            $('#editForm [name="filePath"]').val(d.filePath);
            $('#editForm [name="fileName"]').val(d.fileName);
            $('#editForm [name="fileNameShow"]').val(d.fileName);
            form.render('select');
        } else { form.render('select'); }
        state.editIndex = layer.open({ type: 1, title: d ? '编辑公告' : '添加公告', content: $('#editBox'), area: ['640px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        if ($('#editForm [name="startTime"]').val() > $('#editForm [name="endTime"]').val()) { app.showAlert(app.warning, '结束时间不能小于开始时间'); return; }
        var opt = {
            'notice.nid': $('#editForm [name="nid"]').val(),
            'notice.theme': $('#editForm [name="theme"]').val(),
            'notice.type': $('#editForm [name="type"]').val(),
            'notice.priority': $('#editForm [name="priority"]').val(),
            'notice.creater.userId': $('#editForm [name="userId"]').val(),
            'notice.startTime': $('#editForm [name="startTime"]').val(),
            'notice.endTime': $('#editForm [name="endTime"]').val(),
            'notice.isPublic': $('#editForm [name="isPublic"]').val(),
            'notice.exPublic': $('#editForm [name="exPublic"]').val(),
            'notice.contents': $('#editForm [name="contents"]').val(),
            'notice.filePath': $('#editForm [name="filePath"]').val(),
            'notice.fileName': $('#editForm [name="fileName"]').val()
        };
        var apiDef; if (state.editId) { opt['notice.noticeId'] = $('#editForm [name="noticeId"]').val(); apiDef = api.information.updateNotice; } else { apiDef = api.information.addNotice; }
        app.post(apiDef, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function doDelete(nid) { app.showConfirm('确认删除该公告？', function () { app.post(api.information.deleteNotice, { 'notice.nid': nid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); }); }); }

    upload.render({ elem: '#btnUpload', url: app.config.media + (window.appUploadUrl || 'uploadOther.do'), accept: 'file', exts: 'pdf', size: 5120, data: { uploadType: 3 }, before: function () { layer.load(); }, done: function (res) { layer.closeAll('loading'); if (res.errorCode == 0) { $('#editForm [name="filePath"]').val(res.resUrl); $('#editForm [name="fileName"]').val(res.strutsUploadsFileName); $('#editForm [name="fileNameShow"]').val(res.strutsUploadsFileName); } else { layer.msg(res.errorMessage || '上传失败'); } } });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
