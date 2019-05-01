jQuery(function($){

    var approvalTrack = {
        postParam: {},
        type: ["劵", "物品"]
    };

    var approvalItemInfo = {
        "6": {
            "api": api.approval.queryApprovalMaterialRefundItem,
            "title": "主材信息",
            "resultname": "approvalMaterialRefundItems",
            "args": [
                ['10', '型号  : ', "materialItem.name"],
                ['40', '品类  : ', "materialItem.category"],
                ['40', '品牌  : ', "materialItem.brand"],
                ['10', '售价  : ', "materialItem.price"],
                ['40', '退货数量  : ', "num"],
                ['40', '退货金额  : ', "total"]
            ]
        },
        "8": {
            "api": api.approval.queryApprovalDecorationActivity,
            "title": "活动信息",
            "resultname": "approvalDecorationActivityItems",
            "args": [
                ['10', '活动名称  : ', "activityName"],
                ['40', '活动项  : ', "activityItemName"],
                ['40', '物品类型  : ', "type"],
                ['10', '金额  : ', "money"],
                ['40', '数量  : ', "num"],
                ['40', '备注  : ', "content"]
            ],
            "totalMoney": []
        },
        "10": {
            "api": api.approval.queryApprovalSalesRefundItem,
            "title": "销售信息",
            "resultname": "approvalSalesRefundItem",
            "args": [
                ['10', '名称  : ', "salesItem.goods.name"],
                ['40', '颜色  : ', "salesItem.color.name"],
                ['40', '规格  : ', "salesItem.format.info"],
                ['10', '售价  : ', "salesItem.selling"],
                ['40', '退货数量  : ', "num"],
                ['40', '退货金额  : ', "total"]
            ]
        }
    };

    var url = null;
    var postData = null;

    if (params['urlLoadParams'].type == 'send') {
        url = api.approval.pageApprovalForSend;
        postData = "approvalSenderTrackPostData"
    } else if (params['urlLoadParams'].type == 'receive') {
        url = api.approval.pageApprovalForReceive;
        postData = "approvalReceiveTrackPostData"
    } else if (params['urlLoadParams'].type == 'dept') {
        url = api.approval.pageApprovalForReceiveDept;
        postData = "approvalDeptTrackPostData"
    }


    com.post(api.ds.approval, {
        "timestamp": new Date().getTime()
    }, function (res) {
        approvalTrack.approvalType = res.approvalType;

        approvalTrack.approvalTypeData = {};

        for (var i = 0; i < approvalTrack.approvalType.length; i++) {
            var _ = approvalTrack.approvalType[i];
            approvalTrack.approvalTypeData[_["key"]] = _["value"];
        }
    }, null, false);

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass(
                'item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(approvalTrack.approvalTypeData[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            // 查看主材退款,主材详细信息按钮
            var $btnDetails = $('<a></a>').addClass('btn btn-minier btn-primary').html('详情');
            var $btnPass = $('<a></a>').addClass('btn btn-minier btn-success').html('通过').prepend($('<i></i>'));
            var $btnRefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('拒绝').prepend($('<i></i>'));

            var propertyArr = [
                ["申请人:", v.sender.userName, "grey"],
                ["提交时间:", v.createTime, "grey"],
                ["审批时间:", v.approvalTime, "grey"],
                ["状态:", v.status == 0 ? "等待" : (v.status == 1 ? "通过" : v.status == 3 ? "审批中" : "拒绝"), "red"]
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $content = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').append($('<li></li>').append($('<strong></strong>').append($('<b></b>').text(v.contents).addClass("grey"))));


            $divBtnWrap.appendTo($h3);

            if (v.status == 0) {
                $divBtnWrap.append($btnPass).append($btnRefuse).appendTo($h3);
            }

            $liLine.append($h3).append($ulProperty).append($content);
            $btnPass.bindClick(function () {
                approve(v.aid, api.approval.approveApproval);
            });

            $btnRefuse.bindClick(function () {
                approve(v.aid, api.approval.refuseApproval);
            });

            if ([6, 8, 10].indexOf(v.type) != -1) {

                $divBtnWrap.append($btnDetails).appendTo($h3);

                // 详细信息按钮
                $btnDetails.bindClick(function () {
                    queryInformationItem(v.aid, v.type);

                });

            }

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var searcher = new Searcher();

    if (params['urlLoadParams'].type == 'send') {
        searcher.init(["approval_receiverName", "approval_Type", "approval_createTime", "approval_Time"], "condList",
            url, function (data) {
                displayFunc.init('resultList', data);
            }, "pagenation", postData);


    } else if (params['urlLoadParams'].type == 'receive') {
        searcher.init(["approval_senderName", "approval_Type"], "condList",
            url, function (data) {
                displayFunc.init('resultList', data);
            },
            "pagenation", postData);

    } else if (params['urlLoadParams'].type == 'dept') {
        searcher.init(["approval_senderName", "approval_Type"], "condList",
            url, function (data) {
                displayFunc.init('resultList', data);
            },
            "pagenation", postData);

    }


    function approve(aid, url, $this) {
        com.post(url, {"approval.aid": aid}, function (res) {
            searcher.doSearch();
        }, null, false);
    }

    function queryInformationItem(aid, type) {

        if (com.focusPage('#materialInfoList').children()) {
            com.focusPage('#materialInfoList').empty();
        }

        var itemInfo = approvalItemInfo[type];
        var infoList = com.focusPage('#materialInfoList');
        itemInfo.totalMoney=[];
        com.post(itemInfo.api, {"approval.aid": aid}, function (res) {

            com.focusPage("#materialInfo").html(itemInfo.title);


            $.each(res[itemInfo.resultname], function (i, v) {

                $.each(itemInfo.args, function (j, e) {
                    if (e[2] == "type") infoList.append(approvalUtils.addspan(e[0], e[1], approvalTrack.type[getElement(v, e[2].split('.'))]));

                    else infoList.append(approvalUtils.addspan(e[0], e[1], getElement(v, e[2].split('.'))))

                });

                if (itemInfo.totalMoney) {

                    var tmoney = v.money * v.num;
                    itemInfo.totalMoney.push(tmoney);
                    com.focusPage('#totalMoneyList').html("总金额:" + sum(itemInfo.totalMoney));

                }

                infoList.append('<hr />')

            });

            com.focusPage('#msoiModel').modal("show");


        }, null, false);

    }

    function sum(totalMoney) {
        return eval(totalMoney.join('+'));
    }

    function getElement(o, props) {

        var prop = props.shift();

        if (props.length == 0) {
            return o[prop];
        } else if (o[prop]) {
            return getElement(o[prop], props);
        }

        return "";
    }
});

