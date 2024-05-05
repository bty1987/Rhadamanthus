/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费) 4 (保密协议) 5 (解除协议)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 解除协议协议
 */
jQuery(function($) {

    var contractEdit = {

        customer: null,

        cover: {},

        items: {},

        modal: {
            talkingModal: com.focusPage('#talkingModal')
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        $input: null,

        current: new Date(),
    };

    if (contractEdit.contractArgs.company != "1") {
        com.focusPage(".company", "#form").hide();
    }

    if (contractEdit.contractArgs.company == "1") {
        com.focusPage(".customer", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    com.datetime(com.focusPage("#con-sign-year"), "year");
    com.datetime(com.focusPage("#con-sign-month"), "month");
    com.datetime(com.focusPage("#con-sign-day"), "day");
    contractEdit.cover["sin-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["sin-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["sin-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        var customer = res.decoration.customer;

        com.focusPage("#con-orderId", "#form").val(data.orderId);
        com.focusPage("#con-work-status", "#form").val(constant.decoration().decoration.projectStatus.keys[data.projectStatus]);
        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#con-customer-ident", "#form").val(customer.identity);

        contractEdit.customer = customer;

        com.focusPage("#con-province-name", "#form").val(proper.city.province);
        com.focusPage("#con-city-name", "#form").val(proper.city.name);
        com.focusPage("#con-proper-name", "#form").val(proper.name);
        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
        com.focusPage("#con-company-no", "#form").val(customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(customer.companyName);

        contractEdit.cover["con-customer-name"] = customer.name;
        contractEdit.cover["con-customer-ident"] = customer.ident;
        contractEdit.cover["sin-customer-phone"] = customer.phone;
        contractEdit.cover["sin-customer-ident"] = customer.identity;
        contractEdit.cover["con-work-model"] = constant.decoration().decoration.typeness.keys[data.typeness];
    }, null, false);

    com.focusPage("#preservation").unbind("click").on('click', function() {

        if (com.validate('form'))
            return false;

        var conitems = com.focusPage(".conitem:visible", "#form");

        var data = {};

        $.each(conitems, function(i, e) {

            var content = $(e);
            data[content.attr("id")] = content.val();
        });

        data = $.extend({}, data, contractEdit.cover);

        data["sin-customer-name"] = data["con-customer-name"];

        if (contractEdit.contractArgs.company == "1") {
            delete data["con-customer-name"];

            data["sin-company-name"] = data["con-company-name"];
            data["sin-company-no"] = data["con-company-no"];
        }

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            });
        });
    });

});
