/** app/js/construction/normtion.js —— 定额材料（报价定额 vs 库房领料 对比汇总）
 *  上下文：app.params.quotation = { orderId }。
 *  数据源：quotation.amountQuotationNormood/amountExtensionNormood/amountAddReduceNormood/queryQuotationNormoodItem
 *  + amountQuotationNormrice/amountExtensionNormrice/amountAddReduceNormrice + inventory.queryAccessories*
 *  按商品 nid 聚合，按节点 cnid 汇总；打印跳 quotation.normoodOutput。 */
app.ready(function () {
layui.use(['form', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    constructionCommon.ensureApiStubs();
    var ctx = app.params.quotation || {};
    var state = { quotation: null, leftTotal: 0, rightTotal: 0, aids: [] };

    if (!ctx.orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    function mul(a, b) { return parseFloat(a || 0) * parseFloat(b || 0); }
    function fmt3(n) { return (Math.round(parseFloat(n || 0) * 1000) / 1000).toFixed(3); }

    // —— 报价定额（右表数据源）——
    app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': ctx.orderId, 'quotation.type': 1 }, function (res) {
        state.quotation = res.quotation;
        if (!state.quotation || state.quotation.qid == null) return;

        app.post(api.quotation.amountQuotationNormood, { 'quotation.qid': state.quotation.qid }, function (r) { handleRight(r.normoods || []); }, null, false);
        app.post(api.quotation.amountExtensionNormood, { 'extension.orderId': state.quotation.orderId }, function (r) { handleRight(r.normoods || []); }, null, false);
        app.post(api.quotation.amountAddReduceNormood, { 'addReduce.orderId': state.quotation.orderId }, function (r) { handleRight(r.normoods || [], true); }, null, false);
        app.post(api.quotation.queryQuotationNormoodItem, { 'quotationNormoodItem.qid': state.quotation.qid }, function (r) { handleRight(r.quotationNormoodItems || []); }, null, false);

        // 按节点材料费（定额工料）
        app.post(api.quotation.amountQuotationNormrice, { 'quotation.qid': state.quotation.qid }, function (r) { lowRight(r.normrices || []); }, null, false);
        app.post(api.quotation.amountExtensionNormrice, { 'extension.orderId': state.quotation.orderId }, function (r) { lowRight(r.normrices || []); }, null, false);
        app.post(api.quotation.amountAddReduceNormrice, { 'addReduce.orderId': state.quotation.orderId }, function (r) { lowRight(r.normrices || []); }, null, false);
    }, null, false);

    // —— 库房辅料单（左表数据源）——
    app.post(api.inventory.queryAccessoriesByOrderId, { 'accessories.orderId': ctx.orderId }, function (res) {
        $.each(res.accessoriess || [], function (i, v) {
            if ([0, 1, 2, 6, 7].indexOf(v.status) == -1) return;
            state.aids.push(v.aid);
            lowLeft(v);
        });
    }, null, false);

    app.post(api.inventory.queryAccessoriesItemByOrderId, { 'accessories.orderId': ctx.orderId }, function (res) {
        state.leftTotal = 0;
        handleLeft(res.accessoriesItems || []);
        $('#leftTotal').text(fmt3(state.leftTotal));
    }, null, false);

    // —— 节点名回填 ——
    var nodeMap = constructionCommon.loadNodeMap();
    $('#accessories tr').each(function () {
        var cnid = $(this).attr('data-cnid');
        if (cnid && nodeMap[cnid]) $(this).find('.aname').text(nodeMap[cnid]);
    });

    // —— 定额聚合（右表，按 nid）——
    function handleRight(data, isAddReduce) {
        $.each(data, function (i, v) {
            var nid = v.noods ? v.noods.nid : v.nid;
            var $tr = $('#nid' + nid);
            state.rightTotal += mul(v.price, v.normnum);

            if ($tr.length) {
                var normnum = (parseFloat($tr.attr('data-tnnum') || 0)) + parseFloat(v.normnum || 0);
                var storenum = (parseFloat($tr.attr('data-tsnum') || 0)) + parseFloat(v.storenum || 0);
                var tntotal = (parseFloat($tr.attr('data-tntotal') || 0)) + mul(v.price, v.normnum);
                var arnnum = (parseFloat($tr.attr('data-arnnum') || 0)) + (isAddReduce ? parseFloat(v.normnum || 0) : 0);
                $tr.attr({ 'data-tnnum': normnum, 'data-tsnum': storenum, 'data-tntotal': tntotal, 'data-arnnum': arnnum });
                $tr.find('.tnnum').text(arnnum != 0 ? normnum + '(' + (arnnum > 0 ? '+' : '') + arnnum + ')' : normnum);
                $tr.find('.tsnum').text(arnnum != 0 ? storenum + '(' + (arnnum > 0 ? '+' : '') + arnnum + ')' : storenum);
                $tr.find('.tntotal').text(fmt3(tntotal));
            } else {
                var name = v.noods ? v.noods.name : (v.goods ? v.goods.name : '');
                var ar = isAddReduce ? parseFloat(v.normnum || 0) : 0;
                var html = '<tr id="nid' + nid + '" data-tnnum="' + (v.normnum || 0) + '" data-tsnum="' + (v.storenum || 0) + '" data-tntotal="' + mul(v.price, v.normnum) + '" data-arnnum="' + ar + '">'
                    + '<td>' + (name || '') + '<\/td><td class="tnnum">' + (ar != 0 ? (v.normnum || 0) + '(' + (ar > 0 ? '+' : '') + ar + ')' : (v.normnum || 0)) + '<\/td>'
                    + '<td>' + (v.normunit || (v.noods ? v.noods.normunit : '') || '') + '<\/td>'
                    + '<td class="tsnum">' + (v.storenum || 0) + '<\/td><td>' + (v.storeunit || (v.noods ? v.noods.storeunit : '') || '') + '<\/td>'
                    + '<td class="tntotal">' + fmt3(mul(v.price, v.normnum)) + '<\/td>'
                    + '<td colspan="6"><\/td>'
                    + '<\/tr>';
                $('#normoods').append(html);
            }
            $('#rightTotal').text(fmt3(state.rightTotal));
        });
    }

    // —— 领料聚合（左表，按 nid）——
    function handleLeft(data) {
        $.each(data, function (i, v) {
            if (state.aids.indexOf(v.aid) == -1) return;
            state.leftTotal += mul(v.normnum, v.num);
            var $tr = $('#nid' + v.nid);
            if ($tr.length) {
                var num = (parseFloat($tr.attr('data-onum') || 0)) + parseFloat(v.num || 0);
                var ototal = (parseFloat($tr.attr('data-ototal') || 0)) + mul(v.normnum, v.num);
                $tr.attr({ 'data-onum': num, 'data-ototal': ototal });
                $tr.find('.onum').text(num);
                $tr.find('.ototal').text(fmt3(ototal));
            }
            $('#leftTotal').text(fmt3(state.leftTotal));
        });
    }

    // —— 按节点汇总 ——
    function lowLeft(v) {
        var $tr = $('#cnid' + v.cnid);
        if ($tr.length) {
            var total = fmt3(parseFloat($tr.attr('data-total') || 0) + parseFloat(v.total || 0));
            $tr.attr('data-total', total);
            $tr.find('.total').text(total);
        } else {
            var html = '<tr id="cnid' + v.cnid + '" data-cnid="' + v.cnid + '" data-total="' + (v.total == null ? 0 : v.total) + '" data-stotal="0">'
                + '<td class="aname">' + (nodeMap[v.cnid] || '') + '<\/td><td class="total">' + (v.total == null ? 0 : v.total) + '<\/td>'
                + '<td class="name"><\/td><td class="stotal">0<\/td>'
                + '<\/tr>';
            $('#accessories').append(html);
        }
    }

    function lowRight(data) {
        $.each(data, function (i, v) {
            var cnid = v.constructionNode ? v.constructionNode.cnid : v.cnid;
            var $tr = $('#cnid' + cnid);
            var stotal = mul(v.stuff, v.num);
            if ($tr.length) {
                var total = fmt3(parseFloat($tr.attr('data-stotal') || 0) + stotal);
                $tr.attr('data-stotal', total);
                $tr.find('.stotal').text(total);
                $tr.find('.name').text(v.constructionNode ? v.constructionNode.name : (nodeMap[cnid] || ''));
            } else {
                var html = '<tr id="cnid' + cnid + '" data-cnid="' + cnid + '" data-total="0" data-stotal="' + stotal + '">'
                    + '<td class="aname">' + (nodeMap[cnid] || '') + '<\/td><td class="total">0<\/td>'
                    + '<td class="name">' + (v.constructionNode ? v.constructionNode.name : '') + '<\/td><td class="stotal">' + fmt3(stotal) + '<\/td>'
                    + '<\/tr>';
                $('#accessories').append(html);
            }
        });
    }

    // —— 打印 ——
    $('#printBtn').on('click', function () {
        $('#printNormoodBox input[name="printType"]').prop('checked', false);
        form.render('checkbox');
        layer.open({ type: 1, title: '打印定额', content: $('#printNormoodBox'), area: ['400px', 'auto'],
            btn: ['打印', '取消'], yes: function (idx) {
                var subtype = 0;
                $('#printNormoodBox input[name="printType"]:checked').each(function () { subtype += parseInt($(this).val(), 10); });
                app.params.quotation = $.extend({}, app.params.quotation, {
                    quotationId: state.quotation ? state.quotation.qid : null,
                    orderId: ctx.orderId,
                    subtype: subtype
                });
                layer.close(idx);
                app.popup('views/quotation/normoodOutput.html', '打印定额', null, { area: ['85%', '90%'] });
            } });
    });
});
}); // end app.ready
