/** app/js/material/materialActivity.js —— 主材活动（活动信息 + 物品列表 + 领取/失效/退货/配送/未退/补款）
 * 上下文：app.params.materialActivity = { orderId, mid, no, activityId }。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var ctx = app.params.materialActivity || {};
    var STATE = { 0: '初始', 1: '失效', 2: '已领', 3: '退货', 4: '配送', 5: '未退', 6: '补款' };
    var activityMap = {};
    var editIndex = null, changeIndex = null;
    function stB(d) { var s = STATE[d.state] || '-'; var c = d.state == 2 ? 'layui-bg-green' : d.state == 1 ? 'layui-bg-gray' : 'layui-bg-orange'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; }
    loadActivityInfo(); loadItems(); loadActivityList();
    function loadActivityInfo() {
        $('#activityInfoBox').html('装修单号：<b>' + (ctx.orderId || '') + '<\/b> &nbsp; 主材单号：<b>' + (ctx.no || '') + '<\/b>');
    }
    function loadActivityList() {
        app.post(api.information.queryActivityForValid, { 'activity.type': 2 }, function (res) {
            var list = res.activitys || [];
            var $s = $('#selActivity'); $s.empty().append('<option value="">请选择</option>');
            list.forEach(function (a) { $s.append('<option value="' + a.aid + '">' + a.name + '</option>'); activityMap[a.aid] = a.name; });
            form.render('select');
        });
    }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[
                { type: 'numbers', title: '#', width: 60 },
                { field: 'activity', title: '活动', width: 160 },
                { field: 'name', title: '物品', minWidth: 140 },
                { field: 'money', title: '金额', width: 100, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'num', title: '数量', width: 80 },
                { field: 'total', title: '合计', width: 100, templet: function (d) { return app.formatMoney(app.utils.accMul(d.money, d.num)); } },
                { field: 'state', title: '状态', width: 90, templet: stB },
                { title: '操作', width: 460, toolbar: '#rowToolbar' }
            ]]
        });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'abate') doConfirm(api.material.abateMaterialActivityItem, v, '失效');
            else if (ev === 'unrefund') doConfirm(api.material.unrefundMaterialActivityItem, v, '未退');
            else if (ev === 'expend') doConfirm(api.material.expendMaterialActivityItem, v, '补款');
            else if (ev === 'receive') openComment(v, 0, '领取');
            else if (ev === 'delive') openComment(v, 1, '配送');
            else if (ev === 'refund') openComment(v, 2, '退货');
        });
    }
    function loadItems() { initTable(); app.post(api.material.queryMaterialActivityItem, { 'orderId': ctx.orderId }, function (res) { table.reload('resultTable', { data: res.materialActivityItems || [] }); }); }
    function doConfirm(url, v, label) { layer.confirm('是否确认' + label + ' ' + v.name + ' ?', function (i) { app.post(url, { 'materialActivityItem.maiid': v.maiid }, function () { layer.close(i); app.showAlert(app.success, '操作成功'); loadItems(); }); }); }
    function openComment(v, type, label) {
        $('#editForm')[0].reset();
        $('#editForm [name="maiid"]').val(v.maiid);
        $('#editForm [name="opType"]').val(type);
        editIndex = layer.open({ type: 1, title: label + ' - ' + v.name, content: $('#editBox'), area: ['520px', 'auto'] });
    }
    function doSave() {
        var maiid = $('#editForm [name="maiid"]').val();
        var type = $('#editForm [name="opType"]').val();
        var content = $('#editForm [name="content"]').val();
        var url = type == 0 ? api.material.receiveMaterialActivityItem : type == 1 ? api.material.deliveMaterialActivityItem : api.material.refundMaterialActivityItem;
        app.post(url, { 'materialActivityItem.maiid': maiid, 'materialActivityItem.content': content }, function () { app.showAlert(app.success, '操作成功'); layer.close(editIndex); loadItems(); });
    }
    function openChange() { $('#changeForm')[0].reset(); form.render('select'); changeIndex = layer.open({ type: 1, title: '修改活动', content: $('#changeBox'), area: ['520px', 'auto'] }); }
    function doChangeSave() {
        var aid = $('#changeForm [name="aid"]').val();
        if (!aid) { app.showAlert(app.warning, '请选择活动'); return; }
        app.post(api.material.updateMaterialForActivity, { 'material.mid': ctx.mid, 'material.activityId': aid }, function () { app.showAlert(app.success, '修改成功'); layer.close(changeIndex); });
    }
    $('#btnAddItem').on('click', function () { app.showAlert(app.info, '领取物品功能请在活动物品页选择"领取"'); });
    $('#btnChangeActivity').on('click', openChange);
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(editIndex); });
    $('#btnChangeSave').on('click', doChangeSave);
    $('#btnChangeCancel').on('click', function () { layer.close(changeIndex); });
    $('#btnBack').on('click', function () { app.switchPage(api.index.materialIndex.url); });
});
}); // end app.ready
