/** app/js/decoration/decoration4detail.js —— 装修单详情向导（旧 ace_wizard 动态节点 → layui tab 懒加载）
 *  上下文：app.params.decoration = { orderId, orderType, orderTypeness, versionId, viewNode:[{type,opt}] }。
 *  节点实现（对齐旧 decorationUtils.initXxx）：
 *    basic 基本信息 / quotation 报价 / picture 图纸（分类型画廊+上传） / material 主材（销售+物料款+品牌汇总）
 *    activity 活动（活动+物品）/ payment 款项（装修款+配比+预付款）/ belong 归属（设计+业务）
 *    addreduce 增减项 / account 决算 / service 服务 / users 人员。 */
app.ready(function () {
layui.use(['element', 'table', 'form', 'layer', 'jquery'], function () {
    var element = layui.element, table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var nodes = decorationCommon.resolveViewNode();
    var loaded = {};
    var seq = 0;

    $('#orderIdLabel').text(orderId || '-');
    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); return; }

    // —— 构造 tab ——
    $.each(nodes, function (i, node) {
        var title = decorationCommon.nodeTitle[node.type] || node.type;
        var layId = 'node_' + node.type + '_' + (++seq);
        $('#tabTitles').append('<li' + (i === 0 ? ' class="layui-this"' : '') + ' lay-id="' + layId + '">' + title + '<\/li>');
        $('#tabContent').append('<div class="layui-tab-item' + (i === 0 ? ' layui-show' : '') + '" id="' + layId + '"><p style="color:#999;padding:20px;">加载中...<\/p><\/div>');
        node._layId = layId;
    });
    element.render('tab');

    element.on('tab(detailTab)', function (data) {
        var node = nodes[data.index];
        if (node && !loaded[node._layId]) { loaded[node._layId] = true; renderNode(node); }
    });
    renderNode(nodes[0]); loaded[nodes[0]._layId] = true;

    function renderNode(node) {
        var $box = $('#' + node._layId).empty();
        switch (node.type) {
            case 'basic': renderBasic($box); break;
            case 'presign': renderPresign($box); break;
            case 'quotation': renderQuotation($box); break;
            case 'select': renderSelect($box); break;
            case 'picture': renderPicture($box, node); break;
            case 'material': renderMaterial($box); break;
            case 'activity': renderActivity($box); break;
            case 'payment': renderPayment($box); break;
            case 'belong': renderBelong($box); break;
            case 'addreduce': renderAddreduce($box); break;
            case 'account': renderAccount($box); break;
            case 'service': renderService($box); break;
            case 'users': renderUsers($box); break;
            default: $box.html('<p style="color:#999;padding:20px;">未知节点：' + node.type + '<\/p>');
        }
    }

    function sec(title, html) { return '<div style="margin:10px 0;"><b>' + title + '<\/b><\/div>' + html; }

    // —— 基本信息 ——
    function renderBasic($box) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            var d = res.decoration || {}, h = d.house || {};
            function row(k, v) { return '<tr><td style="width:110px;font-weight:bold;">' + k + '<\/td><td>' + (v == null ? '' : v) + '<\/td><td style="width:110px;font-weight:bold;">' + k + '<\/td><td>' + (v == null ? '' : v) + '<\/td><\/tr>'; }
            $box.html('<table class="layui-table">'
                + '<tr><td>装修单号<\/td><td>' + d.orderId + '<\/td><td>状态<\/td><td>' + decorationCommon.badge(E.status, d.status) + '<\/td><\/tr>'
                + '<tr><td>楼盘地址<\/td><td>' + ((h.village ? h.village.name : '') + ' ' + (h.houseNumber || '')) + '<\/td><td>订单类型<\/td><td>' + (E.typeness[d.typeness] != null ? E.typeness[d.typeness] : '') + '<\/td><\/tr>'
                + '<tr><td>客户<\/td><td>' + (d.customer ? d.customer.name + '（' + (d.customer.phone || '') + '）' : '') + '<\/td><td>订单等级<\/td><td>' + (d.grade || '') + '<\/td><\/tr>'
                + '<tr><td>设计师<\/td><td>' + (d.designer ? d.designer.currentName : '') + '<\/td><td>业务员<\/td><td>' + (d.salesman ? d.salesman.currentName : '') + '<\/td><\/tr>'
                + '<tr><td>监理<\/td><td>' + (d.supervisor ? d.supervisor.currentName : '') + '<\/td><td>报价员<\/td><td>' + (d.quoter ? d.quoter.currentName : '') + '<\/td><\/tr>'
                + '<tr><td>建筑面积<\/td><td>' + (h.buildArea || '') + '<\/td><td>计价面积<\/td><td>' + (h.innerArea || '') + '<\/td><\/tr>'
                + '<tr><td>合同报价<\/td><td>' + app.formatMoney(d.orderTotalPrice) + '<\/td><td>预签额<\/td><td>' + app.formatMoney(d.precontractPrice) + '<\/td><\/tr>'
                + '<tr><td>报价额<\/td><td>' + app.formatMoney(d.quotationPrice) + '<\/td><td>实收额<\/td><td>' + app.formatMoney(d.factPrice) + '<\/td><\/tr>'
                + '<tr><td>量房时间<\/td><td>' + (d.measureTime || '') + '<\/td><td>签单时间<\/td><td>' + (d.contractTime || '') + '<\/td><\/tr>'
                + '<\/table>');
        });
    }

    // —— 预签信息 ——
    function renderPresign($box) {
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': orderId }, function (res) {
            var d = res.decoration || {};
            $box.html('<table class="layui-table">'
                + '<tr><td>预签时间<\/td><td>' + (d.precontractTime || '-') + '<\/td><td>预签额<\/td><td>' + app.formatMoney(d.precontractPrice) + '<\/td><\/tr>'
                + '<tr><td>业务类型<\/td><td>' + (d.busitype ? d.busitype.name : '') + '<\/td><td>非业务员比例<\/td><td>' + (d.notSalesmanRate != null ? d.notSalesmanRate : '') + '<\/td><\/tr>'
                + '<\/table>');
        });
    }

    // —— 报价信息 ——
    function renderQuotation($box) {
        app.post(api.quotation.queryQuotationForDefaultByOrderId, { 'quotation.orderId': orderId, 'quotation.type': ctx.orderType }, function (res) {
            var q = res.quotation || {};
            if (q.qid == null) { $box.html('<p style="color:#999;padding:20px;">报价不存在<\/p>'); return; }
            $box.html('<table class="layui-table">'
                + '<tr><td>报价版本<\/td><td>' + (q.versionName || '') + '<\/td><td>报价总额<\/td><td>' + app.formatMoney(q.totalPrice) + '<\/td><\/tr>'
                + '<tr><td>折前价<\/td><td>' + app.formatMoney(q.undisPrice) + '<\/td><td>折后价<\/td><td>' + app.formatMoney(q.disPrice) + '<\/td><\/tr>'
                + '<tr><td>管理费<\/td><td>' + app.formatMoney(q.managePrice) + '<\/td><td>税金<\/td><td>' + app.formatMoney(q.taxPrice) + '<\/td><\/tr>'
                + '<tr><td>交通费<\/td><td>' + app.formatMoney(q.trafficPrice) + '<\/td><td>折扣<\/td><td>' + (q.discount != null ? q.discount : '') + '<\/td><\/tr>'
                + '<\/table><blockquote class="layui-elem-quote">完整报价明细请进入报价模块查看。<\/blockquote>');
        });
    }

    // —— 选材信息 ——
    function renderSelect($box) {
        $box.html('<blockquote class="layui-elem-quote">选材明细属于报价模块（selectionPart），迁移报价模块后在此内嵌。当前请从装修单列表"选材项"进入。<\/blockquote>');
    }

    // —— 图纸信息（分类型画廊 + 上传） ——
    var PIC_TYPES = [
        { key: 1, name: '合同方案图（效果图）' }, { key: 2, name: '放线方案图' }, { key: 3, name: '合同备档' },
        { key: 4, name: '现场图' }, { key: 0, name: '工程文件CAD' }, { key: 5, name: '合同2' }
    ];
    function picUrl(path, w) { return app.config.media + 'showImg.do?imgBasePath=' + path + '&divFlag=1&width=' + w + '&height=' + w; }
    function renderPicture($box, node) {
        var opt = node.opt || {};
        var html = '';
        $.each(PIC_TYPES, function (i, t) {
            var display = !opt.display || opt.display.length === 0 || opt.display.indexOf({ 1: 'designPictures', 2: 'projectPictures', 3: 'contractMap', 4: 'OriginalPicture', 0: 'CADProjectPicture', 5: 'designContractPicture' }[t.key]) != -1;
            if (!display) return;
            var show = !opt.show || opt.show.length === 0;
            html += '<div style="margin-bottom:15px;"><b>' + t.name + '<\/b>'
                + (show ? ' <button type="button" class="layui-btn layui-btn-xs pic-upload" data-type="' + t.key + '"><i class="layui-icon layui-icon-upload"><\/i>上传<\/button>' : '')
                + '<div class="pic-list" data-type="' + t.key + '" style="margin-top:8px;"><\/div><\/div>';
        });
        $box.html(html);
        app.post(api.decoration.queryDecorationPictureByOrderId, { 'decorationPicture.orderId': orderId }, function (res) {
            $.each(res.decorationPictures || [], function (i, v) {
                var $list = $('.pic-list[data-type="' + v.type + '"]', $box);
                if (!$list.length) return;
                var src = /\.dwg|\.dwt$/i.test(v.path || '') ? null : picUrl(v.path, 120);
                $list.append('<div style="display:inline-block;margin:4px;" id="dp_' + v.dpId + '">'
                    + (src ? '<img src="' + src + '" data-big="' + picUrl(v.path, 800) + '" style="width:110px;height:110px;object-fit:cover;cursor:zoom-in;">'
                        : '<div style="width:110px;height:110px;line-height:110px;text-align:center;border:1px solid #eee;">CAD<\/div>')
                    + '<div><a href="' + picUrl(v.path, 800) + '" target="_blank" style="font-size:12px;">查看<\/a> '
                    + '<a href="javascript:;" class="pic-del" data-dpid="' + v.dpId + '" style="font-size:12px;color:#FF5722;">删除<\/a><\/div>'
                    + '<\/div>');
            });
        });
        $box.off('click', '.pic-list img').on('click', '.pic-list img', function () {
            layer.photos({ photos: { start: 0, data: [{ src: $(this).data('big') }] }, anim: 5 });
        });
        $box.off('click', '.pic-del').on('click', '.pic-del', function () {
            var dpid = $(this).data('dpid');
            app.showConfirm('确认删除该图纸?', function () {
                app.post(api.decoration.deleteDecorationPicture, { 'decorationPicture.dpId': dpid }, function () {
                    $('#dp_' + dpid).remove();
                    app.showAlert(app.success, '已删除');
                });
            });
        });
        $box.off('click', '.pic-upload').on('click', '.pic-upload', function () {
            var type = $(this).data('type');
            app.uploadImage({
                elem: this,
                done: function (res) {
                    app.post(api.decoration.addDecorationPicture, {
                        'decorationPicture.orderId': orderId,
                        'decorationPicture.name': res.strutsUploadsFileName || '',
                        'decorationPicture.path': res.resUrl,
                        'decorationPicture.type': type,
                        'decorationPicture.status': 1
                    }, function () {
                        app.showAlert(app.success, '上传成功');
                        renderNode(node);   // 重新加载该节点
                    });
                }
            });
        });
    }

    // —— 主材信息（物料款 + 销售单 + 品牌汇总） ——
    function renderMaterial($box) {
        $box.html('<div id="matTabs" class="layui-tab layui-tab-brief"><ul class="layui-tab-title">'
            + '<li class="layui-this">销售单<\/li><li>物料款<\/li><li>外销单<\/li><\/ul>'
            + '<div class="layui-tab-content">'
            + '<div class="layui-tab-item layui-show"><table id="matSalesTable" lay-filter="matSalesTable"><\/table><\/div>'
            + '<div class="layui-tab-item"><table id="matPaymentTable" lay-filter="matPaymentTable"><\/table><\/div>'
            + '<div class="layui-tab-item"><table id="matOalesTable" lay-filter="matOalesTable"><\/div>'
            + '<\/div><\/div>');
        element.render('tab');

        table.render({ elem: '#matSalesTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '销售单号', width: 130 }, { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 110, templet: function (d) { return d.brand ? d.brand.name : ''; } },
                { field: 'total', title: '总额', width: 90, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'depositpay', title: '定金', width: 90, templet: function (d) { return app.formatMoney(d.depositpay); } },
                { field: 'fullpay', title: '补款', width: 90, templet: function (d) { return app.formatMoney(d.fullpay); } },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return d.status != null ? d.status : ''; } },
                { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
        app.post(api.sales.pageSalesByOrderId, { 'sales.orderId': orderId, 'paging.page': 1, 'paging.rows': 200 }, function (res) {
            table.reload('matSalesTable', { data: (res.paging || {}).data || [] });
        });

        table.render({ elem: '#matPaymentTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '主材单号', width: 130, templet: function (d) { return d.material ? d.material.no : ''; } },
                { field: 'category', title: '品类', width: 100 }, { field: 'brand', title: '品牌', width: 110 },
                { field: 'referMoney', title: '应收额', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } },
                { field: 'paymentType', title: '类型', width: 90 },
                { field: 'paymentStatus', title: '状态', width: 90, templet: function (d) { return E.paymentStatus[d.paymentStatus] != null ? E.paymentStatus[d.paymentStatus] : ''; } },
                { field: 'collectTime', title: '收款时间', width: 165, templet: function (d) { return app.dateFormat(d.collectTime); } } ]] });
        app.post(api.payment.queryMaterialPaymentByOrderId, { 'materialPayment.material.orderId': orderId }, function (res) {
            var list = (res.materialPayments || []).filter(function (v) { return v.paymentStatus != 0; });
            table.reload('matPaymentTable', { data: list });
        });

        table.render({ elem: '#matOalesTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'no', title: '外销单号', width: 130 }, { field: 'category', title: '品类', width: 100 },
                { field: 'brand', title: '品牌', width: 110 }, { field: 'total', title: '总额', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'comment', title: '备注', minWidth: 140 } ]] });
        app.post(api.sales.queryOalesByOrderId, { 'oales.decoration.orderId': orderId }, function (res) {
            table.reload('matOalesTable', { data: res.oaleses || [] });
        });
    }

    // —— 活动信息 ——
    function renderActivity($box) {
        $box.html('<b>参与活动<\/b><table id="dActTable" lay-filter="dActTable"><\/table><b style="display:block;margin-top:12px;">活动物品<\/b><table id="dActItemTable" lay-filter="dActItemTable"><\/table>');
        table.render({ elem: '#dActTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'name', title: '活动', width: 180, templet: function (d) { return d.activity ? d.activity.name : ''; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.activityStatus, d.status); } },
                { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
        app.post(api.decoration.queryDecorationActivityByOrderId, { 'decorationActivity.orderId': orderId }, function (res) {
            table.reload('dActTable', { data: res.decorationActivitys || [] });
        });
        table.render({ elem: '#dActItemTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'activityName', title: '活动', width: 150 }, { field: 'activityItemName', title: '物品', width: 130 },
                { field: 'num', title: '数量', width: 70 }, { field: 'money', title: '金额', width: 90, templet: function (d) { return app.formatMoney(d.money); } },
                { field: 'status', title: '状态', width: 80, templet: function (d) { return decorationCommon.badge(E.activityItemStatus, d.status); } },
                { field: 'stateType', title: '领取类型', width: 100, templet: function (d) { return E.stateType[d.stateType] != null ? E.stateType[d.stateType] : ''; } } ]] });
        app.post(api.decoration.queryDecorationActivityItem, { 'decorationActivityItem.orderId': orderId }, function (res) {
            table.reload('dActItemTable', { data: res.decorationActivityItems || [] });
        });
    }

    // —— 款项信息 ——
    function renderPayment($box) {
        $box.html('<b>装修款</b><table id="payTable" lay-filter="payTable"><\/table><div id="payExtra" style="margin-top:12px;"><\/div>');
        table.render({ elem: '#payTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'paymentType', title: '款项类型', width: 130 },
                { field: 'referMoney', title: '应收', width: 100, templet: function (d) { return app.formatMoney(d.referMoney); } },
                { field: 'realMoney', title: '实收', width: 100, templet: function (d) { return app.formatMoney(d.realMoney); } },
                { field: 'paymentStatus', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.paymentStatus, d.paymentStatus, function (k) { return k == 2 ? 'layui-bg-green' : k == 1 ? 'layui-bg-blue' : 'layui-bg-gray'; }); } },
                { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } } ]] });
        app.post(api.payment.queryDecorationPaymentByOrderId, { 'decorationPayment.decoration.orderId': orderId }, function (res) {
            table.reload('payTable', { data: res.decorationPayments || [] });
        });
        // 预付款 + 配比（半包/整装/满减）
        var extra = '<table class="layui-table" style="width:520px;">';
        app.post(api.payment.queryAdvancePaymentByOrderId, { 'advancePayment.decoration.orderId': orderId }, function (res) {
            extra += '<tr><td>合同预付款<\/td><td>' + app.formatMoney(res.balanceAdvance) + '<\/td><td>主材预付款<\/td><td>' + app.formatMoney(res.materialAdvance) + '<\/td><\/tr>';
            $('#payExtra').html(extra + '<\/table>');
        });
        app.post(api.decoration.queryDecorationMidpack, { 'decorationMidpack.decoration.orderId': orderId }, function (res) {
            var m = res.decorationMidpack;
            if (!m) return;
            $('#payExtra table').append('<tr><td>半包主材配比<\/td><td>' + app.formatMoney(m.materialPrice) + '<\/td><td>半包服务费<\/td><td>' + app.formatMoney(m.servicePrice) + '<\/td><\/tr>');
        });
        app.post(api.decoration.queryDecorationHolonomy, { 'decorationHolonomy.decoration.orderId': orderId }, function (res) {
            var m = res.decorationHolonomy;
            if (!m) return;
            $('#payExtra table').append('<tr><td>满减主材配比<\/td><td>' + app.formatMoney(m.materialPrice) + '<\/td><td>满减服务费<\/td><td>' + app.formatMoney(m.servicePrice) + '<\/td><\/tr>');
        });
        app.post(api.decoration.queryDecorationInclusive, { 'decorationInclusive.decoration.orderId': orderId }, function (res) {
            var m = res.decorationInclusive;
            if (!m) return;
            $('#payExtra table').append('<tr><td>整装合同价<\/td><td>' + app.formatMoney(m.contractPrice) + '<\/td><td>整装工程价<\/td><td>' + app.formatMoney(m.projectPrice) + '<\/td><\/tr>');
        });
    }

    // —— 归属信息 ——
    function renderBelong($box) {
        $box.html('<b>设计归属<\/b><table id="dBelong0" lay-filter="dBelong0"><\/table><b style="display:block;margin-top:12px;">业务归属<\/b><table id="dBelong1" lay-filter="dBelong1"><\/table>');
        var COLS = [[ { field: 'uid', title: '员工编号', width: 120, templet: function (d) { return d.belonger ? d.belonger.userId : ''; } },
            { field: 'name', title: '姓名', width: 110, templet: function (d) { return d.belonger ? d.belonger.currentName : ''; } },
            { field: 'dept', title: '部门', width: 140, templet: function (d) { return d.department ? d.department.name : ''; } },
            { field: 'region', title: '大区', width: 140, templet: function (d) { return d.region ? d.region.name : ''; } },
            { field: 'rate', title: '分配比例', width: 100 },
            { field: 'defaultFlag', title: '默认', width: 80, templet: function (d) { return d.defaultFlag == 1 ? '<span class="layui-badge layui-bg-green">归属<\/span>' : '<span class="layui-badge layui-bg-gray">非归属<\/span>'; } } ]];
        table.render({ elem: '#dBelong0', data: [], page: false, limit: 1000, even: true, cols: COLS });
        table.render({ elem: '#dBelong1', data: [], page: false, limit: 1000, even: true, cols: COLS });
        app.post(api.decoration.queryDecorationBelong, { 'decorationBelong.orderId': orderId, 'decorationBelong.type': 0, 'decorationBelong.status': 0 }, function (res) {
            table.reload('dBelong0', { data: res.decorationBelongs || [] });
        });
        app.post(api.decoration.queryDecorationBelong, { 'decorationBelong.orderId': orderId, 'decorationBelong.type': 1, 'decorationBelong.status': 0 }, function (res) {
            table.reload('dBelong1', { data: res.decorationBelongs || [] });
        });
    }

    // —— 增减项 ——
    function renderAddreduce($box) {
        $box.html('<table id="arTable" lay-filter="arTable"><\/table>');
        var TYPE = { 0: '增项', 1: '减项', 2: '漏项' };
        var STATUS = { 0: '未提交', 1: '未付款', 2: '已付款', 3: '已确认' };
        table.render({ elem: '#arTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'arId', title: '增减项编号', width: 110 }, { field: 'type', title: '类型', width: 80, templet: function (d) { return TYPE[d.type] != null ? TYPE[d.type] : d.type; } },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(STATUS, d.status); } },
                { field: 'total', title: '总额', width: 100, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'comment', title: '备注', minWidth: 150 } ]] });
        app.post(api.quotation.queryAddReduceByOrderId, { 'addReduce.orderId': orderId }, function (res) {
            table.reload('arTable', { data: res.addReduces || [] });
        });
    }

    // —— 决算信息 ——
    function renderAccount($box) {
        app.post(api.decoration.queryDecorationAccount, { 'decorationAccount.orderId': orderId }, function (res) {
            var a = res.decorationAccount;
            if (!a) { $box.html('<p style="color:#999;padding:20px;">暂无决算信息<\/p>'); return; }
            $box.html('<table class="layui-table">'
                + '<tr><td>决算名称<\/td><td>' + (a.name || '') + '<\/td><td>决算类型<\/td><td>' + (E.typeness[a.typeness] != null ? E.typeness[a.typeness] : '') + '<\/td><\/tr>'
                + '<tr><td>主材配比<\/td><td>' + app.formatMoney(a.matching) + '<\/td><td>折扣<\/td><td>' + app.formatMoney(a.discount) + '<\/td><\/tr>'
                + '<tr><td>决算主材额<\/td><td>' + app.formatMoney(a.materialPrice) + '<\/td><td>决算服务费<\/td><td>' + app.formatMoney(a.servicePrice) + '<\/td><\/tr>'
                + '<tr><td>工程总额<\/td><td>' + app.formatMoney(a.projectPrice) + '<\/td><td>差额<\/td><td>' + app.formatMoney(a.difference) + '<\/td><\/tr>'
                + '<tr><td>客户确认<\/td><td>' + (E.accountIsAffirm[a.isAffirm] != null ? E.accountIsAffirm[a.isAffirm] : '') + '<\/td><td>确认时间<\/td><td>' + (a.affirmTime || '') + '<\/td><\/tr>'
                + '<\/table>');
        });
    }

    // —— 服务信息 ——
    function renderService($box) {
        $box.html('<table id="svcTable" lay-filter="svcTable"><\/table>');
        table.render({ elem: '#svcTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'detail', title: '详述', minWidth: 160 },
                { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.serviceStatus, d.status, function (k) { return k == 1 ? 'layui-bg-green' : 'layui-bg-gray'; }); } },
                { field: 'createTime', title: '创建时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'planTime', title: '计划时间', width: 165, templet: function (d) { return app.dateFormat(d.planTime); } },
                { field: 'finishTime', title: '完成时间', width: 165, templet: function (d) { return app.dateFormat(d.finishTime); } },
                { field: 'finisher', title: '完成人', width: 90, templet: function (d) { return d.finisher ? d.finisher.currentName : ''; } },
                { field: 'comment', title: '备注', width: 120 } ]] });
        app.post(api.decoration.queryDecorationServiceByOrderId, { 'decorationService.orderId': orderId }, function (res) {
            table.reload('svcTable', { data: res.decorationServices || [] });
        });
    }

    // —— 人员信息 ——
    function renderUsers($box) {
        $box.html('<button type="button" class="layui-btn layui-btn-sm" id="btnAddUser"><i class="layui-icon layui-icon-add-1"><\/i>添加<\/button><table id="userTable" lay-filter="userTable"><\/table>');
        table.render({ elem: '#userTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { field: 'user', title: '姓名', width: 110, templet: function (d) { return d.user ? (d.user.currentName || '') : ''; } },
                { field: 'type', title: '类型', width: 90, templet: function (d) { return decorationCommon.badge(E.userType, d.type == null ? 99 : d.type, function () { return 'layui-bg-blue'; }); } },
                { field: 'isPay', title: '薪资', width: 90, templet: function (d) { return decorationCommon.badge(E.isPay, d.isPay, function () { return 'layui-bg-blue'; }); } },
                { field: 'isShow', title: '显示', width: 90, templet: function (d) { return decorationCommon.badge(E.isShow, d.isShow, function () { return 'layui-bg-blue'; }); } },
                { field: 'createTime', title: '加入时间', width: 165, templet: function (d) { return app.dateFormat(d.createTime); } },
                { field: 'creater', title: '添加人', width: 100, templet: function (d) { return d.creater ? (d.creater.currentName || '') : ''; } },
                { title: '操作', width: 160, toolbar: '#userToolbar' } ]] });
        function load() {
            app.post(api.decoration.queryDecorationUser, { 'decorationUser.orderId': orderId, 'paging.page': 1, 'paging.rows': 200 }, function (res) {
                table.reload('userTable', { data: res.decorationUsers || [] });
            });
        }
        load();
        table.on('tool(userTable)', function (obj) {
            var v = obj.data;
            if (obj.event === 'del') {
                app.showConfirm('确认删除?', function () {
                    app.post(api.decoration.deleteDecorationUser, { 'decorationUser.duid': v.duid }, function () { load(); });
                });
            } else if (obj.event === 'edit') {
                layer.open({ type: 1, title: '编辑人员', content: '<div style="padding:20px;">'
                    + '<div class="layui-form-item"><label class="layui-form-label">薪资<\/label><div class="layui-input-inline"><select id="uIsPay"><option value="0">无薪<\/option><option value="1">有薪<\/option><\/select><\/div><\/div>'
                    + '<div class="layui-form-item"><label class="layui-form-label">显示<\/label><div class="layui-input-inline"><select id="uIsShow"><option value="0">显示<\/option><option value="1">隐藏<\/option><\/select><\/div><\/div><\/div>',
                    area: ['420px', 'auto'], success: function () { $('#uIsPay').val(v.isPay); $('#uIsShow').val(v.isShow); form.render('select'); },
                    btn: ['保存', '取消'], yes: function (idx) {
                        app.post(api.decoration.updateDecorationUser, { 'decorationUser.duid': v.duid, 'decorationUser.isPay': $('#uIsPay').val(), 'decorationUser.isShow': $('#uIsShow').val() }, function () {
                            layer.close(idx); load();
                        });
                    } });
            }
        });
        $('#btnAddUser').on('click', function () {
            layer.open({ type: 1, title: '添加人员', content: '<div style="padding:20px;">'
                + '<div class="layui-form-item"><label class="layui-form-label">用户编号<\/label><div class="layui-input-inline"><input class="layui-input" id="uUserId" placeholder="用户编号"><\/div><\/div>'
                + '<div class="layui-form-item"><label class="layui-form-label">类型<\/label><div class="layui-input-inline"><select id="uType"><option value="0">业务<\/option><option value="1">装饰<\/option><option value="2">服务<\/option><option value="3">合同<\/option><option value="4">销售<\/option><option value="99" selected>其他<\/option><\/select><\/div><\/div>'
                + '<div class="layui-form-item"><label class="layui-form-label">薪资<\/label><div class="layui-input-inline"><select id="uIsPay"><option value="0">无薪<\/option><option value="1">有薪<\/option><\/select><\/div><\/div>'
                + '<div class="layui-form-item"><label class="layui-form-label">显示<\/label><div class="layui-input-inline"><select id="uIsShow"><option value="0">显示<\/option><option value="1">隐藏<\/option><\/select><\/div><\/div><\/div>',
                area: ['420px', 'auto'], success: function () { form.render('select'); },
                btn: ['保存', '取消'], yes: function (idx) {
                    if (!$('#uUserId').val()) { app.showAlert(app.warning, '请输入用户编号'); return; }
                    app.post(api.decoration.addDecorationUser, { 'decorationUser.orderId': orderId, 'decorationUser.user.userId': $('#uUserId').val(), 'decorationUser.type': $('#uType').val(), 'decorationUser.isPay': $('#uIsPay').val(), 'decorationUser.isShow': $('#uIsShow').val() }, function () {
                        layer.close(idx); load();
                    });
                } });
        });
    }

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
