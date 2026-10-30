/** app/js/quotation/ruotationPart.js —— 软装报价编辑
 *  装载：queryRuotationById / queryQuotationFunctionAreaByQuotationId（跳过管理区，按功能区分组）
 *  + queryRuotationItem（每功能区）；项编辑 updateRuotationItem（公式求值数量，qriid 空=新增）；
 *  删除 deleteRuotationItem；从报价项添加：queryQuotationFunctionAreaItemByQuotationFunctionAreaId 勾选；
 *  总额 updateRuotation。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var ruotation = qctx.ruotation || {};
    var quoteRefundId = ruotation.qrid;
    var orderId = ruotation.decoration ? ruotation.decoration.orderId : '';
    var quoteId = ruotation.quotation ? ruotation.quotation.qid : '';
    var quoteRefundParams = { 'ruotation.qrid': quoteRefundId, 'ruotation.totalPrice': 0 };
    var areas = [];
    var seq = 0;

    function evalNum(formula) {
        formula = (formula || '').replace(/\s+/g, '');
        if (formula === '') return null;
        if (/([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/.test(formula)) return null;
        try {
            var num = u.changeThrDecimal(eval(formula));
            if (num < 0 || num > 10000000) return null;
            return num;
        } catch (e) { return null; }
    }

    function renderArea(area, items) {
        var aid = 'areaTable' + (seq++);
        var box = '<div class="layui-card" style="margin-bottom:10px;">'
            + '<div class="layui-card-header"><b>' + area.functionAreaName + '<\/b>'
            + ' <span style="float:right;">总额: <span id="sum_' + aid + '">' + qc.money(area.total != null ? area.total : 0) + '<\/span><\/span>'
            + ' <button type="button" class="layui-btn layui-btn-xs layui-btn-normal" style="float:right;margin-right:10px;" data-qfaid="' + area.qfaId + '" data-name="' + area.functionAreaName + '">添加报价项<\/button>'
            + '<\/div><div class="layui-card-body" style="padding:5px;"><table id="' + aid + '" lay-filter="' + aid + '"><\/table><\/div><\/div>';
        $('#areaTables').append(box);
        table.render({ elem: '#' + aid, data: items, page: false, limit: 1000, even: true, id: aid,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'itemName', title: '名称', width: 180, fixed: 'left' },
                { field: 'measurementUnit', title: '单位', width: 70 },
                { field: 'workType', title: '工种', width: 90 },
                { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
                { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
                { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
                { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num); } },
                { field: 'formula', title: '公式', width: 120 },
                { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.changeThrDecimal(u.accMul(d.unitPrice, d.num))); } },
                { title: '操作', width: 140, toolbar: '#rowToolbar' } ]] });
        table.on('tool(' + aid + ')', function (obj) {
            var v = obj.data;
            if (obj.event === 'editNum') {
                $('#numInput').val(v.num != null ? v.num : '');
                layer.open({ type: 1, title: '数量编辑 - ' + v.itemName, content: $('#numBox'), area: ['460px', 'auto'],
                    btn: ['保存', '取消'], yes: function (idx) {
                        var num = evalNum($('#numInput').val());
                        if (num == null) { app.showAlert(app.warning, '公式/数量非法'); return; }
                        layer.close(idx);
                        updateItem(v, num, area, aid);
                    } });
            } else if (obj.event === 'del') {
                app.showConfirm('确定删除: ' + v.itemName + '?', function () {
                    app.post(api.quotation.deleteRuotationItem, $.extend({ 'ruotationItem.qriid': v.qriid, 'ruotationItem.ruotation.qrid': quoteRefundId }, quoteRefundParams), function () {
                        load();
                    });
                });
            }
        });
        return aid;
    }

    function updateItem(v, num, area, aid) {
        var params = $.extend({}, {
            'ruotationItem.qriid': v.qriid,
            'ruotationItem.ruotation.qrid': quoteRefundId,
            'ruotationItem.quotationFunctionArea.qfaId': area.qfaId,
            'ruotationItem.quotationItem.qiid': v.quotationItem ? v.quotationItem.qiid : v.qiid,
            'ruotationItem.itemName': v.itemName,
            'ruotationItem.measurementUnit': v.measurementUnit,
            'ruotationItem.workType': v.workType,
            'ruotationItem.unitPrice': v.unitPrice,
            'ruotationItem.addPrice': v.addPrice,
            'ruotationItem.subPrice': v.subPrice,
            'ruotationItem.formula': num,
            'ruotationItem.initNum': num,
            'ruotationItem.num': num,
            'ruotationItem.type': v.type,
            'ruotationItem.subtype': v.subtype,
            'ruotationItem.content': v.content,
            'ruotationItem.index': v.index
        }, quoteRefundParams);
        app.post(api.quotation.updateRuotationItem, params, function (res) {
            if (res.ruotation && res.ruotation.totalPrice != null) {
                quoteRefundParams['ruotation.totalPrice'] = res.ruotation.totalPrice;
                $('#totalPrice').text(qc.money(res.ruotation.totalPrice));
            }
            loadArea(area, aid);
        }, function () { load(); });
    }

    function loadArea(area, aid) {
        app.post(api.quotation.queryRuotationItem, { 'ruotationItem.ruotation.qrid': quoteRefundId, 'ruotationItem.quotationFunctionArea.qfaId': area.qfaId }, function (res) {
            var items = res.ruotationItems || [];
            table.reload(aid, { data: items });
            var sum = 0;
            $.each(items, function (i, v) { sum = u.accAdd(sum, u.accMul(v.unitPrice, v.num)); });
            $('#sum_' + aid).text(qc.money(sum));
        });
    }

    function load() {
        $('#areaTables').empty();
        seq = 0;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            $('#orderId').text(res.decoration.orderId);
            $('#address').text(res.decoration.house ? (res.decoration.house.village.name + ' ' + res.decoration.house.houseNumber) : '-');
        }, null, false);
        app.post(api.quotation.queryRuotationById, { 'ruotation.qrid': quoteRefundId }, function (res) {
            var r = res.ruotation;
            quoteRefundParams = { 'ruotation.qrid': r.qrid, 'ruotation.totalPrice': r.totalPrice };
            $('#quotationName').text(' - ' + (r.quotation ? r.quotation.name : ''));
            $('#version').text(r.version ? r.version.name : '-');
            $('#totalPrice').text(qc.money(r.totalPrice));
        }, null, false);
        app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': quoteId }, function (res) {
            areas = [];
            var totalAmount = 0;
            $.each(res.quotationFunctionAreas || [], function (i, v) {
                if (v.type == 0) return; // 跳过管理区
                areas.push(v);
                var aid = null;
                // 先渲染空表再装载
                aid = renderArea(v, []);
                loadArea(v, aid);
                if (v.type == 1 || v.type == 5 || v.type == 7) {
                    totalAmount = u.accAdd(totalAmount, v.total != null ? v.total : 0);
                } else if (v.type == 2) {
                    totalAmount = u.accAdd(totalAmount, v.total != null ? v.total : 0);
                }
            });
            var total = u.changeThrDecimal(totalAmount);
            $('#totalPrice').text(qc.money(total));
            quoteRefundParams['ruotation.totalPrice'] = total;
            app.post(api.quotation.updateRuotation, quoteRefundParams, function () {}, null, false);
        });
    }
    load();

    // —— 从报价项添加 ——
    var pickArea = null, pickAid = null;
    $('#areaTables').on('click', '.layui-btn-normal', function () {
        var qfaId = $(this).data('qfaid');
        pickArea = null;
        $.each(areas, function (i, a) { if (a.qfaId == qfaId) pickArea = a; });
        if (!pickArea) return;
        app.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, { 'quotationFunctionAreaItem.quotationFunctionAreaId': qfaId }, function (res) {
            table.render({ elem: '#pickTable', data: res.quotationFunctionAreaItems || [], page: false, limit: 1000, even: true, id: 'pickTable',
                cols: [[ { type: 'checkbox', width: 40 },
                    { field: 'itemName', title: '名称', width: 180 },
                    { field: 'measurementUnit', title: '单位', width: 70 },
                    { field: 'workType', title: '工种', width: 100, templet: function (d) { return d.workType ? d.workType.name : ''; } },
                    { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
                    { field: 'initNum', title: '初始数量', width: 90, templet: function (d) { return qc.money(d.initNum); } },
                    { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num); } } ]] });
            layer.open({ type: 1, title: '添加报价项 - ' + pickArea.functionAreaName, content: $('#itemsBox'), area: ['850px', '75%'] });
        });
    });
    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('pickTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请选择要添加的报价项'); return; }
        var count = 0, total = cks.data.length;
        $.each(cks.data, function (i, v) {
            var qv = v.quotationItem || v;
            var params = $.extend({}, {
                'ruotationItem.qriid': '',
                'ruotationItem.ruotation.qrid': quoteRefundId,
                'ruotationItem.quotationFunctionArea.qfaId': pickArea.qfaId,
                'ruotationItem.quotationItem.qiid': v.quotationItemId,
                'ruotationItem.itemName': v.itemName,
                'ruotationItem.measurementUnit': v.measurementUnit,
                'ruotationItem.workType': qv.workType ? qv.workType.name : '',
                'ruotationItem.unitPrice': v.unitPrice,
                'ruotationItem.addPrice': v.addPrice,
                'ruotationItem.subPrice': v.subPrice,
                'ruotationItem.formula': v.num != null ? v.num : '',
                'ruotationItem.initNum': v.initNum != null ? v.initNum : '',
                'ruotationItem.num': v.num != null ? v.num : '',
                'ruotationItem.type': v.type,
                'ruotationItem.subtype': v.subtype,
                'ruotationItem.content': v.content,
                'ruotationItem.index': i + 1
            }, quoteRefundParams);
            app.post(api.quotation.updateRuotationItem, params, function () {
                count++;
                if (count == total) { app.showAlert(app.success, '添加完成'); layer.closeAll(); load(); }
            });
        });
    });
    $('#btnAddItem').on('click', function () { app.showAlert(app.info, '请点击各功能区标题栏上的"添加报价项"按钮'); });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.ruotationIndex.url); });
});
}); // end app.ready
