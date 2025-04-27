/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费) 4 (保密协议) 5 (解除协议) 6 (负责协议) 6 (签约后交付流程)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 签约后交付流程
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

    contractEdit.cover["cov-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var data = res.decoration;
        var house = data.house;
        var village = house.village;
        var proper = village.cityProper;
        var customer = res.decoration.customer;

        contractEdit.cover["cov-orderId"] = data.orderId;
        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#cov-designer-name", "#form").val(data.designer.currentName);

        contractEdit.customer = customer;

        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["sin-customer-name"] = customer.name;
        contractEdit.cover["cov-address"] = data.house.village.name + " " + data.house.houseNumber;

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
