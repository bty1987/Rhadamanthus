/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 宜家半包主材代购合同
 */

jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,
        holonomy: null,
        quotation: null,

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
        com.focusPage(".agent", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    contractEdit.cover["cov-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    contractEdit.cover["sin-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["sin-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["sin-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    var decoration = [];

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        decoration = res.decoration;
        var house = decoration.house;
        var village = house.village;
        var proper = village.cityProper;
        var customer = res.decoration.customer;

        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#sin-customer-phone", "#form").val(customer.phone);
        com.focusPage("#sin-customer-ident", "#form").val(customer.identity);

        contractEdit.customer = customer;

        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["cov-customer-phone"] = customer.phone;
        contractEdit.cover["sin-customer-name"] = customer.name;

        com.focusPage("#con-company-name", "#form").val(customer.companyName);
        com.focusPage("#con-company-phone", "#form").val(customer.companyPhone);

        contractEdit.cover["sin-company-phone"] = customer.companyPhone;

        contractEdit.decoration = decoration;

        contractEdit.cover["cov-buildarea"] = decoration.house.buildArea;
        contractEdit.cover["cov-address"] = decoration.house.village.name + " " + decoration.house.houseNumber;
        contractEdit.cover["cov-designer-name"] = decoration.designer.currentName;
        contractEdit.cover["cov-designer-phone"] = decoration.designer.phone;
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

        data["con-material-total-cn"] = utils.getCNMoney(parseFloat(data["con-material-total"]));

        if (contractEdit.contractArgs.company == "1") {
            delete data["con-customer-ident"];
            delete data["con-customer-name"];
            delete data["cov-customer-name"];
            delete data["con-company-phone"];

            data["cov-company-name"] = data["con-company-name"];
            data["sin-company-name"] = data["con-company-name"];
        }

        if (contractEdit.contractArgs.company != "1") {
            delete data["sin-company-phone"];
        }

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var url = api.decoration.addDecorationContract;
            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };
            
            if(params.decoration.contract && params.decoration.contract.dcid){
                url = api.decoration.makeDecorationContract;
                options["decorationContract.dcid"] = params.decoration.contract.dcid
            }

            console.log(options);

            com.post(url, options, function(res) {

                com.closePopup();
            });
        });
    });

});
