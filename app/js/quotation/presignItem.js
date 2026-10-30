/** app/js/quotation/presignItem.js —— 预签项
 *  默认（产品弹窗）：pagePresignItem + presignItem.ppid，创建 add/updatePresignItem，状态 updatePresignItemForStatus。
 *  ?pageType=presignItem：pagePresignItemByPpid（带产品列）。
 *  上下文：app.params.data.presignProduce。 */
app.ready(function () {
layui.use(['table', 'laypage', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, laypage = layui.laypage, form = layui.form, layer = layui.layer, $ = layui.jquery;
    quotationCommon.ensureApiStubs();
    var qc = quotationCommon;
    var E = quotationCommon.ENUM;
    var dctx = qc.ctx('data') || {};
    var presignProduce = dctx.presignProduce || {};
    var urlLoad = qc.ctx('urlLoadParams') || {};
    var pageType = urlLoad.pageType;
    var state = { page: 1, rows: 10, total: 0, piid: null };

    var cols = [[ { type: 'numbers', title: '#', width: 50 },
        { field: 'name', title: '名称', width: 140, fixed: 'left' },
        { field: 'status', title: '状态', width: 80, templet: function (d) { return qc.badge(E.presignItemType == null ? { 0: '启用', 1: '禁用' } : { 0: '启用', 1: '禁用' }, d.status); } },
        { field: 'cost', title: '成本', width: 90, templet: function (d) { return qc.money(d.cost); } },
        { field: 'price', title: '价格', width: 90, templet: function (d) { return qc.money(d.price); } },
        { field: 'addPrice', title: '增补价', width: 90, templet: function (d) { return qc.money(d.addPrice); } },
        { field: 'subPrice', title: '退减价', width: 90, templet: function (d) { return qc.money(d.subPrice); } },
        { field: 'areaCale', title: '面积规则', width: 90, templet: function (d) { return E.presignItemAreaCale[d.areaCale] != null ? E.presignItemAreaCale[d.areaCale] : d.areaCale; } },
        { field: 'basicNum', title: '基础量', width: 80, templet: function (d) { return qc.money(d.basicNum); } },
        { field: 'type', title: '类型', width: 80, templet: function (d) { return E.presignItemType[d.type] != null ? E.presignItemType[d.type] : d.type; } },
        { field: 'onetype', title: '一类', width: 80, templet: function (d) { return E.protationItemOneType[d.onetype] != null ? E.protationItemOneType[d.onetype] : d.onetype; } },
        { field: 'atttype', title: '业务类型', width: 90, templet: function (d) { return { 0: '通用', 1: '工程', 2: '主材' }[d.atttype] != null ? { 0: '通用', 1: '工程', 2: '主材' }[d.atttype] : d.atttype; } },
        { field: 'content', title: '说明', minWidth: 130 },
        { title: '操作', width: 160, toolbar: '#rowToolbar', fixed: 'right' } ]];
    if (pageType == 'presignItem') {
        // 前插产品信息列
        var head = [
            { field: 'presignProduce', title: '产品名称', width: 130, templet: function (d) { return d.presignProduce ? d.presignProduce.name : ''; } },
            { field: 'produceQuote', title: '起报价', width: 90, templet: function (d) { return d.presignProduce ? qc.money(d.presignProduce.quotePrice) : ''; } },
            { field: 'produceDiscount', title: '折扣', width: 70, templet: function (d) { return d.presignProduce ? d.presignProduce.discount : ''; } },
            { field: 'produceManageRate', title: '管理费比例', width: 95, templet: function (d) { return d.presignProduce ? d.presignProduce.manageRate : ''; } },
            { field: 'produceCostPrice', title: '成本单价', width: 90, templet: function (d) { return d.presignProduce ? qc.money(d.presignProduce.costPrice) : ''; } },
            { field: 'produceMostPrice', title: '主材成本', width: 90, templet: function (d) { return d.presignProduce ? qc.money(d.presignProduce.mostPrice) : ''; } },
            { field: 'produceProfitRate', title: '利润率', width: 80, templet: function (d) { return d.presignProduce ? d.presignProduce.profitRate : ''; } },
            { field: 'produceCostRate', title: '工程增项成本比例', width: 130, templet: function (d) { return d.presignProduce ? d.presignProduce.costRate : ''; } },
            { field: 'produceMostRate', title: '主材增项成本比例', width: 130, templet: function (d) { return d.presignProduce ? d.presignProduce.mostRate : ''; } },
            { field: 'produceStatus', title: '产品状态', width: 90, templet: function (d) { return d.presignProduce ? qc.badge({ 0: '初始', 1: '发布' }, d.presignProduce.status) : ''; } }
        ];
        cols = [head.concat(cols[0].slice(1))];
        $('#addArea').hide();
    }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true, cols: cols });

    function query(pg) {
        state.page = pg || 1;
        var apiObj = pageType == 'presignItem' ? api.quotation.pagePresignItemByPpid : api.quotation.pagePresignItem;
        var extra = pageType == 'presignItem' ? {} : { 'presignItem.ppid': presignProduce.ppid };
        app.post(apiObj, $.extend({}, extra, qc.buildFilters($('#searchForm')), { 'paging.page': state.page, 'paging.rows': state.rows }), function (res) {
            var p = res.paging || {};
            table.reload('resultTable', { data: p.data || [] });
            state.total = p.totalRecords || 0;
            rpg();
        });
    }
    function rpg() { laypage.render({ elem: 'pagenation', count: state.total, curr: state.page, limit: state.rows, limits: [10, 30, 100], layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'], jump: function (o, f) { state.rows = o.limit; if (!f) query(o.curr); } }); }

    function openEdit(v) {
        state.piid = v ? v.piid : null;
        $('#editBox form')[0].reset();
        if (v) {
            $('#name').val(v.name); $('#basicNum').val(v.basicNum); $('#cost').val(v.cost); $('#price').val(v.price);
            $('#addPrice').val(v.addPrice); $('#subPrice').val(v.subPrice);
            $('#type').val(v.type); $('#onetype').val(v.onetype); $('#atttype').val(v.atttype);
            $('#content').val(v.content);
            $('input[name="areaCale"][value="' + v.areaCale + '"]').prop('checked', true);
        } else {
            $('input[name="areaCale"][value="0"]').prop('checked', true);
        }
        form.render(null, 'editForm');
        layer.open({ type: 1, title: state.piid ? '编辑预签项' : '创建预签项', content: $('#editBox'), area: ['600px', '80%'],
            btn: ['保存', '取消'], yes: function (idx) {
                if (!$.trim($('#name').val())) { app.showAlert(app.warning, '请填写名称'); return; }
                var url = api.quotation.addPresignItem;
                var options = {
                    'presignItem.ppid': presignProduce.ppid,
                    'presignItem.name': $('#name').val(),
                    'presignItem.basicNum': $('#basicNum').val(),
                    'presignItem.cost': $('#cost').val(),
                    'presignItem.price': $('#price').val(),
                    'presignItem.addPrice': $('#addPrice').val(),
                    'presignItem.subPrice': $('#subPrice').val(),
                    'presignItem.type': $('#type').val(),
                    'presignItem.onetype': $('#onetype').val(),
                    'presignItem.content': $('#content').val(),
                    'presignItem.atttype': $('#atttype').val(),
                    'presignItem.areaCale': $('input[name="areaCale"]:checked').val() != null ? $('input[name="areaCale"]:checked').val() : 0
                };
                if (state.piid) { url = api.quotation.updatePresignItem; options['presignItem.piid'] = state.piid; }
                app.post(url, options, function () {
                    app.showAlert(app.info, '操作成功');
                    layer.close(idx); query(state.page);
                });
            } });
    }

    table.on('tool(resultTable)', function (obj) {
        var v = obj.data;
        if (obj.event === 'edit') openEdit(v);
        else if (obj.event === 'status') {
            app.post(api.quotation.updatePresignItemForStatus, { 'presignItem.piid': v.piid, 'presignItem.status': v.status == 0 ? 1 : 0 }, function () { query(state.page); });
        }
    });

    $('#btnAdd').on('click', function () { openEdit(null); });
    $('#btnSearch').on('click', function () { query(1); });
    $('#btnReset').on('click', function () { $('#searchForm')[0].reset(); form.render('select'); query(1); });
    query(1);
});
}); // end app.ready
