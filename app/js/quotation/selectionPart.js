/** app/js/quotation/selectionPart.js —— 选材单编辑
 *  装载：querySelectionByOrderId（无则 querySelectionByQid / addSelection 创建）+ querySelectionItem；
 *  项编辑：updateSelectionItem（num）；删除 deleteSelectionItem；添加 addSelectionItem（选材项 goods）；
 *  头操作：保存 updateSelectionForAdvance、发送 sendSelection、锁定 lockSelection、解锁 unlockSelection、重置 resetSelection。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var orderId = qctx.orderId;
    var selectionData = qctx.selection || null;
    var basicParams = null;

    function drawHeader() {
        $('#orderIdLabel').text(' - ' + orderId);
        $('#total').text(qc.money(basicParams['selection.total']));
        $('#quotationTotal').text(qc.money(basicParams['selection.quotationTotal']));
        $('#extensionAddTotal').text(qc.money(basicParams['selection.extensionAddTotal']));
        $('#extensionReduceTotal').text(qc.money(basicParams['selection.extensionReduceTotal']));
        $('#addReduceAddTotal').text(qc.money(basicParams['selection.addReduceAddTotal']));
        $('#addReduceMinusTotal').text(qc.money(basicParams['selection.addReduceMinusTotal']));
        $('#statusLabel').text(E.selectionStatus[basicParams.status] != null ? E.selectionStatus[basicParams.status] : basicParams.status);
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'goods', title: '商品名称', width: 180, fixed: 'left', templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goodsBrand', title: '品牌', width: 110, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
            { field: 'goodsCategory', title: '品类', width: 100, templet: function (d) { return d.goods ? d.goods.category : ''; } },
            { field: 'measurementUnit', title: '单位', width: 70, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'postprice', title: '结算价', width: 95, templet: function (d) { return qc.money(d.postprice); } },
            { field: 'num', title: '数量', width: 80, edit: 'text', templet: function (d) { return qc.money(d.num); } },
            { field: 'type', title: '类型', width: 90, templet: function (d) { return E.selectionItemType[d.type] != null ? E.selectionItemType[d.type] : d.type; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.selectionItemStatus, d.status); } },
            { field: 'areaName', title: '功能区', width: 100, templet: function (d) { return d.areaName || ''; } },
            { title: '操作', width: 140, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function load() {
        var afterLoad = function (sel) {
            basicParams = {
                'selection.sid': sel.sid,
                'selection.total': sel.total,
                'selection.quotationTotal': sel.quotationTotal,
                'selection.extensionAddTotal': sel.extensionAddTotal,
                'selection.extensionReduceTotal': sel.extensionReduceTotal,
                'selection.addReduceAddTotal': sel.addReduceAddTotal,
                'selection.addReduceMinusTotal': sel.addReduceMinusTotal,
                status: sel.status
            };
            drawHeader();
            app.post(api.quotation.querySelectionItem, { 'selectionItem.qid': sel.qid, 'selectionItem.decoration.orderId': orderId }, function (r) {
                table.reload('resultTable', { data: r.selectionItems || [] });
            });
        };
        if (selectionData && selectionData.qid) {
            afterLoad(selectionData);
        } else {
            app.post(api.quotation.querySelectionByOrderId, { 'selection.orderId': orderId }, function (res) {
                if (res.selection && res.selection.qid) afterLoad(res.selection);
                else {
                    app.post(api.quotation.querySelectionByQid, { 'selection.qid': orderId }, function (r2) {
                        if (r2.selection && r2.selection.qid) afterLoad(r2.selection);
                        else app.showAlert(app.warning, '选材单不存在');
                    }, null, false);
                }
            }, null, false);
        }
    }
    load();

    table.on('edit(resultTable)', function (obj) {
        if (obj.field === 'num') {
            app.post(api.quotation.updateSelectionItem, { 'selectionItem.siid': obj.data.siid, 'selectionItem.num': obj.value }, function () { load(); }, function () { load(); });
        }
    });
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'editNum') {
            $('#numInput').val(v.num);
            layer.open({ type: 1, title: '数量 - ' + (v.goods ? v.goods.name : ''), content: $('#numBox'), area: ['420px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    layer.close(idx);
                    app.post(api.quotation.updateSelectionItem, { 'selectionItem.siid': v.siid, 'selectionItem.num': $('#numInput').val() }, function () { load(); }, function () { load(); });
                } });
        } else if (obj.event === 'del') {
            app.showConfirm('确定删除该选材项?', function () {
                app.post(api.quotation.deleteSelectionItem, $.extend({ 'selectionItem.siid': v.siid }, basicParams), function () {
                    app.showAlert(app.info, '操作成功'); load();
                });
            });
        }
    });

    $('#btnAddItem').on('click', function () {
        $('#addItemBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加选材项', content: $('#addItemBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if ($('#gid').val() === '') { app.showAlert(app.warning, '请填写货品编号'); return; }
                app.post(api.quotation.addSelectionItem, $.extend({
                    'selectionItem.goods.gid': $('#gid').val(),
                    'selectionItem.postprice': $('#postprice').val(),
                    'selectionItem.preprice': 0,
                    'selectionItem.initNum': 0,
                    'selectionItem.num': $('#num').val(),
                    'selectionItem.type': $('#selType').val(),
                    'selectionItem.areaId': 0,
                    'selectionItem.areaName': '未匹配'
                }, basicParams), function () {
                    app.showAlert(app.success, '添加成功');
                    layer.close(idx); load();
                });
            } });
    });

    $('#btnSave').on('click', function () {
        app.post(api.quotation.updateSelectionForAdvance, basicParams, function () { app.showAlert(app.info, '操作成功'); load(); });
    });
    $('#btnSend').on('click', function () {
        app.showConfirm('是否发送选材单?', function () {
            app.post(api.quotation.sendSelection, { 'selection.orderId': orderId }, function () {
                app.showAlert(app.info, '操作成功'); load();
            });
        });
    });
    $('#btnLock').on('click', function () {
        app.post(api.quotation.lockSelection, { 'selection.qid': basicParams['selection.sid'] }, function () { app.showAlert(app.info, '锁定成功'); load(); });
    });
    $('#btnUnlock').on('click', function () {
        app.post(api.quotation.unlockSelection, { 'selection.qid': basicParams['selection.sid'] }, function () { app.showAlert(app.info, '解锁成功'); load(); });
    });
    $('#btnReset').on('click', function () {
        app.showConfirm('是否确认重置选材单?', function () {
            app.post(api.quotation.resetSelection, { 'selection.qid': basicParams['selection.sid'] }, function () { load(); });
        });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.selectionIndex.url); });
});
}); // end app.ready
