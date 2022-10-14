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
 * 此文件为: 爱林装修工程补充协议
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
            houseType: com.focusPage("#con-housetype"),
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        decorationType: {},

        $input: null,

        current: new Date(),
    };

    if (contractEdit.contractArgs.agent == "1") {
        com.focusPage(".agent", "#form").hide();
    }

    if (contractEdit.contractArgs.type == "0") {
        com.focusPage("#con-payment-second", "#form").hide();
    }

    if (contractEdit.contractArgs.company != "1") {
        com.focusPage(".company", "#form").hide();
    }

    if (contractEdit.contractArgs.company == "1") {
        com.focusPage(".customer", "#form").hide();
    }

    com.post(api.common.current, {}, function(res) {

        contractEdit.current = new Date(res.current);
    }, null, false);

    contractEdit.cover["cov-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
    contractEdit.cover["cov-sign-month"] = com.dateFormat(contractEdit.current, "MM");
    contractEdit.cover["cov-sign-day"] = com.dateFormat(contractEdit.current, "dd");

    com.post(api.ds.decoration, {}, function(res) {

        contractEdit.decorationType = res.typeness.split("key", "value");
        contractEdit.item.houseType.bindData(res.houseClass, 'key', 'value');
    });

    // 通过装修单号获取装修款项信息
    com.post(api.payment.queryDecorationPaymentByOrderId, {
        "decorationPayment.decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var payments = res.decorationPayments.split("paymentType", "referMoney");

        com.focusPage("#con-design-money", "#form").val(payments['设计费'] == null ? 0 : payments['设计费']);
        com.focusPage("#con-payment-first", "#form").val(payments['首付款'] == null ? 0 : payments['首付款']);
        com.focusPage("#con-payment-second", "#form").val(payments['首付二期款'] == null ? 0 : payments['首付二期款']);
        com.focusPage("#con-payment-third", "#form").val(payments['二期款'] == null ? 0 : payments['二期款']);
        com.focusPage("#con-payment-final", "#form").val(payments['尾款'] == null ? 0 : payments['尾款']);

        contractEdit.designPrice = payments['设计费'] == null ? 0 : payments['设计费'];

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
        com.focusPage("#con-customer-phone", "#form").val(customer.phone);
        com.focusPage("#con-customer-ident", "#form").val(customer.identity);
        com.focusPage("#con-bank-man", "#form").val(customer.name);
        com.focusPage("#con-bank-no", "#form").val(customer.companyBankno);
        com.focusPage("#con-bank-name", "#form").val(customer.companyBank);
        com.focusPage("#con-bank-phone", "#form").val(customer.phone);

        contractEdit.customer = customer;

        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["cov-customer-phone"] = customer.phone;
        contractEdit.cover["sin-customer-name"] = customer.name;
        contractEdit.cover["sin-customer-ident"] = customer.identity;

        com.focusPage("#con-company-no", "#form").val(customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(customer.companyName);
        com.focusPage("#con-company-name1", "#form").val(customer.companyName);
        com.focusPage("#con-company-phone", "#form").val(customer.companyPhone);
        com.focusPage("#con-company-addr", "#form").val(customer.companyAddr);
        com.focusPage("#con-company-bank", "#form").val(customer.companyBank);
        com.focusPage("#con-company-bankno", "#form").val(customer.companyBankno);

        com.focusPage("#con-province-name", "#form").val(proper.city.province);
        com.focusPage("#con-city-name", "#form").val(proper.city.name);
        com.focusPage("#con-proper-name", "#form").val(proper.name);
        com.focusPage("#con-village-name", "#form").val(village.name);
        com.focusPage("#con-housenumber", "#form").val(house.houseNumber);
        com.focusPage("#con-housetype", "#form").val(data.houseClass);

        com.focusPage("#con-house-type", "#form").val(contractEdit.decorationType[data.type]);
        com.focusPage("#con-work-type", "#form").val(contractEdit.decorationType[data.type]);
        com.focusPage("#con-work-model", "#form").val(contractEdit.decorationType[data.type]);

        com.focusPage("#con-innerarea", "#form").val(data.house.innerArea);
        com.focusPage("#con-precontract-total", "#form").val(data.precontractPrice);

        com.focusPage("#con-contract-total", "#form").val(utils.accAdd(parseFloat(data.orderTotalPrice), parseFloat(contractEdit.designPrice)));
        com.focusPage("#con-contract-stotal", "#form").val(data.orderTotalPrice);
        com.focusPage("#con-contract-rtotal", "#form").val(data.factPrice);
        com.focusPage("#cov-orderId", "#form").val(data.orderId);

        contractEdit.cover["cov-designer-name"] = data.designer.currentName;
        contractEdit.cover["cov-designer-phone"] = data.designer.phone;
    }, null, false);

    if (contractEdit.contractArgs.company == "1" && contractEdit.customer.type == 0) {

        com.showAlert(com.warning, "客户类型为个人");

        com.focusPage("#contractPopUp").empty();

        return false;
    }

    com.post(api.construction.queryConstructionInfoByOrderId, {
        "constructionInfo.orderId": contractEdit.decorationOrderId
    }, function(result) {

        var datas = result.constructionInfo;

        com.focusPage("#con-work-number", "#form").val(datas.timeLimit);

        com.datetime(com.focusPage("#con-work-year", "#form").val(datas.finishTime ? datas.finishTime.substr(0, 4) : ""), "year");
        com.datetime(com.focusPage("#con-work-month", "#form").val(datas.finishTime ? datas.finishTime.substr(5, 2) : ""), "month");
        com.datetime(com.focusPage("#con-work-day", "#form").val(datas.finishTime ? datas.finishTime.substr(8, 2) : ""), "day");
    });

    com.post(api.decoration.queryDecorationActivityByOrderId, {
        "decorationActivity.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var decorationActivitys = res.decorationActivitys;

        if (decorationActivitys.length != 0)
            com.focusPage("#con-activity-name", "#form").val(decorationActivitys[0].activity.name);
    });

    quotationUtils.quotationDetail = {
        quotation: {},
        quotationFunctionAreas: {}
    };
    params.showType = {
        itemtype: 31
    };

    com.post(api.quotation.queryQuotationForDefaultByOrderId, {
        "quotation.orderId": contractEdit.decorationOrderId
    }, function(res) {

        quotationUtils.quotationDetail.quotation = res.quotation;
    }, null, false);

    if (!quotationUtils.quotationDetail.quotation.qid) {
        com.showAlert(com.warning, "无报价信息");
        com.focusPage("#contractPopUp").html("");
        return false;
    }

    com.post(api.decoration.queryDecorationForCommonByOrderId, {
        "decoration.orderId": contractEdit.decorationOrderId
    }, function(res) {

        quotationUtils.quotationDetail.quotation.decoration = res.decoration;
    }, null, false);

    com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {
        "quotation.qid": quotationUtils.quotationDetail.quotation.qid
    }, function(res) {

        quotationUtils.quotationDetail.quotationFunctionAreas = res.quotationFunctionAreas;
    }, null, false);

    quotationUtils.quotationDetail.extensionItems = [];

    com.post(api.quotation.queryExtensionByOrderId, {
        "extension.orderId": contractEdit.decorationOrderId
    }, function(res) {

        quotationUtils.quotationDetail.extensions = res.extensions;
    }, null, false);

    quotationUtils.quotationDetail.addReduceItems = [];

    com.post(api.addReduce.queryAddReduceByOrderId, {
        'addReduce.orderId': contractEdit.decorationOrderId
    }, function(res) {

        quotationUtils.quotationDetail.addReduces = res.addReduces;
    }, null, false);

    quotationUtils.initQuotationDetailItem(quotationUtils.quotationDetail.quotation, quotationUtils.quotationDetail.quotationFunctionAreas, quotationUtils.quotationDetail.addReduces, quotationUtils.quotationDetail.extensions, params.orderType, false, params.showType);

    console.log(quotationUtils.quotationDetail.quotationFunctionAreaItemCs);

    contractEdit.table = {
        "insertWay": 1,
        "keyword": "家装项目列表",
        "pageBegin": 1,
        "headers": ["序号", "项目名称", "类型", "单位", "数量", "工艺做法及材料说明"],
        "colWidthPercent": [1, 3, 3, 1, 1, 5],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };

    var index = 0;

    $.each(quotationUtils.quotationDetail.quotationFunctionAreaItemCs, function(i, v) {

        var functionArea = i.split('-')[1];
        var subtype = [-2];

        var _index = 0;

        contractEdit.table.datas.push([utils.getBigNumber(index + 1), functionArea, "", "", "", ""]);

        $.each(v, function(j, qv) {

            if (subtype.indexOf(-2) != -1 || subtype.indexOf(qv.subtype) != -1) {

                qv.num = 1;
                qv.measurementUnit = "项";

                contractEdit.table.datas.push([(_index + 1), qv.itemName, qv.typestr, qv.measurementUnit, qv.num, qv.content ? qv.content : "-"]);
            }

            _index++;
        });

        index++;
    });

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

    com.focusPage("#con-markup-thr").dblclick(function() {

        talkingData($(this).attr("id"), {
            "types[0]": 3
        });
    });

    function talkingData(content, types) {

        contractEdit.$input = content;

        com.post(api.data.queryTalking, types, function(res) {

            displayFunc.init("talkingList", res.talkings);
            contractEdit.modal.talkingModal.modal("show");
        }, null, false);
    };

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

            data["cov-innerarea"] = data["con-innerarea"];
            data["cov-address"] = data["con-village-name"] + " " + data["con-housenumber"];

            data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
            data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
            data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");

            data["con-activity-name1"] = data["con-activity-name"];

            data["con-contract-rtotal-cn"] = utils.getCNMoney(parseFloat(data["con-contract-rtotal"]));

            data["con-precontract-total-cn"] = utils.getCNMoney(parseFloat(data["con-precontract-total"]));
            data["con-contract-stotal-cn"] = utils.getCNMoney(parseFloat(data["con-contract-stotal"]));

            data["sin-customer-ident"] = data["con-customer-ident"];

            if (contractEdit.contractArgs.company == "1") {
                delete data["con-customer-name"];
                delete data["con-customer-ident"];
                delete data["cov-customer-name"];

                data["cov-company-name"] = data["con-company-name"];
                data["sin-company-name"] = data["con-company-name"];
                data["sin-company-phone"] = data["con-company-phone"];
            }
            console.log(data);
            console.log(contractEdit.table);

            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "decorationContract.contract.cid": params.decoration.contractargs.cid,
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

            com.post(api.decoration.addDecorationContract, options, function(res) {

                com.closePopup();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);

                mask.remove();
                popup.css("overflow", "");
            });
        });
    });

});