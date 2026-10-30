/** app/js/sales/salesBalance.js —— 销售结算单
 * type: bdompany|bsupplier|bpompany|allowance*|其他。决定接口与按钮显隐。
 * salesBalance.status: 0初始/1预结/2厂商结算/3平台结算/4已结算；
 * onetype: 0销售/1退货；deliverStatus/verifyStatus/confirmStatus 来自 ds。 */
app.ready(function () {
layui.use(['table', 'laypage', 'layer', 'upload', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, layer = layui.layer, upload = layui.upload, $ = layui.jquery;
    var pageType = (app.params.urlLoadParams && app.params.urlLoadParams.type) || '';
    var state = { page: 1, rows: 10, total: 0, editIndex: null, picIndex: null, curSbid: null };
    var listApi = api.sales.pageSalesBalance;
    if (pageType == 'bdompany') listApi = api.sales.pageSalesBalanceForDompany;
    else if (pageType == 'bsupplier') listApi = api.sales.pageSalesBalanceForSupplier;
    else if (pageType == 'bpompany') listApi = api.sales.pageSalesBalanceForPompany;
    else if (pageType.indexOf('allowance') != -1) listApi = api.sales.pageSalesBalanceForCheck;
    var STATUS = { 0: '初始', 1: '预结', 2: '厂商结算', 3: '平台结算', 4: '已结算' };
    var ONETYPE = { 0: '销售', 1: '退货' };
    initTable(); query(1);

    function initTable() {
        table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
            cols: [[ { type: 'numbers', title: '#', width: 60 },
                { field: 'sales', title: '销售单号', width: 140, templet: function (d) { return (d.sales && d.sales.no) || '-'; } },
                { field: 'orderId', title: '装修单号', width: 140, templet: function (d) { return (d.sales && d.sales.orderId) || '-'; } },
                { field: 'brand', title: '品牌', width: 130, templet: function (d) { return (d.sales && d.sales.brand && d.sales.brand.name) || '-'; } },
                { field: 'category', title: '品类', width: 110, templet: function (d) { return (d.sales && d.sales.category) || '-'; } },
                { field: 'onetype', title: '类型', width: 80, templet: function (d) { return ONETYPE[d.onetype] != null ? ONETYPE[d.onetype] : '-'; } },
                { field: 'balance', title: '结算额', width: 110, templet: function (d) { return app.formatMoney(d.balance); } },
                { field: 'difference', title: '差额', width: 100, templet: function (d) { return app.formatMoney(d.difference); } },
                { field: 'total', title: '总额', width: 110, templet: function (d) { return app.formatMoney(d.total); } },
                { field: 'allowance', title: '折让', width: 100, templet: function (d) { return app.formatMoney(d.allowance); } },
                { field: 'vbalance', title: '厂商结算', width: 110, templet: function (d) { return app.formatMoney(d.vbalance); } },
                { field: 'pbalance', title: '平台结算', width: 110, templet: function (d) { return app.formatMoney(d.pbalance); } },
                { field: 'coupon', title: '券', width: 90, templet: function (d) { return app.formatMoney(d.coupon); } },
                { field: 'rate', title: '系数', width: 90 },
                { field: 'status', title: '状态', width: 100, templet: function (d) { var s = STATUS[d.status] != null ? STATUS[d.status] : '-'; var c = d.status >= 4 ? 'layui-bg-green' : d.status == 0 ? 'layui-bg-gray' : 'layui-bg-blue'; return '<span class="layui-badge ' + c + '">' + s + '<\/span>'; } },
                { field: 'deliverStatus', title: '配送', width: 90 },
                { field: 'verifyStatus', title: '审核', width: 90 },
                { field: 'confirmStatus', title: '确认', width: 90 },
                { title: '操作', width: 360, toolbar: '#rowToolbar' } ]] });
        table.on('tool(resultTable)', function (obj) {
            var ev = obj.event, v = obj.data;
            if (ev === 'detail') openDetail(v);
            else if (ev === 'vbalance') openEdit(v, 'vbalance');
            else if (ev === 'pbalance') openEdit(v, 'pbalance');
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
    function openDetail(v) {
        app.params.sales = { salesBalance: { sbid: v.sbid }, sales: { sid: v.sales ? v.sales.sid : null } };
        app.popup('/views/sales/salesItem4balance.html', '明细 ' + (v.sales ? v.sales.no : ''), null, { area: ['90%', '80%'] });
    }
    function openEdit(v, field) {
        app.clearValidator();
        $('#editForm [name="sbid"]').val(v.sbid);
        $('#editForm [name="field"]').val(field);
        $('#editForm [name="value"]').val(v[field]);
        $('#fieldLabel').text(field == 'vbalance' ? '厂商结算额' : '平台结算额');
        state.editIndex = layer.open({ type: 1, title: (field == 'vbalance' ? '改厂商结算' : '改平台结算') + ' - ' + (v.sales ? v.sales.no : ''), content: $('#editBox'), area: ['480px', 'auto'] });
    }
    function doSave() {
        if (app.validate('editForm')) return;
        var sbid = $('#editForm [name="sbid"]').val(), field = $('#editForm [name="field"]').val(), val = $('#editForm [name="value"]').val();
        var a = field == 'vbalance' ? api.sales.updateSalesBalanceForVBalance : api.sales.updateSalesBalanceForPBalance;
        var opt = { 'salesBalance.sbid': sbid };
        opt['salesBalance.' + field] = val;
        app.post(a, opt, function () { app.showAlert(app.success, '保存成功'); layer.close(state.editIndex); state.editIndex = null; query(state.page); });
    }
    function openPic(v) {
        state.curSbid = v.sbid;
        $('#picSbid').val(v.sbid);
        loadPics(v.sbid);
        // 上传
        upload.render({ elem: '#btnUpload', url: cfg.server + 'common/uploadImg.do', accept: 'images', multiple: true, done: function (res) {
            if (res.resUrl) {
                app.post(api.sales.addSalesPicture, {
                    'salesPicture.sid': v.sales ? v.sales.sid : '',
                    'salesPicture.siid': v.sbid,
                    'salesPicture.name': res.strutsUploadsFileName || 'img',
                    'salesPicture.path': res.resUrl,
                    'salesPicture.type': 3,
                    'salesPicture.filesize': res.filesize || 0
                }, function (r) { loadPics(v.sbid); });
            }
        } });
        state.picIndex = layer.open({ type: 1, title: '图片 - ' + (v.sales ? v.sales.no : ''), content: $('#picBox'), area: ['700px', '60%'] });
    }
    function loadPics(sbid) {
        app.post(api.sales.querySalesPicture, { 'salesPicture.siid': sbid }, function (res) {
            var html = '';
            $.each(res.salesPictures || [], function (i, p) {
                html += '<div style="position:relative;width:120px;"><img src="' + (cfg.media + p.path) + '" style="width:120px;height:120px;object-fit:cover;border:1px solid #eee;"><button class="layui-btn layui-btn-xs layui-btn-danger pic-del" data-spid="' + p.spid + '" style="position:absolute;top:2px;right:2px;padding:0 6px;">X</button></div>';
            });
            $('#gallery').html(html || '<span class="layui-badge layui-bg-gray">无图片</span>');
            $('.pic-del').on('click', function () {
                var spid = $(this).attr('data-spid');
                app.post(api.sales.deleteSalesPicture, { 'salesPicture.spid': spid }, function () { loadPics(sbid); });
            });
        });
    }
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); query(1); });
    $('#btnSave').on('click', doSave);
    $('#btnCancel').on('click', function () { layer.close(state.editIndex); state.editIndex = null; });
});
}); // end app.ready
