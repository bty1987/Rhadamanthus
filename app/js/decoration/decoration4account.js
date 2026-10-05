/** app/js/decoration/decoration4account.js —— 装修单决算向导（旧 ace_wizard 决算节点 → layui tab）
 *  上下文：app.params.decoration = { orderId, typeness, status, viewNode }。
 *  数据：装修单（queryDecorationForCommonByOrderId）+ 配比（Midpack/Holonomy/Inclusive，按订单类型）
 *  + 装修款（queryDecorationPaymentByOrderId 待收/已收汇总）+ 外销（queryOalesByOrderId + amountOales）
 *  + 决算（queryDecorationAccount + queryDecorationAccountItem）。
 *  操作：保存（updateDecorationAccount + updateDecorationAccountItem）/ 生成决算（makeDecorationAccount）/
 *  推送客户（sendDecorationAccount）/ 打印（decorationAccountOutput 弹窗）。 */
app.ready(function () {
layui.use(['element', 'table', 'form', 'layer', 'jquery'], function () {
    var element = layui.element, table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var decoration = {};
    var basic = { signFactDone: 0, signFactOwing: 0, oalesTotal: 0, oalesScaleTotal: 0, materialTotal: 0, materialFactPrice: 0, addDone: 0, reduceDone: 0, contractAdvance: 0, materialAdvance: 0 };

    $('#orderIdLabel').text(orderId || '-');
    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    var F = ['name', 'matching', 'discount', 'discountBase', 'serviceRate', 'materialPrice', 'servicePrice', 'projectPrice', 'projectBase', 'paidupMatching', 'difference', 'coupon', 'internal', 'fulldel', 'cashback', 'comment'];

    // —— 装修单 + 配比 + 款项 + 外销（同步取齐后渲染汇总）——
    app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
        decoration = res.decoration || {};
        loadProportion();
        loadPayments();
        loadOales();
        loadAdvance();
        loadAccount();
        renderSum();
    });

    function loadProportion() {
        var typeness = parseInt(decoration.typeness, 10);
        if (typeness == 0) {
            app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
                var m = res.decorationMidpack;
                if (m && m.dmid) { basic.servicePrice = m.servicePrice; basic.servicePaidup = m.servicePaidup; basic.materialRatio = 0; }
                renderSum();
            }, null, false);
        } else if (typeness == 2) {
            app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
                var m = res.decorationHolonomy;
                if (m && m.dhid) { basic.servicePrice = m.servicePrice; basic.materialRatio = m.materialPrice; basic.servicePaidup = m.servicePaidup; }
                renderSum();
            }, null, false);
        } else if (typeness == 1) {
            basic.servicePrice = 0; basic.materialRatio = 0; basic.servicePaidup = 0;
        }
    }

    function loadPayments() {
        app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId, 'decorationPayment.oneType': 0 }, function (res) {
            $.each(res.decorationPayments || [], function (i, v) {
                if (v.twoType == 1 && v.paymentStatus == 0) basic.signFactOwing = app.utils.accAdd(basic.signFactOwing, v.referMoney);
                else if (v.twoType == 1 && v.paymentStatus != 0) basic.signFactDone = app.utils.accAdd(basic.signFactDone, v.referMoney);
            });
            renderSum();
        }, null, false);
    }

    function loadOales() {
        app.post(api.sales.queryOalesByOrderId, { 'oales.decoration.orderId': orderId }, function (res) {
            // 驳回(3)/废单(6)不计入外销总额
            $.each(res.oaleses || [], function (i, v) { if (v.status == 3 || v.status == 6) return; basic.oalesTotal = app.utils.accAdd(basic.oalesTotal, v.total); });
            renderSum();
            table.reload('oalesTable', { data: res.oaleses || [] });
        }, null, false);
        app.post(api.sales.amountOales, { 'oales.decoration.orderId': orderId, 'oales.isScale': 0 }, function (res) {
            basic.oalesScaleTotal = res.amount || 0;
            renderSum();
        }, null, false);
    }

    function loadAdvance() {
        app.post(api.payment.queryAdvancePaymentByOrderId, { 'advancePayment.decoration.orderId': orderId }, function (res) {
            basic.contractAdvance = res.balanceAdvance || 0;
            basic.materialAdvance = res.materialAdvance || 0;
            renderSum();
        }, null, false);
    }

    // —— 汇总表 ——
    function renderSum() {
        function row2(k1, v1, k2, v2) { return '<tr><td style="width:130px;font-weight:bold;">' + k1 + '<\/td><td>' + app.formatMoney(v1) + '<\/td><td style="width:130px;font-weight:bold;">' + k2 + '<\/td><td>' + app.formatMoney(v2) + '<\/td><\/tr>'; }
        var html = ''
            + row2('合同额（签单额）', decoration.orderTotalPrice, '优惠券', decoration.couponCut)
            + row2('实收额', decoration.factPrice, '预签额', decoration.precontractPrice)
            + row2('合同款已收', basic.signFactDone, '合同款待收', basic.signFactOwing)
            + row2('服务费', basic.servicePrice != null ? basic.servicePrice : 0, '已收服务费', basic.servicePaidup != null ? basic.servicePaidup : 0)
            + row2('主材配比', basic.materialRatio != null ? basic.materialRatio : 0, '外销总金额', basic.oalesTotal)
            + row2('外销配比金额', basic.oalesScaleTotal, '外销主材总额', app.utils.accAdd(basic.oalesTotal, basic.materialTotal))
            + row2('合同预付款', basic.contractAdvance, '主材预付款', basic.materialAdvance)
            + row2('建筑面积', decoration.house ? decoration.house.buildArea : '', '折扣', decoration.discount);
        $('#sumTable').html(html);
    }

    // —— 主材/外销 ——
    table.render({ elem: '#matSalesTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'no', title: '销售单号', width: 130 }, { field: 'category', title: '品类', width: 100 },
            { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.brand ? d.brand.name : ''; } },
            { field: 'total', title: '总额', width: 90, templet: function (d) { return app.formatMoney(d.total); } },
            { field: 'depositpay', title: '定金', width: 90, templet: function (d) { return app.formatMoney(d.depositpay); } },
            { field: 'fullpay', title: '补款', width: 90, templet: function (d) { return app.formatMoney(d.fullpay); } },
            { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
    app.post(api.sales.pageSalesByOrderId, { 'sales.orderId': orderId, 'paging.page': 1, 'paging.rows': 200 }, function (res) {
        var data = (res.paging || {}).data || [];
        // 实收合计（对齐旧 initMaterial 口径）
        $.each(data, function (i, v) { basic.materialTotal = app.utils.accAdd(basic.materialTotal, app.utils.accAdd(v.depositpay != null ? v.depositpay : 0, v.fullpay != null ? v.fullpay : 0)); });
        renderSum();
        table.reload('matSalesTable', { data: data });
    });

    table.render({ elem: '#oalesTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { field: 'no', title: '外销单号', width: 130 }, { field: 'category', title: '品类', width: 100 },
            { field: 'brand', title: '品牌', width: 110 }, { field: 'total', title: '总额', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
            { field: 'comment', title: '备注', minWidth: 140 } ]] });

    // —— 决算明细 ——
    table.render({ elem: '#itemTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'type', title: '类型', width: 80, templet: function (d) { return E.accountItemType[d.type] != null ? E.accountItemType[d.type] : d.type; } },
            { field: 'name', title: '名称', width: 140 },
            { field: 'money', title: '金额', width: 100, templet: function (d) { return app.formatMoney(d.money); } },
            { field: 'rate', title: '比例', width: 80 },
            { field: 'sourceType', title: '来源类型', width: 90 },
            { field: 'sourceId', title: '来源ID', width: 100 },
            { field: 'content', title: '内容', minWidth: 150 },
            { field: 'comment', title: '备注', width: 120 } ]] });

    // —— 决算信息回填 ——
    function loadAccount() {
        app.post(api.decoration.queryDecorationAccount, { 'decorationAccount.orderId': orderId }, function (res) {
            var a = res.decorationAccount;
            if (!a) return;
            $('#name').val(a.name);
            $('#typeness').val(a.typeness);
            $('#arcal').val(a.arcal);
            var map = { matching: a.matching, discount: a.discount, discountBase: a.discountBase, serviceRate: a.serviceRate, materialPrice: a.materialPrice, servicePrice: a.servicePrice, projectPrice: a.projectPrice, projectBase: a.projectBase, paidupMatching: a.paidupMatching, difference: a.difference, coupon: a.coupon, internal: a.internal, fulldel: a.fulldel, cashback: a.cashback, comment: a.comment };
            $.each(map, function (k, v) { $('#' + k).val(v != null ? v : ''); });
            form.render('select');
        });
        app.post(api.decoration.queryDecorationAccountItem, { 'decorationAccountItem.orderId': orderId }, function (res) {
            table.reload('itemTable', { data: res.decorationAccountItems || [] });
        });
    }

    // —— 保存（决算 + 明细）——
    function collectOptions() {
        var opts = { 'decorationAccount.orderId': orderId };
        $.each(F, function (i, k) { opts['decorationAccount.' + k] = $('#' + k).val(); });
        opts['decorationAccount.typeness'] = $('#typeness').val();
        opts['decorationAccount.arcal'] = $('#arcal').val();
        return opts;
    }
    function buildItems() {
        // 决算固定项（对齐旧 buildDecorationAccountItems 的固定子项）
        var items = [];
        function addItem(type, subtype, name, money) {
            items.push({ type: type, subtype: subtype, name: name, sourceType: '', sourceId: '', money: money || 0, rate: 0, sort: items.length, content: money || 0, comment: '' });
        }
        addItem(8, 4, '决算主材额', $('#materialPrice').val());
        addItem(8, 14, '优惠券', $('#coupon').val());
        addItem(8, 15, '内部优惠券', $('#internal').val());
        addItem(8, 16, '满送', $('#fulldel').val());
        addItem(8, 17, '返现', $('#cashback').val());
        return items;
    }

    $('#btnSave').on('click', function () {
        var items = buildItems();
        var opts = {};
        $.each(items, function (i, it) {
            opts['decorationAccountItems[' + i + '].type'] = it.type;
            opts['decorationAccountItems[' + i + '].subtype'] = it.subtype;
            opts['decorationAccountItems[' + i + '].name'] = it.name;
            opts['decorationAccountItems[' + i + '].sourceType'] = it.sourceType;
            opts['decorationAccountItems[' + i + '].sourceId'] = it.sourceId;
            opts['decorationAccountItems[' + i + '].money'] = it.money;
            opts['decorationAccountItems[' + i + '].rate'] = it.rate;
            opts['decorationAccountItems[' + i + '].sort'] = it.sort;
            opts['decorationAccountItems[' + i + '].content'] = it.content;
            opts['decorationAccountItems[' + i + '].comment'] = it.comment;
        });
        app.post(api.decoration.updateDecorationAccountItem, opts, function () {
            app.post(api.decoration.updateDecorationAccount, collectOptions(), function () {
                app.showAlert(app.success, '保存成功');
                loadAccount();
            });
        });
    });

    // —— 生成决算 ——
    $('#btnMake').on('click', function () {
        app.showConfirm('确认生成决算吗?', function () {
            app.post(api.decoration.makeDecorationAccount, { 'decorationAccount.orderId': orderId }, function () {
                app.showAlert(app.success, '生成成功');
                loadAccount();
            });
        });
    });

    // —— 推送客户 ——
    $('#btnSend').on('click', function () {
        app.showConfirm('确定要向客户推送决算信息吗?', function () {
            app.post(api.decoration.sendDecorationAccount, { 'decorationAccount.orderId': orderId }, function () {
                app.showAlert(app.success, '推送成功');
            });
        });
    });

    // —— 打印（决算单）——
    $('#btnPrint').on('click', function () {
        app.params.decoration = $.extend({}, app.params.decoration, {
            decoration: decoration,
            accountBasic: {
                typeness: $('#typeness').val(), cal: $('#arcal').val() == 0,
                signPrice: decoration.orderTotalPrice, coupon: decoration.couponCut, signFactPrice: decoration.factPrice,
                servicePrice: $('#servicePrice').val(), servicePaidup: basic.servicePaidup, materialRatio: basic.materialRatio,
                materialTotal: basic.materialTotal, materialCoupon: '', materialFactPrice: basic.materialFactPrice,
                oalesOutput: basic.oalesTotal > 0, oalesTotal: basic.oalesTotal,
                addDone: basic.addDone, reduceDone: basic.reduceDone,
                contractAdvance: basic.contractAdvance, materialAdvance: basic.materialAdvance,
                direct: $('#projectPrice').val(), beforeTotal: $('#projectBase').val(),
                materialAccount: $('#materialPrice').val(), accountForehead: $('#projectPrice').val(),
                accountServicePrice: $('#servicePrice').val(), balanceSum: $('#difference').val(),
                preferences: $('#coupon').val(), fulldel: $('#fulldel').val(), cashback: $('#cashback').val(),
                flowerRatio: $('#paidupMatching').val(), flowerOalesRatio: app.utils.accAdd($('#paidupMatching').val() || 0, basic.oalesScaleTotal)
            }
        });
        app.popup(api.index.decorationAccountOutputIndex.url, '决算单打印 - ' + orderId, null, { area: ['900px', '90%'] });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationAccountIndex.url); });
});
}); // end app.ready
