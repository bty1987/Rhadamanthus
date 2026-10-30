/** app/js/manifest/occessoriesCost.js —— 外辅成本（按 oid 增改删成本项）
 *  对齐旧 WebContent/js/manifest/occessoriesCost.js。
 *  type 枚举来自 api.ds.manifest（occessoriesisCostType）。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var oid = getQueryParam('oid');
    var editIndex = null;
    if (!oid) { app.showAlert(app.warning, '缺少 oid 参数'); return; }
    app.breadcrumb([{ icon: 'layui-icon-home', text: '货单' }, { text: '外辅成本' }]);

    var typeMap = {};
    app.post(api.ds.manifest, {}, function (res) {
        var list = res.occessoriesisCostType || [];
        var html = '';
        for (var i = 0; i < list.length; i++) { typeMap[list[i].key] = list[i].value; html += '<option value="' + list[i].key + '">' + list[i].value + '</option>'; }
        $('#costType').html(html);
        form.render('select');
        initTable(); query();
    });

    function typeText(d) { return typeMap[String(d.type)] || '---'; }
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'initPrice', title: '原费用', width: 120, align: 'right' },
                { field: 'price', title: '费用', width: 120, align: 'right' },
                { field: 'cost', title: '成本', width: 120, align: 'right' },
                { field: 'type', title: '类型', width: 100, templet: typeText },
                { title: '操作', width: 180, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var e = obj.event, d = obj.data;
            if (e === 'edit') openEdit(d);
            else if (e === 'del') app.showConfirm('是否确定删除', function () { app.post(api.inventory.deleteOccessoriesCost, { 'occessoriesCost.ocid': d.ocid }, function () { app.showAlert(app.success, '已删除'); query(); }); });
        });
    }
    function query() {
        app.post(api.inventory.queryOccessoriesCost, { 'occessoriesCost.oid': oid }, function (res) {
            table.reload('resultTable', { data: res.occessoriesCosts || [] });
        });
    }
    function openEdit(d) {
        app.clearValidator(); $('#editForm')[0].reset();
        if (d) { $('#editForm [name="ocid"]').val(d.ocid); $('#editForm [name="initPrice"]').val(d.initPrice); $('#editForm [name="price"]').val(d.price); $('#editForm [name="cost"]').val(d.cost); $('#editForm [name="type"]').val(d.type); }
        form.render('select');
        editIndex = layer.open({ type: 1, title: d ? '编辑' : '添加', content: $('#editBox'), area: ['480px', 'auto'] });
    }
    $('#btnSave').on('click', function () {
        var ocid = $('#editForm [name="ocid"]').val();
        var opt = { 'occessoriesCost.oid': oid, 'occessoriesCost.initPrice': $('#editForm [name="initPrice"]').val(), 'occessoriesCost.price': $('#editForm [name="price"]').val(), 'occessoriesCost.cost': $('#editForm [name="cost"]').val(), 'occessoriesCost.type': $('#editForm [name="type"]').val() };
        var def;
        if (ocid) { opt['occessoriesCost.ocid'] = ocid; def = api.inventory.updateOccessoriesCost; }
        else { def = api.inventory.addOccessoriesCost; }
        app.post(def, opt, function () { app.showAlert(app.success, '操作成功'); layer.close(editIndex); editIndex = null; query(); });
    });
    $('#btnCancel').on('click', function () { layer.close(editIndex); editIndex = null; });
    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnBack').on('click', function () { history.back(); });
    form.render();

    function getQueryParam(name) {
        var s = location.search.substring(1).split('&');
        for (var i = 0; i < s.length; i++) { var kv = s[i].split('='); if (decodeURIComponent(kv[0]) === name) return decodeURIComponent(kv[1] || ''); }
        return '';
    }
});
}); // end app.ready
