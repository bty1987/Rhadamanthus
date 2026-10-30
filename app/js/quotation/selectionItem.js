/** app/js/quotation/selectionItem.js —— 选材项管理
 *  pageType（url ?type=）映射 apiPage：supplier/escorter/account → pageSelectionItemFor*；其余 pageSelectionItem；
 *  expert/init/material/account 不限状态；tran/check/confirm/finish/review/balance 固定状态过滤。
 *  行操作（pageBtn）：编辑 updateSelectionItem、配送 tranSelectionItem（数量）、审核 checkSelectionItem、确认 confirmSelectionItem、
 *  完结 finishSelectionItem、核对 reviewSelectionItem、驳回 rejectSelectionItem、退货 refundSelectionItem、补量 addedSelectionItem（type→30~34）、
 *  删除 deleteSelectionItem、图片（quotationPicture atttype=1）、修改厂商 updateSelectionItemForSupplier、打印 selectionOutput。
 *  批量结算：submitBalanceSelection（bsid + 勾选项）。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var u = app.utils;
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageType = urlLoad.type;
    var pageConfig = qc.getPageConfig(pageType, 8);
    var state = { page: 1, rows: 10, total: 0 };
    var params_ = { siid: null, num: null, type: null };

    // apiPage 与状态过滤
    var apiPage = api.quotation.pageSelectionItem;
    if (pageType == 'supplier') apiPage = api.quotation.pageSelectionItemForSupplier;
    else if (pageType == 'escorter') apiPage = api.quotation.pageSelectionItemForEscorter;
    else if (pageType == 'account') apiPage = api.quotation.pageSelectionItemForAccount;
    if (pageConfig.apiPage) apiPage = pageConfig.apiPage;
    var statusFilter = { tran: 1, check: 2, confirm: 3, finish: 4, review: 5, balance: 6 }[pageType];

    function hasBtn(n) { return (pageConfig.pageBtn || []).indexOf(n) != -1; }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'checkbox', width: 40 },
            { type: 'numbers', title: '#', width: 50 },
            { field: 'decoration', title: '装修单号', width: 105, fixed: 'left', templet: function (d) { return d.decoration ? d.decoration.orderId : ''; } },
            { field: 'goods', title: '商品名称', width: 170, templet: function (d) { return d.goods ? d.goods.name : ''; } },
            { field: 'goodsBrand', title: '品牌', width: 100, templet: function (d) { return d.goods ? d.goods.brand : ''; } },
            { field: 'goodsCategory', title: '品类', width: 90, templet: function (d) { return d.goods ? d.goods.category : ''; } },
            { field: 'measurementUnit', title: '单位', width: 60, templet: function (d) { return d.goods ? d.goods.measurementUnit : ''; } },
            { field: 'postprice', title: '结算价', width: 90, templet: function (d) { return qc.money(d.postprice); } },
            { field: 'num', title: '数量', width: 80, templet: function (d) { return qc.money(d.num); } },
            { field: 'refnum', title: '退货量', width: 80, templet: function (d) { return qc.money(d.refnum); } },
            { field: 'type', title: '类型', width: 100, templet: function (d) { return E.selectionItemType[d.type] != null ? E.selectionItemType[d.type] : d.type; } },
            { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.selectionItemStatus, d.status); } },
            { field: 'accountStatus', title: '对账状态', width: 90, templet: function (d) { return E.selectionItemAccountStatus[d.accountStatus] != null ? E.selectionItemAccountStatus[d.accountStatus] : ''; } },
            { field: 'comment', title: '说明', minWidth: 110 },
            { title: '操作', width: 420, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    function query(pg) {
        state.page = pg || 1;
        var opts = $.extend({}, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows });
        if (statusFilter != null) opts['selectionItem.status'] = statusFilter;
        $.each(pageConfig.extraParam || [], function (i, v) { opts['statusas[' + i + ']'] = v; });
        app.post(apiPage, opts, function (res) {
            var p = res.paging || {};
            var data = p.data || [];
            renderToolbar(data.length ? data[0] : {});
            table.reload('resultTable', { data: data });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    // —— 行按钮 ——
    var BTNS = [];
    function reg(ev, name, show, handle) { BTNS.push({ ev: ev, name: name, show: show, handle: handle }); }
    function canEdit(v) { return (v.status == 0 && v.decoration && v.decoration.paySacle >= 65) || v.status == 1 || pageType == 'expert'; }
    reg('compile', '编辑', function (v) { return hasBtn('compile') && canEdit(v); }, function (v) {
        params_.siid = v.siid;
        $('#num').val(v.num); $('#comment').val(v.comment);
        layer.open({ type: 1, title: '编辑选材项', content: $('#editBox'), area: ['480px', 'auto'],
            btn: ['保存', '取消'], yes: function (idx) {
                app.post(api.quotation.updateSelectionItem, { 'selectionItem.num': $('#num').val(), 'selectionItem.comment': $('#comment').val(), 'selectionItem.siid': params_.siid }, function () {
                    app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                });
            } });
    });
    reg('tran', '配送', function (v) { return hasBtn('tran'); }, function (v) {
        params_.siid = v.siid;
        $('#tranNum').val(v.num);
        layer.open({ type: 1, title: '配送', content: $('#tranBox'), area: ['400px', 'auto'],
            btn: ['确定', '取消'], yes: function (idx) {
                app.post(api.quotation.tranSelectionItem, { 'selectionItems[0].siid': params_.siid, 'selectionItems[0].num': $('#tranNum').val() }, function () {
                    app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                });
            } });
    });
    reg('check', '审核', function (v) { return hasBtn('check'); }, function (v) {
        app.post(api.quotation.checkSelectionItem, { 'selectionItem.siid': v.siid }, function () { app.showAlert(app.info, '操作成功'); query(state.page); });
    });
    reg('confirm', '确认', function (v) { return hasBtn('confirm'); }, function (v) {
        app.post(api.quotation.confirmSelectionItem, { 'selectionItem.siid': v.siid }, function () { app.showAlert(app.info, '操作成功'); query(state.page); });
    });
    reg('finish', '完结', function (v) { return hasBtn('finish'); }, function (v) {
        app.showConfirm('是否完结该选材项?', function () {
            app.post(api.quotation.finishSelectionItem, { 'selectionItems[0].siid': v.siid, 'selectionItems[0].refnum': v.refnum }, function () { query(state.page); });
        });
    });
    reg('review', '核对', function (v) { return hasBtn('review'); }, function (v) {
        app.post(api.quotation.reviewSelectionItem, { 'selectionItems[0].siid': v.siid, 'selectionItems[0].refnum': v.refnum }, function () { query(state.page); });
    });
    reg('reject', '驳回', function (v) { return hasBtn('reject'); }, function (v) {
        app.post(api.quotation.rejectSelectionItem, { 'selectionItem.siid': v.siid }, function () { query(state.page); });
    });
    reg('balance', '对账', function (v) { return hasBtn('balance'); }, function (v) {
        app.post(api.quotation.balanceSelectionItem, { 'selectionItem.siid': v.siid }, function () { query(state.page); });
    });
    reg('refund', '退货', function (v) { return hasBtn('refund'); }, function (v) {
        params_.siid = v.siid; params_.num = v.num;
        $('#refnum').val(''); $('#utilitynum').val('');
        layer.open({ type: 1, title: '退货', content: $('#refundBox'), area: ['480px', 'auto'],
            btn: ['确定', '取消'], yes: function (idx) {
                if ($('#refnum').val() !== '' && $('#utilitynum').val() !== '') { app.showAlert(app.warning, '实用量与退货只可填写一项'); return; }
                if ($('#refnum').val() !== '' && parseFloat($('#refnum').val()) > parseFloat(params_.num)) { app.showAlert(app.warning, '退货不能大于当前数量'); return; }
                var refnum = $('#refnum').val() !== '' ? $('#refnum').val() : u.changeThrDecimal(u.accSub(params_.num, $('#utilitynum').val()));
                app.post(api.quotation.refundSelectionItem, { 'selectionItem.refnum': refnum, 'selectionItem.siid': params_.siid }, function () {
                    app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                });
            } });
    });
    reg('added', '补量', function (v) { return hasBtn('added'); }, function (v) {
        params_.siid = v.siid; params_.type = v.type;
        $('#added').val('');
        layer.open({ type: 1, title: '补量', content: $('#addedBox'), area: ['400px', 'auto'],
            btn: ['确定', '取消'], yes: function (idx) {
                if ($('#added').val() === '' || $('#added').val() == 0) { app.showAlert(app.warning, '请输入补量'); return; }
                var typeMap = { 0: 30, 1: 31, 2: 32, 3: 33, 4: 34, 13: 33, 14: 34, 23: 34 };
                var type = typeMap[params_.type] != null ? typeMap[params_.type] : 33;
                app.post(api.quotation.addedSelectionItem, { 'selectionItem.siid': params_.siid, 'selectionItem.num': $('#added').val(), 'selectionItem.type': type }, function () {
                    app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                });
            } });
    });
    reg('picture', '图片', function (v) { return hasBtn('picture'); }, function (v) { openPictures(v); });
    reg('supplier', '修改厂商', function (v) { return hasBtn('supplier'); }, function (v) { openSupplier(v); });
    reg('print', '打印', function (v) { return hasBtn('print'); }, function (v) {
        app.post(api.quotation.querySelectionByOrderId, { 'selection.orderId': v.decoration.orderId }, function (res) {
            app.params.quotation = $.extend({}, app.params.quotation, { orderId: v.decoration.orderId, selection: res.selection });
            app.popup(api.index.selectionOutputIndex.url, '选材单打印', null, { area: ['85%', '90%'] });
        });
    });
    reg('delete', '删除', function (v) { return hasBtn('delete'); }, function (v) {
        app.showConfirm('是否删除该选材项?', function () {
            app.post(api.quotation.deleteSelectionItem, { 'selectionItem.siid': v.siid, 'selection.total': 0, 'selection.quotationTotal': 0, 'selection.extensionAddTotal': 0, 'selection.extensionReduceTotal': 0, 'selection.addReduceAddTotal': 0, 'selection.addReduceMinusTotal': 0 }, function () { query(state.page); });
        });
    });
    function renderToolbar(sample) {
        var html = '';
        $.each(BTNS, function (i, b) { if (b.show(sample)) html += '<button class="layui-btn layui-btn-xs" lay-event="' + b.ev + '">' + b.name + '<\/button>'; });
        $('#rowToolbar').html(html);
    }
    table.on('tool(resultTable)', function (obj) {
        for (var i = 0; i < BTNS.length; i++) if (BTNS[i].ev === obj.event) { BTNS[i].handle(obj.data); return; }
    });

    // —— 图片 ——
    var curSiid = null;
    function openPictures(v) {
        curSiid = v.siid;
        renderPics([]);
        app.post(api.quotation.queryQuotationPicture, { 'quotationPicture.qid': v.siid, 'quotationPicture.atttype': 1 }, function (res) {
            renderPics(res.quotationPictures || []);
        });
        layer.open({ type: 1, title: '图片 - ' + (v.goods ? v.goods.name : v.siid), content: $('#picBox'), area: ['640px', '70%'] });
    }
    function renderPics(pics) {
        var html = '';
        $.each(pics, function (i, p) {
            html += '<div style="display:inline-block;margin:6px;position:relative;">'
                + '<img src="' + app.config.media + p.path + '" width="150" height="150" style="object-fit:cover;">'
                + '<button type="button" class="layui-btn layui-btn-xs layui-btn-danger" style="position:absolute;right:0;top:0;" data-pid="' + p.pid + '">删<\/button><\/div>';
        });
        $('#picList').html(html || '<p style="color:#999;">暂无图片</p>');
    }
    $('#picList').on('click', 'button[data-pid]', function () {
        var pid = $(this).data('pid');
        app.post(api.quotation.deleteQuotationPicture, { 'quotationPicture.pid': pid }, function () {
            app.showAlert(app.info, '删除成功');
            app.post(api.quotation.queryQuotationPicture, { 'quotationPicture.qid': curSiid, 'quotationPicture.atttype': 1 }, function (res) { renderPics(res.quotationPictures || []); });
        });
    });
    $('#btnAddPic').on('click', function () { $('#picFile').click(); });
    $('#picFile').on('change', function () {
        var file = this.files[0];
        if (!file) return;
        if (app.upload) {
            app.upload(file, { uploadType: 0 }, function (data) {
                if (data.errorCode == 0) {
                    app.post(api.quotation.addQuotationPicture, { 'quotationPicture.qid': curSiid, 'quotationPicture.atttype': 1, 'quotationPicture.path': data.resUrl }, function () {
                        app.showAlert(app.success, '上传成功');
                        app.post(api.quotation.queryQuotationPicture, { 'quotationPicture.qid': curSiid, 'quotationPicture.atttype': 1 }, function (res) { renderPics(res.quotationPictures || []); });
                    });
                } else app.showAlert(app.error, data.errorMsg || '上传失败');
            });
        } else app.showAlert(app.warning, '上传组件未加载');
        this.value = '';
    });

    // —— 修改厂商 ——
    function openSupplier(v) {
        params_.siid = v.siid;
        app.post(api.communion.queryBrandSupplier, { 'brand.bid': v.goods ? v.goods.bid : '' }, function (res) {
            app.bindData($('#supplierSelect'), res.userBases || res.users || [], 'uid', 'currentName', true);
            form.render('select');
            layer.open({ type: 1, title: '修改厂商', content: $('#supplierBox'), area: ['480px', 'auto'],
                btn: ['保存', '取消'], yes: function (idx) {
                    if (!$('#supplierSelect').val()) { app.showAlert(app.warning, '请选择厂商'); return; }
                    app.post(api.quotation.updateSelectionItemForSupplier, { 'selectionItem.siid': params_.siid, 'selectionItem.supplier.uid': $('#supplierSelect').val() }, function () {
                        app.showAlert(app.info, '操作成功'); layer.close(idx); query(state.page);
                    });
                } });
        });
    }

    // —— 批量结算 ——
    $('#btnBatchBalance').on('click', function () {
        var cks = table.checkStatus('resultTable');
        if (!cks.data.length) { app.showAlert(app.warning, '请勾选要结算的选材项'); return; }
        $('#balanceSales').val('');
        layer.open({ type: 1, title: '批量结算', content: $('#balanceBox'), area: ['480px', 'auto'],
            btn: ['提交', '取消'], yes: function (idx) {
                var bsid = $.trim($('#balanceSales').val());
                if (bsid === '') { app.showAlert(app.warning, '请填写结算单编号'); return; }
                var bsidCount = 0, balanceSelection = null;
                app.post(api.balance.countBalanceSelectionItem, { 'balanceSelection.bsid': bsid }, function (res) { bsidCount = res.count; }, null, false);
                if (bsidCount + cks.data.length > 500) { app.showAlert(app.warning, '数据量过大'); return; }
                app.post(api.balance.queryBalanceSelectionByBsid, { 'balanceSelection.bsid': bsid }, function (res) { balanceSelection = res.balanceSelection; }, null, false);
                if (!balanceSelection) { app.showAlert(app.warning, '结算单不存在'); return; }
                var postTotal = 0;
                var options = {};
                $.each(cks.data, function (i, v) {
                    postTotal = u.accAdd(postTotal, u.accMul(u.accSub(v.num, v.refnum), v.postprice));
                    options['balanceSelectionItems[' + i + '].selectionItem.siid'] = v.siid;
                });
                options['balanceSelection.bsid'] = bsid;
                options['balanceSelection.income'] = 0;
                options['balanceSelection.cost'] = u.accAdd(balanceSelection.cost, postTotal);
                options['balanceSelection.payment'] = u.accAdd(balanceSelection.payment, postTotal);
                options['balanceSelection.profit'] = 0;
                app.post(api.balance.submitBalanceSelection, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    });

    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
