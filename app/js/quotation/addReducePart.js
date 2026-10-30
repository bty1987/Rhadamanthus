/** app/js/quotation/addReducePart.js —— 增减项编辑
 *  装载：queryAddReduceByArid + queryAddReduceItemByAddReduceId + queryQuotationForDefaultByOrderId（功能区）；
 *  项编辑：updateAddReduceItem（num 公式求值；ariid 空=新增）；删除 deleteAddReduceItem；
 *  项来源：报价项 / 已付增减项（queryAddReduceForPayedByOrderId→queryAddReduceItemByAddReduceIds）/ 扩展项（queryExtensionByOrderId）/ 自定义；
 *  提交 submitAddReduce、撤销 cancelAddReduce。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var arid = qctx.arid || (qctx.addReduce ? qctx.addReduce.arId : null);
    var arType = qctx.addReduceType != null ? qctx.addReduceType : (qctx.addReduce ? qctx.addReduce.type : 0);
    var orderId = qctx.orderId;
    var addReduce = null, basicParams = null, quotation = null;
    var pickMode = 'quo'; // quo | paid | ext

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
        $('#arLabel').text((E.addReduceType[arType] || arType) + ' - ' + (addReduce.arId || '-'));
        $('#undisPrice').text(qc.money(addReduce.undisPrice));
        $('#disPrice').text(qc.money(addReduce.disPrice));
        $('#consPrice').text(qc.money(addReduce.consPrice));
        $('#managePrice').text(qc.money(addReduce.managePrice));
        $('#taxPrice').text(qc.money(addReduce.taxPrice));
        $('#discount').text(addReduce.discount);
        $('#total').text(qc.money(addReduce.total));
        $('#statusLabel').text(E.addReduceStatus[addReduce.status] != null ? E.addReduceStatus[addReduce.status] : addReduce.status);
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'quotationFunctionAreaName', title: '功能区', width: 110 },
            { field: 'itemName', title: '项目名', width: 170, fixed: 'left' },
            { field: 'type', title: '类型', width: 140, templet: function (d) { return E.addReduceItemType[d.type] != null ? E.addReduceItemType[d.type] : d.type; } },
            { field: 'subtype', title: '细分', width: 80, templet: function (d) { return E.subtype[d.subtype] != null ? E.subtype[d.subtype] : d.subtype; } },
            { field: 'measurementUnit', title: '单位', width: 70 },
            { field: 'workType', title: '工种', width: 80 },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
            { field: 'num', title: '工程量', width: 90, templet: function (d) { return qc.money(d.num); } },
            { field: 'discount', title: '打折', width: 90, templet: function (d) { return qc.badge(E.addReduceItemDiscount, d.discount); } },
            { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.accMul(d.unitPrice, d.num)); } },
            { title: '操作', width: 140, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function load() {
        app.post(api.quotation.queryAddReduceByArid, { 'addReduce.arId': arid }, function (res) {
            addReduce = res.addReduce;
            arType = addReduce.type;
            basicParams = {
                'addReduce.arId': addReduce.arId,
                'addReduce.total': addReduce.total,
                'addReduce.managePrice': addReduce.managePrice,
                'addReduce.taxPrice': addReduce.taxPrice,
                'addReduce.undisPrice': addReduce.undisPrice,
                'addReduce.disPrice': addReduce.disPrice
            };
            drawHeader();
            app.post(api.quotation.queryAddReduceItemByAddReduceId, { 'addReduceItem.arId': arid }, function (r) {
                table.reload('resultTable', { data: r.addReduceItems || [] });
            });
        });
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) {
            quotation = res.quotation;
            app.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, { 'quotation.qid': quotation.qid }, function (r) {
                app.bindData($('#quotationFunctionAreaId'), r.quotationFunctionAreas || [], 'qfaId', 'functionAreaName', false);
                form.render('select');
            });
        }, null, false);
    }
    load();

    function updateItem(args, ok) {
        app.post(api.quotation.updateAddReduceItem, $.extend({}, basicParams, args), function (res) {
            app.post(api.quotation.queryAddReduceByArid, { 'addReduce.arId': arid }, function (r) { addReduce = r.addReduce; drawHeader(); }, null, false);
            app.post(api.quotation.queryAddReduceItemByAddReduceId, { 'addReduceItem.arId': arid }, function (r) {
                table.reload('resultTable', { data: r.addReduceItems || [] });
            });
            if (ok) ok(res);
        }, function () { load(); });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'editNum') {
            $('#numInput').val(v.num);
            layer.open({ type: 1, title: '数量编辑 - ' + v.itemName, content: $('#numBox'), area: ['460px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    var num = evalNum($('#numInput').val());
                    if (num == null) { app.showAlert(app.warning, '公式/数量非法'); return; }
                    layer.close(idx);
                    updateItem({
                        'addReduceItem.ariId': v.ariId,
                        'addReduceItem.itemName': v.itemName,
                        'addReduceItem.measurementUnit': v.measurementUnit,
                        'addReduceItem.workType': v.workType,
                        'addReduceItem.addPrice': v.addPrice,
                        'addReduceItem.unitPrice': v.unitPrice,
                        'addReduceItem.subPrice': v.subPrice,
                        'addReduceItem.num': num,
                        'addReduceItem.initnum': num,
                        'addReduceItem.type': v.type,
                        'addReduceItem.subtype': v.subtype,
                        'addReduceItem.discount': v.discount,
                        'addReduceItem.quotationFunctionAreaId': v.quotationFunctionAreaId,
                        'addReduceItem.quotationFunctionAreaName': v.quotationFunctionAreaName,
                        'addReduceItem.content': v.content
                    });
                } });
        } else if (obj.event === 'del') {
            app.showConfirm('确定删除: ' + v.itemName + '?', function () {
                app.post(api.quotation.deleteAddReduceItem, $.extend({ 'addReduceItem.ariId': v.ariId }, basicParams), function () { load(); });
            });
        }
    });

    // —— 提交 / 撤销 ——
    $('#btnSubmit').on('click', function () {
        app.showConfirm('是否提交增减单?', function () {
            app.post(api.quotation.submitAddReduce, { 'addReduces[0].arId': arid, 'addReduce.orderId': orderId }, function () {
                app.showAlert(app.info, '操作成功'); load();
            });
        });
    });
    $('#btnCancel').on('click', function () {
        app.showConfirm('是否撤销增减单?', function () {
            app.post(api.quotation.cancelAddReduce, { 'addReduce.dpId': addReduce.dpId }, function () {
                app.showAlert(app.info, '操作成功'); load();
            });
        });
    });

    // —— 自定义项 ——
    $('#btnAddCustom').on('click', function () {
        $('#customBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加自定义项', content: $('#customBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#itemName').val())) { app.showAlert(app.warning, '请填写项目名'); return; }
                layer.close(idx);
                updateItem({
                    'addReduceItem.ariId': '',
                    'addReduceItem.itemName': $('#itemName').val(),
                    'addReduceItem.measurementUnit': $('#measurementUnit').val(),
                    'addReduceItem.workType': $('#workType').val(),
                    'addReduceItem.addPrice': $('#unitPrice').val(),
                    'addReduceItem.unitPrice': $('#unitPrice').val(),
                    'addReduceItem.subPrice': $('#unitPrice').val(),
                    'addReduceItem.subtype': $('#subtype').val(),
                    'addReduceItem.type': 2,
                    'addReduceItem.discount': $('#discountSel').val(),
                    'addReduceItem.num': $('#num').val(),
                    'addReduceItem.initnum': $('#num').val(),
                    'addReduceItem.quotationFunctionAreaId': '',
                    'addReduceItem.quotationFunctionAreaName': '',
                    'addReduceItem.content': $('#content').val()
                });
            } });
    });

    // —— 项来源选择弹窗 ——
    table.render({ elem: '#pickTable', data: [], page: false, limit: 1000, even: true, id: 'pickTable',
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'itemName', title: '名称', width: 180 },
            { field: 'quotationFunctionAreaName', title: '功能区', width: 110 },
            { field: 'measurementUnit', title: '单位', width: 70 },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.workType ? (d.workType.name || d.workType) : ''; } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num != null ? d.num : d.initNum); } } ]] });

    function openPick(mode) {
        pickMode = mode;
        $('#areaSelectWrap').toggle(mode === 'quo');
        layer.open({ type: 1, title: { quo: '从报价项添加', paid: '从已付增减项添加', ext: '从扩展项添加' }[mode], content: $('#itemsBox'), area: ['950px', '80%'] });
        if (mode !== 'quo') loadPick();
    }
    $('#btnAddFromQuo').on('click', function () { openPick('quo'); });
    $('#btnAddFromPaid').on('click', function () { openPick('paid'); });
    $('#btnAddFromExt').on('click', function () { openPick('ext'); });

    function loadPick() {
        if (pickMode === 'quo') {
            var qfaId = $('#quotationFunctionAreaId').val();
            if (!qfaId) { app.showAlert(app.warning, '请选择功能区'); return; }
            app.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, { 'quotationFunctionAreaItem.quotationFunctionAreaId': qfaId }, function (res) {
                table.reload('pickTable', { data: res.quotationFunctionAreaItems || [] });
            });
        } else if (pickMode === 'paid') {
            // 已付款增减单中的报价项
            app.post(api.quotation.queryAddReduceForPayedByOrderId, { 'addReduce.orderId': orderId }, function (res) {
                var adds = res.addReduces || [];
                var arIds = { 'addReduce.arId': null };
                var idx = 0, list = [];
                $.each(adds, function (i, a) {
                    if (a.status == 2 || a.status == 3) {
                        arIds['addReduces[' + idx++ + '].arId'] = a.arId;
                    }
                });
                if (!idx) { table.reload('pickTable', { data: [] }); return; }
                app.post(api.quotation.queryAddReduceItemByAddReduceIds, arIds, function (r) {
                    var items = r.addReduceItems || [];
                    $.each(items, function (j, it) { if (it.type == 0 || it.type == 2) list.push(it); });
                    table.reload('pickTable', { data: list });
                });
            });
        } else if (pickMode === 'ext') {
            app.post(api.quotation.queryExtensionByOrderId, { 'extension.orderId': orderId }, function (res) {
                var list = [];
                $.each(res.extensions || [], function (i, e) {
                    $.each(e.extensionItems || [], function (j, it) { list.push($.extend({}, it, { quotationFunctionAreaName: it.quotationFunctionAreaName || '' })); });
                });
                table.reload('pickTable', { data: list });
            });
        }
    }
    $('#btnAreaLoad').on('click', function () { loadPick(); });

    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('pickTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请勾选要添加的项'); return; }
        var count = 0, total = cks.data.length;
        $.each(cks.data, function (i, v) {
            var itemType = 0; // 默认：标准报价项
            if (pickMode === 'paid') itemType = v.type == 0 ? 4 : 3; // 增项中报价项 / 报价中报价项
            if (pickMode === 'ext') itemType = 5;                    // 拓展中报价项
            updateItem({
                'addReduceItem.ariId': '',
                'addReduceItem.itemName': v.itemName,
                'addReduceItem.measurementUnit': v.measurementUnit,
                'addReduceItem.workType': v.workType ? (v.workType.name || v.workType) : '',
                'addReduceItem.addPrice': v.addPrice != null ? v.addPrice : v.unitPrice,
                'addReduceItem.unitPrice': v.unitPrice,
                'addReduceItem.subPrice': v.subPrice != null ? v.subPrice : v.unitPrice,
                'addReduceItem.subtype': v.subtype != null ? v.subtype : 0,
                'addReduceItem.type': itemType,
                'addReduceItem.discount': v.discount != null ? v.discount : 0,
                'addReduceItem.num': v.num != null ? v.num : 1,
                'addReduceItem.initnum': v.initnum != null ? v.initnum : (v.num != null ? v.num : 1),
                'addReduceItem.quotationFunctionAreaId': v.quotationFunctionAreaId,
                'addReduceItem.quotationFunctionAreaName': v.quotationFunctionAreaName || '',
                'addReduceItem.content': v.content
            }, function () {
                count++;
                if (count == total) { app.showAlert(app.success, '添加完成'); layer.closeAll(); load(); }
            });
        });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.addReduceIndex.url); });
});
}); // end app.ready
