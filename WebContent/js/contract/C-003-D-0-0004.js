/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费) 4 (保密协议)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 对公司保密协议
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
        com.focusPage(".agentor", "#form").hide();
    }

    if (contractEdit.contractArgs.company == "1") {
        com.focusPage(".customer", "#form").hide();
    }

    com.datetime(com.focusPage("#con-valid-start-date"));
    com.datetime(com.focusPage("#con-valid-end-date"));

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

        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#con-customer-ident", "#form").val(customer.identity);

        contractEdit.customer = customer;

        contractEdit.cover["con-customer-name"] = customer.name;
        contractEdit.cover["con-customer-phone"] = customer.phone;
        com.focusPage("#con-company-name", "#form").val(customer.companyName);

        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
    }, null, false);

    if (contractEdit.contractArgs.company == "1" && contractEdit.customer.type == 0) {

        com.showAlert(com.warning, "客户类型为个人");

        com.focusPage("#contractPopUp").empty();

        return false;
    }

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

        data["con-valid-start-date"] = com.focusPage("#con-valid-start-date").val();
        data["con-valid-end-date"] = com.focusPage("#con-valid-end-date").val();
        data["sin-sign-date"] = com.dateFormat(contractEdit.current, "yyyy年MM月dd日");
        data["sin-sign-date1"] = com.dateFormat(contractEdit.current, "yyyy年MM月dd日");

        if (contractEdit.contractArgs.company == "1") {
            delete data["con-customer-ident"];
            delete data["con-customer-phone"];
            delete data["sin-agent-name"];
        }

        if (contractEdit.contractArgs.company != "1") {
            delete data["sin-agent-name"];
        }

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "decorationContract.contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            });
        });
    });

});
