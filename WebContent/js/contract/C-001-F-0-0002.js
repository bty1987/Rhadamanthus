/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材) P (人事) F (厂商)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 厂商基装合同
 */

jQuery(function($) {

    var contractEdit = {

        cover: {},
        table: [],
        modal: {},

        item: {
            productModel: com.focusPage("#con-product-model"),
            orderingMethod: com.focusPage("#con-ordering-method"),
            deliveryMode: com.focusPage("#con-delivery-mode"),
            installationMode: com.focusPage("#con-installation-mode"),
            paymentMethod: com.focusPage("#con-payment-method")
        },

        contractArgs: params.personel.contractargs,
        supplier: params.personel.supplier,
        uid: params.personel.uid,
        ucid: params.ucid,
        scid: null,
        no: null,
        brandNameList: "",
        goodNameList: "",
        concentionTem: "",
        specialTem: "",
        oemTem: "",
        current: new Date(),
    };

    com.datetime(com.focusPage("#con-term-start-date"));
    com.datetime(com.focusPage("#con-term-end-date"));

    contractEdit.item.productModel.bindData(constant.personel().contract.productModel.datas, 'key', 'value');
    contractEdit.item.orderingMethod.bindData(constant.personel().contract.orderingMethod.datas, 'key', 'value');
    contractEdit.item.deliveryMode.bindData(constant.personel().contract.deliveryMode.datas, 'key', 'value');
    contractEdit.item.installationMode.bindData(constant.personel().contract.installationMode.datas, 'key', 'value');
    contractEdit.item.paymentMethod.bindData(constant.personel().contract.paymentMethod.datas, 'key', 'value');

    contractEdit.cover["con-sign-date-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["con-sign-date-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["con-sign-date-day"] = com.dateFormat(contractEdit.current, "dd");

    contractEdit.cover["con-sign-date-year-1"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["con-sign-date-month-1"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["con-sign-date-day-1"] = com.dateFormat(contractEdit.current, "dd");

    contractEdit.cover["con-sign-date-month-2"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["con-sign-date-day-2"] = com.dateFormat(contractEdit.current, "dd");

    contractEdit.cover["con-sign-date-month-3"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["con-sign-date-day-3"] = com.dateFormat(contractEdit.current, "dd");

    com.focusPage("#con-supplier-name", "#form").val(contractEdit.supplier.currentName);
    com.focusPage("#con-supplier-phone", "#form").val(contractEdit.supplier.phone);

    var supplierContract = [];

    com.post(api.personel.querySupplierContractById, {

        "supplierContract.scid": params.personel.contractargs.scid
    }, function(res) {

        supplierContract = res.supplierContract;
        contractEdit.no = supplierContract.no;
    }, null, false);

    var supplierContractBrands = [];

    com.post(api.personel.pageSupplierContractBrand, {
        "paging.page": 1,
        "paging.rows": 10,
        "supplierContractBrand.scid": params.personel.contractargs.scid
    }, function(res) {

        supplierContractBrands = res.paging.data;
    }, null, false);

    var supplierContractProduct = [];
    com.post(api.personel.querySupplierContractProduct, {
        "supplierContractProduct.scid": params.personel.contractargs.scid
    }, function(res) {

        supplierContractProduct = res.supplierContractProducts;
    }, null, false);

    var supplierSignets = [];
    com.post(api.data.pageSupplierSignet, {
        "paging.page": 1,
        "paging.rows": 10,
        "signet.suid": contractEdit.uid
    }, function(res) {

        supplierSignets = res.paging.data;
    }, null, false);

    var supplierContractGoods = [];
    com.post(api.personel.pageSupplierContractGoods, {
        "paging.page": 1,
        "paging.rows": 10,
        "supplierContractGoods.scid": params.personel.contractargs.scid

    }, function(res) {

        supplierContractGoods = res.paging.data;
    }, null, false);

    var table1 = {
        "insertWay": 1,
        "keyword": "产品质量保证明细表",
        "pageBegin": 1,
        "headers": ["品类", "品牌", "产品名称", "质保期"],
        "colWidthPercent": [2, 2, 4, 2],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };

    var table2 = {
        "insertWay": 1,
        "keyword": "年度返利明细表",
        "pageBegin": 1,
        "headers": ["品牌名称", "时间限期", "取档", "超额服务费"],
        "colWidthPercent": [2, 2, 3, 3],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };

    var table3 = {
        "insertWay": 1,
        "keyword": "产品采购价明细表",
        "pageBegin": 1,
        "headers": ["序号", "品牌", "名称", "型号", "规格", "采购单位", "采购价(不含税)", "税率", "税额", "采购价(含税)"],
        "colWidthPercent": [1, 2, 2, 2, 2, 3, 2, 2, 2, 2],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };

    var index = 0;

    if (supplierContractBrands && supplierContractBrands.length) {

        $.each(supplierContractBrands, function(i, v) {

            if (v.name != null) {
                if (i > 0) {
                    contractEdit.goodNameList += ',';
                }
                contractEdit.goodNameList += v.name;
            }

            contractEdit.brandNameList += v.brand.name;

            if (v.supplierContractCategorys && v.supplierContractCategorys.length) {
                var mySet = new Set();
                $.each(v.supplierContractCategorys, function(t, item) {

                    if (item.ctype === 2) {
                        contractEdit.concentionTem += item.name + " " + item.cvalue + "%" + "  ";
                    }
                    if (item.ctype === 3) {
                        contractEdit.specialTem += item.name + " " + item.cvalue + "%" + "  ";
                    }
                    if (item.ctype === 4) {
                        contractEdit.oemTem += item.name + " " + item.cvalue + "%" + "  ";
                    }
                    if (t == 0) {
                        contractEdit.brandNameList += "(";
                    }
                    var isAInSet = mySet.has(item.name);

                    if (!isAInSet) {
                        contractEdit.brandNameList += item.name;
                        mySet.add(item.name);
                        if (t != v.supplierContractCategorys.length - 1) {
                            contractEdit.brandNameList += "  ";
                        }
                    }

                    if (t == v.supplierContractCategorys.length - 1) {
                        contractEdit.brandNameList += ")";
                    }

                });
            }
            if (i != supplierContractBrands.length - 1) {
                contractEdit.brandNameList += ",";
            }

        });
    }

    if (supplierContractProduct && supplierContractProduct.length) {

        $.each(supplierContractProduct, function(i, v) {

            table1.datas.push([v.category, v.brand, v.name, v.warranTime]);

        });
    }

    index = 0;
    var service = [];
    if (supplierContractBrands && supplierContractBrands.length) {

        $.each(supplierContractBrands, function(i, v) {

            if (v.servicePrice == null || v.servicePrice == "")
                return true;

            var servicePrices = JSON.parse(v.servicePrice);

            $.each(servicePrices, function(i, t) {

                if (t.UV != 0 && t.DV == 0) {

                    service.push({
                        name: v.brand.name,
                        time: t.TL,
                        sale: "销售总金额" + t.UV + "万元（含）以下",
                        money: "对应应结款总额的" + t.SR + "%；"
                    });

                }
                if (t.DV != 0 && t.UV == 0) {
                    service.push({
                        name: v.brand.name,
                        time: t.TL,
                        sale: "销售总金额" + t.DV + "万元以上",
                        money: "对应应结款总额的" + t.SR + "%；"
                    });

                }
                if (t.UV != 0 && t.DV != 0) {
                    service.push({
                        name: v.brand.name,
                        time: t.TL,
                        sale: "销售总金额" + t.DV + "万元-" + t.UV + "万元（含）",
                        money: "对应应结款总额的" + t.SR + "%；"
                    });
                }
            });
        });

        var result = [];
        if (service && service.length > 0) {

            $.each(service, function(index, item) {

                var found = false;

                $.each(result, function(i, r) {

                    if (r.sale === item.sale) {
                        r.name += ',' + item.name;
                        found = true;
                        return false;
                    }
                });

                if (!found) {
                    result.push($.extend({}, item));
                }
            });
        }
        $.each(service, function(index, item) {

            console.log(item);
        });
        $.each(result, function(index, item) {

            console.log(item);
            table2.datas.push([item.name, item.time, item.sale, item.money]);

        });
    }

    index = 0;
    if (supplierContractGoods && supplierContractGoods.length != 0) {

        $.each(supplierContractGoods, function(i, v) {

            // ["序号", "品牌", "名称", "型号", "规格", "采购单位", "采购价(不含税)", "税率", "税额", "采购价(含税)"]
            console.log(v)
            table3.datas.push([index++, v.goods.brand, v.goods.name, v.goods.model, v.goods.format, v.goods.measurementUnit, "", "", "", ""]);

        });
    }

    contractEdit.table.push(table1);
    contractEdit.table.push(table2);
    contractEdit.table.push(table3);

    com.focusPage("#preservation").unbind().on('click', function() {

        if (com.validate('form'))
            return false;

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var conitems = com.focusPage(".conitem:visible", "#form");

            var data = {};

            $.each(conitems, function(i, e) {

                var content = $(e);
                data[content.attr("id")] = content.val();
            });

            data = $.extend({}, data, contractEdit.cover);

            var termStartDate = com.focusPage("#con-term-start-date").val();
            var termEndDate = com.focusPage("#con-term-end-date").val();

            data["con-tern-start-year"] = termStartDate.substr(0, 4);
            data["con-tern-start-month"] = termStartDate.substr(5, 2);
            data["con-tern-start-day"] = termStartDate.substr(8, 2);
            data["con-tern-end-year"] = termEndDate.substr(0, 4);
            data["con-tern-end-month"] = termEndDate.substr(5, 2);
            data["con-tern-end-day"] = termEndDate.substr(8, 2);

            // data["con-supplier-name-1"] = data["con-supplier-name"];
            data["cov-supplier-name"] = data["con-supplier-name"];
            data["cov-company-name"] = data["con-company-name"];
            data["con-company-name-2"] = data["con-company-name"];
            data["con-company-legal-2"] = data["con-company-legal-1"];

            data["con-management-fee-cn"] = utils.getCNMoney(parseFloat(data["con-management-fee"]));
            data["con-marketing-expenses-cn"] = utils.getCNMoney(parseFloat(data["con-marketing-expenses"]));

            var options = {
                "supplierContract.scid": params.personel.contractargs.scid,
                "data": JSON.stringify(data),
                "table": JSON.stringify(contractEdit.table)
            };

            var popup = com.focusPage("#popup-page");
            var target = com.focusPage("#layerPopUp");

            var mask = $("<div></div>").addClass("tab-mask").appendTo(popup);
            var maskh1 = $("<h1></h1>").css({
                "position": "absolute",
                "top": "30%",
                "left": "45%"
            }).appendTo(mask);
            var maskicon = $("<i></i>").addClass("icon-spinner icon-spin bigger-450").appendTo(maskh1);

            mask.css("top", target.height() - mask.height() + 30);
            popup.css("overflow", "hidden");
            console.log(data)
            var iii = 1;
            $.each(data, function(i, v) {

                iii++
            })
            console.log(iii)
            com.post(api.personel.makeSupplierContract, options, function(res) {

                com.closePopup();
                mask.remove();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                mask.remove();
                popup.css("overflow", "");
            });
        });
    });

});