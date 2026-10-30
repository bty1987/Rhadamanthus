/** app/js/quotation/qeasure4detail.js —— 量房表详情
 *  装载：queryQeasureByQmid / queryQeasureByOrderId（无则系统模板 QUOTATION_QEASURE_TEMPLATE → makeQeasure）；
 *  表单渲染：qeasureItem 类型（0文本/1输入框/2单选/3多选/4日期）→ layui 表单；
 *  保存：handleQeasure（items[].content / options[].checked=0选中1未选）；
 *  功能区：queryQeasureFunctionArea / makeQeasureFunctionArea（模板功能区选择）/ handleQeasureFunctionArea / deleteQeasureFunctionArea；
 *  删除量房表 deleteQeasure。
 *  上下文：app.params.quotation = { orderId 或 qmid }。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'laydate', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var qctx = qc.ctx('quotation') || {};
    var qeasure = null, decoration = null, quotation = null;

    // 装载装修单/报价（取版本功能区）
    if (qctx.orderId) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': qctx.orderId }, function (res) { decoration = res.decoration; }, null, false);
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': qctx.orderId }, function (res) { quotation = res.quotation; }, function () {}, false);
    }

    function loadVersionAreas() {
        var versionNo = quotation && quotation.versionId ? quotation.versionId : (decoration && decoration.version ? decoration.version.no : '');
        if (!versionNo) return;
        app.post(api.quotation.queryFunctionAreaByVersionId, { 'functionArea.version.no': versionNo }, function (res) {
            app.bindData($('#functionAreaSel'), res.functionAreas || [], 'faid', 'name', false);
            form.render('select');
        }, null, false);
    }

    // —— 量房表装载 ——
    function show() {
        var url = null, args = {};
        if (qctx.qmid) { url = api.quotation.queryQeasureByQmid; args = { 'qeasure.qmid': qctx.qmid }; }
        else if (qctx.orderId) { url = api.quotation.queryQeasureByOrderId; args = { 'qeasure.orderId': qctx.orderId }; }
        else return;

        var isMake = true;
        app.post(url, args, function (res) {
            if (res.qeasure && res.qeasure.qmid) { qeasure = res.qeasure; display(qeasure); isMake = false; }
        }, null, false);
        if (!isMake) return;

        var template = null;
        app.post(api.system.querySystemConfigByKey, { 'systemConfig.key': 'QUOTATION_QEASURE_TEMPLATE' }, function (res) {
            template = res.systemConfig && res.systemConfig.value;
        }, null, false);
        if (!template) { app.showAlert(app.error, '量房模板不存在'); return; }
        args['qeasure.tid'] = template;
        app.post(api.quotation.makeQeasure, args, function (res) {
            args['qeasure.qmid'] = res.qeasure.qmid;
        }, null, false);
        app.post(api.quotation.queryQeasureByOrderId, args, function (res) {
            qeasure = res.qeasure;
            display(qeasure);
        }, null, false);
    }

    function display(q) {
        $('#orderIdLabel').text(' - ' + (q.orderId || qctx.orderId || '-'));
        renderItems(q.items || []);
        loadAreas();
        loadVersionAreas();
    }

    function renderItems(items) {
        var html = '';
        $.each(items, function (i, item) {
            var qmiid = item.qmiid;
            html += '<div class="layui-form-item qeasure-item" data-qmiid="' + qmiid + '" data-type="' + item.type + '">';
            html += '<label class="layui-form-label">' + (item.name || '') + '<\/label><div class="layui-input-inline" style="text-align:left;padding-top:9px;">';
            if (item.type == 0) {
                html += '<span>' + (item.content || '') + '<\/span>';
            } else if (item.type == 1) {
                html += '<input class="layui-input" id="' + qmiid + 'textarea" style="width:360px;" value="' + (item.content || '') + '">';
            } else if (item.type == 4) {
                html += '<input class="layui-input" id="' + qmiid + 'date" readonly style="width:200px;" value="' + (item.content || '') + '">';
            } else if (item.type == 2 || item.type == 3) {
                var inputType = item.type == 2 ? 'radio' : 'checkbox';
                html += '<div style="width:560px;">';
                $.each(item.options || [], function (k, opt) {
                    var checked = opt.checked == 0 || opt.checked === 0 ? ' checked' : '';
                    html += '<span style="display:inline-block;margin:2px 15px 2px 0;">'
                        + '<input type="' + inputType + '" name="opt' + qmiid + '" qmoid="' + opt.qmoid + '" value="' + k + '" title="' + (opt.content || opt.name || '') + '"' + checked + '><\/span>';
                });
                html += '<\/div>';
            }
            html += '<\/div><\/div>';
        });
        $('#itemlist').html(html || '<p style="color:#999;">无量房项<\/p>');
        form.render(null, 'qeasureForm');
        $('#itemlist input[id$="date"]').each(function () {
            layui.laydate.render({ elem: '#' + $(this).attr('id'), type: 'date', format: 'yyyy-MM-dd' });
        });
    }

    // —— 保存量房信息 ——
    $('#btnExecute').on('click', function () {
        if (!qeasure) return;
        var options = { 'qeasure.qmid': qeasure.qmid };
        var items = $('#itemlist .qeasure-item');
        items.each(function (i, el) {
            var $item = $(el);
            var qmiid = $item.data('qmiid');
            var type = parseInt($item.data('type'), 10);
            options['qeasure.items[' + i + '].qmiid'] = qmiid;
            if (type == 1) options['qeasure.items[' + i + '].content'] = $('#' + qmiid + 'textarea').val();
            if (type == 4) options['qeasure.items[' + i + '].content'] = $('#' + qmiid + 'date').val();
            if (type == 2 || type == 3) {
                $item.find('input[qmoid]').each(function (k, input) {
                    var qmoid = $(input).attr('qmoid');
                    options['qeasure.items[' + i + '].options[' + k + '].qmoid'] = qmoid;
                    options['qeasure.items[' + i + '].options[' + k + '].checked'] = $(input).prop('checked') ? 0 : 1;
                });
            }
        });
        app.showConfirm('是否更新量房信息', function () {
            app.post(api.quotation.handleQeasure, options, function () {
                app.showAlert(app.info, '操作成功');
            });
        });
    });

    // —— 删除量房表 ——
    $('#btnDelete').on('click', function () {
        if (!qeasure) return;
        app.showConfirm('是否删除量房表?', function () {
            app.post(api.quotation.deleteQeasure, { 'qeasure.qmid': qeasure.qmid }, function () {
                app.showAlert(app.info, '删除成功');
                $('#itemlist').empty();
                table.reload('areaTable', { data: [] });
                qeasure = null;
            });
        });
    });

    // —— 功能区 ——
    table.render({ elem: '#areaTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'name', title: '功能区', width: 160 },
            { field: 'total', title: '总额', width: 110, templet: function (d) { return qc.money(d.total); } },
            { field: 'createTime', title: '创建时间', width: 170 },
            { title: '操作', width: 150, toolbar: '#areaToolbar' } ]] });

    function loadAreas() {
        if (!qeasure) return;
        app.post(api.quotation.queryQeasureFunctionArea, { 'qeasureFunctionArea.qmid': qeasure.qmid }, function (res) {
            table.reload('areaTable', { data: res.qeasureFunctionAreas || [] });
        });
    }

    $('#btnAddArea').on('click', function () {
        if (!qeasure) { app.showAlert(app.warning, '量房表未加载'); return; }
        $('#areaBox form')[0].reset();
        form.render('select');
        layer.open({ type: 1, title: '添加功能区（选择模板功能区）', content: $('#areaBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var faid = $('#functionAreaSel').val();
                if (!faid) { app.showAlert(app.warning, '请选择功能区'); return; }
                app.post(api.quotation.makeQeasureFunctionArea, { 'qeasureFunctionArea.qmid': qeasure.qmid, 'qeasureFunctionArea.faid': faid }, function () {
                    app.showAlert(app.success, '添加成功');
                    layer.close(idx); loadAreas();
                });
            } });
    });

    table.on('tool(areaTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'del') {
            app.showConfirm('确定删除功能区: ' + v.name + '?', function () {
                app.post(api.quotation.deleteQeasureFunctionArea, { 'qeasureFunctionArea.qmfaid': v.qmfaid }, function () {
                    app.showAlert(app.info, '操作成功'); loadAreas();
                });
            });
        } else if (obj.event === 'edit') {
            // 编辑功能区量房参数
            app.post(api.quotation.queryQeasureFunctionAreaByQmfaId, { 'qeasureFunctionArea.qmfaid': v.qmfaid }, function (res) {
                var fa = res.qeasureFunctionArea || {};
                var params = fa.qeasureFunctionAreaParam || {};
                var html = '<div class="layui-form-item"><label class="layui-form-label">周长</label><div class="layui-input-inline"><input class="layui-input" id="girth" value="' + (params.girth != null ? params.girth : '') + '"><\/div><\/div>'
                    + '<div class="layui-form-item"><label class="layui-form-label">面积</label><div class="layui-input-inline"><input class="layui-input" id="area" value="' + (params.area != null ? params.area : '') + '"><\/div><\/div>'
                    + '<div class="layui-form-item"><label class="layui-form-label">举架</label><div class="layui-input-inline"><input class="layui-input" id="height" value="' + (params.height != null ? params.height : '') + '"><\/div><\/div>';
                $('#areaEditForm').html(html);
                layer.open({ type: 1, title: '编辑参数 - ' + v.name, content: $('#areaEditBox'), area: ['460px', 'auto'],
                    btn: ['保存', '取消'], yes: function (idx) {
                        app.post(api.quotation.handleQeasureFunctionArea, {
                            'qeasureFunctionArea.qmfaid': v.qmfaid,
                            'qeasureFunctionArea.qeasureFunctionAreaParam.girth': $('#girth').val(),
                            'qeasureFunctionArea.qeasureFunctionAreaParam.area': $('#area').val(),
                            'qeasureFunctionArea.qeasureFunctionAreaParam.height': $('#height').val()
                        }, function () {
                            app.showAlert(app.info, '操作成功');
                            layer.close(idx); loadAreas();
                        });
                    } });
            });
        }
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || 'views/decoration/decoration.html'); });

    show();
});
}); // end app.ready
