jQuery(function($) {

    var approvalTrackSender = {
        postParam : {},
        type: ["劵","物品"]
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
            "totalMoney" : [],

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

    com.post(api.ds.approval, {
        "timestamp" : new Date().getTime()
    }, function(res) {
        approvalTrackSender.approvalType = res.approvalType;

        approvalTrackSender.approvalTypeData = {};

        for ( var i = 0; i < approvalTrackSender.approvalType.length; i++) {
            var _ = approvalTrackSender.approvalType[i];
            approvalTrackSender.approvalTypeData[_["key"]] = _["value"];
        }
    }, null, false);

    var displayFunc = (function() {

        var renderList = function(tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function(i, v) {
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(approvalTrackSender.approvalTypeData[v.type]));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            // 查看主材退款,主材详细信息按钮
            var $btnDetails = $('<a></a>').addClass('btn btn-minier btn-primary').html('详情');

            var propertyArr = [
                [ "审批人:", v.receiver.userName, "grey" ],
                [ "提交时间:", v.createTime, "grey" ],
                [ "审批时间:", v.approvalTime, "grey" ],
                ["状态:", v.status == 0 ? "等待" : (v.status == 1 ? "通过" : "拒绝"), "red" ]
            ];

            $.each(propertyArr, function(index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var $content = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix')
                .append($('<li></li>').append($('<strong></strong>')
                    .append($('<b></b>').text(v.contents == null ? "" : v.contents).addClass("grey"))));

            $divBtnWrap.appendTo($h3);

            $liLine.append($h3).append($ulProperty).append($content);

            if([6,8,10].indexOf(v.type) != -1){

                $divBtnWrap.append($btnDetails).appendTo($h3);

                // 详细信息按钮
                $btnDetails.bindClick(function() {
                    queryInformationItem(v.aid, v.type);
                });

            }

            return $liLine;
        };

        return {
            init : function(tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine : function(v) {
                return creatLine(v);
            }
        };
    })();
    var searcher = new Searcher();

    searcher.init([ "approval_receiverName", "approval_Type", "approval_createTime", "approval_Time" ], "condList",
        api.approval.pageApprovalBySenderId, function(data) {
            displayFunc.init('resultList', data);
        },
        "pagenation", "approvalSenderTrackPostData");

    function queryInformationItem(aid, type){

        if (com.focusPage('#materialInfoList').children()) {
            com.focusPage('#materialInfoList').empty();
        }

        var itemInfo = approvalItemInfo[type];
        var infoList = com.focusPage('#materialInfoList');

        com.post(itemInfo.api, {"approval.aid" : aid}, function(res) {

            com.focusPage("#materialInfo").html(itemInfo.title);

            $.each(res[itemInfo.resultname], function(i, v) {

                $.each(itemInfo.args, function(j, e){
                    if(e[2] == "type") infoList.append(approvalUtils.addspan(e[0], e[1], approvalTrackSender.type[getElement(v, e[2].split('.'))]))

                    else infoList.append(approvalUtils.addspan(e[0], e[1], getElement(v, e[2].split('.'))))

                });

                if(itemInfo.totalMoney){
                    itemInfo.totalMoney.push(v.money);
                    com.focusPage('#totalMoneyList').html("总金额:"+sum(itemInfo.totalMoney));
                }

                infoList.append('<hr />')
            });

            com.focusPage('#msoiModel').modal("show");

        }, null, false);
    }
    function sum(totalMoney){
        return eval(totalMoney.join('+'))
    }


    function getElement(o, props){

        var prop = props.shift();

        if(props.length == 0){
            return o[prop];
        }else if(o[prop]){
            return getElement(o[prop], props);
        }

        return "";
    }

});

