/** app/js/data/signet.js —— 签章管理（CRUD + 多状态流转）*/
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, upload = layui.upload, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIndex: null, editId: null };
    var F = ['sid','no','name','keyword','type','path'];
    app.uploadImage({ elem: '#btnUpload', done: function (res) { $('#path').val(res.resUrl || ''); } });
    var ST = { 0: '初始化', 1: '已注册', 2: '已认证', 3: '已签章', 4: '已确认', 5: '已作废' };
    function stB(d) { var c = ''; switch (d.status) { case 0: c = 'layui-bg-gray'; break; case 3: c = 'layui-bg-green'; break; case 5: c = 'layui-bg-red'; break; default: c = 'layui-bg-blue'; } return '<span class="layui-badge ' + c + '">' + (ST[d.status] || d.status) + '<\/span>'; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 }, { field: 'no', title: '编号', width: 120 }, { field: 'name', title: '名称', minWidth: 160 }, { field: 'keyword', title: '关键字', width: 120 }, { field: 'type', title: '类型', width: 80 }, { field: 'provider', title: '厂商', width: 80, templet: function (d) { return d.provider == 2 ? 'e签宝' : '法大大'; } }, { field: 'signno', title: '标识', width: 120 }, { field: 'status', title: '状态', width: 100, templet: stB }, { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'edit') openEdit(obj.data); else if (obj.event === 'autosign') doAutoSignAuth(obj.data); else if (obj.event === 'cancel') doCancel(obj.data.sid); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.data.pageSignet, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }
    function openEdit(d) { app.clearValidator(); $('#editForm')[0].reset(); state.editId = null; if (d) { state.editId = d.sid; F.forEach(function (k) { $('#editForm [name="' + k + '"]').val(d[k] != null ? d[k] : ''); }); } form.render('select'); state.editIndex = layer.open({ type: 1, title: d ? '编辑签章' : '添加签章', content: $('#editBox'), area: ['520px', 'auto'] }); }
    function doSave() { if (app.validate('editForm')) return; var o = {}; F.forEach(function (k) { o['signet.' + k] = $('#editForm [name="' + k + '"]').val(); }); var ad; if (state.editId) { o['signet.sid'] = state.editId; ad = api.data.updateSignet; } else { delete o['signet.sid']; ad = api.data.addSignet; } app.post(ad, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); }); }
    function doCancel(id) { app.showConfirm('确认作废？', function () { app.post(api.data.cancelSignet, { 'signet.sid': id }, function () { app.showAlert(app.success, '已作废'); query(state.page); }); }); }
    // 自动落章授权: internal-auth 将印章授权给全部成员在指定流程模板自动使用, 返回授权书签署链接
    function doAutoSignAuth(d) {
        layer.open({ type: 1, title: '自动落章授权 - ' + (d.name || ''), area: ['520px', '320px'],
            content: '<div style="padding:12px 18px;"><div style="margin-bottom:8px;color:#666;">绑定流程模板编号(多个用英文逗号分隔):</div><textarea id="autoSignTplIds" style="width:96%;height:64px;" placeholder="流程模板ID列表"></textarea><div style="margin-top:10px;color:#f60;" id="autoSignAuthResult"></div></div>',
            btn: ['发起授权', '取消'],
            yes: function (idx) {
                var tplIds = $('#autoSignTplIds').val();
                if (!tplIds || !tplIds.trim()) { app.showAlert(app.warning, '请填写模板编号'); return; }
                app.post(api.data.esignAutoSignAuth, { 'orgId': d.signno, 'templateIds': tplIds.trim() }, function (res) {
                    var link = res.authorizationSignShortUrl || res.authorizationSignUrl;
                    $('#autoSignAuthResult').html('授权书签署链接(发企业管理员/法定代表人签署后生效):<br><a href="' + link + '" target="_blank">' + link + '<\/a>');
                }, function (res) {
                    $('#autoSignAuthResult').text((res && res.errorMsg) || '发起失败');
                });
            }
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
