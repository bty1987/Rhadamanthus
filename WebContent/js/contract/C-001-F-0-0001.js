/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材) P (人事)
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

        item: {},

        contractArgs:params.personel.contractargs,
        uid:params.personel.uid,
        ucid:params.ucid,
        scid:null,
        no:null,
        brandNameList: "",
        goodNameList: "",

        current: new Date(),
    };

    console.log(params.personel.contractargs);
    console.log(params.personel.uid);

    var currentDate = new Date(); 
    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1;
    var day = currentDate.getDate();

    if (contractEdit.contractArgs.type == "1") {
        com.focusPage(".undispatch", "#form").hide();
    }

    if (contractEdit.contractArgs.type != "1" && contractEdit.contractArgs.type != "2") {
        com.focusPage(".dispatch", "#form").hide();
    }

    if (contractEdit.contractArgs.type == "2") {
        com.focusPage(".insure", "#form").hide();
    }

    if (contractEdit.contractArgs.type == "3") {
        com.focusPage(".insure", "#form").hide();
    }

    com.datetime(com.focusPage("#con-term-start-date"));
    com.datetime(com.focusPage("#con-term-end-date"));

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
        "keyword": "厂商品牌列表",
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
        "keyword": "超额服务费列表",
        "pageBegin": 1,
        "headers": ["品类名称", "品牌名称", "时间限期", "取档", "超额服务费"],
        "colWidthPercent": [2, 2, 2, 3, 1],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };
    
    var index = 0;

    if (supplierContractBrands && supplierContractBrands.length) {

        $.each(supplierContractBrands, function(i, v) {

            if (i > 0) {
                contractEdit.brandNameList += ',';
            }
            
            contractEdit.brandNameList += v.brand.name;

            if (v.name != null) {
                if (i > 0) {
                    contractEdit.goodNameList += ',';
                }
                contractEdit.goodNameList += v.name;
            }
            
            table1.datas.push(["", v.brand.name, v.name, v.warranTime]);
        });
    }

    index = 0;
    if (supplierContractBrands && supplierContractBrands.length) {

        $.each(supplierContractBrands, function(i, v) {

            if (v.servicePrice == null || v.servicePrice == "")
                return true;

            var servicePrices = JSON.parse(v.servicePrice);

            $.each(servicePrices, function(i, t) {

                if (t.UV == 0 && t.DV != 0) {
                    table2.datas.push([ "", v.brand.name, t.TL, "销售总金额" + t.DV + "万元（含）以下", "对应应结款总额的" + t.SR + "%；"]);
                }
                if (t.DV == 0 && t.UV != 0) {
                    table2.datas.push([ "", v.brand.name, t.TL, "销售总金额" + t.UV + "万元以上", "对应应结款总额的" + t.SR + "%；"]);
                }
                if (t.UV != 0 && t.DV != 0) {
                    table2.datas.push([ "", v.brand.name, t.TL, "销售总金额" + t.DV + "万元-" + t.UV + "万元（含）", "对应应结款总额的" + t.SR + "%；"]);
                }
            });
        });
    }
    console.log("table1.table2:"+table2.datas)
    contractEdit.table.push(table1);
    contractEdit.table.push(table2);

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

            console.log(data);

            var termStartDate = com.focusPage("#con-term-start-date").val();
            var termEndDate = com.focusPage("#con-term-start-date").val();

            data["con-tern-start-year"] = termStartDate.substr(0, 4);
            data["con-tern-start-month"] = termStartDate.substr(5, 2);
            data["con-tern-start-day"] = termStartDate.substr(8, 2);
            data["con-tern-end-year"] = termEndDate.substr(0, 4);
            data["con-tern-end-month"] = termEndDate.substr(5, 2);
            data["con-tern-end-day"] = termEndDate.substr(8, 2);

            data["cov-company-name"] = data["con-company-name"];
            data["cov-company-name-11"] = data["con-company-name"];
            data["sin-company-name"] = data["con-company-name"];
            data["con-company-name-1"] = data["con-company-name"];
            data["con-company-name-2"] = data["con-company-name"];
            data["con-company-name-3"] = data["con-company-name"];
            data["con-company-name-4"] = data["con-company-name"];
            data["con-company-name-5"] = data["con-company-name"];
            data["con-company-name-6"] = data["con-company-name"];
            data["con-company-name-7"] = data["con-company-name"];
            data["con-company-name-11"] = data["con-company-name"];
            data["con-company-addr-11"] = data["con-company-addr"];
            data["con-company-legal-11"] = data["con-company-legal"];
            data["con-company-phone-11"] = data["con-company-phone"];
            data["con-company-email-11"] = data["con-company-email"];
            data["con-company-name-21"] = data["con-company-name"];
            data["con-company-addr-21"] = data["con-company-addr"];
            data["con-company-legal-21"] = data["con-company-legal"];
            data["con-company-phone-21"] = data["con-company-phone"];
            data["con-company-bank-name-21"] = data["con-company-bank-name"];
            data["con-company-bank-21"] = data["con-company-bank"];
            data["con-company-bank-no-21"] = data["con-company-bank-no"];
            data["con-company-abank-name-21"] = data["con-company-bank-name"];
            data["con-company-abank-21"] = data["con-company-bank"];
            data["con-company-abank-no-21"] = data["con-company-bank-no"];
            data["con-company-name-22"] = data["con-company-name"];

            data["cov-supplier-name"] = data["con-supplier-name"];
            data["cov-supplier-name-1"] = data["con-supplier-name"];
            data["sin-supplier-name"] = data["con-supplier-name"];
            data["con-supplier-addr1"] = data["con-supplier-addr"];
            data["con-supplier-phone1"] = data["con-supplier-phone"];
            data["con-supplier-name-11"] = data["con-supplier-name"];
            data["con-supplier-addr-11"] = data["con-supplier-addr"];
            data["con-supplier-legal-11"] = data["con-supplier-legal"];
            data["con-supplier-phone-11"] = data["con-supplier-phone"];
            data["con-supplier-email-11"] = data["con-supplier-email"];
            data["con-supplier-name-21"] = data["con-supplier-name"];
            data["con-supplier-addr-21"] = data["con-supplier-addr"];
            data["con-supplier-legal-21"] = data["con-supplier-legal"];
            data["con--supplier-phone-21"] = data["con-supplier-phone"];
            data["con-supplier-bank-name-21"] = data["con-supplier-bank-name"];
            data["con-supplier-bank-21"] = data["con-supplier-bank"];
            data["con-supplier-bank-no-21"] = data["con-supplier-bank-no"];
            data["con-supplier-name-22"] = data["con-supplier-name"];

            data["con-regular-product-service-fee1"] = data["con-regular-product-service-fee"];

            data["sin-company-addr"] = data["con-company-addr"];
            data["sin-company-legal"] = data["con-company-legal"];
            data["sin-company-phone"] = data["con-company-phone"];
            data["sin-communion-email"] = data["con-company-email"];
            data["sin-company-addr-11"] = data["con-company-addr"];
            data["sin-company-name-11"] = data["con-company-name"];
            data["sin-company-legal-11"] = data["con-company-legal"];
            data["sin-company-phone-11"] = data["con-company-phone"];
            data["sin-company-email-11"] = data["con-company-email"];

            data["sin-supplier-addr"] = data["con-supplier-addr"];
            data["sin-supplier-legal"] = data["con-supplier-legal"];
            data["sin-supplier-phone"] = data["con-supplier-phone"];
            data["sin-supplier-email"] = data["con-supplier-email"];
            data["sin-supplier-bank-no"] = data["con-supplier-bank-no"];
            data["sin-supplier-bank"] = data["con-supplier-bank"];
            data["sin-supplier-name-11"] = data["con-supplier-name"];
            data["sin-supplier-addr-11"] = data["con-supplier-addr"];
            data["sin-supplier-legal-11"] = data["con-supplier-legal"];
            data["sin-supplier-phone-11"] = data["con-supplier-phone"];
            data["sin-supplier-email-11"] = data["con-supplier-email"];
            data["sin-supplier-bank-no-11"] = data["con-supplier-bank-no"];
            data["sin-supplier-bank-11"] = data["con-supplier-bank"];

            data["con-cooperation-amount-undis-cn"] = utils.getCNMoney(parseFloat(data["con-cooperation-amount-undis"]));
            data["con-venue-rental-fee-cn"] = utils.getCNMoney(parseFloat(data["con-venue-rental-fee"]));

            data["con-brand-list"] = contractEdit.brandNameList;
            data["con-brand-list-1"] = contractEdit.brandNameList;
            data["con-goods-list"] = contractEdit.goodNameList;
            data["con-goods-list-1"] = contractEdit.goodNameList;
            data["con-goods-list-1"] = contractEdit.goodNameList;
            data["cov-contract-no"] = contractEdit.no;
            data["cov-contract-no-1"] = contractEdit.no;
            data["cov-contract-no-2"] = contractEdit.no;
            data["cov-contract-no-3"] = contractEdit.no;
            data["con-contract-no"] = contractEdit.no;
            data["con-contract-no-1"] = contractEdit.no;
            data["con-contract-no-2"] = contractEdit.no;

            data["con-regular-settlement-amount-1"] = data["con-regular-settlement-amount"];
            data["con-regular-product-service-fee2"] = data["con-regular-product-service-fee"];
            data["con-settlement-amount-1"] = data["con-settlement-amount"];
            data["con-experience-hall1-1"] = data["con-experience-hall-1"];
            data["con-experience-hall1-2"] = data["con-experience-hall-2"];
            data["con-experience-hall1-3"] = data["con-experience-hall-3"];
            data["con-experience-hall-sum-1"] = data["con-experience-hall-sum"];

            data["sin-company-time"] = year+"-"+month+"-"+day;
            data["sin-company-time-1"] = year+"-"+month+"-"+day;
            data["sin-supplier-time"] = year+"-"+month+"-"+day;
            data["sin-supplier-time-1"] = year+"-"+month+"-"+day;
            
            data["con-sign-date-year"] = year;
            data["con-sign-date-month"] = month;
            data["con-sign-date-day"] = day;
            data["con-sign-date-year-1"] = year;
            data["con-sign-date-month-1"] = month;
            data["con-sign-date-day-1"] = day;
            data["con-sign-date-year-2"] = year;
            data["con-sign-date-month-2"] = month;
            data["con-sign-date-day-2"] = day;
            data["con-sign-date-year-3"] = year;
            data["con-sign-date-month-3"] = month;
            data["con-sign-date-day-3"] = day; 

           

            var options = {
                "supplierContract.scid": params.personel.contractargs.scid,
                "data": JSON.stringify(data),
                "table": JSON.stringify(contractEdit.table)
            };

            console.log(options);

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