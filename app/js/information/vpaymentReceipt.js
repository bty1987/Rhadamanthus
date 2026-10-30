/** app/js/information/vpaymentReceipt.js —— 收款收据（按 vrid 查询 + 表格渲染）*/
app.ready(function () {
layui.use(['table', 'jquery'], function () {
    var table = layui.table, $ = layui.jquery;

    var vrid = null;
    // 从父窗口读取 vrid
    try {
        var p = (parent && parent.params && parent.params.infomation) ? parent.params.infomation : (window.params ? window.params.infomation : null);
        if (p && p.vpayment) vrid = p.vpayment.vrid;
    } catch (e) {}

    var TYPE_MAP = { 0: '定金', 1: '诚意金', 2: '活动款', 3: '其他' };

    if (vrid) {
        app.post(api.information.queryVpaymentByVrid, { 'vpayment.vreceipt.vrid': vrid }, function (res) {
            var rows = []; var total = 0;
            $.each(res.vpayments || [], function (i, v) {
                rows.push({ paymentType: TYPE_MAP[v.type] || '---', brand: v.brand || '---', money: v.money });
                total += parseFloat(v.money || 0);
            });
            table.render({ elem: '#resultTable', data: rows, page: false, limit: 1000, even: true,
                cols: [[ { type: 'numbers', title: '#', width: 60 },
                    { field: 'brand', title: '品牌', width: 140 },
                    { field: 'paymentType', title: '收款类型', width: 140 },
                    { field: 'money', title: '收款金额(元)', width: 150, align: 'right', templet: function (d) { return app.formatMoney(d.money); } } ]] });
        });
    }
});
}); // end app.ready
