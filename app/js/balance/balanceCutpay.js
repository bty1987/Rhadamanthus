/** app/js/balance/balanceCutpay.js —— 结算扣款（弹窗子页，双模式）
 * url ?depage=balance: 当前结算单的扣款列表（默认）；?depage=cutpay: 扣款账户管理。
 * balanceCutpay.type: 0扣款/1抵扣；status: 0初始/1绑定/2抵扣。
 * 上下文：app.params.balance.{bid,uid,balance} */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'upload', 'form', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, upload = layui.upload, form = layui.form, $ = layui.jquery;
    var url = (app.params.urlLoadParams && app.params.urlLoadParams.depage) || 'balance';
    var ctx = app.params.balance || {};
    var bid = ctx.bid || '', uid = ctx.uid || '', balance = ctx.balance || {};
    var state = { page: 1, rows: 10, total: 0, bindIndex: null, deductIndex: null, createIndex: null, picIndex: null, curBcid: null };
    var listApi = url == 'cutpay' ? api.balance.pageBalanceCutpay : api.balance.queryBalanceCutpay;
    var TYPE = { 0: '扣款', 1: '抵扣' };
    var STATUS = { 0: '初始', 1: '绑定', 2: '抵扣' };
    var TYPE_CUTPAY = 0, TYPE_UNCUTPAY = 1;

    // 切换显隐
    if (url == 'cutpay') { $('.app-only-balance').hide(); }
    else { $('.app-only-cutpay').hide(); }

    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'name', title: '名称', width: 160 },
                { field: 'operater', title: '操作人', width: 100, templet: function (d) { return (d.operater && d.operater.currentName) || '-'; } },
                { field: 'belonger', title: '归属人', width: 100, templet: function (d) { return (d.belonger && d.belonger.currentName) || '-'; } },
                { field: 'operateTime', title: '操作时间', width: 170 },
                { field: 'cutpay', title: '关联扣款', width: 130, templet: function (d) { return (d.cutpay && d.cutpay.name) || '-'; } },
                { field: 'dccount', title: '关联扣款账户', width: 140, templet: function (d) { return (d.dccount && d.dccount.name) || '-'; } },
                { field: 'money', title: '金额', width: 110, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : '-'; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 2 ? 'layui-bg-green' : d.status == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'comment', title: '说明', minWidth: 140 },
                { title: '操作', width: 200, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'deduct') openDeduct(v);
            else if (ev === 'unbind') doUnbind(v);
            else if (ev === 'pic') openPic(v);
        });
    }
    function bF() { var p = {}, c = 0; $('#searchForm [name]').each(function () { var v = $.trim($(this).val()); if (!v) return; p['filters[' + c + '].field'] = $(this).attr('name'); p['filters[' + c + '].data'] = v; p['filters[' + c + '].op'] = $(this).attr('data-op') || 'cn'; c++; }); return p; }
    function query(pg) {
        state.page = pg || 1;
        var param = $.extend({}, bF(), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (url != 'cutpay') param['balanceCutpay.balance.bid'] = bid;
        else param['balanceCutpay.belonger.uid'] = uid;
        app.post(listApi, param, function (res) {
            var arr = res.balanceCutpays || (res.paging && res.paging.data) || [];
            table.reload('resultTable', { data: arr });
            state.total = (res.paging && res.paging.totalRecords) || arr.length;
            rpg();
        });
    }
    function rpg() { if (url != 'cutpay') return; laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // 绑定扣款：先查 ouid 下的扣款，让用户选
    function openBind() {
        app.clearValidator();
        app.post(api.balance.queryBalanceCutpayByOuid, { 'balanceCutpay.belonger.uid': uid }, function (res) {
            var list = []; $.each(res.balanceCutpays || [], function (i, v) { if (v.status == 0) list.push(v); });
            app.bindData($('#bindForm [name="bcid"]'), list, 'bcid', 'name');
            form.render('select');
            state.bindIndex = layer.open({ type: 1, title: '添加扣款', content: $('#bindBox'), area: ['480px', 'auto'] });
        });
    }
    function doBind() {
        if (app.validate('bindForm')) return;
        app.post(api.balance.submitBalanceCutpay, {
            'balanceCutpay.bcid': $('#bindForm [name="bcid"]').val(),
            'balanceCutpay.balance.bid': bid,
            'balanceCutpay.comment': $('#bindForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.bindIndex); state.bindIndex = null; query(state.page); });
    }

    function openDeduct(v) {
        app.clearValidator();
        $('#deductForm [name="bcid"]').val(v.bcid);
        $('#deductForm [name="money"]').val('');
        $('#deductForm [name="comment"]').val('');
        state.deductIndex = layer.open({ type: 1, title: '抵扣 - ' + v.name, content: $('#deductBox'), area: ['480px', 'auto'] });
    }
    function doDeduct() {
        if (app.validate('deductForm')) return;
        app.post(api.balance.deductBalanceCutpay, {
            'balanceCutpay.balance.bid': bid,
            'balanceCutpay.bcid': $('#deductForm [name="bcid"]').val(),
            'balanceCutpay.type': TYPE_UNCUTPAY,
            'balanceCutpay.money': $('#deductForm [name="money"]').val(),
            'balanceCutpay.comment': $('#deductForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '操作成功'); layer.close(state.deductIndex); state.deductIndex = null; query(state.page); });
    }
    function doUnbind(v) {
        app.showConfirm('确定解绑该扣款？', function () {
            app.post(api.balance.unbindBalanceCutpay, { 'balanceCutpay.bcid': v.bcid, 'balanceCutpay.balance.bid': bid }, function () { app.showAlert(app.success, '操作成功'); query(state.page); });
        });
    }

    function openCreate() {
        app.clearValidator();
        $('#createForm')[0].reset();
        state.createIndex = layer.open({ type: 1, title: '创建扣款', content: $('#createBox'), area: ['480px', 'auto'] });
    }
    function doCreate() {
        if (app.validate('createForm')) return;
        app.post(api.balance.addBalanceCutpay, {
            'balanceCutpay.name': $('#createForm [name="name"]').val(),
            'balanceCutpay.type': TYPE_CUTPAY,
            'balanceCutpay.belonger.userId': $('#createForm [name="belonger.userId"]').val(),
            'balanceCutpay.money': $('#createForm [name="money"]').val(),
            'balanceCutpay.comment': $('#createForm [name="comment"]').val()
        }, function () { app.showAlert(app.success, '添加成功'); layer.close(state.createIndex); state.createIndex = null; query(state.page); });
    }

    function doPrint() {
        app.params.balance = balance;
        app.params.balance.bid = bid;
        app.popup(api.index.balanceCutpay2print.url, '扣款明细表', null, { area: ['900px', '600px'] });
    }

    // 图片
    function openPic(v) {
        state.curBcid = v.bcid;
        var $box = $('#picBox');
        if (!$box.length) {
            $box = $('<div id="picBox" style="display:none; padding:20px;"><div style="margin-bottom:10px;"><button type="button" class="layui-btn" id="btnUpload"><i class="layui-icon layui-icon-upload"></i>上传图片</button></div><div id="gallery" style="display:flex;flex-wrap:wrap;gap:10px;"></div></div>').appendTo('body');
        }
        loadPics(v.bcid);
        upload.render({ elem: '#btnUpload', url: cfg.server + 'common/uploadImg.do', accept: 'images', multiple: true, done: function (res) {
            if (res.resUrl) {
                app.post(api.balance.addBalancePicture, {
                    'balancePicture.bid': bid,
                    'balancePicture.pid': v.bcid,
                    'balancePicture.name': res.strutsUploadsFileName || 'img',
                    'balancePicture.path': res.resUrl,
                    'balancePicture.type': 0,
                    'balancePicture.filesize': res.filesize || 0
                }, function () { loadPics(v.bcid); });
            }
        } });
        state.picIndex = layer.open({ type: 1, title: '图片 - ' + v.name, content: $box, area: ['700px', '60%'] });
    }
    function loadPics(bcid) {
        app.post(api.balance.queryBalancePicture, { 'balancePicture.pid': bcid, 'balancePicture.type': 0 }, function (res) {
            var html = '';
            $.each(res.balancePictures || [], function (i, p) {
                html += '<div style="position:relative;width:120px;"><img src="' + (cfg.media + p.path) + '" style="width:120px;height:120px;object-fit:cover;border:1px solid #eee;"><button class="layui-btn layui-btn-xs layui-btn-danger pic-del" data-bpid="' + p.bpid + '" style="position:absolute;top:2px;right:2px;padding:0 6px;">X</button></div>';
            });
            $('#gallery').html(html || '<span class="layui-badge layui-bg-gray">无图片</span>');
            $('.pic-del').on('click', function () {
                var bpid = $(this).attr('data-bpid');
                app.post(api.balance.deleteBalancePicture, { 'balancePicture.bpid': bpid }, function () { loadPics(bcid); });
            });
        });
    }

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnBindCutpay').on('click', openBind);
    $('#btnBindConfirm').on('click', doBind);
    $('#btnBindCancel').on('click', function () { layer.close(state.bindIndex); state.bindIndex = null; });
    $('#btnDeductConfirm').on('click', doDeduct);
    $('#btnDeductCancel').on('click', function () { layer.close(state.deductIndex); state.deductIndex = null; });
    $('#btnCreate').on('click', openCreate);
    $('#btnCreateConfirm').on('click', doCreate);
    $('#btnCreateCancel').on('click', function () { layer.close(state.createIndex); state.createIndex = null; });
    $('#btnPrint').on('click', doPrint);
});
}); // end app.ready
