/** app/js/decoration/decorationContract2create.js —— 创建合同（弹窗子页）
 *  上下文：app.params.decoration = { orderId, contract? }；app.params.customer = { cid }。
 *  流程：注册/确认客户（registCustomer/confirmCustomer）→ 若已有合同（params.decoration.contract.cid）则查询并回写
 *  contractargs → 否则选择模板（data.queryContract atttype=装修=0）确定后回写 contractargs 并关闭。
 *  ★ 旧版通过 iframe 加载服务端合同表单页（Ace 片段），纯 layui 版改为回写模板参数由父页统一处理。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var ctx = app.params.decoration || {};
    var customer = app.params.customer || {};
    var contracts = {};

    // 注册 + 确认客户（对齐旧逻辑，忽略失败）
    if (customer.cid) {
        app.post(api.data.registCustomer, { 'customer.cid': customer.cid }, function () {}, function () {});
        app.post(api.data.confirmCustomer, { 'customer.cid': customer.cid }, function () {}, function () {});
    }

    // 合同模板列表（atttype=0 装修合同），模板按厂商标注: path前缀esign://=e签宝/fadada://=法大大, 未标记=默认(与路由模板级口径一致)
    app.post(api.data.queryContract, { 'contract.atttype': 0 }, function (res) {
        var list = res.contracts || [];
        var html = '<option value="">请选择合同模板</option>';
        $.each(list, function (i, v) {
            contracts[v.cid] = v;
            var vendor = (v.path || '').indexOf('esign://') === 0 ? '(e签宝)' : ((v.path || '').indexOf('fadada://') === 0 ? '(法大大)' : '');
            html += '<option value="' + v.cid + '">' + v.name + vendor + '<\/option>';
        });
        $('#contract').html(html);
        form.render('select');
    });

    // 已有合同：直接回写 contractargs
    if (ctx.contract && ctx.contract.cid) {
        app.post(api.data.queryContractByCid, { 'contract.cid': ctx.contract.cid }, function (res) {
            var contract = res.contract;
            if (!contract || !contract.cid) return;
            var args = {};
            if (contract.page) {
                $.each(contract.page.split('?')[1].split('&'), function (i, kv) {
                    var p = kv.split('=');
                    if (p[0]) args[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
                });
            }
            args.cid = contract.cid;
            app.params.decoration.contractargs = args;
            app.params.decoration.contract = contract;
            openContractTemplate(contract, args);
            layer.msg('已使用现有合同模板', { icon: 1, time: 1200 });
            setTimeout(function () { parent.layer.close(parent.layer.getFrameIndex(window.name)); }, 600);
        });
    }

    /** 打开合同模板页（contract.page 指向 views/contract/C-xxx.html，参数由 URL 查询串携带） */
    function openContractTemplate(contract, args) {
        var page = contract.page || '';
        if (!page) { app.showAlert(app.warning, '合同模板未配置页面'); return; }
        var url = page + (page.indexOf('?') != -1 ? '&' : '?')
            + 'orderId=' + encodeURIComponent(ctx.orderId || '')
            + '&cid=' + encodeURIComponent(args.cid || '');
        if (ctx.contract && ctx.contract.dcid) url += '&dcid=' + encodeURIComponent(ctx.contract.dcid);
        try {
            parent.app.params.decoration = $.extend({}, (parent.app.params && parent.app.params.decoration) || {}, {
                orderId: ctx.orderId, contractargs: args, contract: ctx.contract || null
            });
        } catch (e) { /* 跨域忽略 */ }
        parent.layer.open({ type: 2, title: '生成合同', content: url, area: ['95%', '92%'] });
    }

    $('#btnOk').on('click', function () {
        var cid = $('#contract').val();
        if (!cid) { app.showAlert(app.warning, '请选择合同模板'); return; }
        var contract = contracts[cid] || {};
        var args = {};
        if (contract.page) {
            var qs = contract.page.indexOf('?') != -1 ? contract.page.split('?')[1] : '';
            $.each(qs.split('&'), function (i, kv) {
                var p = kv.split('=');
                if (p[0]) args[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
            });
        }
        args.cid = cid;
        app.params.decoration.orderId = ctx.orderId;
        app.params.decoration.contractargs = args;
        app.params.decoration.contract = contract;
        openContractTemplate(contract, args);
        setTimeout(function () {
            // 弹窗子页关闭（父层 index）
            var idx = parent.layer.getFrameIndex(window.name);
            if (idx) parent.layer.close(idx); else window.close();
        }, 500);
    });
});
}); // end app.ready
