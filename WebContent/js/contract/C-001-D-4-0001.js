/**
 * 合同html/js文件命名说明: C-<company>-<module>-<type>-<index>.html C-<公司/模式>-<业务类型>-<合同类型>-<序号>.html
 * 
 * 公司/模式: 001 (方林/半包) 002 (1918/大宅) 003 (宜家/半包/整装) 004 (爱林/整装) 005 (恩林/局改/二改)
 * 
 * 业务类型: D (装修) M (主材)
 * 
 * 合同类型: 0 (工程) 1 (设计费) 2 (主材代购) 3 (服务费) 4 (负责协议)
 * 
 * 举例: C-001-D-3-0001.html 方林装修服务费相关合同 C-005-D-0-0001.html 恩林装修工程相关合同
 * 
 * 此文件为: 方林负责协议合同
 */

jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,

        cover: {},
        table: {},

        modal: {
            talkingModal: com.focusPage('#talkingModal')
        },

        item: {
            decorationType: com.focusPage("#con-decoration-type")
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        projectStatus: {},
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

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    com.datetime(com.focusPage("#con-project-data"));

    contractEdit.projectStatus = constant.decoration().decoration.projectStatus.keys;
    contractEdit.projectTypeness = constant.decoration().decoration.typeness.keys;
    contractEdit.item.decorationType.bindData(constant.decoration().decoration.typeness.datas, 'key', 'value');

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

        contractEdit.cover["con-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["sin-customer-name"] = customer.name;
        contractEdit.cover["sin-customer-phone"] = customer.phone;
        contractEdit.cover["sin-customer-ident"] = customer.identity;

        com.focusPage("#con-company-no", "#form").val(customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(customer.companyName);

        com.focusPage("#con-province-name", "#form").val(proper.city.province);
        com.focusPage("#con-city-name", "#form").val(proper.city.name);
        com.focusPage("#con-proper-name", "#form").val(proper.name);
        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
        com.focusPage("#con-project-status", "#form").val(contractEdit.projectStatus[data.projectStatus]);
        com.focusPage("#con-decoration-type", "#form").val(data.typeness);
    }, null, false);

    if (contractEdit.contractArgs.company == "1" && contractEdit.customer.type == 0) {

        com.showAlert(com.warning, "客户类型为个人");

        com.focusPage("#contractPopUp").empty();

        return false;
    }

    com.focusPage('#talkingList').click(function() {

        contractEdit.modal.talkingModal.modal("hide");
    });

    com.focusPage("#con-markup-one").dblclick(function() {

        talkingData($(this).attr("id"), {
            "types[0]": 0
        });
    });

    com.focusPage("#con-markup-two").dblclick(function() {

        talkingData($(this).attr("id"), {
            "types[0]": 1
        });
    });

    function talkingData(content, types) {

        contractEdit.$input = content;

        com.post(api.data.queryTalking, types, function(res) {

            displayFunc.init("talkingList", res.talkings);
            contractEdit.modal.talkingModal.modal("show");
        }, null, false);
    }

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

        com.showConfirm("请仔细认真检查合同填写内容", function() {

            var conitems = com.focusPage(".conitem:visible", "#form");

            var data = {};

            $.each(conitems, function(i, e) {

                var content = $(e);
                data[content.attr("id")] = content.val();
            });

            data = $.extend({}, data, contractEdit.cover);

            data["con-decoration-type"] = contractEdit.projectTypeness[com.focusPage("#con-decoration-type").val()];
            data["sin-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
            data["sin-sign-month"] = com.dateFormat(contractEdit.current, "MM");
            data["sin-sign-day"] = com.dateFormat(contractEdit.current, "dd");
            data["con-project-year"] = com.focusPage("#con-project-data").val().substr(0, 4);
            data["con-project-month"] = com.focusPage("#con-project-data").val().substr(5, 2);
            data["con-project-day"] = com.focusPage("#con-project-data").val().substr(8, 2);

            if (contractEdit.contractArgs.company == "1") {
                data["sin-company-name"] = data["con-company-name"];

                delete data["con-customer-ident"];
                delete data["con-company-name"];
            }

            var url = api.decoration.addDecorationContract;
            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data),
                "table": JSON.stringify(contractEdit.table)
            };
            
            if(params.decoration.contract && params.decoration.contract.dcid){
                url = api.decoration.makeDecorationContract;
                options["decorationContract.dcid"] = params.decoration.contract.dcid
            }

            console.log(options);

            com.post(url, options, function(res) {

                com.closePopup();
            });

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

            com.post(url, options, function(res) {

                com.closePopup();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                mask.remove();
                popup.css("overflow", "");
            });
        });
    });

});