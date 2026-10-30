/** app/js/information/vaward.js —— 活动奖品（按票号加载 + 删除 + 选中打印）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;
    var state = { tno: null };

    // 从父窗口读取 tno
    try {
        var p = (parent && parent.params && parent.params.infomation) ? parent.params.infomation : (window.params ? window.params.infomation : null);
        if (p) state.tno = p.tno;
    } catch (e) {}

    initTable();
    if (state.tno) query();
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'checkbox', width: 50 },
                { field: 'name', title: '奖品名称', minWidth: 180 },
                { field: 'price', title: '价格', width: 100, align: 'right', templet: function (d) { return app.formatMoney(d.price); } },
                { field: 'num', title: '数量', width: 90, align: 'right' },
                { field: 'unit', title: '单位', width: 90 },
                { title: '操作', width: 110, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) { if (obj.event === 'del') doDelete(obj.data.vaid, obj.data.name); });
    }
    function query() {
        app.post(api.information.queryVawardByNo, { 'vaward.no': state.tno }, function (res) {
            table.reload('resultTable', { data: res.vawards || [] });
        });
    }
    function doDelete(vaid, name) {
        app.showConfirm('确认删除' + name + '？', function () {
            app.post(api.information.deleteVaward, { 'vaward.vaid': vaid }, function () { app.showAlert(app.success, '已删除'); query(); });
        });
    }
    function doPrint() {
        var ck = table.checkStatus('resultTable').data || [];
        if (!ck.length) { app.showAlert(app.warning, '请选择奖品'); return; }
        // 推到父窗口供打印页使用
        try {
            if (parent && parent.params && parent.params.infomation) {
                parent.params.infomation.vawards = ck.map(function (v) { return { name: v.name, num: v.num, unit: v.unit }; });
            }
        } catch (e) {}
        app.showAlert(app.success, '已选择' + ck.length + '项');
    }
    $('#btnPrint').on('click', doPrint);
});
}); // end app.ready
