jQuery(function($){

    var approvalTrack = {
        
        type: ["劵", "物品"],
        url: null,
        postData : null,
        stateType:["到店", "定金", "签单", "抽奖", "特批", "购买", "其他", "升级"],
        
        btns: {
            submitBtn: com.focusPage("#submitBtn")
        },
        
        modals: {
            itemModel: com.focusPage('#itemModel'),
            approveModal: com.focusPage("#approveModal"),
        },
        
        items: {
            result: com.focusPage('#result'),
            annotate: com.focusPage('#annotate'),
        },
        
        approvalItemInfo : {
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
                ],
                "caleTotal": ["total"]
            },
            "8": {
                "api": api.approval.queryApprovalDecorationActivity,
                "title": "活动信息",
                "resultname": "approvalDecorationActivityItems",
                "args": [
                    ['10', '活动名称  : ', "activityName"],
                    ['40', '活动项  : ', "activityItemName"],
                    ['40', '物品类型  : ', "type"],
                    ['40', '状态类型  : ', "stateType"],
                    ['10', '金额  : ', "money"],
                    ['40', '数量  : ', "num"],
                    ['40', '备注  : ', "content"],
                    
                ],
                "caleTotal": ["money", "num"]
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
                ],
                "caleTotal": ["total"]
            },
            "14": {
                "api": api.approval.queryApprovalCustomerOriginTDecoration,
                "title": "客源信息",
                "resultname": "approvalCustomerOriginTDecoration",
                "args": [
                    ['10', '城市: ', "customerOrigin.house.village.cityProper.city.name"],
                    ['10', '城区: ', "customerOrigin.house.village.cityProper.name"],
                    ['10', '楼盘: ', "customerOrigin.house.village.name"],
                    ['10', '楼号: ', "customerOrigin.house.houseNumber"],
                    ['10', '面积: ', "customerOrigin.house.buildArea"],
                    ['10', '房屋类型: ', "houseClass"],
                    ['10', '房屋类别: ', "houseType "],
                    ['10', '客户: ', "customerOrigin.customer.name"],
                    ['10', '业务员: ', "salesman.currentName"],
                    ['10', '业务部: ', "salesman.dept.name"],
                    ['10', '设计师: ', "customerOrigin.designer.currentName"],
                    ['10', '设计部: ', "customerOrigin.designer.dept.name"],
                    ['10', '装修单类型: ', "typeness"],
                    ['10', '总面积: ', "customerOrigin.house.totalArea"],
                ]
            },
            "17": {
                "api": api.approval.queryApprovalCustomerOrigin,
                "title": "客源信息",
                "resultname": "approvalCustomerOrigin",
                "args": [
                    ['10', '城市: ', "customerOrigin.house.village.cityProper.city.name"],
                    ['10', '城区: ', "customerOrigin.house.village.cityProper.name"],
                    ['10', '楼盘: ', "customerOrigin.house.village.name"],
                    ['10', '楼号: ', "customerOrigin.house.houseNumber"],
                    ['10', '面积: ', "customerOrigin.house.buildArea"],
                    ['10', '客户: ', "customerOrigin.customer.name"],
                    ['10', '设计师: ', "customerOrigin.designer.currentName"],
                    ['10', '设计部: ', "customerOrigin.designer.dept.name"],
                    ['10', '总面积: ', "customerOrigin.house.totalArea"],
                ]
            }
        },
        
        approvalTypeData:{},
        approvalStatus: {},
        typenesses: {},
        aid: null,
        submitUrl : null,
    };

    if (params['urlLoadParams'].type == 'send') {
        approvalTrack.url = api.approval.pageApprovalForSend;
        approvalTrack.postData = "approvalSenderTrackPostData"	
    } else if (params['urlLoadParams'].type == 'receive') {
        approvalTrack.url = api.approval.pageApprovalForReceive;
        approvalTrack.postData = "approvalReceiveTrackPostData"
    } else if (params['urlLoadParams'].type == 'dept') {
        approvalTrack.url = api.approval.pageApprovalForReceiveDept;
        approvalTrack.postData = "approvalDeptTrackPostData"
    }
    
    com.post(api.ds.approval, {}, function (res) {
        approvalTrack.approvalTypeData = res.approvalType.split("key", "value");
        approvalTrack.approvalStatus = res.approvalStatus.split("key", "value");
    }, null, false);
    
    com.post(api.ds.decoration, {}, function (res) {
        approvalTrack.typenesses = res.typeness.split("key", "value");
    }, null, false);
    
    approvalTrack.btns.submitBtn.on("click", approve);
    
    approvalTrack.modals.approveModal.on('hide.bs.modal', function(e){
        com.clearValidator();
        com.cleanItems(approvalTrack.items);
    });

    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass(
                'item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    creatLine(v).appendTo($ul);
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

            var $btnAffirm = $('<a></a>').addClass('btn btn-minier btn-warning').html('客户确认').prepend($('<i></i>'));
            var $btnPass = $('<a></a>').addClass('btn btn-minier btn-success').html('通过').prepend($('<i></i>'));
            var $btnRefuse = $('<a></a>').addClass('btn btn-minier btn-danger').html('拒绝').prepend($('<i></i>'));
            
            
            var propertyArr = [
                ["申请人 : ", v.sender.currentName, "grey"],
                ["审批人 : ", v.receiver.currentName, "grey"],
                ["提交时间 : ", v.createTime, "grey"],
                ["审批时间 : ", v.approvalTime, "grey"],
                ["状态 : ", approvalTrack.approvalStatus[v.status], "red"],
                ["说明 : ", v.contents, "grey"],
                ["备注 : ", v.comment, "grey"],
                ["批注 : ", v.annotate, "grey"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            $divBtnWrap.appendTo($h3);
            
            
            if ([0, 5, 6].indexOf(v.status) != -1 && params['urlLoadParams'].type != 'send') {
                $divBtnWrap.append($btnPass).append($btnRefuse).appendTo($h3);
            }
            
            $liLine.append($h3).append($ulProperty);
            
            $btnAffirm.bindClick(function(){
                affirm(v.aid);
            });
            
            $btnPass.bindClick(function () {
                proapprove(v.aid, api.approval.approveApproval, "通过");
            });

            $btnRefuse.bindClick(function () {
                proapprove(v.aid, api.approval.refuseApproval, "拒绝");
            });

            if ([6, 8, 10, 14, 17].indexOf(v.type) != -1) {
            		
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
        searcher.init(["approval_receiverName", "approval_Type", "approval_Status", "approval_createTime", "approval_Time"], "condList", approvalTrack.url, function (data) {
            displayFunc.init('resultList', data);
        }, "pagenation", approvalTrack.postData);
    } else if (params['urlLoadParams'].type == 'receive') {
        searcher.init(["approval_senderName", "approval_Type", "approval_Status"], "condList", approvalTrack.url, function (data) {
            displayFunc.init('resultList', data);
        },
        "pagenation", approvalTrack.postData);
    } else if (params['urlLoadParams'].type == 'dept') {
        searcher.init(["approval_senderName", "approval_Type", "approval_Status"], "condList", approvalTrack.url, function (data) {
            displayFunc.init('resultList', data);
        },
        "pagenation", approvalTrack.postData);
    }
    
    function proapprove(aid, submitUrl, result){
        
        approvalTrack.aid = aid;
        approvalTrack.submitUrl = submitUrl;
        
        approvalTrack.items.annotate.val("");
        approvalTrack.items.result.text(result);
        
        approvalTrack.modals.approveModal.modal("show");
    }

    function approve() {
        
        var options = {
            "approval.aid": approvalTrack.aid,
            "approval.annotate": approvalTrack.items.annotate.val(),
        }
        
        com.post(approvalTrack.submitUrl, options, function (res) {
            searcher.doSearch();
            
            approvalTrack.aid = null;
            approvalTrack.submitUrl = null;
            
            approvalTrack.modals.approveModal.modal("hide");
        });
    }
    
    function affirm(aid){  
        var options = {
            "approval.aid": aid
        }
        com.post(api.approval.affirmApproval, options, function (res) {
            searcher.doSearch();
        });
    }
    
    function queryInformationItem(aid, type) {

        if (com.focusPage('#itemList').children()) {
            com.focusPage('#itemList').empty();
        }
        
        com.focusPage('#totalMoney').hide();

        var itemInfo = approvalTrack.approvalItemInfo[type];
        var infoList = com.focusPage('#itemList');
        
        com.post(itemInfo.api, {"approval.aid": aid}, function (res) {
            
            var totalMoney = 0;

            com.focusPage("#itemTitle").html(itemInfo.title);
            
            var data = $.isArray(res[itemInfo.resultname]) ? res[itemInfo.resultname] : [res[itemInfo.resultname]]
            
            $.each(data, function (i, v) {
        
                $.each(itemInfo.args, function (j, e) {
     
                    if (e[2] == "type") infoList.append(approvalUtils.addspan(e[0], e[1], approvalTrack.type[getElement(v, e[2].split('.'))]));
                    if (e[2] == "stateType") infoList.append(approvalUtils.addspan(e[0], e[1], approvalTrack.stateType[getElement(v, e[2].split('.'))]));
                    if (e[2] == "typeness") infoList.append(approvalUtils.addspan(e[0], e[1], approvalTrack.typenesses[getElement(v, e[2].split('.'))]));
                    
                    if(e[2] != "type" && e[2] != "stateType" && e[2] != "typeness") infoList.append(approvalUtils.addspan(e[0], e[1], getElement(v, e[2].split('.'))))
                });
                
                var caleTotal = itemInfo.caleTotal;
                
                if (caleTotal && caleTotal.length == 2) {
                    totalMoney += parseFloat(v[caleTotal[0]]) * parseFloat(v[caleTotal[1]]);
                } else if (caleTotal && caleTotal.length == 1) {
                    totalMoney += parseFloat(v[caleTotal[0]]);
                }

                infoList.append('<hr />');
            });
            
            if(itemInfo.caleTotal) com.focusPage('#totalMoney').html("总金额:" + totalMoney).show();
            
            approvalTrack.modals.itemModel.modal("show");
        });
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

