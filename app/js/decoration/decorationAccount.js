/** app/js/decoration/decorationAccount.js —— 装修单决算列表
 *  操作：查看/编辑 → decoration4account 决算向导；明细 → 决算项明细弹窗；
 *        推送 → sendDecorationAccount；二维码 → 客户确认二维码 URL（layer 展示链接文本）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'laydate', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var state = { page: 1, rows: 10, total: 0 };
    decorationCommon.dateRange('#accountTime');

    function stName(v, field) { return v.accountStatus ? (E.accountStatusFlag[v.accountStatus[field]] != null ? E.accountStatusFlag[v.accountStatus[field]] : '') : ''; }
    function scaleText(v, s, t) { return v.accountStatus ? '(' + (v.accountStatus[s] != null ? v.accountStatus[s] : 0) + '/' + (v.accountStatus[t] != null ? v.accountStatus[t] : 0) + ')' : ''; }
    function unfinishText(v, f) { return v.accountStatus ? '(' + (v.accountStatus[f] != null ? v.accountStatus[f] : 0) + ')' : ''; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 120, templet: function (d) { return d.decoration ? d.decoration.orderId : d.orderId; } },
            { field: 'village', title: '楼盘', width: 110, templet: function (d) { return d.decoration && d.decoration.house && d.decoration.house.village ? d.decoration.house.village.name : ''; } },
            { field: 'houseNumber', title: '楼号', width: 80, templet: function (d) { return d.decoration && d.decoration.house ? d.decoration.house.houseNumber : ''; } },
            { field: 'customer', title: '客户', width: 80, templet: function (d) { return d.decoration && d.decoration.customer ? d.decoration.customer.name : ''; } },
            { field: 'designer', title: '设计师', width: 80, templet: function (d) { return d.decoration && d.decoration.designer ? d.decoration.designer.currentName : ''; } },
            { field: 'salesman', title: '业务员', width: 80, templet: function (d) { return d.decoration && d.decoration.salesman ? d.decoration.salesman.currentName : ''; } },
            { field: 'status', title: '订单状态', width: 85, templet: function (d) { return d.decoration ? decorationCommon.badge(E.status, d.decoration.status) : ''; } },
            { field: 'accountTime', title: '决算时间', width: 100, templet: function (d) { return (d.decoration ? d.decoration.accountTime : '') ? (d.decoration.accountTime + '').substring(0, 10) : ''; } },
            { field: 'name', title: '决算名称', width: 120 },
            { field: 'type', title: '类型', width: 75, templet: function (d) { return E.accountType[d.type] != null ? E.accountType[d.type] : d.type; } },
            { field: 'typeness', title: '决算类型', width: 85, templet: function (d) { return E.typeness[d.typeness] != null ? E.typeness[d.typeness] : d.typeness; } },
            { field: 'arcal', title: '增减配比', width: 90, templet: function (d) { return E.accountArcal[d.arcal] != null ? E.accountArcal[d.arcal] : d.arcal; } },
            { field: 'matching', title: '主材配比', width: 90, templet: function (d) { return app.formatMoney(d.matching); } },
            { field: 'discount', title: '折扣', width: 70, templet: function (d) { return app.formatMoney(d.discount); } },
            { field: 'discountBase', title: '折扣基数', width: 85, templet: function (d) { return app.formatMoney(d.discountBase); } },
            { field: 'serviceRate', title: '服务费比例', width: 90, templet: function (d) { return app.formatMoney(d.serviceRate); } },
            { field: 'materialPrice', title: '决算主材额', width: 95, templet: function (d) { return app.formatMoney(d.materialPrice); } },
            { field: 'servicePrice', title: '决算服务费', width: 95, templet: function (d) { return app.formatMoney(d.servicePrice); } },
            { field: 'projectPrice', title: '工程总额', width: 90, templet: function (d) { return app.formatMoney(d.projectPrice); } },
            { field: 'projectBase', title: '工程基数', width: 90, templet: function (d) { return app.formatMoney(d.projectBase); } },
            { field: 'paidupMatching', title: '实花配比', width: 90, templet: function (d) { return app.formatMoney(d.paidupMatching); } },
            { field: 'difference', title: '差额', width: 80, templet: function (d) { return app.formatMoney(d.difference); } },
            { field: 'coupon', title: '优惠券', width: 80, templet: function (d) { return app.formatMoney(d.coupon); } },
            { field: 'internal', title: '内部优惠券', width: 95, templet: function (d) { return app.formatMoney(d.internal); } },
            { field: 'fulldel', title: '满送', width: 75, templet: function (d) { return app.formatMoney(d.fulldel); } },
            { field: 'cashback', title: '返现', width: 75, templet: function (d) { return app.formatMoney(d.cashback); } },
            { field: 'isAffirm', title: '客户确认', width: 85, templet: function (d) { return decorationCommon.badge(E.accountIsAffirm, d.isAffirm, function (k) { return k == 1 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
            { field: 'affirmTime', title: '确认时间', width: 100, templet: function (d) { return (d.affirmTime || '').substring(0, 10); } },
            { field: 'asStatus', title: '决算指标', width: 90, templet: function (d) { return stName(d, 'status'); } },
            { field: 'asSign', title: '签约', width: 85, templet: function (d) { return stName(d, 'signStatus'); } },
            { field: 'asSales', title: '销售完结', width: 110, templet: function (d) { return stName(d, 'salesStatus') + unfinishText(d, 'salesUnfinish'); } },
            { field: 'asCons', title: '工程节点', width: 120, templet: function (d) { var n = d.accountStatus && d.accountStatus.constructionName ? '(' + d.accountStatus.constructionName + ')' : ''; return stName(d, 'constructionStatus') + n; } },
            { field: 'asSel', title: '选材完结', width: 110, templet: function (d) { return stName(d, 'selectionStatus') + unfinishText(d, 'selectionUnfinish'); } },
            { field: 'asDp', title: '装修款比例', width: 130, templet: function (d) { return stName(d, 'decorationPaymentStatus') + scaleText(d, 'decorationPaymentScale', 'decorationPaymentTarget'); } },
            { field: 'asSp', title: '销售比例', width: 130, templet: function (d) { return stName(d, 'salesPaymentStatus') + scaleText(d, 'salesPaymentScale', 'salesPaymentTarget'); } },
            { field: 'comment', title: '备注', width: 120 },
            { title: '操作', width: 330, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        var ev = obj.event, v = obj.data;
        if (ev === 'view') goDetail(v);
        else if (ev === 'items') showItems(v);
        else if (ev === 'push') doPush(v);
        else if (ev === 'qrcode') showQrcode(v);
    });

    // 查看/编辑 → 决算向导
    function goDetail(v) {
        var d = v.decoration || {};
        app.params.decoration = $.extend({}, app.params.decoration, { orderId: v.orderId || d.orderId, typeness: d.typeness, status: d.status });
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.orderId || d.orderId });
        app.params.decoration.viewNode = [{ type: 'account', opt: { btn: ['accountPrint', 'btnAccountPrint'] } }];
        app.params.historyPage = api.index.decorationAccountIndex.url;
        app.switchPage(api.index.decorationFinalSettlementIndex.url);
    }

    // 决算项明细
    function showItems(v) {
        app.post(api.decoration.queryDecorationAccountItem, { 'decorationAccountItem.orderId': v.orderId }, function (res) {
            var items = res.decorationAccountItems || [];
            if (!items.length) { app.showAlert(app.info, '暂无明细'); return; }
            var table2 = layui.table;
            layer.open({ type: 1, title: '决算明细 - ' + v.orderId, area: ['860px', '70%'],
                content: '<div style="padding:10px;"><table id="itemTable" lay-filter="itemTable"><\/table></div>',
                success: function () {
                    table2.render({ elem: '#itemTable', data: items, page: false, limit: 1000, even: true,
                        cols: [[ { type: 'numbers', title: '#', width: 50 },
                            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.accountItemType[d.type] != null ? E.accountItemType[d.type] : d.type; } },
                            { field: 'name', title: '名称', width: 140 },
                            { field: 'money', title: '金额', width: 100, templet: function (d) { return app.formatMoney(d.money); } },
                            { field: 'rate', title: '比例', width: 80 },
                            { field: 'sourceType', title: '来源类型', width: 90 },
                            { field: 'sourceId', title: '来源ID', width: 100 },
                            { field: 'content', title: '内容', minWidth: 150 },
                            { field: 'comment', title: '备注', minWidth: 120 } ]] });
                } });
        });
    }

    function doPush(v) {
        app.showConfirm('确定要向客户推送决算信息吗?', function () {
            app.post(api.decoration.sendDecorationAccount, { 'decorationAccount.orderId': v.orderId }, function () {
                app.showAlert(app.success, '操作成功');
            });
        });
    }

    // 二维码（旧版 jquery.qrcode；纯 layui 版展示确认链接，可扫码打开）
    function showQrcode(v) {
        var url = 'http://fanglin.vip/wx/account?orderId=' + v.orderId + '&daid=' + v.daid;
        layer.open({ type: 1, title: '客户确认二维码', area: ['420px', '220px'],
            content: '<div style="padding:20px;text-align:center;">'
                + '<p style="margin-bottom:10px;">扫码或复制链接进行客户确认：<\/p>'
                + '<p style="word-break:break-all;"><a href="' + url + '" target="_blank">' + url + '<\/a><\/p>'
                + '<p style="color:#999;font-size:12px;margin-top:10px;">装修单号：' + v.orderId + '<\/p>'
                + '<\/div>' });
    }

    function query(pg) {
        state.page = pg || 1;
        var filters = decorationCommon.buildFilters($('#searchForm'));
        app.post(api.decoration.pageDecorationAccount, $.extend({}, filters, { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    $('#btnSearch').on('click', function () { query(1); });
    query(1);
});
}); // end app.ready
