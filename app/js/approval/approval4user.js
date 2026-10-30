/** app/js/approval/approval4user.js —— 审批人员管理（approver CRUD）
  pageApprover 分页；addApprover/deleteApprover；审批人用拼音输入框（blur 自动匹配 queryUserByPinyin，存 data-uid）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, editIdx: null };
    var typeName = { 1: '客户信息', 2: '小区', 3: '装修归属', 4: '报价折扣', 5: '装修退款', 6: '主材退款', 7: '主材外部退款', 8: '装修活动', 9: '主材全款', 10: '销售退款', 11: '清单DB', 12: '销售折扣', 13: '人事', 14: '客源-装修', 16: '装修整装', 17: '客源', 18: '销售收款', 19: '装修终审', 20: '客源变更', 21: '客户机会', 22: '报价优惠', 23: '优惠', 24: '装饰合同', 25: '客户机会停用', 26: '预付款提现' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'userBase.currentName', title: '姓名', width: 120 },
                { field: 'userBase.userId', title: '编号', width: 100 },
                { field: 'userBase.duty.name', title: '职位', width: 120 },
                { field: 'type', title: '类型', width: 130, templet: function (d) { return '<span class="layui-badge layui-bg-blue">' + (typeName[d.type] || d.type) + '<\/span>'; } },
                { field: 'comment', title: '说明', minWidth: 160, templet: function (d) { return esc(d.comment); } },
                { title: '操作', width: 100, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDel(obj.data.aid); });
    }
    function buildFilters() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(page) {
        state.page = page || 1;
        app.post(api.approval.pageApprover, $.extend({}, buildFilters(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var pg = res.paging || {}; table.reload('resultTable', { data: pg.data || [] }); state.total = pg.totalRecords || 0; renderPage();
        });
    }
    function renderPage() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (obj, first) { state.rows = obj.limit; if (!first) query(obj.curr); } }); }

    function openAdd() {
        app.clearValidator(); $('#editForm')[0].reset();
        $('#editForm [name="approver"]').attr('data-uid', 0);
        form.render('select');
        state.editIdx = layer.open({ type: 1, title: '添加审批人员', content: $('#editBox'), area: ['520px', 'auto'], cancel: function () { app.clearValidator(); } });
    }
    // 简易 typeahead：审批人拼音输入框 blur 自动匹配
    $('#editForm [name="approver"]').on('blur', function () {
        var pin = $.trim($(this).val()); var $i = $(this);
        if (!pin) { $i.attr('data-uid', 0); return; }
        app.post(api.personel.queryUserByPinyin, { 'pinyinName': pin, 'user.status': 0, 'departmentType.name': '' }, function (res) {
            var list = res.autoFillKeyValue || res.users || []; var u = list[0];
            if (u) { $i.val(u.value || u.userName || ''); $i.attr('data-uid', u.key || u.userId || 0); }
            else { $i.attr('data-uid', 0); }
        });
    });
    function doSave() {
        if (app.validate('editForm')) return;
        var uid = $('#editForm [name="approver"]').attr('data-uid');
        if (!uid || uid == 0) { app.showAlert(app.warning, '请输入有效的审批人'); return; }
        var o = {
            'approver.userBase.userId': uid,
            'approver.type': $('#editForm [name="type"]').val(),
            'approver.comment': $('#editForm [name="comment"]').val()
        };
        app.post(api.approval.addApprover, o, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIdx); state.editIdx = null; query(state.page); });
    }
    function doDel(aid) {
        app.showConfirm('确认删除该审批人员?', function () { app.post(api.approval.deleteApprover, { 'approver.aid': aid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); }); });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIdx); state.editIdx = null; });

    function esc(s) { return $('<div/>').text(s == null ? '' : s).html(); }
});
}); // end app.ready
