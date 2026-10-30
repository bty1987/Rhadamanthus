/** app/js/system/upgradePackage.js —— 升级包管理（新增 + 上线/下线 + 删除 + 上传 zip）
 * 接口：pageUpgrade / addUpgrade / updateUpgradeForStatus / deleteUpgrade
 * 上传：uploadOther（zip），返回 resUrl + fileInfo.size 填入 path/fileSize
 * 状态：0=待上线 1=已上线 2=已下线 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null };

    // 创建时间日期选择
    layui.laydate.render({ elem: '#createTime', format: 'yyyy-MM-dd' });

    initTable(); query(1);

    function stS(d) {
        var map = { 0: ['layui-bg-gray', '待上线'], 1: ['layui-bg-green', '已上线'], 2: ['layui-bg-orange', '已下线'] };
        var s = map[d.status] || ['layui-bg-gray', '未知'];
        return '<span class="layui-badge ' + s[0] + '">' + s[1] + '<\/span>';
    }

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '最新版本', width: 140 },
                { field: 'trialno', title: '适用版本', width: 140 },
                { field: 'status', title: '状态', width: 100, templet: stS },
                { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'content', title: '版本说明', minWidth: 200 },
                { field: 'path', title: '路径', minWidth: 200 },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            if (obj.event === 'online') setStatus(obj.data, 1, '上线');
            else if (obj.event === 'offline') setStatus(obj.data, 2, '下线');
            else if (obj.event === 'del') doDelete(obj.data);
        });
    }

    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) { state.page = page || 1; app.post(api.upgrade.pageUpgrade, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage(); }); }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openEdit() {
        app.clearValidator(); $('#editForm')[0].reset();
        state.editIndex = layer.open({ type: 1, title: '添加升级包', content: $('#editBox'), area: ['560px', 'auto'], cancel: function () { app.clearValidator(); } });
    }

    function doSave() {
        if (app.validate('editForm')) return;
        var createTime = $('#editForm [name="createTime"]').val();
        var opt = {
            'upgrade.no': $('#editForm [name="upgradeNumber"]').val(),
            'upgrade.trialno': $('#editForm [name="trialUpgrade"]').val(),
            'upgrade.createTime': createTime ? (createTime + ' 00:00:00') : '',
            'upgrade.content': $('#editForm [name="content"]').val(),
            'upgrade.path': $('#editForm [name="path"]').val(),
            'upgrade.fileSize': $('#editForm [name="fileSize"]').val()
        };
        app.post(api.upgrade.addUpgrade, opt, function () {
            app.showAlert(app.success, '添加成功');
            layer.close(state.editIndex); state.editIndex = null; query(state.page);
        });
    }

    function setStatus(d, status, label) {
        app.showConfirm('是否' + label + '版本：' + d.no + '？', function () {
            app.post(api.upgrade.updateUpgradeForStatus, { 'upgrade.ugid': d.ugid, 'upgrade.status': status }, function () {
                app.showAlert(app.success, '已' + label); query(state.page);
            });
        });
    }

    function doDelete(d) {
        app.showConfirm('是否确定删除？', function () {
            app.post(api.upgrade.deleteUpgrade, { 'upgrade.ugid': d.ugid }, function () {
                app.showAlert(app.success, '已删除'); query(state.page);
            });
        });
    }

    // 上传 zip 升级包
    $('#btnUpload').on('click', function () {
        app.uploadFile({
            elem: '#btnUpload', url: 'uploadOther.do', accept: 'file', exts: 'zip',
            data: { 'uploadType': 0 },
            done: function (res) {
                if (res.errorCode == 0) {
                    $('#editForm [name="path"]').val(res.resUrl || '');
                    $('#editForm [name="fileSize"]').val(res.fileInfo ? res.fileInfo.size : '');
                    app.showAlert(app.success, '上传成功');
                } else {
                    app.showAlert(app.error, res.errorMsg || '上传失败');
                }
            },
            error: function () { app.showAlert(app.error, '上传失败'); }
        });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', openEdit);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
