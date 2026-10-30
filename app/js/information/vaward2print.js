/** app/js/information/vaward2print.js —— 大活动奖品打印（读取父窗口 vticket/vawards 渲染表格）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    var vticket = null, vawards = [];
    try {
        var p = (parent && parent.params && parent.params.infomation) ? parent.params.infomation : (window.params ? window.params.infomation : null);
        if (p) { vticket = p.vticket || {}; vawards = p.vawards || []; }
    } catch (e) {}

    var rows = $.map(vawards, function (v) { return { name: v.name, num: v.num, unit: v.unit }; });
    var tno = vticket ? vticket.tno : '';
    var address = (vticket && vticket.address) ? vticket.address : '';
    var belonger = (vticket && vticket.belonger && vticket.belonger.currentName) ? vticket.belonger.currentName : '';

    $('#resultTable').before('<div style="text-align:center; padding:12px 0;"><h2>大活动奖品</h2></div>' +
        '<div style="padding:0 12px;"><p>票号：' + tno + '　归属人：' + belonger + '</p><p>楼盘地址：' + address + '</p></div>');

    table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '名称', minWidth: 200 },
            { field: 'unit', title: '单位', width: 120 },
            { field: 'num', title: '数量', width: 120, align: 'right' } ]] });

    $('#btnPrint').on('click', function () { window.print(); });
});
}); // end app.ready
