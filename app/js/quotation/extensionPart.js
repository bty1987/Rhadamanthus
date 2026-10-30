/** app/js/quotation/extensionPart.js —— 扩展项编辑
 *  装载：queryExtensionByEid + queryExtensionItemByEid + queryQuotationForDefaultByOrderId（取默认报价功能区）；
 *  项编辑：updateExtensionItem（num 公式求值；eiid 空=新增，自定义项 type=增1/减3）；删除 deleteExtensionItem；
 *  计管理/管理打折/计税开关：updateExtensionForAdvance（清零 manageRate/taxRate）。
 *  上下文：app.params.quotation.{ extensionId, extensionType, orderId }。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var extensionId = qctx.extensionId;
    var extType = qctx.extensionType != null ? qctx.extensionType : 0;
    var orderId = qctx.orderId;
    var extension = null, basicParams = null, quotation = null;

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
        $('#extLabel').text((E.extensionType[extType] || extType) + ' - ' + (extension.eid || '-'));
        $('#undisPrice').text(qc.money(extension.undisPrice));
        $('#disPrice').text(qc.money(extension.disPrice));
        $('#total').text(qc.money(extension.total));
        $('#manageRate').text(extension.manageRate);
        $('#managePrice').text(qc.money(extension.managePrice));
        $('#taxRate').text(extension.taxRate);
        $('#taxPrice').text(qc.money(extension.taxPrice));
        $('#isCountManage').prop('checked', extension.manageRate != 0);
        $('#isCountManageDiscount').prop('checked', extension.manageDiscount == 1);
        $('#isCountTax').prop('checked', extension.taxRate != 0);
        form.render();
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'quotationFunctionAreaName', title: '功能区', width: 110 },
            { field: 'itemName', title: '项目名', width: 170, fixed: 'left' },
            { field: 'type', title: '类型', width: 110, templet: function (d) { return { 0: '标准增', 1: '定义增', 2: '标准减', 3: '定义减', 4: '报价减', 5: '报价增', 6: '报价项(活动)' }[d.type] != null ? { 0: '标准增', 1: '定义增', 2: '标准减', 3: '定义减', 4: '报价减', 5: '报价增', 6: '报价项(活动)' }[d.type] : d.type; } },
            { field: 'subtype', title: '细分', width: 80, templet: function (d) { return E.subtype[d.subtype] != null ? E.subtype[d.subtype] : d.subtype; } },
            { field: 'measurementUnit', title: '单位', width: 70 },
            { field: 'workType', title: '工种', width: 80 },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
            { field: 'num', title: '工程量', width: 90, templet: function (d) { return qc.money(d.num); } },
            { field: 'discount', title: '打折', width: 80, templet: function (d) { return qc.badge(E.extensionItemDiscount, d.discount); } },
            { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.accMul(d.unitPrice, d.num)); } },
            { title: '操作', width: 140, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function load() {
        app.post(api.quotation.queryExtensionByEid, { 'extension.eid': extensionId }, function (res) {
            extension = res.extension;
            extType = extension.type;
            basicParams = {
                'extension.eid': extension.eid,
                'extension.undisPrice': extension.undisPrice,
                'extension.disPrice': extension.disPrice,
                'extension.consPrice': extension.consPrice,
                'extension.comsPrice': extension.comsPrice,
                'extension.total': extension.total,
                'extension.manageRate': extension.manageRate,
                'extension.manageDiscount': extension.manageDiscount,
                'extension.managePrice': extension.managePrice,
                'extension.taxRate': extension.taxRate,
                'extension.taxPrice': extension.taxPrice
            };
            drawHeader();
            app.post(api.quotation.queryExtensionItemByEid, { 'extensionItem.eid': extensionId }, function (r) {
                table.reload('resultTable', { data: r.extensionItems || [] });
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
        app.post(api.quotation.updateExtensionItem, $.extend({}, basicParams, args), function (res) {
            if (res.extension) { extension = $.extend({}, extension, res.extension); basicParams['extension.total'] = extension.total; drawHeader(); }
            app.post(api.quotation.queryExtensionByEid, { 'extension.eid': extensionId }, function (r2) {
                extension = r2.extension; drawHeader();
            }, null, false);
            app.post(api.quotation.queryExtensionItemByEid, { 'extensionItem.eid': extensionId }, function (r) {
                table.reload('resultTable', { data: r.extensionItems || [] });
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
                        'extensionItem.eiid': v.eiid,
                        'extensionItem.itemName': v.itemName,
                        'extensionItem.measurementUnit': v.measurementUnit,
                        'extensionItem.workType': v.workType,
                        'extensionItem.addPrice': v.addPrice,
                        'extensionItem.unitPrice': v.unitPrice,
                        'extensionItem.subPrice': v.subPrice,
                        'extensionItem.num': num,
                        'extensionItem.initnum': num,
                        'extensionItem.type': v.type,
                        'extensionItem.subtype': v.subtype,
                        'extensionItem.quotationFunctionAreaId': v.quotationFunctionAreaId,
                        'extensionItem.quotationFunctionAreaName': v.quotationFunctionAreaName,
                        'extensionItem.content': v.content
                    });
                } });
        } else if (obj.event === 'del') {
            app.showConfirm('确定删除: ' + v.itemName + '?', function () {
                app.post(api.quotation.deleteExtensionItem, $.extend({ 'extensionItem.eiid': v.eiid }, basicParams), function () { load(); });
            });
        }
    });

    // —— 管理费/税金开关 ——
    function saveAdvance(overrides) {
        var options = $.extend({}, basicParams, overrides || {});
        app.post(api.quotation.updateExtensionForAdvance, options, function () { load(); }, null, false);
    }
    form.on('switch(isCountManage)', function (obj) {
        if (!obj.elem.checked) saveAdvance({ 'extension.manageRate': 0, 'extension.managePrice': 0 });
        else saveAdvance();
    });
    form.on('switch(isCountManageDiscount)', function () { saveAdvance(); });
    form.on('switch(isCountTax)', function (obj) {
        if (!obj.elem.checked) saveAdvance({ 'extension.taxRate': 0, 'extension.taxPrice': 0 });
        else saveAdvance();
    });

    // —— 添加自定义项 ——
    $('#btnAddCustom').on('click', function () {
        $('#customBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加自定义项', content: $('#customBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#itemName').val())) { app.showAlert(app.warning, '请填写项目名'); return; }
                layer.close(idx);
                updateItem({
                    'extensionItem.eiid': '',
                    'extensionItem.itemName': $('#itemName').val(),
                    'extensionItem.measurementUnit': $('#measurementUnit').val(),
                    'extensionItem.workType': $('#workType').val(),
                    'extensionItem.addPrice': $('#unitPrice').val(),
                    'extensionItem.unitPrice': $('#unitPrice').val(),
                    'extensionItem.subPrice': $('#unitPrice').val(),
                    'extensionItem.subtype': $('#subtype').val(),
                    'extensionItem.type': extType == 0 ? 1 : 3,
                    'extensionItem.discount': 0,
                    'extensionItem.num': $('#num').val(),
                    'extensionItem.initnum': $('#num').val(),
                    'extensionItem.quotationFunctionAreaId': '',
                    'extensionItem.quotationFunctionAreaName': '',
                    'extensionItem.content': $('#content').val()
                });
            } });
    });

    // —— 从报价项添加 ——
    $('#btnAddFromQuo').on('click', function () {
        layer.open({ type: 1, title: '从报价项添加（先选功能区再加载报价项）', content: $('#itemsBox'), area: ['950px', '80%'] });
    });
    table.render({ elem: '#pickTable', data: [], page: false, limit: 1000, even: true, id: 'pickTable',
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'itemName', title: '名称', width: 180 },
            { field: 'measurementUnit', title: '单位', width: 70 },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'initNum', title: '初始数量', width: 90, templet: function (d) { return qc.money(d.initNum); } },
            { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num); } } ]] });
    $('#btnAreaLoad').on('click', function () {
        var qfaId = $('#quotationFunctionAreaId').val();
        if (!qfaId) { app.showAlert(app.warning, '请选择功能区'); return; }
        app.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, { 'quotationFunctionAreaItem.quotationFunctionAreaId': qfaId }, function (res) {
            table.reload('pickTable', { data: res.quotationFunctionAreaItems || [] });
        });
    });
    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('pickTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请选择要添加的报价项'); return; }
        var areaName = $('#quotationFunctionAreaId').find('option:selected').text();
        var count = 0, total = cks.data.length;
        $.each(cks.data, function (i, v) {
            updateItem({
                'extensionItem.eiid': '',
                'extensionItem.itemName': v.itemName,
                'extensionItem.measurementUnit': v.measurementUnit,
                'extensionItem.workType': v.workType ? v.workType.name : '',
                'extensionItem.addPrice': v.unitPrice,
                'extensionItem.unitPrice': v.unitPrice,
                'extensionItem.subPrice': v.unitPrice,
                'extensionItem.subtype': v.subtype,
                'extensionItem.type': extType == 0 ? 0 : 2,
                'extensionItem.discount': v.discount != null ? v.discount : 0,
                'extensionItem.num': v.num != null ? v.num : 1,
                'extensionItem.initnum': v.initNum != null ? v.initNum : 1,
                'extensionItem.quotationFunctionAreaId': v.quotationFunctionAreaId,
                'extensionItem.quotationFunctionAreaName': areaName,
                'extensionItem.content': v.content
            }, function () {
                count++;
                if (count == total) { app.showAlert(app.success, '添加完成'); layer.closeAll(); load(); }
            });
        });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.extensionIndex.url); });
});
}); // end app.ready
