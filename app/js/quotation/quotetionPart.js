/** app/js/quotation/quotetionPart.js —— 预报编辑器（quotetion 并行模块）
 *  装载：queryQuotetionByQid + queryQuotetionFunctionAreaByQid；
 *  功能区：add/update/deleteQuotetionFunctionArea（deleteQuotetionFunctionArea）；
 *  项：updateQuotetionFunctionAreaItem（数量公式 {w}工程量 等变量/单价）、deleteQuotetionFunctionAreaItem；
 *  保存 updateQuotetionForAdvance；对比入口（quotetionCompare）。
 *  上下文：app.params.quotation = { quotetion, orderId }。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var quotetion = qctx.quotetion || {};
    var orderId = qctx.orderId;
    var basicParams = null;
    var areas = [];
    var seq = 0;
    var itemState = { page: 1, rows: 10, total: 0 };

    function evalNum(formula) {
        formula = (formula || '').replace(/\s+/g, '');
        if (formula === '') return null;
        if (/([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)/.test(formula)) return null;
        try {
            var num = u.changeThrDecimal(eval(formula));
            if (num < 0 || num > 10000000) return null;
            return num;
        } catch (e) { return null; }
    }

    function drawHeader() {
        $('#quoLabel').text(quotetion.name + ' (' + quotetion.qid + ')');
        $('#discount').text(quotetion.discount);
        $('#undisPrice').text(qc.money(quotetion.undisPrice));
        $('#disPrice').text(qc.money(quotetion.disPrice));
        $('#trafficPrice').text(qc.money(quotetion.trafficPrice));
        $('#managePrice').text(qc.money(quotetion.managePrice));
        $('#taxPrice').text(qc.money(quotetion.taxPrice));
        $('#basePrice').text(qc.money(quotetion.basePrice));
        $('#costPrice').text('-');
        $('#totalPrice').text(qc.money(quotetion.totalPrice));
        $('#statusLabel').text('-');
        basicParams = {
            'quotetion.qid': quotetion.qid,
            'quotetion.discount': quotetion.discount,
            'quotetion.totalPrice': quotetion.totalPrice,
            'quotetion.undisPrice': quotetion.undisPrice,
            'quotetion.disPrice': quotetion.disPrice,
            'quotetion.manageRate': quotetion.manageRate,
            'quotetion.managePrice': quotetion.managePrice,
            'quotetion.trafficRate': quotetion.trafficRate,
            'quotetion.trafficPrice': quotetion.trafficPrice,
            'quotetion.costPrice': quotetion.costPrice,
            'quotetion.basePrice': quotetion.basePrice,
            'quotetion.taxRate': quotetion.taxRate,
            'quotetion.taxPrice': quotetion.taxPrice
        };
    }

    function refresh() {
        app.post(api.quotation.queryQuotetionByQid, { 'quotetion.qid': quotetion.qid }, function (res) {
            quotetion = res.quotetion;
            drawHeader();
        }, null, false);
    }

    function loadAreas() {
        $('#areaTables').empty();
        seq = 0;
        app.post(api.quotation.queryQuotetionFunctionAreaByQid, { 'quotetion.qid': quotetion.qid }, function (res) {
            areas = res.quotetionFunctionAreas || [];
            $.each(areas, function (i, area) { renderArea(area); });
        });
    }

    function areaButtons() {
        return '<button type="button" class="layui-btn layui-btn-xs" data-act="edit">编辑</button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" data-act="del">删除</button>';
    }

    function renderArea(area) {
        var aid = 'qareaTable' + (seq++);
        var box = '<div class="layui-card" style="margin-bottom:10px;" data-qfaid="' + area.qfaid + '">'
            + '<div class="layui-card-header"><b>' + area.functionAreaName + '<\/b>'
            + ' <span style="color:#999;">[' + (E.quotetionFunctionAreaType[area.type] != null ? E.quotetionFunctionAreaType[area.type] : area.type) + ']<\/span>'
            + ' <span style="float:right;">总额: <span id="sum_' + aid + '">0<\/span><\/span> ' + areaButtons()
            + '<\/div><div class="layui-card-body" style="padding:5px;"><table id="' + aid + '" lay-filter="' + aid + '"><\/table><\/div><\/div>';
        $('#areaTables').append(box);
        var items = (area.quotetionFunctionAreaItems || []).slice().sort(function (a, b) { return (a.index || 0) - (b.index || 0); });
        table.render({ elem: '#' + aid, data: items, page: false, limit: 1000, even: true, id: aid,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'itemName', title: '项目名', width: 170, fixed: 'left' },
                { field: 'measurementUnit', title: '单位', width: 70 },
                { field: 'workType', title: '工种', width: 80 },
                { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
                { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num); } },
                { field: 'formula', title: '公式', width: 140, templet: function (d) { return qc.paramToFormula(d.formula); } },
                { field: 'discount', title: '打折', width: 80, templet: function (d) { return qc.badge(E.quotetionFunctionAreaItemDiscount, d.discount); } },
                { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.accMul(d.unitPrice, d.num)); } },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(' + aid + ')', function (obj) {
            var v = obj.data;
            if (obj.event === 'editNum') {
                $('#numInput').val(v.num != null ? v.num : '');
                layer.open({ type: 1, title: '数量编辑 - ' + v.itemName, content: $('#numBox'), area: ['520px', 'auto'],
                    btn: ['保存', '取消'], yes: function (idx) {
                        var num = evalNum($('#numInput').val());
                        if (num == null) { app.showAlert(app.warning, '公式/数量非法'); return; }
                        layer.close(idx);
                        updateItem(v, area, { 'quotetionFunctionAreaItem.num': num });
                    } });
            } else if (obj.event === 'editPrice') {
                $('#unitPriceInput').val(v.unitPrice);
                layer.open({ type: 1, title: '单价编辑 - ' + v.itemName, content: $('#priceBox'), area: ['440px', 'auto'],
                    btn: ['保存', '取消'], yes: function (idx) {
                        layer.close(idx);
                        updateItem(v, area, { 'quotetionFunctionAreaItem.unitPrice': $('#unitPriceInput').val() });
                    } });
            } else if (obj.event === 'delItem') {
                app.showConfirm('确定删除: ' + v.itemName + '?', function () {
                    app.post(api.quotation.deleteQuotetionFunctionAreaItem, $.extend({ 'quotetionFunctionAreaItem.qfiid': v.qfiid }, basicParams), function () {
                        refresh(); loadAreas();
                    });
                });
            }
        });
        var sum = 0;
        $.each(items, function (i, it) { sum = u.accAdd(sum, u.accMul(it.unitPrice, it.num)); });
        $('#sum_' + aid).text(qc.money(sum));
    }

    function updateItem(v, area, overrides) {
        var args = $.extend({
            'quotetionFunctionAreaItem.qfiid': v.qfiid,
            'quotetionFunctionAreaItem.quotationItem.qiid': v.quotationItemId != null ? v.quotationItemId : v.quoteItemId,
            'quotetionFunctionAreaItem.itemName': v.itemName,
            'quotetionFunctionAreaItem.measurementUnit': v.measurementUnit,
            'quotetionFunctionAreaItem.workType': v.workType,
            'quotetionFunctionAreaItem.unitPrice': v.unitPrice,
            'quotetionFunctionAreaItem.num': v.num,
            'quotetionFunctionAreaItem.formula': v.formula,
            'quotetionFunctionAreaItem.type': v.type,
            'quotetionFunctionAreaItem.subtype': v.subtype,
            'quotetionFunctionAreaItem.discount': v.discount,
            'quotetionFunctionAreaItem.quotationFunctionAreaId': area.qfaid,
            'quotetionFunctionAreaItem.quotationFunctionAreaName': area.functionAreaName,
            'quotetionFunctionAreaItem.content': v.content
        }, overrides || {});
        app.post(api.quotation.updateQuotetionFunctionAreaItem, $.extend({}, basicParams, args), function () {
            refresh(); loadAreas();
        }, function () { loadAreas(); });
    }

    // —— 功能区操作 ——
    $('#areaTables').on('click', '.layui-btn-xs', function () {
        var act = $(this).data('act');
        var qfaid = $(this).closest('.layui-card').data('qfaid');
        var area = null;
        $.each(areas, function (i, a) { if (a.qfaid == qfaid) area = a; });
        if (!area) return;
        if (act === 'del') {
            app.showConfirm('确定删除功能区: ' + area.functionAreaName + '?', function () {
                app.post(api.quotation.deleteQuotetionFunctionArea, $.extend({ 'quotetionFunctionArea.qfaid': area.qfaid }, basicParams), function () {
                    refresh(); loadAreas();
                });
            });
        } else if (act === 'edit') {
            $('#faName').val(area.functionAreaName);
            $('#faTypeSel').val(area.type);
            $('#faTotal').val(area.total);
            form.render('select');
            layer.open({ type: 1, title: '编辑功能区', content: $('#areaBox'), area: ['480px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    layer.close(idx);
                    app.post(api.quotation.updateQuotetionFunctionArea, $.extend({
                        'quotetionFunctionArea.qfaid': area.qfaid,
                        'quotetionFunctionArea.functionAreaName': $('#faName').val(),
                        'quotetionFunctionArea.type': $('#faTypeSel').val(),
                        'quotetionFunctionArea.total': $('#faTotal').val() || 0
                    }, basicParams), function () { refresh(); loadAreas(); });
                } });
        }
    });

    $('#btnAddArea').on('click', function () {
        $('#areaBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加功能区', content: $('#areaBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                layer.close(idx);
                app.post(api.quotation.addQuotetionFunctionArea, $.extend({
                    'quotetionFunctionArea.functionAreaName': $('#faName').val(),
                    'quotetionFunctionArea.type': $('#faTypeSel').val(),
                    'quotetionFunctionArea.total': $('#faTotal').val() || 0
                }, basicParams), function () { refresh(); loadAreas(); });
            } });
    });

    // 隐藏不适用于预报的按钮
    $('#btnAddCommon, #btnAddCustom, #btnDiscount, #btnPrefer, #btnLock, #btnUnlock, #btnRecord').hide();
    $('#btnPrint').attr('title', '对比').find('i').removeClass('layui-icon-print').addClass('layui-icon-cols');
    $('#btnPrint').children().last().replaceWith('<i class="layui-icon layui-icon-cols"></i>对比');
    $('#btnPrint').on('click', function () {
        app.params.historyPage = api.index.quotetionPartIndex.url;
        app.switchPage(api.index.quotetionCompareIndex.url);
    });
    $('#btnSave').on('click', function () {
        app.post(api.quotation.updateQuotetionForAdvance, basicParams, function () {
            app.showAlert(app.info, '操作成功'); refresh();
        });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.quotetionIndex.url); });

    function start() {
        if (!quotetion || !quotetion.qid) { app.showAlert(app.warning, '预报不存在'); return; }
        drawHeader();
        loadAreas();
    }
    start();
});
}); // end app.ready
