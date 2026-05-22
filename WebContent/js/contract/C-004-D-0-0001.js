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
 * 此文件为: 爱林装修工程预签合同
 */

jQuery(function($) {

    var contractEdit = {

        customer: null,
        decoration: null,

        cover: {},
        table: [],

        modal: {
            talkingModal: com.focusPage('#talkingModal')
        },

        item: {
            houseType: com.focusPage("#con-housetype"),
            houseTypeness: com.focusPage("#con-housetypeness"),
            showMoney: com.focusPage("#showMoney"),
            decorationPictureType: com.focusPage("#con-decorationPicture-type")
        },

        contractArgs: params.decoration.contractargs,
        decorationOrderId: params.decoration.orderId,

        decorationType: {},

        $input: null,

        current: new Date()
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

    contractEdit.decorationType = constant.decoration().decoration.typeness.keys;
    contractEdit.item.houseType.bindData(constant.decoration().decoration.houseClass.datas, 'key', 'value');
    contractEdit.item.houseTypeness.bindData(constant.decoration().decoration.houseType.datas, 'key', 'value');
    contractEdit.item.decorationPictureType.bindData(constant.decoration().decorationPicture.type.datas, 'key', 'value');

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

        contractEdit.customer = customer;

        com.focusPage("#con-customer-name", "#form").val(customer.name);
        com.focusPage("#con-bank-man", "#form").val(customer.name);
        com.focusPage("#con-bank-no", "#form").val(customer.companyBankno);
        com.focusPage("#con-bank-name", "#form").val(customer.companyBank);

        contractEdit.cover["cov-orderId"] = contractEdit.decorationOrderId;
        contractEdit.cover["cov-customer-name"] = customer.name;
        contractEdit.cover["sin-customer-name"] = customer.name;

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
        com.focusPage("#con-housetypeness", "#form").val(data.houseType);

        com.focusPage("#con-house-type", "#form").val(contractEdit.decorationType[data.type]);
        com.focusPage("#con-work-type", "#form").val(contractEdit.decorationType[data.type]);
        com.focusPage("#con-work-model", "#form").val(contractEdit.decorationType[data.type]);

        com.focusPage("#con-contract-total", "#form").val(utils.accAdd(parseFloat(data.orderTotalPrice), parseFloat(contractEdit.designPrice)));
        com.focusPage("#con-contract-stotal", "#form").val(data.orderTotalPrice);
        com.focusPage("#con-contract-rtotal", "#form").val(data.factPrice);

        com.focusPage("#con-buildarea", "#form").val(house.innerArea);
        
        contractEdit.decoration = data;

        contractEdit.cover["cov-buildarea"] = data.house.innerArea;
        contractEdit.cover["cov-designer-name"] = data.designer.currentName;
        contractEdit.cover["cov-designer-phone"] = data.designer.phone;
    }, null, false);

    com.post(api.data.queryCustomerForPhone, {
        "customerPhone.cid": contractEdit.customer.cid,
        "customerPhone.cpid": 0
    }, function(res) {

        contractEdit.customer = res.customer;

        com.focusPage("#con-customer-phone", "#form").val(contractEdit.customer.phone);
        com.focusPage("#sin-customer-phone", "#form").val(contractEdit.customer.phone);
        com.focusPage("#con-customer-ident", "#form").val(contractEdit.customer.identity);

        com.focusPage("#con-bank-no", "#form").val(contractEdit.customer.companyBankno);
        com.focusPage("#con-bank-name", "#form").val(contractEdit.customer.companyBank);
        com.focusPage("#con-bank-phone", "#form").val(contractEdit.customer.phone);

        com.focusPage("#con-company-no", "#form").val(contractEdit.customer.companyNo);
        com.focusPage("#con-company-name", "#form").val(contractEdit.customer.companyName);
        com.focusPage("#con-company-name1", "#form").val(contractEdit.customer.companyName);
        com.focusPage("#con-company-phone", "#form").val(contractEdit.customer.companyPhone);
        com.focusPage("#con-company-addr", "#form").val(contractEdit.customer.companyAddr);
        com.focusPage("#con-company-bank", "#form").val(contractEdit.customer.companyBank);
        com.focusPage("#con-company-bankno", "#form").val(contractEdit.customer.companyBankno);

        contractEdit.cover["cov-customer-phone"] = contractEdit.customer.phone;
        contractEdit.cover["sin-customer-ident"] = contractEdit.customer.identity;

    }, null, false);

    com.post(api.construction.queryConstructionInfoByOrderId, {
        "constructionInfo.orderId": contractEdit.decorationOrderId
    }, function(result) {

        var datas = result.constructionInfo;

        com.focusPage("#con-work-number", "#form").val(datas.timeLimit);

        com.datetime(com.focusPage("#con-work-year", "#form").val(datas.drawlineTime ? datas.drawlineTime.substr(0, 4) : ""), "year");
        com.datetime(com.focusPage("#con-work-month", "#form").val(datas.drawlineTime ? datas.drawlineTime.substr(5, 2) : ""), "month");
        com.datetime(com.focusPage("#con-work-day", "#form").val(datas.drawlineTime ? datas.drawlineTime.substr(8, 2) : ""), "day");
    });

    quotationUtils.quotationDetail = {
        protation: {},
        protationItems: {}
    };
    params.showType = {
        itemtype: 10
    };

    com.post(api.quotation.queryProtationForDefaultByOrderId, {
        "protation.orderId": contractEdit.decorationOrderId
    }, function(res) {

        quotationUtils.quotationDetail.protation = res.protation;
        contractEdit.totalPrice = res.protation.totalPrice;
        
        com.focusPage("#con-precontract-total", "#form").val(Math.round(utils.accSub(res.protation.totalPrice, contractEdit.decoration.couponCut)));
        com.focusPage("#con-precontract-total-30", "#form").val(Math.round(utils.accMul(utils.accSub(res.protation.totalPrice, contractEdit.decoration.couponCut), 0.3)));

    }, null, false);

    com.post(api.decoration.queryDecorationActivityByOrderId, {
        "decorationActivity.orderId": contractEdit.decorationOrderId
    }, function(res) {

        var decorationActivitys = res.decorationActivitys;

        if (decorationActivitys.length != 0)
            com.focusPage("#con-activity-name", "#form").val(decorationActivitys[0].activity.name);
    });

    if (!quotationUtils.quotationDetail.protation.pid) {
        com.showAlert(com.warning, "无预签信息");
        com.focusPage("#contractPopUp").html("");
        return false;
    }

    com.post(api.quotation.queryProtationItemByPid, {
        "protationItem.pid": quotationUtils.quotationDetail.protation.pid
    }, function(res) {

        quotationUtils.quotationDetail.protationItems = res.protationItems;
    }, null, false);

    com.post(api.quotation.queryProtationByPid, {
        "protation.pid": quotationUtils.quotationDetail.protation.pid
    }, function(res) {

        protation = res;
    }, null, false);

    com.post(api.quotation.queryPresignProduceByPpid, {
        "presignProduce.ppid": protation.protation.ppid
    }, function(res) {

        presignProduce = res.presignProduce;
    }, null, false);

    var table1 = {
        "insertWay": 1,
        "keyword": "家装项目预签列表",
        "pageBegin": 1,
        "headers": [],
        "colWidthPercent": [],
        "headersAlignment": 1,
        "cellHorizontalAlignment": 0,
        "cellVerticalAlignment": 5,
        "datas": []
    };

    var protationItems = {
        0: {
            name: "标配产品",
            item: [],
            items: [],
            totals: []
        },
        1: {
            name: "赋能产品",
            item: [],
            items: [],
            totals: []
        },
        2: {
            name: "标配外功能区",
            item: [],
            items: [],
            totals: []
        },
        3: {
            name: "个性化产品",
            item: [],
            items: [],
            totals: []
        },
        4: {
            name: "标配产品减项",
            item: [],
            items: [],
            totals: []
        }
    };

    var empowermentTotal = 0;
    var functionTotal = 0;
    var subtractTotal = 0;

    $.each(quotationUtils.quotationDetail.protationItems, function(i, qv) {

        if (qv.type == 0 && utils.accSub(qv.num, qv.basicNum) > 0) {

            qv.total = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, utils.accSub(qv.num, qv.basicNum))) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, utils.accSub(qv.num, qv.basicNum)), protation.protation.quoteArea));

            protationItems[2].items.push([qv.name, utils.accSub(qv.num, qv.basicNum), qv.total]);
            protationItems[2].item.push([qv.name, utils.accSub(qv.num, qv.basicNum)]);

            functionTotal = utils.accAdd(functionTotal, qv.total);
        }

        if (qv.type == 5 || qv.type == 6) {

            qv.total = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, qv.num)) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, qv.num), protation.protation.quoteArea));

            protationItems[4].items.push([qv.name, -qv.num, qv.total]);
            protationItems[4].item.push([qv.name, -qv.num]);

            subtractTotal = utils.accAdd(subtractTotal, qv.total);
        }

        if (qv.type == 7 || qv.type == 8) {

            qv.total = qv.areaCale == constant.data().presignItem.AREACALE_NUMBER_INT ? utils.changeThrDecimal(utils.accMul(qv.price, qv.num)) : utils.changeThrDecimal(utils.accMul(utils.accMul(qv.price, qv.num), protation.protation.quoteArea));

            protationItems[1].items.push([qv.name, qv.num, qv.total]);
            protationItems[1].item.push([qv.name, qv.num]);

            empowermentTotal = utils.accAdd(empowermentTotal, qv.total);
        }
    });

    protationItems[0].items.push(["标配产品", 1, utils.accAdd(protation.protation.quotePrice, protation.protation.activityPrice)]);
    protationItems[0].items.push(["优惠金额", '', protation.protation.preferPrice]);
    protationItems[0].items.push(["管理费收取比例", 1, protation.protation.manageRate]);
    protationItems[0].items.push(["管理费", 1, protation.protation.managePrice]);
    protationItems[0].items.push(["管理优惠", 1, protation.protation.manageProfit]);
    protationItems[0].items.push(["活动优惠", 1, protation.protation.activityProfit]);

    if (protation.protation.advanceProfit && protation.protation.advanceProfit != 0) {
        protationItems[0].items.push(["特批优惠", 1, protation.protation.advanceProfit]);
    }

    protationItems[0].items.push(["税金金额", 1, protation.protation.taxPrice]);
    protationItems[3].items.push(["基础增项", 1, protation.protation.adddPrice]);
    protationItems[3].items.push(["主材增项", 1, protation.protation.addmPrice]);
    protationItems[0].item.push(["标配产品", 1]);
    protationItems[0].item.push(["优惠金额", '']);
    protationItems[0].item.push(["管理费收取比例", 1]);
    protationItems[0].item.push(["折后管理费", 1]);
    protationItems[3].item.push(["工程个性化预收", 1]);
    protationItems[3].item.push(["主材个性化预收", 1]);

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

    function showControl(v) {

        if (v == 3) {

            table1.headers.push('', '', '');
            table1.colWidthPercent.push(3, 3, 3);
            table1.datas.push([presignProduce.name, '', '']);
            table1.datas.push(["项目", "计价面积", ""]);
            table1.datas.push([protation.protation.name, protation.protation.quoteArea, '']); // utils.changeThrDecimal(utils.accAdd(utils.accMul(protation.protation.quotePrice, utils.accAdd(1, protation.protation.manageRate)), utils.accAdd(protation.protation.accdPrice, protation.protation.accmPrice)))

            $.each(protationItems, function(i, q) {

                table1.datas.push([q.name, '', '']);
                table1.datas.push(["项目", "数量", "金额"]);
                $.each(q.items, function(j, qi) {

                    table1.datas.push(qi);
                });
                $.each(q.totals, function(k, qt) {

                    table1.datas.push(qt);
                });

            });

            table1.datas.push(["合计(不含税)", '', utils.changeThrDecimal(utils.accSub(protation.protation.totalPrice, protation.protation.taxPrice))]);
            table1.datas.push(["税金", '', protation.protation.taxPrice]);
            table1.datas.push(["预签合计(含税)", '', protation.protation.totalPrice]);
        } else {

            table1.headers.push('', '');
            table1.colWidthPercent.push(3, 3);
            table1.datas.push([presignProduce.name, '']);
            table1.datas.push(["项目", "计价面积"]);
            table1.datas.push([protation.protation.name, protation.protation.quoteArea]);

            $.each(protationItems, function(i, q) {

                table1.datas.push([q.name, '']);
                table1.datas.push(["项目", "数量"]);
                $.each(q.item, function(j, qi) {

                    table1.datas.push(qi);
                });
            });
        }
    }

    contractEdit.table.push(table1);

    // var table2 = {
    // "insertWay": 1,
    // "keyword": "活动礼品项目列表",
    // "pageBegin": 1,
    // "headers": ["序号", "名称", "数量"],
    // "colWidthPercent": [1, 3, 1],
    // "headersAlignment": 1,
    // "cellHorizontalAlignment": 0,
    // "cellVerticalAlignment": 5,
    // "datas": []
    // };

    // var decorationActivityItems = [];
    //
    // com.post(api.decoration.queryDecorationActivityItem, {
    // "decoration.orderId": contractEdit.decorationOrderId
    // }, function(res) {
    //
    // decorationActivityItems = res.decorationActivityItems;
    // }, null, false);
    //
    // var index = 0;
    //
    // if (decorationActivityItems && decorationActivityItems.length) {
    //
    // $.each(decorationActivityItems, function(i, v) {
    //
    // if (v.type != 1)
    // return true;
    // if ([0, 2, 4, 6].indexOf(v.state) == -1)
    // return true;
    //
    // table2.datas.push([(index++ + 1), v.activityItemName, v.num]);
    // });
    // }
    //
    // contractEdit.table.push(table2);

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

            data["cov-address"] = data["con-village-name"] + " " + data["con-housenumber"];

            data["con-sign-year"] = com.dateFormat(contractEdit.current, "yyyy");
            data["con-sign-month"] = com.dateFormat(contractEdit.current, "MM");
            data["con-sign-day"] = com.dateFormat(contractEdit.current, "dd");

            data["con-design-money-cn"] = utils.getCNMoney(parseFloat(data["con-design-money"]));

            data["con-precontract-total-cn"] = utils.getCNMoney(parseFloat(data["con-precontract-total"]));
            data["con-precontract-total-30"] = Math.round(parseFloat(data["con-precontract-total"]) * 0.3);

            data["sin-customer-ident"] = data["con-customer-ident"];

            data["con-precontract-total"] = data["con-precontract-total"];

            delete data["showMoney"];

            if (contractEdit.contractArgs.company == "1") {
                delete data["con-customer-name"];
                delete data["con-customer-ident"];
                delete data["cov-customer-name"];

                data["cov-company-name"] = data["con-company-name"];
                data["sin-company-name"] = data["con-company-name"];
                data["sin-company-phone"] = data["con-company-phone"];
            }

            if (contractEdit.item.showMoney.val() == 1) {
                showControl(3);
            } else {
                showControl(2);
            }

            var url = api.decoration.addDecorationContract;
            var options = {
                "decorationContract.orderId": params.decoration.orderId,
                "contract.cid": params.decoration.contractargs.cid,
                "data": JSON.stringify(data),
                "table": JSON.stringify(contractEdit.table)
            };

            if (params.decoration.contract && params.decoration.contract.dcid) {
                url = api.decoration.makeDecorationContract;
                options["decorationContract.dcid"] = params.decoration.contract.dcid;
            }

            console.log(data);
            com.post(url, options, function(res) {

                com.closePopup();
            }, function(res) {

                com.showAlert(com.error, res.errorMsg);
            });
        });
    });

});