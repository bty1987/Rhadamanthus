jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,

        cover: {},

        modal: {
            talkingModal: com.focusPage('#talkingModal')
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        $input: null,

        current: new Date(),
    };

    if (contractEdit.contractArgs.agent == "1") {
        com.focusPage(".agent", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

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

        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#con-customer-phone", "#form").val(customer.phone);
        com.focusPage("#con-customer-ident", "#form").val(customer.identity);

        contractEdit.customer = customer;

        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["cov-customer-phone"] = customer.phone == "" ? "" : customer.phone;

        com.focusPage("#con-province-name", "#form").val(proper.city.province);
        com.focusPage("#con-city-name", "#form").val(proper.city.name);
        com.focusPage("#con-proper-name", "#form").val(proper.name);
        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
        com.focusPage("#con-buildarea", "#form").val(house.buildArea);

        com.focusPage("#con-designer-name", "#form").val(data.designer.currentName);
        com.focusPage("#con-designer-phone", "#form").val(data.designer.phone);

        contractEdit.decoration = data;

        contractEdit.cover["cov-buildarea"] = data.house.buildArea;
        contractEdit.cover["cov-address"] = data.house.village.name + " " + data.house.houseNumber;
        contractEdit.cover["cov-designer-name"] = data.designer.currentName;
        contractEdit.cover["cov-designer-phone"] = data.designer.phone;
    });

    com.focusPage('#talkingList').click(function() {

        contractEdit.modal.talkingModal.modal("hide");
    });

    com.focusPage(".makeup.conitem").dblclick(function() {

        talkingData($(this).attr("id"), {
            "types[0]": 0,
            "types[1]": 1
        });
    });

    function talkingData(content, options) {

        contractEdit.$input = content;

        console.log(content);

        com.post(api.data.queryTalking, options, function(res) {

            displayFunc.init("talkingList", res.talkings);
            contractEdit.modal.talkingModal.modal("show");
        });
    }
    ;

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {

            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {

                    creatLine(v).appendTo($ul);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [[" ", v.content, 'grey']];

            $.each(propertyArr, function(index, value) {

                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $liLine.append($divBtnWrap).append($ulProperty);

            return $liLine.click(function() {

                var $tmp = com.focusPage("#" + contractEdit.$input);
                var value = $tmp.val();
                $tmp.val(value + v.content + "\n");
            });
        };

        return {
            init: function(tableId, listData) {

                if (!listData.length) {
                    var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                } else {
                    com.focusPage('#' + tableId).html(null);
                    renderList(tableId, listData);
                }
            },
            drawLine: function(v) {

                return creatLine(v);
            }
        };
    })();

    com.focusPage("#preservation").unbind().on('click', function() {

        if (com.validate('form'))
            return false;

        var conitems = com.focusPage(".conitem:visible", "#form");

        var data = {};

        $.each(conitems, function(i, e) {

            var content = $(e);
            data[content.attr("id")] = content.val();
        });

        console.log(data);

        data = $.extend({}, data, contractEdit.cover);

        console.log(data);

        data["con-design-money-cn"] = utils.getCNMoney(parseFloat(data["con-design-money"]));
        data["con-design-rmoney-cn"] = utils.getCNMoney(parseFloat(data["con-design-rmoney"]));

        data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
        data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
        data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");

        data["sin-customer-name"] = data["con-customer-name"];
        data["sin-customer-phone"] = data["con-customer-phone"];
        data["sin-customer-ident"] = data["con-customer-ident"];

        if (contractEdit.contractArgs.agent == "0") {
            data["sin-agent-name"] = data["con-agent-name"];
            data["sin-agent-phone"] = data["con-agent-phone"];
            data["sin-agent-ident"] = data["con-agent-ident"];
        }

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "decorationContract.contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data)
            };

            console.log(options);

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            });
        });
    });

});
