/** app/js/contract/C-001-F-0-0001.js —— 厂商基装合同（合同模板页，personel 上下文）
 *  上下文：app.params.personel = { contractargs:{scid,cid,type}, uid, supplier? }（或 URL 查询参数 scid/cid/type/uid）。
 *  读取厂商合同（querySupplierContractById）/品牌（pageSupplierContractBrand）/产品（querySupplierContractProduct）/
 *  签章主体（pageSupplierSignet）/货品（pageSupplierContractGoods），产出 3 张表；保存走 makeSupplierContract。 */
app.ready(function () {
layui.use(['form', 'laydate', 'layer', 'jquery'], function () {
    var form = layui.form, layer = layui.layer, $ = layui.jquery;
    contractCommon.ensureApiStubs();
    var ctx = contractCommon.resolveCtx('personel');
    var args = ctx.contractargs || {};
    var scid = args.scid;
    var uid = ctx.uid;
    var supplier = ctx.supplier || {};

    var state = { no: null, brandNameList: '', goodNameList: '', concentionTem: '', specialTem: '', oemTem: '', table: [], current: new Date() };

    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    if (args.type == '1') $('.undispatch').hide();
    if (args.type != '1' && args.type != '2') $('.dispatch').hide();
    if (args.type == '2' || args.type == '3') $('.insure').hide();

    contractCommon.date(['con-term-start-date', 'con-term-end-date']);

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

    var table1 = { insertWay: 1, keyword: '厂商产品列表', pageBegin: 1, headers: ['品类', '品牌', '产品名称', '质保期'], colWidthPercent: [2, 2, 4, 2], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var table2 = { insertWay: 1, keyword: '超额服务费列表', pageBegin: 1, headers: ['品牌名称', '时间限期', '取档', '超额服务费'], colWidthPercent: [2, 2, 3, 3], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };
    var table3 = { insertWay: 1, keyword: '附件九乙方主体名单', pageBegin: 1, headers: ['公司名称', '法人', '纳税人识别号', '地址', '电话', '开户行', '账号'], colWidthPercent: [1, 1, 1, 2, 1, 2, 2], headersAlignment: 1, cellHorizontalAlignment: 0, cellVerticalAlignment: 5, datas: [] };

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

    if (supplierSignets && supplierSignets.length) {
        $.each(supplierSignets, function (i, v) {
            table3.datas.push([v.name, v.corporation, v.taxNo, v.address, v.phone, v.bankName, v.bankNo]);
        });
    }

    state.table.push(table1);
    state.table.push(table2);
    state.table.push(table3);

    // 保存
    $('#preservation').on('click', function () {
        if (app.validate('form')) return false;

        app.showConfirm('请仔细认真检查合同填写内容', function () {
            var data = $.extend({}, contractCommon.collect('#form'));

            var termStartDate = $('#con-term-start-date').val();
            var termEndDate = $('#con-term-end-date').val();

            data['con-tern-start-year'] = termStartDate.substr(0, 4);
            data['con-tern-start-month'] = termStartDate.substr(5, 2);
            data['con-tern-start-day'] = termStartDate.substr(8, 2);
            data['con-tern-end-year'] = termEndDate.substr(0, 4);
            data['con-tern-end-month'] = termEndDate.substr(5, 2);
            data['con-tern-end-day'] = termEndDate.substr(8, 2);

            data['con-special-product-service-fee'] = state.specialTem;
            data['con-exclusive-product-service-fee'] = state.oemTem;

            data['cov-company-name'] = data['con-company-name'];
            data['cov-company-name-11'] = data['con-company-name'];
            data['cov-company-name-12'] = data['con-company-name'];
            data['sin-company-name'] = data['con-company-name'];
            data['con-company-name-1'] = data['con-company-name'];
            data['con-company-name-2'] = data['con-company-name'];
            data['con-company-name-3'] = data['con-company-name'];
            data['con-company-name-4'] = data['con-company-name'];
            data['con-company-name-5'] = data['con-company-name'];
            data['con-company-name-11'] = data['con-company-name'];
            data['con-company-legal-11'] = data['con-company-legal'];
            data['con-company-phone-11'] = data['con-company-phone'];
            data['con-company-email-11'] = data['con-company-email'];
            data['con-company-addr-11'] = data['con-company-addr'];
            data['con-company-name-21'] = data['con-company-name'];
            data['con-company-addr-21'] = data['con-company-addr'];
            data['con-company-legal-21'] = data['con-company-legal'];
            data['con-company-phone-21'] = data['con-company-phone'];
            data['con-company-bank-name-21'] = data['con-company-bank-name'];
            data['con-company-bank-21'] = data['con-company-bank'];
            data['con-company-bank-no-21'] = data['con-company-bank-no'];
            data['con-company-abank-name-21'] = data['con-company-bank-name'];
            data['con-company-abank-21'] = data['con-company-bank'];
            data['con-company-abank-no-21'] = data['con-company-bank-no'];
            data['con-company-name-22'] = data['con-company-name'];

            data['cov-supplier-name'] = data['con-supplier-name'];
            data['cov-supplier-name-1'] = data['con-supplier-name'];
            data['cov-supplier-name-2'] = data['con-supplier-name'];
            data['sin-supplier-name'] = data['con-supplier-name'];
            data['con-supplier-addr1'] = data['con-supplier-addr'];
            data['con-supplier-phone1'] = data['con-supplier-phone'];
            data['con-supplier-name-11'] = data['con-supplier-name'];
            data['con-supplier-addr-11'] = data['con-supplier-addr'];
            data['con-supplier-legal-11'] = data['con-supplier-legal'];
            data['con-supplier-phone-11'] = data['con-supplier-phone'];
            data['con-supplier-email-11'] = data['con-supplier-email'];
            data['con-supplier-name-21'] = data['con-supplier-name'];
            data['con-supplier-addr-21'] = data['con-supplier-addr'];
            data['con-supplier-legal-21'] = data['con-supplier-legal'];
            data['con--supplier-phone-21'] = data['con-supplier-phone'];
            data['con-supplier-bank-name-21'] = data['con-supplier-bank-name'];
            data['con-supplier-bank-21'] = data['con-supplier-bank'];
            data['con-supplier-bank-no-21'] = data['con-supplier-bank-no'];
            data['con-supplier-name-22'] = data['con-supplier-name'];

            data['con-regular-product-service-fee'] = state.concentionTem;

            data['sin-company-addr'] = data['con-company-addr'];
            data['sin-company-legal'] = data['con-company-legal'];
            data['sin-company-phone'] = data['con-company-phone'];
            data['sin-communion-email'] = data['con-company-email'];
            data['sin-company-addr-11'] = data['con-company-addr'];
            data['sin-company-name-11'] = data['con-company-name'];
            data['sin-company-legal-11'] = data['con-company-legal'];
            data['sin-company-phone-11'] = data['con-company-phone'];
            data['sin-company-email-11'] = data['con-company-email'];
            data['sin-company-name-13'] = data['con-company-name'];
            data['sin-company-addr-13'] = data['con-company-addr'];
            data['sin-company-legal-13'] = data['con-company-legal'];
            data['sin-company-phone-13'] = data['con-company-phone'];
            data['sin-company-email-13'] = data['con-company-email'];

            data['sin-supplier-addr'] = data['con-supplier-addr'];
            data['sin-supplier-legal'] = data['con-supplier-legal'];
            data['sin-supplier-phone'] = data['con-supplier-phone'];
            data['sin-supplier-email'] = data['con-supplier-email'];
            data['sin-supplier-bank-no'] = data['con-supplier-bank-no'];
            data['sin-supplier-bank'] = data['con-supplier-bank'];
            data['sin-supplier-name-11'] = data['con-supplier-name'];
            data['sin-supplier-addr-11'] = data['con-supplier-addr'];
            data['sin-supplier-legal-11'] = data['con-supplier-legal'];
            data['sin-supplier-phone-11'] = data['con-supplier-phone'];
            data['sin-supplier-email-11'] = data['con-supplier-email'];
            data['sin-supplier-bank-no-11'] = data['con-supplier-bank-no'];
            data['sin-supplier-bank-11'] = data['con-supplier-bank'];
            data['sin-supplier-name-13'] = data['con-supplier-name'];
            data['sin-supplier-addr-13'] = data['con-supplier-addr'];
            data['sin-supplier-legal-13'] = data['con-supplier-legal'];
            data['sin-supplier-phone-13'] = data['con-supplier-phone'];
            data['sin-supplier-email-13'] = data['con-supplier-email'];
            data['sin-supplier-bank-no-13'] = data['con-supplier-bank-no'];
            data['sin-supplier-bank-13'] = data['con-supplier-bank'];

            data['con-cooperation-amount-undis-cn'] = contractCommon.getCNMoney(parseFloat(data['con-cooperation-amount-undis']));
            data['con-venue-rental-fee-cn'] = contractCommon.getCNMoney(parseFloat(data['con-venue-rental-fee']));

            data['con-brand-lists'] = state.brandNameList;
            data['con-brand-list-1'] = state.brandNameList;

            data['cov-contract-no'] = state.no;
            data['cov-contract-no-1'] = state.no;
            data['cov-contract-no-2'] = state.no;
            data['cov-contract-no-3'] = state.no;
            data['cov-contract-no-5'] = state.no;
            data['cov-contract-no-8'] = state.no;
            data['con-contract-no'] = state.no;
            data['con-contract-no-1'] = state.no;
            data['con-contract-no-2'] = state.no;
            data['con-contract-no-6'] = state.no;
            data['con-contract-no-8'] = state.no;

            data['con-regular-settlement-amount-1'] = data['con-regular-settlement-amount'];
            data['con-regular-product-service-fee1'] = data['con-regular-product-service-fee2'];
            data['con-regular-product-service-fee2'] = data['con-regular-product-service-fee2'];
            data['con-settlement-amount-1'] = data['con-settlement-amount'];
            data['con-experience-hall1-1'] = data['con-experience-hall-1'];
            data['con-experience-hall1-2'] = data['con-experience-hall-2'];
            data['con-experience-hall1-3'] = data['con-experience-hall-3'];
            data['con-experience-hall-sum-1'] = data['con-experience-hall-sum'];

            data['sin-company-time'] = year + '-' + month + '-' + day;
            data['sin-supplier-time'] = year + '-' + month + '-' + day;
            data['con-sign-date-year'] = year;
            data['con-sign-date-month'] = month;
            data['con-sign-date-day'] = day;
            data['con-sign-date-year-1'] = year;
            data['con-sign-date-month-1'] = month;
            data['con-sign-date-day-1'] = day;
            data['con-sign-date-year-2'] = year;
            data['con-sign-date-month-2'] = month;
            data['con-sign-date-day-2'] = day;
            data['con-sign-date-year-3'] = year;
            data['con-sign-date-month-3'] = month;
            data['con-sign-date-day-3'] = day;
            data['con-sign-date-year-4'] = year;
            data['con-sign-date-month-4'] = month;
            data['con-sign-date-day-4'] = day;
            data['con-sign-date-year-5'] = year;
            data['con-sign-date-month-5'] = month;
            data['con-sign-date-day-5'] = day;

            data['con-company-name-12'] = data['con-company-name'];
            data['con-company-addr-12'] = data['con-company-addr'];
            data['con-company-legal-12'] = data['con-company-legal'];
            data['con-company-phone-12'] = data['con-company-phone'];
            data['con-company-email-12'] = data['con-company-email'];
            data['con-supplier-name-12'] = data['con-supplier-name'];
            data['con-supplier-addr-12'] = data['con-supplier-addr'];
            data['con-supplier-legal-12'] = data['con-supplier-legal'];
            data['con-supplier-phone-12'] = data['con-supplier-phone'];
            data['con-supplier-email-12'] = data['con-supplier-email'];

            data['con-supplier-name-1'] = data['con-supplier-name'];
            data['con-supplier-name-2'] = data['con-supplier-name'];
            data['con-supplier-name-3'] = data['con-supplier-name'];
            data['con-supplier-name-4'] = data['con-supplier-name'];
            data['con-supplier-name-5'] = data['con-supplier-name'];
            data['con-brand-list-2'] = state.brandNameList;

            // 旧页两处同名"服务费备注"以后者（备注段）为准
            data['con-service-price-comment'] = data['con-service-price-comment-2'] != null ? data['con-service-price-comment-2'] : data['con-service-price-comment'];
            delete data['con-service-price-comment-2'];

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
