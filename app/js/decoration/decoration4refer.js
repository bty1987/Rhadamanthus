/** app/js/decoration/decoration4refer.js —— 装修单推荐
 *  列表：queryDecorationForReferByOrderId（本单的推荐/被推荐关系）；补录：referDecorationInfo；
 *  四个字段失焦自动匹配：单号→queryDecorationForCommonByOrderId；电话→pageDecorationForCustomer；
 *  楼盘+楼号→queryHouseByNoAHnum + checkDecoration。 */
app.ready(function () {
layui.use(['table', 'form', 'layer', 'jquery'], function () {
    var table = layui.table, form = layui.form, layer = layui.layer, $ = layui.jquery;
    decorationCommon.ensureApiStubs();
    var E = decorationCommon.ENUM;
    var ctx = app.params.decoration || {};
    var orderId = ctx.orderId;
    var editIndex = null;
    var matched = null;   // 已匹配的推荐单号

    if (!orderId) { app.showAlert(app.warning, '缺少订单上下文'); }

    table.render({ elem: '#resultTable', data: [], page: false, limit: 1000, even: true,
        cols: [[ { type: 'numbers', title: '#', width: 60 },
            { field: 'orderId', title: '装修单号', width: 180, templet: function (d) { return d.orderId + (d.referType == 1 ? ' (推荐)' : ' (被推荐)'); } },
            { field: 'customer', title: '客户名', width: 100, templet: function (d) { return (d.customer && d.customer.name) || ''; } },
            { field: 'address', title: '楼盘地址', minWidth: 220, templet: function (d) { var v = d.house ? (d.house.village || {}) : {}; return ((v.cityProper && v.cityProper.city ? v.cityProper.city.name : '') + ' ' + (v.cityProper ? v.cityProper.name : '') + ' ' + v.name + ' ' + (d.house ? d.house.houseNumber : '')); } },
            { field: 'designDept', title: '设计部', width: 130, templet: function (d) { return (d.designer && d.designer.dept && d.designer.dept.name) || ''; } },
            { field: 'designer', title: '设计师', width: 100, templet: function (d) { return (d.designer && d.designer.currentName) || ''; } },
            { field: 'salesDept', title: '业务部', width: 130, templet: function (d) { return (d.salesman && d.salesman.dept && d.salesman.dept.name) || ''; } },
            { field: 'salesman', title: '业务员', width: 100, templet: function (d) { return (d.salesman && d.salesman.currentName) || ''; } },
            { field: 'innerArea', title: '面积', width: 90 },
            { field: 'discount', title: '折扣', width: 80, templet: function (d) { return d.discount != null ? d.discount : 10; } },
            { field: 'precontractPrice', title: '预签额', width: 100, templet: function (d) { return app.formatMoney(d.precontractPrice); } },
            { field: 'orderTotalPrice', title: '签单额', width: 100, templet: function (d) { return app.formatMoney(d.orderTotalPrice); } },
            { field: 'quotationPrice', title: '报价额', width: 100, templet: function (d) { return app.formatMoney(d.quotationPrice); } },
            { field: 'couponCut', title: '券优惠', width: 90, templet: function (d) { return app.formatMoney(d.couponCut); } },
            { field: 'factPrice', title: '实收额', width: 100, templet: function (d) { return app.formatMoney(d.factPrice); } },
            { field: 'createTime', title: '创建时间', width: 170, templet: function (d) { return app.dateFormat(d.createTime); } },
            { field: 'measureTime', title: '量房时间', width: 170, templet: function (d) { return app.dateFormat(d.measureTime); } },
            { field: 'depositTime', title: '定金时间', width: 170, templet: function (d) { return app.dateFormat(d.depositTime); } },
            { field: 'precontractTime', title: '预签时间', width: 170, templet: function (d) { return app.dateFormat(d.precontractTime); } },
            { field: 'contractTime', title: '签单时间', width: 170, templet: function (d) { return app.dateFormat(d.contractTime); } },
            { field: 'status', title: '状态', width: 90, templet: function (d) { return decorationCommon.badge(E.status, d.status); } },
            { title: '操作', width: 100, toolbar: '#rowToolbar', fixed: 'right' } ]] });

    table.on('tool(resultTable)', function (obj) {
        if (obj.event === 'del') {
            app.showConfirm('确认删除该推荐关系?', function () {
                app.post(api.decoration.deleteReferDecorationInfo, { 'decoration.orderId': orderId, 'decorationInfo.referOrderId': obj.data.orderId }, function () {
                    app.showAlert(app.success, '删除成功'); query();
                });
            });
        }
    });

    function query() {
        app.post(api.decoration.queryDecorationForReferByOrderId, { 'decoration.orderId': orderId }, function (res) {
            table.reload('resultTable', { data: res.decorations || [] });
        });
    }
    query();

    // —— 补录弹窗：四字段失焦自动匹配 ——
    function fillDecoration(d) {
        if (!d || !d.orderId) return;
        $('#referOrderId').val(d.orderId);
        if (d.customer && d.customer.phone) {
            $('#referPhone').val((d.status == 3 || d.status == 7) ? (d.customer.phone.substring(0, 3) + '******' + d.customer.phone.substring(9)) : '客户电话');
        }
        if (d.house) {
            $('#referVillage').val(d.house.village ? d.house.village.name : '');
            $('#referHouseNumber').val(d.house.houseNumber || '');
        }
        $('#referContractTime').val(d.precontractTime || d.contractTime || '');
        matched = d.orderId;
    }

    $('#referOrderId').on('blur', function () {
        var v = $.trim($(this).val());
        if (!v) return;
        app.post(api.decoration.queryDecorationForCommonByOrderId, { 'decoration.orderId': v }, function (res) {
            fillDecoration(res.decoration);
        }, function () { app.showAlert(app.error, '推荐装修单不存在'); });
    });

    $('#referPhone').on('blur', function () {
        var v = $.trim($(this).val());
        if (!v) return;
        matched = null;
        app.post(api.decoration.pageDecorationForCustomer, { 'customerPhone': v, 'paging.page': 1, 'paging.rows': 10 }, function (res) {
            var p = res.paging || {};
            if (!p.totalRecords) { app.showAlert(app.error, '推荐装修单不存在'); return; }
            fillDecoration((p.data || [])[0]);
        }, function () { app.showAlert(app.error, '推荐装修单不存在'); });
    });

    function matchByVillageHouse() {
        var village = $.trim($('#referVillage').val());
        var houseNumber = $.trim($('#referHouseNumber').val());
        if (!village || !houseNumber) return;
        matched = null;
        app.post(api.data.queryHouseByNoAHnum, { 'house.village.no': village, 'house.houseNumber': houseNumber, 'house.status': 0 }, function (res) {
            var house = res.house;
            if (!house) return;
            app.post(api.decoration.checkDecoration, { 'decoration.house.hid': house.hid }, function (r) {
                fillDecoration(r.decoration);
            }, function () { app.showAlert(app.error, '推荐装修单不存在'); });
        });
    }
    $('#referVillage').on('blur', matchByVillageHouse);
    $('#referHouseNumber').on('blur', matchByVillageHouse);

    $('#btnSupplement').on('click', function () {
        $('#editForm')[0].reset();
        matched = null;
        editIndex = layer.open({ type: 1, title: '补录推荐 - ' + (orderId || ''), content: $('#editBox'), area: ['520px', 'auto'],
            btn: ['提交', '取消'], yes: function () {
                var referId = $.trim($('#referOrderId').val());
                if (!referId) { app.showAlert(app.warning, '请输入或匹配推荐装修单号'); return; }
                app.post(api.decoration.referDecorationInfo, { 'decoration.orderId': orderId, 'decorationInfo.referOrderId': referId }, function () {
                    app.showAlert(app.success, '操作成功');
                    layer.close(editIndex); editIndex = null; query();
                });
            } });
    });

    $('#btnBack').on('click', function () { app.switchPage(app.params.historyPage || api.index.decorationIndex.url); });
});
}); // end app.ready
