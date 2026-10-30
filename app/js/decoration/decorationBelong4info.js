/** app/js/decoration/decorationBelong4info.js —— 装修单归属信息（弹窗子页：设计归属 type=0 + 业务归属 type=1）
 *  对齐旧 decorationUtils.initDecorationBelong(orderId, 0/1)。 */
app.ready(function () {
layui.use(['table', 'layer', 'jquery'], function () {
    var table = layui.table, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var orderId = (app.params.decoration || {}).orderId;
    $('#orderIdLabel').text(orderId || '-');

    var COLS = [[ { type: 'numbers', title: '#', width: 50 },
        { field: 'uid', title: '员工编号', width: 130, templet: function (d) { return (d.belonger && d.belonger.userId) || ''; } },
        { field: 'name', title: '姓名', width: 110, templet: function (d) { return (d.belonger && d.belonger.currentName) || ''; } },
        { field: 'dept', title: '所属部门', width: 150, templet: function (d) { return (d.department && d.department.name) || ''; } },
        { field: 'region', title: '所属大区', width: 150, templet: function (d) { return (d.region && d.region.name) || ''; } },
        { field: 'rate', title: '分配比例', width: 110 },
        { field: 'defaultFlag', title: '默认', width: 90, templet: function (d) { return d.defaultFlag == 1 ? '<span class="layui-badge layui-bg-green">归属<\/span>' : '<span class="layui-badge layui-bg-gray">非归属<\/span>'; } },
        { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } } ]];

    table.render({ elem: '#designTable', data: [], page: false, limit: 1000, even: true, title: '设计归属', cols: COLS, text: { none: '暂无设计归属' } });
    table.render({ elem: '#salesTable', data: [], page: false, limit: 1000, even: true, title: '业务归属', cols: COLS, text: { none: '暂无业务归属' } });

    if (orderId) {
        app.post(api.decoration.queryDecorationBelong, { 'decorationBelong.orderId': orderId, 'decorationBelong.type': 0, 'decorationBelong.status': 0 }, function (res) {
            table.reload('designTable', { data: res.decorationBelongs || [] });
        });
        app.post(api.decoration.queryDecorationBelong, { 'decorationBelong.orderId': orderId, 'decorationBelong.type': 1, 'decorationBelong.status': 0 }, function (res) {
            table.reload('salesTable', { data: res.decorationBelongs || [] });
        });
    }

    $('#btnBack').on('click', function () { app.switchPage(api.index.decorationBelongIndex.url); });
});
}); // end app.ready
