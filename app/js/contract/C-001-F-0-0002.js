/** app/js/contract/C-001-F-0-0002.js —— 厂商采购合同（合同模板页，personel 上下文）
 *  上下文：app.params.personel = { contractargs:{scid,cid}, uid, supplier:{currentName,phone} }。
 *  读取厂商合同/品牌/产品/签章/货品，产出 产品质量保证/年度返利/产品采购价 3 张表；
 *  保存走 makeSupplierContract。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var E = contractCommon.ENUM;
    var ctx = contractCommon.resolveCtx('personel');
    var args = ctx.contractargs || {};
    var scid = args.scid;
    var uid = ctx.uid;
    var supplier = ctx.supplier || {};

    var state = { no: null, brandNameList: '', goodNameList: '', concentionTem: '', specialTem: '', oemTem: '', table: [], current: new Date() };

    contractCommon.date(['con-term-start-date', 'con-term-end-date']);

    // 下拉（对齐 constant.personel().contract.*）
    app.bindData($('#con-product-model'), E.supplierProductModel);
    app.bindData($('#con-ordering-method'), E.supplierOrderingMethod);
    app.bindData($('#con-delivery-mode'), E.supplierDeliveryMode);
    app.bindData($('#con-installation-mode'), E.supplierInstallationMode);
    app.bindData($('#con-payment-method'), E.supplierPaymentMethod);
    form.render('select');

    state.cover = {};
    state.cover['con-sign-date-year'] = app.dateFormat(state.current, 'yyyy');
    state.cover['con-sign-date-month'] = app.dateFormat(state.current, 'MM');
    state.cover['con-sign-date-day'] = app.dateFormat(state.current, 'dd');
    state.cover['con-sign-date-year-1'] = app.dateFormat(state.current, 'yyyy');
    state.cover['con-sign-date-month-1'] = app.dateFormat(state.current, 'MM');
    state.cover['con-sign-date-day-1'] = app.dateFormat(state.current, 'dd');
    state.cover['con-sign-date-month-2'] = app.dateFormat(state.current, 'MM');
    state.cover['con-sign-date-day-2'] = app.dateFormat(state.current, 'dd');
    state.cover['con-sign-date-month-3'] = app.dateFormat(state.current, 'MM');
    state.cover['con-sign-date-day-3'] = app.dateFormat(state.current, 'dd');

    $('#con-supplier-name').val(supplier.currentName);
    $('#con-supplier-phone').val(supplier.phone);

    // 厂商合同
    var supplierContract = {};
    app.post(api.personel.querySupplierContractById, { 'supplierContract.scid': scid }, function (res) {
        supplierContract = res.supplierContract || {};
        state.no = supplierContract.no;
    }, null, false);

    // 厂商品牌
    var supplierContractBrands = [];
    app.post(api.personel.pageSupplierContractBrand, { 'paging.page': 1, 'paging.rows': 10, 'supplierContractBrand.scid': scid }, function (res) {
        supplierContractBrands = (res.paging && res.paging.data) || [];
    }, null, false);

    // 厂商产品
    var supplierContractProduct = [];
    app.post(api.personel.querySupplierContractProduct, { 'supplierContractProduct.scid': scid }, function (res) {
        supplierContractProduct = res.supplierContractProducts || [];
    }, null, false);

    // 签章主体
    var supplierSignets = [];
    app.post(api.data.pageSupplierSignet, { 'paging.page': 1, 'paging.rows': 10, 'signet.suid': uid }, function (res) {
        supplierSignets = (res.paging && res.paging.data) || [];
    }, null, false);

    // 厂商货品
    var supplierContractGoods = [];
    app.post(api.personel.pageSupplierContractGoods, { 'paging.page': 1, 'paging.rows': 10, 'supplierContractGoods.scid': scid }, function (res) {
        supplierContractGoods = (res.paging && res.paging.data) || [];
    }, null, false);

    var table1 = { insertWay: 1, keyword: '产品质量保证明细表', pageBegin: 1, headers: ['品类', '品牌', '产品名称', '质保期'], colWidthPercent: [2, 2, 4, 2], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var table2 = { insertWay: 1, keyword: '年度返利明细表', pageBegin: 1, headers: ['品牌名称', '时间限期', '取档', '超额服务费'], colWidthPercent: [2, 2, 3, 3], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var table3 = { insertWay: 1, keyword: '产品采购价明细表', pageBegin: 1, headers: ['序号', '品牌', '名称', '型号', '规格', '采购单位', '采购价(不含税)', '税率', '税额', '采购价(含税)'], colWidthPercent: [1, 2, 2, 2, 2, 3, 2, 2, 2, 2], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };

    if (supplierContractBrands && supplierContractBrands.length) {
        $.each(supplierContractBrands, function (i, v) {
            if (v.name != null) {
                if (i > 0) state.goodNameList += ',';
                state.goodNameList += v.name;
            }
            state.brandNameList += v.brand.name;
            if (v.supplierContractCategorys && v.supplierContractCategorys.length) {
                var mySet = {};
                $.each(v.supplierContractCategorys, function (t, item) {
                    if (item.ctype === 2) state.concentionTem += item.name + ' ' + item.cvalue + '%' + '  ';
                    if (item.ctype === 3) state.specialTem += item.name + ' ' + item.cvalue + '%' + '  ';
                    if (item.ctype === 4) state.oemTem += item.name + ' ' + item.cvalue + '%' + '  ';
                    if (t == 0) state.brandNameList += '(';
                    if (!mySet[item.name]) {
                        state.brandNameList += item.name;
                        mySet[item.name] = true;
                        if (t != v.supplierContractCategorys.length - 1) state.brandNameList += '  ';
                    }
                    if (t == v.supplierContractCategorys.length - 1) state.brandNameList += ')';
                });
            }
            if (i != supplierContractBrands.length - 1) state.brandNameList += ',';
        });
    }

    if (supplierContractProduct && supplierContractProduct.length) {
        $.each(supplierContractProduct, function (i, v) {
            table1.datas.push([v.category, v.brand, v.name, v.warranTime]);
        });
    }

    var service = [];
    if (supplierContractBrands && supplierContractBrands.length) {
        $.each(supplierContractBrands, function (i, v) {
            if (v.servicePrice == null || v.servicePrice === '') return true;
            var servicePrices = JSON.parse(v.servicePrice);
            $.each(servicePrices, function (ii, t) {
                if (t.UV != 0 && t.DV == 0) {
                    service.push({ name: v.brand.name, time: t.TL, sale: '销售总金额' + t.UV + '万元（含）以下', money: '对应应结款总额的' + t.SR + '%；' });
                }
                if (t.DV != 0 && t.UV == 0) {
                    service.push({ name: v.brand.name, time: t.TL, sale: '销售总金额' + t.DV + '万元以上', money: '对应应结款总额的' + t.SR + '%；' });
                }
                if (t.UV != 0 && t.DV != 0) {
                    service.push({ name: v.brand.name, time: t.TL, sale: '销售总金额' + t.DV + '万元-' + t.UV + '万元（含）', money: '对应应结款总额的' + t.SR + '%；' });
                }
            });
        });
        var result = [];
        if (service && service.length > 0) {
            $.each(service, function (index, item) {
                var found = false;
                $.each(result, function (i, r) {
                    if (r.sale === item.sale) {
                        r.name += ',' + item.name;
                        found = true;
                        return false;
                    }
                });
                if (!found) result.push($.extend({}, item));
            });
        }
        $.each(result, function (index, item) {
            table2.datas.push([item.name, item.time, item.sale, item.money]);
        });
    }

    var goodsIndex = 0;
    if (supplierContractGoods && supplierContractGoods.length != 0) {
        $.each(supplierContractGoods, function (i, v) {
            var g = v.goods || {};
            table3.datas.push([goodsIndex++, g.brand, g.name, g.model, g.format, g.measurementUnit, '', '', '', '']);
        });
    }

    state.table.push(table1);
    state.table.push(table2);
    state.table.push(table3);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'), state.cover);

            var termStartDate = $('#con-term-start-date').val();
            var termEndDate = $('#con-term-end-date').val();

            data['con-tern-start-year'] = termStartDate.substr(0, 4);
            data['con-tern-start-month'] = termStartDate.substr(5, 2);
            data['con-tern-start-day'] = termStartDate.substr(8, 2);
            data['con-tern-end-year'] = termEndDate.substr(0, 4);
            data['con-tern-end-month'] = termEndDate.substr(5, 2);
            data['con-tern-end-day'] = termEndDate.substr(8, 2);

            data['cov-supplier-name'] = data['con-supplier-name'];
            data['cov-company-name'] = data['con-company-name'];
            data['con-company-name-2'] = data['con-company-name'];
            data['con-company-legal-2'] = data['con-company-legal-1'];

            data['con-management-fee-cn'] = contractCommon.getCNMoney(parseFloat(data['con-management-fee']));
            data['con-marketing-expenses-cn'] = contractCommon.getCNMoney(parseFloat(data['con-marketing-expenses']));

            var options = {
                'supplierContract.scid': scid,
                'data': JSON.stringify(data),
                'table': JSON.stringify(state.table)
            };

            var loader = app.showLoading('合同生成中...', { shade: 0.3 });
            app.post(api.personel.makeSupplierContract, options, function () {
                app.hideLoading(loader);
                app.showAlert(app.success, '操作成功');
                contractCommon.closeSelfPopup();
            }, function (res) {
                app.hideLoading(loader);
                app.showAlert(app.error, (res && res.errorMsg) || '操作失败');
            });
        });
    });

    $('#btnClose').on('click', function () { contractCommon.closeSelfPopup(); });
});
}); // end app.ready
