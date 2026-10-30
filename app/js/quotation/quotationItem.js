/** app/js/quotation/quotationItem.js —— 报价项管理
 *  pageType（url ?type=）: selection（选材/选材复制）| norm（定额材料/工费/工时）| finance（成本）| 默认（关联/价格/公式/编辑/折扣/状态）。
 *  列表：pageQuotationItem（版本/名称/类型/分类/大类/小类/业务）。
 *  编辑：add/updateQuotationItem（编号 QI_00001 校验 + 同版本重复校验 + 名称匹配 quotationFormat 取 qcid）。
 *  行操作：状态/折扣开关、公式 updateQuotationItemForFormula、成本 updateQuotationItemForCost、
 *  弹窗 soods2create/normood/normrice/normtime/quotationRtem/quotationPrice、选材复制（api.data.copySoods）、导入导出。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var urlLoad = (app.params.urlLoadParams || (parent.app && parent.app.params && parent.app.params.urlLoadParams)) || {};
    var pageType = urlLoad.type;
    var state = { page: 1, rows: 10, total: 0, editFlag: false, repeatFlg: false, qiid: null, qcid: null };
    var copyState = { page: 1, rows: 10, total: 0, versionNo: null };

    // —— 下拉数据装载 ——
    app.post(api.quotation.queryQuotationType, {}, function (a) { app.bindData($('#sQuotationType'), a.quotationTypes, 'id', 'name', true); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationClassification, {}, function (a) { app.bindData($('#sClassification'), a.quotationClassifications, 'id', 'name', true); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationBigCategory, { 'quotationBigCategory.qtid': '' }, function (a) { app.bindData($('#sBigCategory'), a.quotationBigCategorys, 'id', 'name', true); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationSmallCategory, { 'quotationSmallCategory.qtid': '' }, function (a) { app.bindData($('#sSmallCategory'), a.quotationSmallCategorys, 'id', 'name', true); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationVersion, {}, function (a) {
        app.bindData($('#sVersion'), a.quotationVersions, 'no', 'name', true);
        app.bindData($('#version'), a.quotationVersions, 'no', 'name', false);
        form.render('select');
    }, null, false);
    app.post(api.data.queryMeasurementUnit, {}, function (a) { app.bindData($('#measurementUnit'), a.measurementUnits, 'id', 'name', false); form.render('select'); }, null, false);
    app.post(api.data.queryWorkType, {}, function (a) { app.bindData($('#workType'), a.workTypes, 'id', 'name', false); form.render('select'); }, null, false);
    app.post(api.quotation.queryQuotationType, {}, function (a) {
        app.bindData($('#quotationType'), a.quotationTypes, 'id', 'name', false);
        $('#quotationType').prepend("<option value='0' selected='selected'>请选择</option>");
        form.render('select');
    }, null, false);

    // 工具栏按钮（pageType 决定）
    if (!pageType || pageType == 'finance') { $('#btnAdd').show(); $('#btnImport').show(); $('#btnExport').show(); }

    // —— 表格 ——
    function itemNo(v) { return v.version && v.version.offset == 0 ? '-' : 'QI_' + ('00000' + (v.qiid - v.version.offset)).slice(-5); }
    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 160, fixed: 'left' },
            { field: 'no', title: '编号', width: 100, templet: function (d) { return itemNo(d); } },
            { field: 'alias', title: '别名', width: 100 },
            { field: 'version', title: '版本', width: 110, templet: function (d) { return d.version ? d.version.name : ''; } },
            { field: 'type', title: '业务', width: 70, templet: function (d) { return { 0: '标准', 1: '自定义', 2: '车运', 3: '管理', 4: '不计', 5: '成本', 6: '非业绩', 7: '隐藏', 8: '税金', 9: '综合' }[d.type] != null ? { 0: '标准', 1: '自定义', 2: '车运', 3: '管理', 4: '不计', 5: '成本', 6: '非业绩', 7: '隐藏', 8: '税金', 9: '综合' }[d.type] : d.type; } },
            { field: 'category', title: '类型', width: 100, templet: function (d) { return d.category ? d.category.name : ''; } },
            { field: 'classification', title: '分类', width: 90, templet: function (d) { return d.classification ? d.classification.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 90, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'smallCategory', title: '小类', width: 90, templet: function (d) { return d.smallCategory ? d.smallCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 70, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 80, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
            { field: 'unitPrice', title: '单价', width: 90, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
            pageType == 'finance' ? { field: 'cost', title: '成本', width: 90, templet: function (d) { return qc.money(d.cost); } } : { field: 'achePrice', title: '业绩额', width: 90, templet: function (d) { return qc.money(d.achePrice); } },
            { field: 'discount', title: '打折', width: 80, templet: function (d) { return qc.badge({ 0: '不打折', 1: '打折' }, d.discount); } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge({ 0: '启用', 1: '禁用' }, d.status); } },
            { field: 'comment', title: '说明', minWidth: 130 },
            { title: '操作', width: 340, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    // —— 动态行按钮（按 pageType）——
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }
    function setParams(item) {
        (parent.app ? parent.app.params : app.params).data = $.extend({}, ((parent.app ? parent.app.params : app.params).data) || {}, { quotationItem: item });
        (parent.app ? parent.app.params : app.params).urlLoadParams = $.extend({}, urlLoad, { pageType: 'query' });
    }
    reg('selection', '选材', function () { return pageType == 'selection'; }, function (v) { setParams(v); app.popup('views/data/soods2create.html', '添加选材'); });
    reg('copySoods', '选材复制', function () { return pageType == 'selection'; }, function (v) { openCopyList(v); });
    reg('normood', '定额材料', function () { return pageType == 'norm'; }, function (v) { setParams(v); app.popup('views/data/normood.html', '定额材料', null, { area: ['85%', '85%'] }); });
    reg('normrice', '定额工费', function () { return pageType == 'norm'; }, function (v) { setParams(v); app.popup('views/data/normrice.html', '定额工费', null, { area: ['85%', '85%'] }); });
    reg('normtime', '定额工时', function (v) { return pageType == 'norm' || (!pageType && v.type == 3); }, function (v) { setParams(v); app.popup('views/data/normtime.html', '定额工时', null, { area: ['85%', '85%'] }); });
    reg('rtem', '关联', function () { return !pageType; }, function (v) { setParams(v); app.popup('views/quotation/quotationRtem.html', '关联报价项', null, { area: ['85%', '85%'] }); });
    reg('price', '价格', function () { return !pageType; }, function (v) { setParams(v); app.popup('views/quotation/quotationPrice.html', '价格', null, { area: ['85%', '85%'] }); });
    reg('formula', '公式', function () { return !pageType; }, function (v) { openFormula(v); });
    reg('cost', '成本', function () { return pageType == 'finance'; }, function (v) { openCost(v); });
    reg('edit', '编辑', function () { return !pageType || pageType == 'finance'; }, function (v) { openEdit(v); });
    reg('discount', '折扣', function () { return !pageType; }, function (v) {
        app.post(api.quotation.updateQuotationItemForDiscount, { 'quotationItem.qiid': v.qiid, 'quotationItem.discount': v.discount == 1 ? 0 : 1 }, function () { query(state.page); });
    });
    reg('status', '状态', function () { return !pageType; }, function (v) {
        app.post(api.quotation.updateQuotationItemForStatus, { 'quotationItem.qiid': v.qiid, 'quotationItem.status': v.status == 1 ? 0 : 1 }, function () { query(state.page); });
    });

    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) { if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>'; });
        $('#rowToolbar').html(html);
    }
    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        for (var i = 0; i < BTNS.length; i++) if (BTNS[i].ev === obj.event) { BTNS[i].handle(v); return; }
    });

    function query(pg) {
        state.page = pg || 1;
        app.post(api.quotation.pageQuotationItem, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            renderToolbar(data.length ? data[0] : {});
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // —— 类型联动大类/小类 ——
    function loadBigSmall(qtid) {
        app.post(api.quotation.queryQuotationBigCategory, { 'quotationBigCategory.qtid': qtid || '' }, function (a) {
            app.bindData($('#quotationBigCategory'), a.quotationBigCategorys, 'id', 'name', false);
            $('#quotationBigCategory').prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
        app.post(api.quotation.queryQuotationSmallCategory, { 'quotationSmallCategory.qtid': qtid || '' }, function (a) {
            app.bindData($('#quotationSmallCategory'), a.quotationSmallCategorys, 'id', 'name', false);
            $('#quotationSmallCategory').prepend("<option value='0' selected='selected'>请选择类型</option>");
        }, null, false);
        form.render('select');
    }
    form.on('select(quotationTypeFilter)', function (obj) {
        var val = obj.value;
        if (val == 0 || val === '') { loadBigSmall(''); return; }
        loadBigSmall(val);
    });

    // —— 编辑 ——
    function checkItemName() {
        var no = $.trim($('#no').val());
        var version = $('#version').val();
        if (no === '' || state.editFlag) return;
        app.post(api.quotation.queryQuotationItemByItemIdAVersionId, { 'quotationItem.no': no, 'quotationItem.version.id': version }, function (res) {
            if (res.quotationItem && res.quotationItem.qiid) {
                app.showTip($('#no'), '该版本的项目编号已存在', 2);
                state.repeatFlg = true;
            } else state.repeatFlg = false;
        });
    }
    function openEdit(v) {
        state.editFlag = !!v; state.repeatFlg = false;
        $('#no').prop('disabled', !!v).val(v ? v.no : '');
        $('#version').prop('disabled', !!v);
        $('#name').val(v ? v.name : ''); $('#alias').val(v ? v.alias : '');
        if (v) {
            $('#version').val(v.version.no);
            $('#type').val(v.type);
            $('#quotationType').val(v.category.id);
            $('#quotationClassification').val(v.classification.id);
            $('#quotationBigCategory').val(v.bigCategory.id);
            $('#quotationSmallCategory').val(v.smallCategory.id);
            $('#workType').val(v.workType.id);
            $('#measurementUnit').val(v.unit.id);
            $('#unitPrice').val(v.unitPrice); $('#addPrice').val(v.addPrice); $('#subPrice').val(v.subPrice);
            $('#achePrices').val(v.achePrice); $('#comment').val(v.comment);
            form.render('select');
        } else {
            $('#editBox form')[0].reset();
            loadBigSmall('');
        }
        form.render(null, 'editForm');
        layer.open({ type: 1, title: state.editFlag ? '编辑报价项' : '添加报价项', content: $('#editBox'), area: ['620px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                if (!state.editFlag && !/^QI_\d{5}$/.test($('#no').val())) { app.showAlert(app.warning, '请以QI_作为前缀 , 之后以五个位数字组成(如QI_00001).'); return; }
                if (state.repeatFlg) { app.showAlert(app.warning, '该版本的项目编号已存在'); return; }
                if ($('#quotationType').val() == 0 || $('#quotationBigCategory').val() == 0 || $('#quotationSmallCategory').val() == 0) {
                    app.showAlert(app.warning, '请选择类型以及大类小类'); return;
                }
                var url = state.editFlag ? api.quotation.updateQuotationItem : api.quotation.addQuotationItem;
                var option = {
                    'quotationItem.name': $('#name').val(),
                    'quotationItem.alias': $('#alias').val(),
                    'quotationItem.version.no': $('#version').val(),
                    'quotationItem.type': $('#type').val(),
                    'quotationItem.category.id': $('#quotationType').val(),
                    'quotationItem.classification.id': $('#quotationClassification').val(),
                    'quotationItem.bigCategory.id': $('#quotationBigCategory').val(),
                    'quotationItem.smallCategory.id': $('#quotationSmallCategory').val(),
                    'quotationItem.unit.id': $('#measurementUnit').val(),
                    'quotationItem.workType.id': $('#workType').val(),
                    'quotationItem.unitPrice': $('#unitPrice').val(),
                    'quotationItem.addPrice': $('#addPrice').val(),
                    'quotationItem.subPrice': $('#subPrice').val(),
                    'quotationItem.achePrice': $('#achePrices').val(),
                    'quotationItem.comment': $('#comment').val()
                };
                if (state.editFlag) option['quotationItem.qiid'] = v.qiid;
                app.post(url, option, function () {
                    app.showAlert(app.info, '保存成功');
                    layer.close(idx); query(state.page);
                });
            } });
        $('#no').off('blur').on('blur', checkItemName);
    }

    // —— 公式 ——
    function openFormula(v) {
        state.qiid = v.qiid;
        $('#formula').val(qc.paramToFormula(v.formula));
        layer.open({ type: 1, title: '公式 - ' + v.name, content: $('#formulaBox'), area: ['640px', 'auto'],
            btn: ['更新', '取消'], yes: function (idx) {
                var formula = $('#formula').val() || '';
                if (formula !== '' && qc.formulaInvalid(formula)) { app.showAlert(app.warning, '公式存在无效参数'); return; }
                if (formula !== '' && qc.evals(qc.formulaToParam(formula))) { app.showAlert(app.warning, '公式运算结果失败'); return; }
                app.post(api.quotation.updateQuotationItemForFormula, { 'quotationItem.qiid': state.qiid, 'quotationItem.formula': qc.formulaToParam(formula) }, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 成本 ——
    function openCost(v) {
        state.qiid = v.qiid;
        $('#cost').val(v.cost); $('#achePrice').val(v.achePrice);
        layer.open({ type: 1, title: '成本 - ' + v.name, content: $('#costBox'), area: ['460px', 'auto'],
            btn: ['更新', '取消'], yes: function (idx) {
                app.post(api.quotation.updateQuotationItemForCost, { 'quotationItem.qiid': state.qiid, 'quotationItem.cost': $('#cost').val(), 'quotationItem.achePrice': $('#achePrice').val() }, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    // —— 选材复制 ——
    table.render({ elem: '#copyTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 50 },
            { field: 'name', title: '名称', width: 150 },
            { field: 'category', title: '类型', width: 90, templet: function (d) { return d.category ? d.category.name : ''; } },
            { field: 'classification', title: '分类', width: 80, templet: function (d) { return d.classification ? d.classification.name : ''; } },
            { field: 'bigCategory', title: '大类', width: 80, templet: function (d) { return d.bigCategory ? d.bigCategory.name : ''; } },
            { field: 'smallCategory', title: '小类', width: 80, templet: function (d) { return d.smallCategory ? d.smallCategory.name : ''; } },
            { field: 'unit', title: '单位', width: 60, templet: function (d) { return d.unit ? d.unit.name : ''; } },
            { field: 'workType', title: '工种', width: 70, templet: function (d) { return d.workType ? d.workType.name : ''; } },
            { field: 'unitPrice', title: '单价', width: 80, templet: function (d) { return qc.money(d.unitPrice); } },
            { field: 'version', title: '版本', width: 100, templet: function (d) { return d.version ? d.version.name : ''; } },
            { title: '操作', width: 90, toolbar: '#copyToolbar' } ]] });
    function openCopyList(v) {
        state.qiid = v.qiid;
        copyState.versionNo = v.version.no;
        layer.open({ type: 1, title: '选材复制 - ' + v.name, content: $('#selectItemBox'), area: ['900px', '80%'],
            success: function () { queryCopy(1); } });
    }
    table.on('tool(copyTable)', function (obj) {
        if (obj.event === 'copy') {
            app.post(api.data.copySoods, { 'soods.quotationItem.qiid': state.qiid, 'soods.qiid': obj.data.qiid }, function () {
                layer.closeAll(); app.showAlert(app.success, '复制成功');
            });
        }
    });
    function queryCopy(pg) {
        copyState.page = pg || 1;
        app.post(api.quotation.pageQuotationItem, $.extend({ 'quotationItem.version.no': copyState.versionNo }, qc.buildFilters($('#copyForm')), { 'paging.page': copyState.page, 'paging.rows': copyState.rows }), function (res) {
            var p = res.paging || {};
            table.reload('copyTable', { data: p.data || [] });
            copyState.total = p.totalRecords || 0;
            laypage.render({ elem: 'copyPagenation', count: copyState.total, curr: copyState.page, limit: copyState.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next'], jump: function (o, f) { copyState.rows = o.limit; if (!f) queryCopy(o.curr); } });
        });
    }
    $('#btnCopySearch').on('click', function () { queryCopy(1); });

    // —— 导入 / 导出 ——
    $('#btnImport').on('click', function () {
        app.showInfo('导入报价项', '请使用旧版导入模板，通过"系统-导入"功能上传（uploadType=4, importQuotationItem）。');
    });
    $('#btnExport').on('click', function () {
        if (!state.total) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值 , 不能完成导出动作'); return; }
        app.post(api.quotation.pageQuotationItem, $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.noPage': 1 }), function (res) {
            var data = (res.paging || {}).data || [];
            $.each(data, function (i, v) {
                v.discount = v.discount == 0 ? '不打折' : '打折';
                v.status = v.status == 0 ? '启用' : '禁用';
                v.no = itemNo(v);
            });
            table.exportFile('resultTable', data, 'csv', '报价项');
        });
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
