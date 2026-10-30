/** app/js/production/production.js —— 生产单主页（分页列表 + 添加/售后单 + 状态流转 + 跳转子页）
 * 列表 pageProduction；添加 addProduction；售后单 addProduction(type=1)；
 * 更新 updateProduction / updateProductionForAdvance；
 * 状态流转：designProduction/splitProduction/instoreProduction/planProduction/finishProduction/terminalProduction；
 * upholdProduction（进入售后阶段）；订单上下文 queryDecorationForCommonByOrderId；品牌 queryBrandByPinyin/ByBid。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    var state = { page: 1, rows: 10, total: 0, addIndex: null, upholdIndex: null, updateIndex: null, curPid: null, curBid: null, distinguish: true };
    var addCtx = { hid: null };
    var upholdCtx = { bid: null };
    var updateCtx = { distinguish: true, designerUserId: 0, salesmanUserId: 0, spliterUserId: 0 };
    function stB(d) {
        var m = { 0: '初始', 1: '设计', 2: '生产', 3: '仓库', 4: '物流', 5: '运输', 6: '安装', 7: '完成', 8: '售后', 9: '完结', 10: '废单' };
        var colors = { 0: 'layui-bg-gray', 1: 'layui-bg-blue', 2: 'layui-bg-orange', 3: 'layui-bg-cyan', 4: 'layui-bg-purple', 5: 'layui-bg-purple', 6: 'layui-bg-green', 7: 'layui-bg-green', 8: 'layui-bg-orange', 9: 'layui-bg-green', 10: 'layui-bg-red' };
        return '<span class="layui-badge ' + (colors[d.status] || 'layui-bg-gray') + '">' + (m[d.status] || '-') + '<\/span>';
    }
    function addr(d) { return d.house && d.house.village ? (d.house.village.name + ' ' + d.house.houseNumber) : ''; }
    function person(d, f) { return d[f] ? (d[f].userName || d[f].currentName || '') : ''; }
    initTable(); query(1);
    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'pno', title: '生产单号', width: 140 }, { field: 'orderId', title: '装修单号', width: 130 },
                { field: 'addr', title: '楼盘地址', minWidth: 200, templet: addr },
                { field: 'designer', title: '设计师', width: 100, templet: function (d) { return person(d, 'designer'); } },
                { field: 'salesman', title: '销售员', width: 100, templet: function (d) { return person(d, 'salesman'); } },
                { field: 'spliter', title: '拆单员', width: 100, templet: function (d) { return person(d, 'spliter'); } },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.brand ? d.brand.name : ''; } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'timeLimit', title: '工期', width: 80 },
                { field: 'status', title: '状态', width: 90, templet: stB },
                { field: 'createTime', title: '创建时间', width: 160 },
                { title: '操作', width: 480, toolbar: '#rowToolbar', fixed: 'right' } ]] });
        table.on('tool(resultTable)', function (obj) { handleRowEvent(obj.event, obj.data); });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) { state.page = pg || 1; app.post(api.production.pageProduction, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) { var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg(); }); }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function handleRowEvent(ev, v) {
        switch (ev) {
            case 'design': flow(v, 'designProduction', '设计'); break;
            case 'split': flow(v, 'splitProduction', '生产'); break;
            case 'instore': flow(v, 'instoreProduction', '入库'); break;
            case 'logistics': flow(v, 'planProduction', '物流'); break;
            case 'finish': flow(v, 'finishProduction', '完结'); break;
            case 'after': app.showConfirm('是否确认进入售后阶段?', function () { app.post(api.production.upholdProduction, { 'production.pid': v.pid }, function () { ok('操作成功'); }); }); break;
            case 'abandon': flow(v, 'terminalProduction', '报废生产单'); break;
            case 'update': openUpdate(v, true); break;
            case 'advUpdate':
                if (v.status == 8 || v.status == 9) { app.showAlert(app.warning, '生产单状态不能作此操作'); return; }
                openUpdate(v, false); break;
            case 'bind':
                app.params.productionBind = { pid: v.pid, status: v.status, orderId: v.orderId };
                app.switchPage(api.index.productionSalesIndex.url); break;
            case 'quote':
                app.params.productionPuotation = { pid: v.pid, status: v.status, address: addr(v) };
                app.switchPage(api.index.puotationIndex.url); break;
            case 'picture':
                app.params.productionPicture = { pid: v.pid, status: v.status };
                app.popup('views/production/productionPicture.html', '图纸-' + v.pno, null, { area: ['900px', '600px'] }); break;
            case 'out':
                app.params.productionOutsource = { pid: v.pid, status: v.status };
                app.switchPage(api.index.outsourceIndex.url); break;
            case 'hard':
                app.params.productionHardware = { pid: v.pid, status: v.status };
                app.switchPage(api.index.hardwareCreateIndex.url); break;
            case 'plan':
                app.params.productionPlanCreate = { pid: v.pid, status: v.status };
                app.switchPage(api.index.productionPlanCreateIndex.url); break;
            case 'view':
                app.params.productionView = { pid: v.pid };
                app.popup('views/production/production4view.html', '查看-' + v.pno, null, { area: ['1000px', '600px'] }); break;
        }
    }
    function flow(v, apiName, txt) {
        app.showConfirm('是否确认进入' + txt + '阶段?', function () {
            app.post(api.production[apiName], { 'production.pid': v.pid }, function () { ok('操作成功'); });
        });
    }
    function ok(msg) { app.showAlert(app.success, msg); query(state.page); }

    // 添加生产单
    function openAdd() {
        app.clearValidator(); $('#addForm')[0].reset(); state.curBid = null; addCtx.hid = null;
        state.addIndex = layer.open({ type: 1, title: '添加生产单', content: $('#addBox'), area: ['640px', '90%'] });
    }
    $('#btnLoadOrder').on('click', function () {
        var oid = $.trim($('#addForm [name="orderId"]').val());
        if (!oid) { app.showAlert(app.warning, '请输入装修单号'); return; }
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': oid }, function (data) {
            var h = data.decoration.house;
            $('#addForm [name="orderAddr"]').val(h ? (h.village.name + '  ' + h.houseNumber) : '');
            addCtx.hid = h ? h.hid : null;
        });
    });
    // 品牌：失焦时反查品类
    $('#addForm [name="brand"]').on('change', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': pinyin }, function (res) {
            var brands = res.brands || [];
            if (brands.length) { var b = brands[0]; state.curBid = b.bid; $('#addForm [name="category"]').val(b.categoryName || ''); }
        });
    });
    function saveAdd() {
        if (app.validate('addForm')) return;
        var o = {
            'production.type': 0,
            'production.designer.userId': resolveUserKey('designer', $('#addForm [name="designer"]')),
            'production.salesman.userId': resolveUserKey('salesman', $('#addForm [name="salesman"]')),
            'production.spliter.userId': resolveUserKey('spliter', $('#addForm [name="spliter"]')),
            'production.brand.bid': state.curBid,
            'production.total': $('#addForm [name="total"]').val(),
            'production.timeLimit': $('#addForm [name="timeLimit"]').val(),
            'production.orderId': $('#addForm [name="orderId"]').val(),
            'production.house.hid': addCtx.hid
        };
        app.post(api.production.addProduction, o, function () { ok('操作成功'); layer.close(state.addIndex); state.addIndex = null; });
    }
    // 简易 typeahead：用户拼音输入框聚焦时绑定 autocomplete（用 jQuery UI autocomplete 替代旧 com.initTypeahead）
    function bindPersonTypeahead($input, deptName) {
        if ($input.data('ac-bound')) return; $input.data('ac-bound', true);
        $input.on('blur', function () {
            var pin = $.trim($input.val()); if (!pin) { $input.attr('data-uid', 0); return; }
            var q = { 'pinyinName': pin, 'user.status': 0 }; if (deptName !== null) q['departmentType.name'] = deptName;
            app.post(api.personel.queryUserByPinyin, q, function (res) {
                var list = res.autoFillKeyValue || res.users || []; var u = list[0];
                if (u) { $input.val(u.value || u.userName || ''); $input.attr('data-uid', u.key || u.userId || 0); }
                else { $input.attr('data-uid', 0); }
            });
        });
    }
    function resolveUserKey(role, $input) { return $input.attr('data-uid') || 0; }
    bindPersonTypeahead($('#addForm [name="designer"]'), '设计部');
    bindPersonTypeahead($('#addForm [name="salesman"]'), '设计部');
    bindPersonTypeahead($('#addForm [name="spliter"]'), '');
    bindPersonTypeahead($('#upholdForm [name="upholdDesigner"]'), '设计部');
    bindPersonTypeahead($('#upholdForm [name="upholdSalesman"]'), '设计部');
    bindPersonTypeahead($('#upholdForm [name="upholdSpliter"]'), '');
    bindPersonTypeahead($('#updateForm [name="uDesigner"]'), '设计部');
    bindPersonTypeahead($('#updateForm [name="uSalesman"]'), '设计部');
    bindPersonTypeahead($('#updateForm [name="uSpliter"]'), '');

    // 售后单
    function openUphold() {
        app.clearValidator(); $('#upholdForm')[0].reset(); upholdCtx.bid = null;
        state.upholdIndex = layer.open({ type: 1, title: '创建售后单', content: $('#upholdBox'), area: ['640px', '90%'] });
    }
    $('#upholdForm [name="mbrand"]').on('change', function () {
        var pinyin = $.trim($(this).val()); if (!pinyin) return;
        app.post(api.data.queryBrandByPinyin, { 'brand.pinyin': pinyin }, function (res) {
            var brands = res.brands || []; if (brands.length) { upholdCtx.bid = brands[0].bid; $('#upholdForm [name="mcategory"]').val(brands[0].categoryName || ''); }
        });
    });
    function saveUphold() {
        if (app.validate('upholdForm')) return;
        var o = {
            'production.spid': $('#upholdForm [name="spid"]').val(),
            'production.brand.bid': upholdCtx.bid,
            'production.designer.userId': $('#upholdForm [name="upholdDesigner"]').attr('data-uid') || 0,
            'production.salesman.userId': $('#upholdForm [name="upholdSalesman"]').attr('data-uid') || 0,
            'production.spliter.userId': $('#upholdForm [name="upholdSpliter"]').attr('data-uid') || 0,
            'production.total': $('#upholdForm [name="upholdTotal"]').val(),
            'production.timeLimit': $('#upholdForm [name="upholdTimeLimit"]').val()
        };
        app.post(api.production.addProduction, o, function () { ok('操作成功'); layer.close(state.upholdIndex); state.upholdIndex = null; });
    }

    // 更新
    function openUpdate(v, distinguish) {
        app.clearValidator(); $('#updateForm')[0].reset();
        state.curPid = v.pid; updateCtx.distinguish = distinguish;
        updateCtx.designerUserId = v.designer ? v.designer.userId : 0;
        updateCtx.salesmanUserId = v.salesman ? v.salesman.userId : 0;
        updateCtx.spliterUserId = v.spliter ? v.spliter.userId : 0;
        $('#updateForm [name="uDesigner"]').val(v.designer ? v.designer.userName : '').attr('data-uid', updateCtx.designerUserId);
        $('#updateForm [name="uSalesman"]').val(v.salesman ? v.salesman.userName : '').attr('data-uid', updateCtx.salesmanUserId);
        $('#updateForm [name="uSpliter"]').val(v.spliter ? v.spliter.userName : '').attr('data-uid', updateCtx.spliterUserId);
        $('#updateForm [name="uTimeLimit"]').val(v.timeLimit);
        var disable = !distinguish && (v.status != 0 && v.status != 1);
        $('#updateForm [name="uDesigner"],#updateForm [name="uSalesman"],#updateForm [name="uSpliter"]').prop('disabled', !distinguish && !(v.status == 0));
        $('#updateForm [name="uTimeLimit"]').prop('disabled', distinguish);
        state.updateIndex = layer.open({ type: 1, title: distinguish ? '更新生产单' : '高级更新', content: $('#updateBox'), area: ['560px', 'auto'] });
    }
    function saveUpdate() {
        var uD = $('#updateForm [name="uDesigner"]').attr('data-uid') || updateCtx.designerUserId;
        var uS = $('#updateForm [name="uSalesman"]').attr('data-uid') || updateCtx.salesmanUserId;
        var uSp = $('#updateForm [name="uSpliter"]').attr('data-uid') || updateCtx.spliterUserId;
        var o = { 'production.pid': state.curPid, 'production.designer.userId': uD, 'production.salesman.userId': uS, 'production.spliter.userId': uSp };
        var ad;
        if (updateCtx.distinguish) { ad = api.production.updateProduction; } else { ad = api.production.updateProductionForAdvance; o['production.timeLimit'] = $('#updateForm [name="uTimeLimit"]').val(); }
        app.post(ad, o, function () { ok('操作成功'); layer.close(state.updateIndex); state.updateIndex = null; });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnAdd').on('click', openAdd);
    $('#btnUphold').on('click', openUphold);
    $('#btnSave').on('click', saveAdd);
    $('#btnCancelAdd').on('click', function () { layer.close(state.addIndex); state.addIndex = null; });
    $('#btnSaveUphold').on('click', saveUphold);
    $('#btnCancelUphold').on('click', function () { layer.close(state.upholdIndex); state.upholdIndex = null; });
    $('#btnSaveUpdate').on('click', saveUpdate);
    $('#btnCancelUpdate').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });
});
}); // end app.ready
