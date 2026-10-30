/** app/js/decoration/decoration4timeline.js —— 装修单信息轴（旧 PhotoSwipe 时间轴 → layui tab）
 *  上下文：app.params.decoration = { orderId | decorationOrderId }。
 *  数据：基本信息（queryDecorationByOrderId）+ 图纸（queryDecorationPictureByOrderId，type 1效果图/2放线图）
 *  + 款项（payment.queryDecorationPaymentByOrderId）+ 施工（construction.queryConstructionScheduleByOrderId
 *  + queryConstructerByOrderId + queryConstructionDrawingByOrderId，按节点展示工人与施工图）。 */
app.ready(function () {
layui.use(['table', 'element', 'layer', 'jquery'], function () {
    var table = layui.table, element = layui.element, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId || ctx.decorationOrderId;

    $('#oid').text(orderId || '-');

    function picUrl(path, w) {
        return app.config.media + 'showImg.do?imgBasePath=' + path + '&divFlag=1&width=' + w + '&height=' + w;
    }
    function addPic($box, path, time) {
        if (!path) return;
        $box.append('<div style="display:inline-block;margin:6px;text-align:center;">'
            + '<img src="' + picUrl(path, 120) + '" style="width:120px;height:120px;object-fit:cover;cursor:zoom-in;" data-big="' + picUrl(path, 800) + '">'
            + (time ? '<div style="font-size:12px;color:#888;">' + (time + '').substring(0, 10) + '<\/div>' : '')
            + '<\/div>');
    }
    // 点击放大
    $(document).on('click', '#effectPics img, #projectPics img, [name="cspic"] img', function () {
        layer.photos({ photos: { start: 0, data: [{ src: $(this).data('big') }] }, anim: 5, shade: 0.6 });
    });

    // —— 基本信息 ——
    app.post(api.decoration.queryDecorationByOrderId, { 'decorationOrderId': orderId }, function (req) {
        var d = req.decoration || {};
        function row(k, v) { return '<tr><td style="width:110px;font-weight:bold;">' + k + '<\/td><td>' + (v == null ? '' : v) + '<\/td><\/tr>'; }
        var html = ''
            + row('客户', d.customer ? d.customer.name : '')
            + row('地址', d.house ? ((d.house.village ? d.house.village.name : '') + ' ' + (d.house.houseNumber || '')) : '')
            + row('设计师', d.designer ? d.designer.currentName + '（' + (d.designer.phone || '') + '）' : '')
            + row('业务员', d.salesman ? d.salesman.currentName + '（' + (d.salesman.phone || '') + '）' : '')
            + row('监理', d.supervisor ? d.supervisor.currentName + '（' + (d.supervisor.phone || '') + '）' : '')
            + row('状态', E.status[d.status] != null ? E.status[d.status] : d.status);
        $('#baseTable').html(html);
    });

    // —— 图纸 ——
    app.post(api.decoration.queryDecorationPictureByOrderId, { 'decorationPicture.orderId': orderId }, function (res) {
        $.each(res.decorationPictures || [], function (i, v) {
            if (v.type == 1) addPic($('#effectPics'), v.path, v.uploadTime);
            else if (v.type == 2) addPic($('#projectPics'), v.path, v.uploadTime);
        });
    });

    // —— 款项 ——
    var PAY_STATUS = E.paymentStatus;
    table.render({ elem: '#paymentTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'paymentType', title: '款项类型', width: 140 },
            { field: 'realMoney', title: '金额', width: 120, templet: function (d) { return app.formatMoney(d.realMoney); } },
            { field: 'paymentStatus', title: '状态', width: 110, templet: function (d) { return decorationCommon.badge(PAY_STATUS, d.paymentStatus, function (k) { return k == 2 ? 'layui-bg-green' : k == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; }); } },
            { field: 'createTime', title: '创建时间', width: 180, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
    app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
        table.reload('paymentTable', { data: res.decorationPayments || [] });
    });

    // —— 施工进程（按节点：工人 + 施工图）——
    var NODE_NAMES = $.extend({ 0: '初始', 1: '开工', 2: '完工' }, {});
    var drawings = [];
    app.post(api.data.queryConstructionNode, {}, function (res) {
        $.each(res.constructionNodes || [], function (i, n) { NODE_NAMES[n.cnid] = n.name; });
    }, null, false);

    app.post(api.construction.queryConstructionScheduleByOrderId, { 'constructionSchedule.orderId': orderId }, function (res) {
        var schedules = res.constructionSchedules || [];
        if (!schedules.length) { $('#constructionArea').html('<p style="color:#999;padding:10px;">暂无施工信息<\/p>'); return; }
        var html = '';
        $.each(schedules, function (i, s) {
            html += '<div style="border:1px solid #eee;border-radius:4px;margin:10px 0;padding:10px;">'
                + '<b style="font-size:14px;">' + (NODE_NAMES[s.schedule] != null ? NODE_NAMES[s.schedule] : ('节点' + s.schedule)) + '<\/b>'
                + '<div name="workers" data-schedule="' + s.schedule + '"><p style="color:#999;">当前进度没有分配工人!<\/p><\/div>'
                + '<p style="font-weight:bold;margin-top:8px;">施工图片<\/p>'
                + '<div name="cspic" data-schedule="' + s.schedule + '" class="app-piclist"><\/div>'
                + '<\/div>';
        });
        $('#constructionArea').html(html);

        // 工人
        app.post(api.construction.queryConstructerByOrderId, { 'constructer.orderId': orderId }, function (res2) {
            $.each(res2.constructers || [], function (i, c) {
                var $w = $('[name="workers"][data-schedule="' + c.schedule + '"]');
                if ($w.length && $w.find('p').length) $w.empty();
                $w.append('<span style="display:inline-block;margin:4px 12px 4px 0;">'
                    + '<img src="' + (c.user && c.user.userPhoto ? picUrl(c.user.userPhoto, 48) : '../../images/icon_fanglin.png') + '" style="width:36px;height:36px;border-radius:50%;vertical-align:middle;">'
                    + ' <b style="color:#01AAED;">' + (c.user ? c.user.userName : '') + '<\/b>'
                    + ' ' + (c.user && c.user.duty ? c.user.duty.name : '') + ' ' + (c.user ? (c.user.phone || '') : '')
                    + '<\/span>');
            });
        });
        // 施工图
        app.post(api.construction.queryConstructionDrawingByOrderId, { 'construction.orderId': orderId }, function (res3) {
            $.each(res3.constructionDrawings || [], function (i, dr) {
                if (!dr.drawingUrl) return;
                var $p = $('[name="cspic"][data-schedule="' + dr.schedule + '"]');
                var src = dr.type == 1 ? (app.config.dmedia + dr.drawingUrl + '_120x120.jpg')
                    : picUrl(dr.drawingUrl + '&timestamp=' + new Date().getTime(), 120);
                var big = dr.type == 1 ? (app.config.dmedia + dr.drawingUrl + '_800x800.jpg') : picUrl(dr.drawingUrl, 800);
                $p.append('<img src="' + src + '" data-big="' + big + '" style="width:120px;height:120px;object-fit:cover;margin:6px;cursor:zoom-in;">');
            });
        });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
