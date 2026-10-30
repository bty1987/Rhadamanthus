/** app/js/balance/balanceSelection.js —— 结算选材单
 * url ?depage=material|supplier|supplyChain|audit|空。控制按钮显隐。
 * balanceSelection.status: 0初始/1锁定/2待审/3审核(ENABLE_CHECK)；grade: A/B/C。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'upload', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, upload = layui.upload, form = layui.form, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.depage) || '';
    var state = { page: 1, rows: 10, total: 0, createIndex: null, updateIndex: null, picIndex: null, curBsid: null };
    var listApi = pageType == 'supplier' ? api.balance.pageBalanceSelectionForSupplier : api.balance.pageBalanceSelection;
    var STATUS = { 0: '初始', 1: '锁定', 2: '待审', 3: '审核' };
    var STATUS_INIT = 0, STATUS_UNLOCK = 1, STATUS_WAIT = 2, STATUS_ENABLE_CHECK = 3;
    // 创建按钮仅 material 模式显示
    if (pageType != 'material') $('#btnCreate').hide();
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.brand && d.brand.name) || '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 3 ? 'layui-bg-green' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'grade', title: '等级', width: 80 },
                { field: 'income', title: '收入', width: 110, templet: function (d) { return app.formatMoney(d.income); } },
                { field: 'cost', title: '成本', width: 110, templet: function (d) { return app.formatMoney(d.cost); } },
                { field: 'payment', title: '应付', width: 110, templet: function (d) { return app.formatMoney(d.payment); } },
                { field: 'profit', title: '利润', width: 110, templet: function (d) { return app.formatMoney(d.profit); } },
                { field: 'creater', title: '创建人', width: 100, templet: function (d) { return (d.creater && d.creater.userName) || '-'; } },
                { field: 'createTime', title: '创建时间', width: 170 },
                { field: 'lockTime', title: '锁定时间', width: 170 },
                { field: 'auditer', title: '待审人', width: 100, templet: function (d) { return (d.auditer && d.auditer.userName) || '-'; } },
                { field: 'auditTime', title: '待审时间', width: 170 },
                { field: 'balancer', title: '审核人', width: 100, templet: function (d) { return (d.balancer && d.balancer.userName) || '-'; } },
                { field: 'balanceTime', title: '审核时间', width: 170 },
                { title: '操作', width: 760, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'cutpay') goCutpay(v);
            else if (ev === 'amount') doAmount(v);
            else if (ev === 'detail') goDetail(v);
            else if (ev === 'update') openUpdate(v);
            else if (ev === 'audit') doAudit(v);
            else if (ev === 'balance') doBalance(v);
            else if (ev === 'unaudit') doUnaudit(v);
            else if (ev === 'split') doSplit(v);
            else if (ev === 'delete') doDelete(v);
            else if (ev === 'lock') doLock(v);
            else if (ev === 'unlock') doUnlock(v);
            else if (ev === 'print') doPrint(v);
            else if (ev === 'record') goRecord(v);
            else if (ev === 'pic') openPic(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        app.post(listApi, $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {}; table.reload('resultTable', { data: p.data || [] }); state.total = p.totalRecords || 0; rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function goCutpay(v) {
        if (pageType == 'supplier') return;
        if (!(v.balance && v.balance.no != '0000000000')) return;
        app.params.balance = { bsid: v.bsid, bid: v.balance ? v.balance.bid : null, uid: v.balance && v.balance.belonger ? v.balance.belonger.uid : null, balance: v.balance, surplus: v.balance ? v.balance.surplus : 0 };
        app.popup(api.index.balanceCutpayIndex.url + '?depage=balance', '结算扣款 - ' + v.name, null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }
    function doAmount(v) {
        if (v.status == STATUS_UNLOCK) return;
        app.post(api.balance.amountBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '汇总成功'); query(state.page); });
    }
    function goDetail(v) {
        app.params.balance = { bsid: v.bsid, balance: v };
        app.popup(api.index.balanceSelectionItemIndex.url, '选材项 - ' + v.name, null, { area: ['95%', '85%'], end: function () { query(state.page); } });
    }
    function openUpdate(v) {
        if (v.status != STATUS_INIT) return;
        if (pageType != 'material' && pageType != 'supplier') return;
        app.clearValidator();
        $('#updateForm [name="bsid"]').val(v.bsid);
        $('#updateForm [name="name"]').val(v.name);
        state.updateIndex = layer.open({ type: 1, title: '更新名称 - ' + v.name, content: $('#updateBox'), area: ['480px', 'auto'] });
    }
    function doUpdate() {
        if (app.validate('updateForm')) return;
        app.post(api.balance.updateBalanceSelection, {
            'balanceSelection.bsid': $('#updateForm [name="bsid"]').val(),
            'balanceSelection.name': $('#updateForm [name="name"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.updateIndex); state.updateIndex = null; query(state.page); });
    }
    function doAudit(v) {
        if (v.status != STATUS_UNLOCK) return;
        if (pageType != 'supplyChain' && pageType) return;
        app.post(api.balance.auditBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doBalance(v) {
        if (v.status != STATUS_WAIT) return;
        if (pageType != 'audit' && pageType) return;
        var pay = v.grade == 'A' ? v.income : v.payment;
        app.showConfirm('确定审核？应付额：' + app.formatMoney(pay), function () {
            app.post(api.balance.balanceBalanceSelection, { 'balanceSelection.bsid': v.bsid, 'balanceSelection.payment': pay }, function () { app.showAlert(app.success, '审核成功'); query(state.page); });
        });
    }
    function doUnaudit(v) {
        if (v.status != STATUS_WAIT) return;
        if (pageType != 'audit') return;
        app.post(api.balance.unauditBalanceSelection, { 'balanceSelection.bsid': v.bsid, 'balanceSelection.status': v.status - 1 }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
    }
    function doSplit(v) {
        if (v.status != STATUS_INIT) return;
        app.showConfirm('确定将该结算选材平均拆分为两个？', function () {
            app.post(api.balance.splitBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '拆分成功'); query(state.page); });
        });
    }
    function doDelete(v) {
        if (v.status != STATUS_INIT) return;
        app.showConfirm('确定删除？', function () {
            app.post(api.balance.deleteBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '删除成功'); query(state.page); });
        });
    }
    function doLock(v) {
        if (v.status != STATUS_INIT) return;
        if (pageType != 'material' && pageType != 'supplier' && pageType) return;
        app.post(api.balance.lockBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '锁定成功'); query(state.page); });
    }
    function doUnlock(v) {
        if (v.status != STATUS_UNLOCK) return;
        if (pageType == 'supplier') return;
        app.post(api.balance.unlockBalanceSelection, { 'balanceSelection.bsid': v.bsid }, function () { app.showAlert(app.success, '解锁成功'); query(state.page); });
    }
    function doPrint(v) {
        if (v.status == STATUS_INIT) return;
        app.params.balance = { bsid: v.bsid, type: 1 };
        app.popup(api.index.balanceSelection2print.url, '明细表', null, { area: ['95%', '85%'] });
    }
    function goRecord(v) {
        app.params.balance = { bsid: v.bsid };
        app.popup(api.index.balanceSelectionRecordIndex.url, '结算选材记录', null, { area: ['80%', '70%'] });
    }

    function openCreate() {
        app.clearValidator();
        $('#createForm')[0].reset();
        form.render('radio');
        state.createIndex = layer.open({ type: 1, title: '创建结算选材单', content: $('#createBox'), area: ['500px', 'auto'] });
    }
    function doCreate() {
        if (app.validate('createForm')) return;
        var grade = $('#createForm [name="grade"]:checked').val();
        if (!grade) { app.showAlert(app.warning, '请选择等级'); return; }
        app.post(api.balance.createBalanceSelection, {
            'balanceSelection.name': $('#createForm [name="name"]').val(),
            'balanceSelection.brand.bid': $('#createForm [name="brand.bid"]').val(),
            'balanceSelection.grade': grade
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.createIndex); state.createIndex = null; query(state.page); });
    }

    function doExport() {
        if (state.total == 0) { app.showAlert(app.warning, '请通过条件进行查询'); return; }
        if (state.total > 2000) { app.showAlert(app.warning, '查询结果大于阀值，导出失败'); return; }
        app.post(listApi, $.extend({}, bF(), { 'paging.page': 1, 'paging.rows': 2000, 'paging.noPage': 1 }), function (res) {
            var rows = (res.paging && res.paging.data) || [];
            $.each(rows, function (i, v) {
                v.status = STATUS[v.status] != null ? STATUS[v.status] : '';
                v.lockTime = v.lockTime || '';
                v.balancer = v.balancer || {}; v.balancer.userName = v.balancer.userName || '';
                v.auditer = v.auditer || {}; v.auditer.userName = v.auditer.userName || '';
                v.auditTime = v.auditTime || ''; v.balanceTime = v.balanceTime || '';
                v.brand = v.brand || {}; v.brand.name = v.brand.name || '';
                v.creater = v.creater || {}; v.creater.userName = v.creater.userName || '';
            });
            app.exporter && app.exporter(rows, '结算选材单');
        });
    }

    // 图片
    function openPic(v) {
        state.curBsid = v.bsid;
        var $box = $('#picBox');
        if (!$box.length) {
            $box = $('<div id="picBox" style="display:none; padding:20px;"><div style="margin-bottom:10px;"><button type="button" class="layui-btn" id="btnUpload"><i class="layui-icon layui-icon-upload"></i>上传图片</button></div><div id="gallery" style="display:flex;flex-wrap:wrap;gap:10px;"></div></div>').appendTo('body');
        }
        loadPics(v.bsid);
        upload.render({ elem: '#btnUpload', url: cfg.server + 'common/uploadImg.do', accept: 'images', multiple: true, done: function (res) {
            if (res.resUrl) {
                app.post(api.balance.addBalancePicture, {
                    'balancePicture.bid': v.balance ? v.balance.bid : '',
                    'balancePicture.pid': v.bsid,
                    'balancePicture.name': res.strutsUploadsFileName || 'img',
                    'balancePicture.path': res.resUrl,
                    'balancePicture.type': 2,
                    'balancePicture.filesize': res.filesize || 0
                }, function () { loadPics(v.bsid); });
            }
        } });
        state.picIndex = layer.open({ type: 1, title: '图片 - ' + v.name, content: $box, area: ['700px', '60%'] });
    }
    function loadPics(bsid) {
        app.post(api.balance.queryBalancePicture, { 'balancePicture.pid': bsid, 'balancePicture.type': 2 }, function (res) {
            var html = '';
            $.each(res.balancePictures || [], function (i, p) {
                html += '<div style="position:relative;width:120px;"><img src="' + (cfg.media + p.path) + '" style="width:120px;height:120px;object-fit:cover;border:1px solid #eee;"><button class="layui-btn layui-btn-xs layui-btn-danger pic-del" data-bpid="' + p.bpid + '" style="position:absolute;top:2px;right:2px;padding:0 6px;">X</button></div>';
            });
            $('#gallery').html(html || '<span class="layui-badge layui-bg-gray">无图片</span>');
            $('.pic-del').on('click', function () {
                var bpid = $(this).attr('data-bpid');
                app.post(api.balance.deleteBalancePicture, { 'balancePicture.bpid': bpid }, function () { loadPics(bsid); });
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    $('#btnCreate').on('click', openCreate);
    $('#btnCreateConfirm').on('click', doCreate);
    $('#btnCreateCancel').on('click', function () { layer.close(state.createIndex); state.createIndex = null; });
    $('#btnUpdateConfirm').on('click', doUpdate);
    $('#btnUpdateCancel').on('click', function () { layer.close(state.updateIndex); state.updateIndex = null; });
    $('#btnExport').on('click', doExport);
});
}); // end app.ready
