/** app/js/production/hardware2create.js —— 生产单下的五金单列表（创建/编辑/入库/完结/五金项）
 * 上下文：app.params.productionHardware = {pid, status}
 * 列表 queryHardwareByPid；创建 addHardware；编辑 updateHardware；入库 instoreHardware；完结 finishHardware。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.productionHardware || {};
    var editIndex = null, editFlg = true;
    var HS = { 0: '初始', 1: '采购', 2: '入库', 3: '完结', 4: '废单' };
    function stB(d) { var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-orange', 2: 'layui-bg-cyan', 3: 'layui-bg-green', 4: 'layui-bg-red' }; return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (HS[d.status] || '-') + '<\/span>'; }
    function pno(d) { return d.production ? d.production.pno : ''; }
    if (ctx.status == 6 || ctx.status == 7) $('#btnAdd').hide();
    initTable(); query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '编号', width: 140 }, { field: 'pno', title: '生产单号', width: 140, templet: pno },
                { field: 'comment', title: '说明', minWidth: 160 }, { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'createTime', title: '创建时间', width: 150 }, { field: 'finishTime', title: '结束时间', width: 150 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 320, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handle(obj.event, obj.data); });
    }
    function query() {
        if (!ctx.pid) { app.showAlert(app.warning, '缺少生产单上下文'); return; }
        app.post(api.production.queryHardwareByPid, { 'hardware.production.pid': ctx.pid }, function (res) { table.reload('resultTable', { data: res.hardwares || [] }); });
    }
    function ok(msg) { app.showAlert(app.success, msg); query(); }
    function handle(ev, v) {
        if (ev === 'edit') openEdit(v);
        else if (ev === 'item') { app.params.hardwareItem = { hid: v.hid, hardwareStatus: v.status, productionStatus: ctx.status }; app.popup('views/production/hardwareItem.html', '五金项-' + v.no, null, { area: ['900px', '600px'] }); }
        else if (ev === 'instore') { if (v.status != 1) return; app.showConfirm('是否确认入库?', function () { app.post(api.production.instoreHardware, { 'hardware.hid': v.hid, 'hardware.status': '2' }, function () { ok('操作成功'); }); }); }
        else if (ev === 'finish') { if (v.status != 2) return; finishPrompt(v); }
    }
    function finishPrompt(v) {
        layer.prompt({ title: '完结 - 请输入数量', value: '0' }, function (val, i) {
            if (!/^\d+(\.\d+)?$/.test(val)) { app.showAlert(app.error, '数量格式错误'); return; }
            app.post(api.production.finishHardware, { 'hardware.hid': v.hid, 'hardware.num': val }, function () { layer.close(i); ok('操作成功'); });
        });
    }
    function openEdit(v) {
        app.clearValidator(); $('#editForm')[0].reset(); editFlg = !v;
        $('#rowStatus').show();
        if (v) {
            $('#editForm [name="hid"]').val(v.hid);
            $('#editForm [name="status"]').val(v.status);
            $('#editForm [name="timeLimit"]').val(v.timeLimit);
            $('#editForm [name="comment"]').val(v.comment);
            $('#rowStatus').hide(); // 编辑时状态由入库/完结流转
        }
        form.render('select');
        editIndex = layer.open({ type: 1, title: v ? '编辑五金单' : '创建五金单', content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function save() {
        if (app.validate('editForm')) return;
        var url, o = {
            'hardware.production.pid': ctx.pid,
            'hardware.status': $('#editForm [name="status"]').val() || 1,
            'hardware.timeLimit': $('#editForm [name="timeLimit"]').val(),
            'hardware.path': '',
            'hardware.comment': $('#editForm [name="comment"]').val()
        };
        if (editFlg) { url = api.production.addHardware; } else { url = api.production.updateHardware; o['hardware.hid'] = $('#editForm [name="hid"]').val(); }
        app.post(url, o, function () { ok(editFlg ? '添加成功' : '操作成功'); layer.close(editIndex); editIndex = null; });
    }
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', save);
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnBack').on('click', function () { app.switchPage(api.index.productionIndex.url); });
});
}); // end app.ready
