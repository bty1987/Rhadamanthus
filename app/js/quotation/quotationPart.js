/** app/js/quotation/quotationPart.js —— 报价编辑器
 *  装载：queryQuotationById + queryQuotationFunctionAreaByQuotationId（功能区分组渲染）；
 *  功能区：add/update/delete/copyQuotationFunctionArea + 参数(girth/area/height...)编辑（updateQuotationFunctionArea）；
 *  项：updateQuotationFunctionAreaItem（数量公式含 {a}~{k} 变量求值/单价/折扣）、deleteQuotationFunctionAreaItem、
 *  添加：常用功能区（addQuotationFunctionAreaByFunctionAreaIds）/报价项（pageQuotationItemByVersionId 勾选）/自定义项；
 *  折扣：updateQuotationForAdvance（超额走 submitApprovalForQuotationDiscount 审批 type=4）；
 *  优惠：updateQuotationPrefer（超额走 submitApprovalForQuotationPrefer）；
 *  保存 updateQuotationForAdvance、锁定/解锁 lock/unlockQuotation、打印 quotationOutput、记录 quotationRecord。
 *  attpages=audi 时只读（仅查看/打印）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var qctx = qc.ctx('quotation') || {};
    var quotation = qctx.quotation || {};
    var orderId = qctx.orderId;
    var attpages = qctx.attpages != null ? qctx.attpages : (qctx.attpaging != null ? qctx.attpaging : null);
    var readonly = attpages == 'audi';
    var quotationDetail = null, basicParams = null, quotationPrefer = null;
    var areas = [];
    var seq = 0;
    var itemState = { page: 1, rows: 10, total: 0 };
    var curArea = null, curItem = null;

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

    if (readonly) { $('#btnAddArea,#btnAddCommon,#btnAddItem,#btnAddCustom,#btnDiscount,#btnPrefer,#btnSave,#btnLock,#btnUnlock').hide(); }

    app.post(api.quotation.queryFunctionAreaType, {}, function (res) {
        app.bindData($('#faAreaType'), res.functionAreaTypes, 'name', 'name', '未分类');
        form.render('select');
    }, null, false);

    function drawHeader() {
        $('#quoLabel').text(quotation.name + ' (' + quotation.qid + ')');
        $('#discount').text(quotation.discount);
        $('#undisPrice').text(qc.money(quotation.undisPrice));
        $('#disPrice').text(qc.money(quotation.disPrice));
        $('#trafficPrice').text(qc.money(quotation.trafficPrice));
        $('#managePrice').text(qc.money(quotation.managePrice));
        $('#taxPrice').text(qc.money(quotation.taxPrice));
        $('#basePrice').text(qc.money(quotation.basePrice));
        $('#costPrice').text(qc.money(quotation.costPrice));
        $('#totalPrice').text(qc.money(quotation.totalPrice));
        $('#statusLabel').text(E.quotationStatus[quotation.status] != null ? E.quotationStatus[quotation.status] : quotation.status);
        basicParams = {
            'quotation.qid': quotation.qid,
            'quotation.discount': quotation.discount,
            'quotation.totalPrice': quotation.totalPrice,
            'quotation.undisPrice': quotation.undisPrice,
            'quotation.disPrice': quotation.disPrice,
            'quotation.manageRate': quotation.manageRate,
            'quotation.managePrice': quotation.managePrice,
            'quotation.trafficRate': quotation.trafficRate,
            'quotation.trafficPrice': quotation.trafficPrice,
            'quotation.basePrice': quotation.basePrice,
            'quotation.costPrice': quotation.costPrice,
            'quotation.taxRate': quotation.taxRate,
            'quotation.taxPrice': quotation.taxPrice
        };
    }

    function refreshQuotation() {
        app.post(api.quotation.queryQuotationById, { 'quotation.qid': quotation.qid }, function (res) {
            quotation = res.quotation;
            drawHeader();
        }, null, false);
    }

    function loadAreas() {
        $('#areaTables').empty();
        seq = 0;
        app.post(api.quotation.queryQuotationFunctionAreaByQuotationId, { 'quotation.qid': quotation.qid }, function (res) {
            areas = res.quotationFunctionAreas || [];
            $.each(areas, function (i, area) { renderArea(area); });
        });
    }

    function areaButtons() {
        if (readonly) return '';
        return '<button type="button" class="layui-btn layui-btn-xs" data-act="param">参数</button>'
            + '<button type="button" class="layui-btn layui-btn-xs" data-act="copy">复制</button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-warm" data-act="edit">编辑</button>'
            + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" data-act="del">删除</button>';
    }

    function renderArea(area) {
        var aid = 'areaTable' + (seq++);
        var box = '<div class="layui-card" style="margin-bottom:10px;" data-qfaid="' + area.qfaId + '">'
            + '<div class="layui-card-header"><b>' + area.functionAreaName + '<\/b>'
            + ' <span style="color:#999;">[' + (E.functionAreaType[area.type] != null ? E.functionAreaType[area.type] : area.type) + ']<\/span>'
            + ' <span style="float:right;">总额: <span id="sum_' + aid + '">' + qc.money(area.total != null ? area.total : 0) + '<\/span><\/span> '
            + areaButtons()
            + '<\/div><div class="layui-card-body" style="padding:5px;"><table id="' + aid + '" lay-filter="' + aid + '"><\/table><\/div><\/div>';
        $('#areaTables').append(box);
        table.render({ elem: '#' + aid, data: area.quotationFunctionAreaItems || [], page: false, limit: 1000, even: true, id: aid,
            cols: [[ { type: 'numbers', title: '#', width: 50 },
                { field: 'itemName', title: '项目名', width: 170, fixed: 'left' },
                { field: 'type', title: '类型', width: 80, templet: function (d) { return E.functionAreaItemType[d.type] != null ? E.functionAreaItemType[d.type] : d.type; } },
                { field: 'measurementUnit', title: '单位', width: 70 },
                { field: 'workType', title: '工种', width: 80 },
                { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
                { field: 'initNum', title: '初始数量', width: 90, templet: function (d) { return qc.money(d.initNum); } },
                { field: 'num', title: '数量', width: 90, templet: function (d) { return qc.money(d.num); } },
                { field: 'formula', title: '公式', width: 140, templet: function (d) { return qc.paramToFormula(d.formula); } },
                { field: 'discount', title: '打折', width: 80, templet: function (d) { return qc.badge(E.functionAreaItemDiscount, d.discount); } },
                { field: 'total', title: '总额', width: 100, templet: function (d) { return qc.money(u.accMul(d.unitPrice, d.num)); } },
                { title: '操作', width: 220, toolbar: '#rowToolbar' } ]] });
        table.on('tool(' + aid + ')', function (obj) {
            var v = obj.data;
            if (obj.event === 'editNum') openNumEdit(v, area);
            else if (obj.event === 'editPrice') openPriceEdit(v, area);
            else if (obj.event === 'delItem') {
                app.showConfirm('确定删除: ' + v.itemName + '?', function () {
                    app.post(api.quotation.deleteQuotationFunctionAreaItem, $.extend({ 'quotationFunctionAreaItem.qfaiId': v.qfaiId }, basicParams), function () {
                        refreshQuotation(); loadAreas();
                    });
                });
            }
        });
        // 总额合计
        var sum = 0;
        $.each(area.quotationFunctionAreaItems || [], function (i, it) { sum = u.accAdd(sum, u.accMul(it.unitPrice, it.num)); });
        $('#sum_' + aid).text(qc.money(sum));
        area._tableId = aid;
    }

    // —— 功能区操作 ——
    $('#areaTables').on('click', '.layui-btn-xs', function () {
        var act = $(this).data('act');
        var qfaId = $(this).closest('.layui-card').data('qfaid');
        var area = null;
        $.each(areas, function (i, a) { if (a.qfaId == qfaId) area = a; });
        if (!area) return;
        if (act === 'param') openParam(area);
        else if (act === 'edit') openAreaEdit(area);
        else if (act === 'del') {
            app.showConfirm('确定删除功能区: ' + area.functionAreaName + '?', function () {
                app.post(api.quotation.deleteQuotationFunctionArea, $.extend({ 'quotationFunctionArea.qfaId': area.qfaId }, basicParams), function () {
                    refreshQuotation(); loadAreas();
                });
            });
        } else if (act === 'copy') {
            app.showConfirm('确定复制功能区: ' + area.functionAreaName + '?', function () {
                app.post(api.quotation.copyQuotationFunctionArea, $.extend({ 'quotationFunctionArea.qfaId': area.qfaId, 'quotationFunctionArea.functionAreaName': area.functionAreaName }, basicParams), function () {
                    refreshQuotation(); loadAreas();
                });
            });
        }
    });

    function openAreaEdit(area) {
        $('#faName').val(area ? area.functionAreaName : '');
        $('#faTypeSel').val(area ? area.type : 1);
        $('#faAreaType').val(area ? (area.functionAreaType || '') : '');
        $('#faTotal').val(area ? area.total : '');
        form.render('select');
        layer.open({ type: 1, title: area ? '编辑功能区' : '添加功能区', content: $('#areaBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#faName').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                layer.close(idx);
                if (area) {
                    app.post(api.quotation.updateQuotationFunctionArea, {
                        'quotation.qid': quotation.qid,
                        'quotationFunctionArea.qfaId': area.qfaId,
                        'quotationFunctionArea.functionAreaName': $('#faName').val(),
                        'quotationFunctionArea.functionAreaType': $('#faAreaType').val(),
                        'quotationFunctionArea.type': $('#faTypeSel').val(),
                        'quotationFunctionArea.total': $('#faTotal').val() || 0
                    }, function () { refreshQuotation(); loadAreas(); });
                } else {
                    app.post(api.quotation.addQuotationFunctionArea, {
                        'quotation.qid': quotation.qid,
                        'quotationFunctionArea.functionAreaName': $('#faName').val(),
                        'quotationFunctionArea.type': $('#faTypeSel').val(),
                        'quotationFunctionArea.total': $('#faTotal').val() || 0
                    }, function () { refreshQuotation(); loadAreas(); });
                }
            } });
    }
    $('#btnAddArea').on('click', function () { openAreaEdit(null); });

    function openParam(area) {
        var p = area.quotationFunctionAreaParam || {};
        $('#girth').val(p.girth != null ? p.girth : '');
        $('#area').val(p.area != null ? p.area : '');
        $('#height').val(p.height != null ? p.height : '');
        $('#holeLength').val(p.holeLength != null ? p.holeLength : '');
        $('#windowLength').val(p.windowLength != null ? p.windowLength : '');
        $('#beamLength').val(p.beamLength != null ? p.beamLength : '');
        layer.open({ type: 1, title: '参数 - ' + area.functionAreaName, content: $('#paramBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                layer.close(idx);
                app.post(api.quotation.updateQuotationFunctionArea, {
                    'quotation.qid': quotation.qid,
                    'quotationFunctionArea.qfaId': area.qfaId,
                    'quotationFunctionArea.functionAreaName': area.functionAreaName,
                    'quotationFunctionArea.functionAreaType': area.functionAreaType,
                    'quotationFunctionArea.type': area.type,
                    'quotationFunctionArea.total': area.total,
                    'quotationFunctionArea.quotationFunctionAreaParam.girth': $('#girth').val(),
                    'quotationFunctionArea.quotationFunctionAreaParam.area': $('#area').val(),
                    'quotationFunctionArea.quotationFunctionAreaParam.height': $('#height').val(),
                    'quotationFunctionArea.quotationFunctionAreaParam.holeLength': $('#holeLength').val(),
                    'quotationFunctionArea.quotationFunctionAreaParam.windowLength': $('#windowLength').val(),
                    'quotationFunctionArea.quotationFunctionAreaParam.beamLength': $('#beamLength').val()
                }, function () { refreshQuotation(); loadAreas(); });
            } });
    }

    // —— 项编辑 ——
    function updateItem(v, area, overrides) {
        var args = $.extend({
            'quotationFunctionAreaItem.qfaiId': v.qfaiId,
            'quotationFunctionAreaItem.quotationItem.qiid': v.quotationItemId,
            'quotationFunctionAreaItem.itemName': v.itemName,
            'quotationFunctionAreaItem.measurementUnit': v.measurementUnit,
            'quotationFunctionAreaItem.workType': v.workType,
            'quotationFunctionAreaItem.unitPrice': v.unitPrice,
            'quotationFunctionAreaItem.initNum': v.initNum,
            'quotationFunctionAreaItem.num': v.num,
            'quotationFunctionAreaItem.formula': v.formula,
            'quotationFunctionAreaItem.type': v.type,
            'quotationFunctionAreaItem.subtype': v.subtype,
            'quotationFunctionAreaItem.discount': v.discount,
            'quotationFunctionAreaItem.quotationFunctionAreaId': area.qfaId,
            'quotationFunctionAreaItem.quotationFunctionAreaName': area.functionAreaName,
            'quotationFunctionAreaItem.content': v.content,
            'quotationFunctionAreaItem.index': v.index
        }, overrides || {});
        app.post(api.quotation.updateQuotationFunctionAreaItem, $.extend({}, basicParams, args), function () {
            refreshQuotation(); loadAreas();
        }, function () { loadAreas(); });
    }
    function openNumEdit(v, area) {
        $('#numInput').val(v.num != null ? v.num : '');
        layer.open({ type: 1, title: '数量编辑 - ' + v.itemName, content: $('#numBox'), area: ['520px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var input = $('#numInput').val();
                var num = evalNum(input);
                if (num == null) { app.showAlert(app.warning, '公式/数量非法'); return; }
                layer.close(idx);
                updateItem(v, area, { 'quotationFunctionAreaItem.num': num, 'quotationFunctionAreaItem.initNum': num });
            } });
    }
    function openPriceEdit(v, area) {
        $('#unitPriceInput').val(v.unitPrice);
        layer.open({ type: 1, title: '单价编辑 - ' + v.itemName, content: $('#priceBox'), area: ['440px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                layer.close(idx);
                updateItem(v, area, { 'quotationFunctionAreaItem.unitPrice': $('#unitPriceInput').val() });
            } });
    }

    // —— 添加自定义项 ——
    $('#btnAddCustom').on('click', function () {
        if (!areas.length) { app.showAlert(app.warning, '请先添加功能区'); return; }
        var options = '';
        $.each(areas, function (i, a) { options += '<option value="' + a.qfaId + '">' + a.functionAreaName + '<\/option>'; });
        $('#customBox form')[0].reset();
        $('#customBox').append('<div class="layui-form-item" id="customAreaWrap" style="display:none;"><label class="layui-form-label">功能区</label><div class="layui-input-inline"><select id="customAreaSel">' + options + '<\/select><\/div><\/div>');
        $('#customAreaWrap').show();
        form.render('select');
        layer.open({ type: 1, title: '添加自定义项', content: $('#customBox'), area: ['560px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#itemName').val())) { app.showAlert(app.warning, '请填写项目名'); return; }
                var areaId = parseInt($('#customAreaSel').val(), 10);
                var area = null;
                $.each(areas, function (i, a) { if (a.qfaId == areaId) area = a; });
                if (!area) return;
                layer.close(idx);
                app.post(api.quotation.updateQuotationFunctionAreaItem, $.extend({}, basicParams, {
                    'quotationFunctionAreaItem.qfaiId': '',
                    'quotationFunctionAreaItem.quotationItem.qiid': 0,
                    'quotationFunctionAreaItem.itemName': $('#itemName').val(),
                    'quotationFunctionAreaItem.measurementUnit': $('#measurementUnit').val(),
                    'quotationFunctionAreaItem.workType': $('#workType').val(),
                    'quotationFunctionAreaItem.unitPrice': $('#unitPrice').val(),
                    'quotationFunctionAreaItem.initNum': $('#num').val(),
                    'quotationFunctionAreaItem.num': $('#num').val(),
                    'quotationFunctionAreaItem.type': 1,
                    'quotationFunctionAreaItem.subtype': 0,
                    'quotationFunctionAreaItem.discount': $('#discountSel').val(),
                    'quotationFunctionAreaItem.quotationFunctionAreaId': area.qfaId,
                    'quotationFunctionAreaItem.quotationFunctionAreaName': area.functionAreaName,
                    'quotationFunctionAreaItem.content': $('#content').val()
                }), function () { refreshQuotation(); loadAreas(); });
            }, end: function () { $('#customAreaWrap').remove(); } });
    });

    // —— 从报价项添加 ——
    table.render({ elem: '#pickTable', data: [], page: false, limit: 1000, even: true, id: 'pickTable',
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'name', title: '名称', width: 170 },
            { field: 'category', title: '类型', width: 90, templet: function (d) { return d.category ? d.category.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 90, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 70, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 90, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'discount', title: '打折', width: 80, templet: function (d) { return d.discount == 0 ? '不打折' : '打折'; } } ]] });
    $('#btnAddItem').on('click', function () {
        if (!areas.length) { app.showAlert(app.warning, '请先添加功能区'); return; }
        layer.open({ type: 1, title: '添加报价项（同版本）', content: $('#itemsBox'), area: ['950px', '80%'], success: function () { queryPick(1); } });
    });
    function queryPick(pg) {
        itemState.page = pg || 1;
        app.post(api.quotation.pageQuotationItemByVersionId, $.extend({ 'quotationItem.version.no': quotation.version ? quotation.version.no : '' }, qc.buildFilters($('#itemForm')), { 'paging.page': itemState.page, 'paging.rows': itemState.rows }), function (res) {
            var p = res.paging || {};
            table.reload('pickTable', { data: p.data || [] });
            itemState.total = p.totalRecords || 0;
            laypage.render({ elem: 'pickPagenation', count: itemState.total, curr: itemState.page, limit: itemState.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next'], jump: function (o, f) { itemState.rows = o.limit; if (!f) queryPick(o.curr); } });
        });
    }
    $('#btnItemSearch').on('click', function () { queryPick(1); });
    $('#btnSaveItems').on('click', function () {
        var cks = table.checkStatus('pickTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请勾选要添加的报价项'); return; }
        var options = '';
        $.each(areas, function (i, a) { options += '<option value="' + a.qfaId + '">' + a.functionAreaName + '<\/option>'; });
        layer.open({ type: 1, title: '选择目标功能区', content: '<div style="padding:20px 40px;"><select id="targetAreaSel" class="layui-input">' + options + '<\/select><\/div>', area: ['420px', 'auto'],
            btn: ['确定', '取消'], yes: function (ai) {
                var areaId = parseInt($('#targetAreaSel').val(), 10);
                var area = null;
                $.each(areas, function (i, a) { if (a.qfaId == areaId) area = a; });
                layer.close(ai);
                if (!area) return;
                var count = 0, total = cks.data.length;
                $.each(cks.data, function (i, v) {
                    app.post(api.quotation.updateQuotationFunctionAreaItem, $.extend({}, basicParams, {
                        'quotationFunctionAreaItem.qfaiId': '',
                        'quotationFunctionAreaItem.quotationItem.qiid': v.qiid,
                        'quotationFunctionAreaItem.itemName': v.name,
                        'quotationFunctionAreaItem.measurementUnit': v.unit ? v.unit.name : '',
                        'quotationFunctionAreaItem.workType': v.workType ? v.workType.name : '',
                        'quotationFunctionAreaItem.unitPrice': v.unitPrice,
                        'quotationFunctionAreaItem.initNum': 1,
                        'quotationFunctionAreaItem.num': 1,
                        'quotationFunctionAreaItem.type': 0,
                        'quotationFunctionAreaItem.subtype': v.subtype != null ? v.subtype : 0,
                        'quotationFunctionAreaItem.discount': v.discount != null ? v.discount : 0,
                        'quotationFunctionAreaItem.quotationFunctionAreaId': area.qfaId,
                        'quotationFunctionAreaItem.quotationFunctionAreaName': area.functionAreaName,
                        'quotationFunctionAreaItem.content': v.comment != null ? v.comment : ''
                    }), function () {
                        count++;
                        if (count == total) { app.showAlert(app.success, '添加完成'); layer.closeAll(); refreshQuotation(); loadAreas(); }
                    });
                });
            } });
    });

    // —— 常用功能区 ——
    table.render({ elem: '#commonTable', data: [], page: false, limit: 1000, even: true, id: 'commonTable',
        cols: [[ { type: 'checkbox', width: 40 },
            { field: 'functionAreaName', title: '功能区', width: 170 },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'total', title: '总价', width: 100, templet: function (d) { return qc.money(d.total); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } } ]] });
    $('#btnAddCommon').on('click', function () {
        app.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, { 'quotation.qid': quotation.qid }, function (res) {
            table.reload('commonTable', { data: res.quotationFunctionAreas || [] });
        });
        layer.open({ type: 1, title: '常用功能区', content: $('#commonBox'), area: ['750px', '75%'] });
    });
    $('#btnSaveCommon').on('click', function () {
        var cks = table.checkStatus('commonTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请勾选要添加的功能区'); return; }
        var fids = [];
        $.each(cks.data, function (i, v) { fids.push(v.functionAreaId || v.faid); });
        var options = $.extend({}, basicParams, { 'quotation.qid': quotation.qid });
        $.each(fids, function (i, fid) { options['quotationFunctionAreas[' + i + '].functionAreaId'] = fid; });
        app.post(api.quotation.addQuotationFunctionAreaByFunctionAreaIds, options, function () {
            app.showAlert(app.success, '添加完成');
            layer.closeAll(); refreshQuotation(); loadAreas();
        });
    });

    // —— 折扣（超额审批 type=4） ——
    var approvers = [];
    app.post(api.approval.queryApproverByType, { 'approver.type': 4 }, function (res) {
        approvers = res.approvers || [];
        var html = '';
        $.each(approvers, function (i, v) {
            html += '<div style="margin:2px 0;"><input type="radio" name="approver" value="' + v.userBase.userId + '" title="' + v.userBase.currentName + (v.comment ? ' (' + v.comment + ')' : '') + '"><\/div>';
        });
        $('#approveManSel').html(html);
        form.render();
    }, null, false);

    $('#btnDiscount').on('click', function () {
        $('#discountInput').val(quotation.discount);
        $('#basePriceInput').val(quotation.basePrice);
        layer.open({ type: 1, title: '折扣/工程基数', content: $('#discountBox'), area: ['460px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                var dis = $('#discountInput').val();
                var basePrice = $('#basePriceInput').val();
                layer.close(idx);
                var saveFn = function () {
                    var opts = $.extend({}, basicParams, { 'quotation.discount': dis, 'quotation.basePrice': basePrice });
                    app.post(api.quotation.updateQuotationForAdvance, opts, function () {
                        app.showAlert(app.info, '操作成功'); refreshQuotation(); loadAreas();
                    });
                };
                if (parseFloat(dis) < parseFloat(quotation.discount)) {
                    // 折扣下调 → 审批
                    layer.open({ type: 1, title: '折扣审批', content: $('#approveBox'), area: ['560px', 'auto'],
                        btn: ['提交审批', '取消'], yes: function (ai) {
                            var receiverId = $('input[name="approver"]:checked').val();
                            if (receiverId == null) { app.showAlert(app.error, '请选择审批人!'); return; }
                            app.post(api.approval.submitApprovalForQuotationDiscount, {
                                'approval.receiver.userId': receiverId,
                                'approval.comment': $('#changeReason').val(),
                                'approvalQuotationDiscount.orderId': orderId,
                                'approvalQuotationDiscount.qid': quotation.qid,
                                'approvalQuotationDiscount.newDiscount': dis,
                                'approvalQuotationDiscount.basePrice': basePrice
                            }, function () {
                                app.showAlert(app.info, '审批已提交');
                                layer.close(ai);
                            });
                        } });
                    return;
                }
                saveFn();
            } });
    });

    // —— 优惠 ——
    $('#btnPrefer').on('click', function () {
        app.post(api.quotation.queryQuotationPrefer, { 'quotationPrefer.qid': quotation.qid }, function (res) {
            quotationPrefer = res.quotationPrefer || {};
            $('#preferPrice').val(quotationPrefer.preferPrice != null ? quotationPrefer.preferPrice : 0);
            $('#managePrefer').val(quotationPrefer.managePrefer != null ? quotationPrefer.managePrefer : 0);
            $('#advancePrefer').val(quotationPrefer.advancePrefer != null ? quotationPrefer.advancePrefer : 0);
            $('#activityProfit').val(quotationPrefer.activityProfit != null ? quotationPrefer.activityProfit : 0);
            layer.open({ type: 1, title: '优惠', content: $('#preferBox'), area: ['480px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    var advancePrefer = $('#advancePrefer').val();
                    var params = $.extend({}, basicParams, {
                        'quotationPrefer.qid': quotation.qid,
                        'quotationPrefer.preferPrice': $('#preferPrice').val(),
                        'quotationPrefer.managePrefer': $('#managePrefer').val(),
                        'quotationPrefer.advancePrefer': advancePrefer,
                        'quotationPrefer.activityProfit': $('#activityProfit').val(),
                        'quotationPrefer.activityPrice': quotationPrefer.activityPrice != null ? quotationPrefer.activityPrice : 0
                    });
                    layer.close(idx);
                    if (parseFloat(advancePrefer) > (quotationPrefer.advancePrefer != null ? parseFloat(quotationPrefer.advancePrefer) : 0)) {
                        layer.open({ type: 1, title: '优惠审批', content: $('#approveBox'), area: ['560px', 'auto'],
                            btn: ['提交审批', '取消'], yes: function (ai) {
                                var receiverId = $('input[name="approver"]:checked').val();
                                if (receiverId == null) { app.showAlert(app.error, '请选择审批人!'); return; }
                                var ap = $.extend({}, params, {
                                    'approval.receiver.userId': receiverId,
                                    'approval.comment': $('#changeReason').val(),
                                    'approvalQuotationPrefer.qid': quotation.qid,
                                    'approvalQuotationPrefer.preferPrice': $('#preferPrice').val(),
                                    'approvalQuotationPrefer.managePrefer': $('#managePrefer').val(),
                                    'approvalQuotationPrefer.advancePrefer': advancePrefer,
                                    'approvalQuotationPrefer.activityPrice': quotationPrefer.activityPrice != null ? quotationPrefer.activityPrice : 0,
                                    'approvalQuotationPrefer.activityProfit': $('#activityProfit').val(),
                                    'approvalQuotationPrefer.totalPrice': basicParams['quotation.totalPrice'],
                                    'approvalQuotationPrefer.taxPrice': basicParams['quotation.taxPrice'],
                                    'approvalQuotationPrefer.type': 0
                                });
                                app.post(api.approval.submitApprovalForQuotationPrefer, ap, function () {
                                    app.showAlert(app.info, '审批已提交');
                                    layer.close(ai);
                                });
                            } });
                        return;
                    }
                    app.post(api.quotation.updateQuotationPrefer, params, function () {
                        app.showAlert(app.info, '操作成功');
                        refreshQuotation(); loadAreas();
                    });
                } });
        }, null, false);
    });

    // —— 工具栏其余 ——
    $('#btnSave').on('click', function () {
        app.post(api.quotation.updateQuotationForAdvance, basicParams, function () {
            app.showAlert(app.info, '操作成功'); refreshQuotation();
        });
    });
    $('#btnLock').on('click', function () {
        app.post(api.quotation.lockQuotation, { 'quotation.qid': quotation.qid }, function () { app.showAlert(app.info, '锁定成功'); refreshQuotation(); });
    });
    $('#btnUnlock').on('click', function () {
        app.post(api.quotation.unlockQuotation, { 'quotation.qid': quotation.qid }, function () { app.showAlert(app.info, '解锁成功'); refreshQuotation(); });
    });
    $('#btnPrint').on('click', function () {
        app.params.quotation = $.extend({}, app.params.quotation, { orderId: orderId, quotationId: quotation.qid, quotation: quotation, type: 31, subtype: 1, orderType: quotation.decoration ? quotation.decoration.type : 0, showType: 31 });
        app.popup(api.index.quotationOutputIndex.url, '打印报价', null, { area: ['85%', '90%'] });
    });
    $('#btnRecord').on('click', function () {
        app.params.quotation = $.extend({}, app.params.quotation, { quotation: quotation });
        app.params.urlLoadParams = $.extend({}, app.params.urlLoadParams, { pageType: 'query' });
        app.popup('views/quotation/quotationRecord.html', '记录', null, { area: ['80%', '80%'] });
    });
    $('#btnBack').on('click', function () {
        app.showConfirm('当前页面存在重要数据,是否进行当前操作', function () {
            app.switchPage(app.params.historyPage || api.index.quotationIndex.url);
        });
    });

    // —— 初始化 ——
    function init() {
        if (!quotation.qid && orderId) {
            app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId }, function (res) { quotation = res.quotation; start(); }, null, false);
        } else start();
    }
    function start() {
        if (!quotation || !quotation.qid) { app.showAlert(app.warning, '报价不存在'); return; }
        drawHeader();
        loadAreas();
    }
    init();
});
}); // end app.ready
