/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费) 4 (保密协议) 5 (解除协议) 6 (负责协议)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 14天无理由退合同
 */

jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,

        cover: {},

        item: {
            decorationType: com.focusPage("#con-work-model")
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,
        projectTypeness: {},

        $input: null,

        current: new Date(),
    };

    if (contractEdit.contractArgs.company != "1") {
        com.focusPage(".company", "#form").hide();
    }

    if (contractEdit.contractArgs.company == "1") {
        com.focusPage(".customer", "#form").hide();
    }

    contractEdit.projectTypeness = constant.decoration().decoration.typeness.keys;
    contractEdit.item.decorationType.bindData(constant.decoration().decoration.typeness.datas, 'key', 'value');

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        var customer = res.decoration.customer;

        contractEdit.customer = customer;

        contractEdit.item.decorationType.val(data.typeness);

        com.focusPage("#con-customer-name", "#form").val(customer.name);

        contractEdit.cover["con-orderId"] = data.orderId;
        contractEdit.cover["sin-customer-name"] = customer.name;

        contractEdit.cover["sin-company-name"] = customer.companyName;

        com.focusPage("#con-company-no", "#form").val(customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(customer.companyName);

        com.focusPage("#con-province-name", "#form").val(proper.city.province);
        com.focusPage("#con-city-name", "#form").val(proper.city.name);
        com.focusPage("#con-proper-name", "#form").val(proper.name);
        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
        com.focusPage("#con-decoration-type", "#form").val(data.typeness);
    }, null, false);

    com.post(api.data.queryCustomerForPhone, {
        "customerPhone.cid": contractEdit.customer.cid,
        "customerPhone.cpid": 0
    }, function(res) {

        contractEdit.customer = res.customer;

        com.focusPage("#sin-customer-phone1", "#form").val(contractEdit.customer.phone);
        com.focusPage("#con-customer-ident", "#form").val(contractEdit.customer.identity);

        com.focusPage("#con-company-no", "#form").val(contractEdit.customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(contractEdit.customer.companyName);

        contractEdit.cover["sin-customer-phone1"] = contractEdit.customer.phone;
        contractEdit.cover["sin-customer-ident"] = contractEdit.customer.identity;

        contractEdit.cover["sin-company-name"] = contractEdit.customer.companyName;

    }, null, false);

    if (contractEdit.contractArgs.company == "1" && contractEdit.customer.type == 0) {

        com.showAlert(com.warning, "客户类型为个人");

        com.focusPage("#contractPopUp").empty();

        return false;
    }

    if (contractEdit.contractArgs.company == "1") {

        com.focusPage("#sin-agent-name", "#form").val(contractEdit.customer.name);
        com.focusPage("#sin-agent-phone", "#form").val(contractEdit.customer.phone);
        com.focusPage("#sin-agent-ident", "#form").val(contractEdit.customer.identity);
    }

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

            data["con-work-model"] = contractEdit.projectTypeness[com.focusPage("#con-work-model").val()];
            data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
            data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
            data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");

            if (contractEdit.contractArgs.company != "1") {

                delete data["sin-company-name"];
            }

            if (contractEdit.contractArgs.company == "1") {

                delete data["sin-customer-name"];
                delete data["sin-customer-ident"];
            }

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data),
            };

            console.log(data);

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

            com.post(api.decoration.addDecorationContract, options, function(res) {

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