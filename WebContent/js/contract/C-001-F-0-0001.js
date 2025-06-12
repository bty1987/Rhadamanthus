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

        contractArgs: params.personel.contractargs,
        uid: params.personel.uid,
        ucid:params.ucid,
        scid:null,

        current: new Date(),
    };

    console.log(params.personel.contractargs);
    console.log(params.personel.uid);

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

    var supplierContractBrands = [];

    com.post(api.personel.pageSupplierContractBrand, {
        "paging.page": 1,
        "paging.rows": 10,
        "supplierContractBrand.scid": params.personel.contractargs.scid
    }, function(res) {

        supplierContractBrands = res.paging.data;
    }, null, false);

    console.log(supplierContractBrands);

    var supplierContractGoods = [];

    com.post(api.personel.pageSupplierContractGoods, {
        "paging.page": 1,
        "paging.rows": 10,
        "supplierContractGoods.scid": params.personel.contractargs.scid
        
    }, function(res) {

        supplierContractGoods = res.paging.data;
    }, null, false);

    console.log(supplierContractGoods);

   var table1 = {
       "insertWay": 1,
       "keyword": "厂商商品列表",
       "pageBegin": 1,
       "headers": ["序号", "商品名称", "价格", "结算价"],
       "colWidthPercent": [1, 3, 3],
       "headersAlignment": 1,
       "cellHorizontalAlignment": 0,
       "cellVerticalAlignment": 5,
       "datas": []
   };

   var table2 = {
       "insertWay": 1,
       "keyword": "厂商品牌列表",
       "pageBegin": 1,
       "headers": ["品牌名称", "结算类型", "结算值", "违约金"],
       "colWidthPercent": [1, 3, 1, 3],
       "headersAlignment": 1,
       "cellHorizontalAlignment": 0,
       "cellVerticalAlignment": 5,
       "datas": []
   };

    var index = 0;

    index = 0;

    if (supplierContractGoods && supplierContractGoods.length) {

        $.each(supplierContractGoods, function(i, v) {

            table1.datas.push([(index++ + 1), v.goods.name, v.balance, v.price]);
        });
    }

    if (supplierContractBrands && supplierContractBrands.length) {

        $.each(supplierContractBrands, function(i, v) {
            
            table2.datas.push([(index++ + 1), v.brand.name, v.ctype, v.breakpay, v.cvalue ]);
        });
    }

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
            
            var options = {
                "supplierContract.scid": params.personel.contractargs.scid,
                "data": JSON.stringify(data),
                //"table": JSON.stringify(contractEdit.table)
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