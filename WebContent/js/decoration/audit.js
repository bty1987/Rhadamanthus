
jQuery(function($) {
	
	var audit = {
		decorationOrderStatus: {},
        type: {}
	};
	
	com.post(api.ds.decoration, {}, function (res) {
		$.each(res.decorationOrderStatus, function(i,v){
			audit.decorationOrderStatus[v.key] = v.value;
		});
		$.each(res.typeness, function(i,v){
			audit.type[v.key] = v.value;
		});
    }, null, false);


    var displayFunc = (function () {
        //ID名,API分页查询的返回值
        var renderList = function (tableId, listData) {
            //创建DIV
            var $tableWrap = com.focusPage('#' + tableId);
            //创建一对UL并添加bootstrap的样式
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            //如果返回值不为null
            if (listData && listData.length) {
                //循环返回值
                $.each(listData, function (i, v) {

                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function (v) {

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnPrice = $('<a></a>').addClass('btn btn-minier btn-success').html('扣款');
            var $btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-warning').html('信息轴');
            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-inverse').html('申请审核');

            var propertyArr = [
                //显示的信息类型,显示信息的数据,显示信息的颜色
                ["楼盘地址:", v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"],
                ["客户:", v.decoration.customer.name, "grey"],
                ["设计师:", v.decoration.designer.currentName, "grey"],
                ["设计部:", v.decoration.designer.dept.name, "grey"],
                ["面积:", v.decoration.house.buildArea, "blue "],
                ["量房时间:", v.decoration.measureTime , "green"],
                ["签单时间:", v.decoration.contractTime, "green"],
                ["类型:",  audit.type[v.decoration.type], "red"],
                ["状态:", audit.decorationOrderStatus[v.decoration.status], "red"],
                ["审核状态:", v.auditer?'已审核':'未审核', "red"]
            ];
            if(v.auditer){
                $btnInfo = null;
                propertyArr.push(["审核人:", v.auditer.currentName, "grey"]);
                propertyArr.push(["审核时间:", v.auditTime, "green"]);

            }
            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnView).append($btnPrice).append($btnAddMinus).append($btnInfo).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnView.click(function(){
                auditScale(v.decoration.orderId,v.decoration.type, v.decoration.typeness, v.versionId, v.notSalesmanRate);
            });

            $btnPrice.click(function(){
                viewAuditRecord(v.decoration.orderId, v.decoration.designer.uid,v.decoration.designer.dept.no);
            });

            $btnAddMinus.click(function(){
                viewdecorationTimelineIndex(v.decoration.orderId);
            });

            $btnInfo && $btnInfo.click(function(){
                applyAudit(v.aid);
            });


            return $liLine;
        };

        var viewAuditRecord = function (aid,designerId,deptId){
            params['decorationOrderId'] = aid;
            params["designerId"] = designerId;
            params["deptId"] = deptId;
            params['auditStatusType'] = 'admin';
            params['historyPage'] = api.index.auditIndex.url;
            params["viewNode"] = [{type:"basic",opt:{btn:["customerInfosBtn"]}},{type:"quotaion",opt:{btn:["btnPrintDefaultQuotationInfo"]}},{type:"picture"},{type:"material"},{type:"activity"},{type:"payment"},{type:"belong"}];
            com.switchPage(api.index.auditRecordIndex.url);
        };

        return {
            //数据显示框的ID,分页查询API的返回值
            init: function (tableId, listData) {
                //创建DIV 并且内容为null
                com.focusPage('#' + tableId).html(null);

                renderList(tableId, listData);
            },
            audit: function (v) {
                return creatLine(v);
            }
        };
    })();
    var _condArr = ['orderId', 'village', 'designer','c_supervisor','designerDepartmentId',
        'createTimeDateRange','signTimeDateRange','auditTime','status','auditStatus','auditName'];
    var searcher = new Searcher();
    //查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名
    searcher.init(_condArr, "condList", api.decoration.pageAudit, function (data) {
        //resultList是显示数据的DIV,data是返回值
        displayFunc.init('resultList', data);
    }, "pagenation");


    function applyAudit(aid){
        com.showConfirm("确认审核吗?",function(){
            //如果为ture
            com.post(api.decoration.applyAudit, {"audit.aid":aid}, function(res){
                com.showAlert(com.info, "操作成功");
                searcher.doSearch();
            });
        });

    }


    var auditScale = function (decorationOrderId, type, typeness, versionId, notSalesmanRate){
        params["decorationOrderId"] = decorationOrderId;
        params["orderType"] = type;
        params["orderTypeness"] = typeness;
        params["versionId"] = versionId;
        params["notSalesmanRate"] = notSalesmanRate;
        params['historyPage'] = api.index.auditIndex.url;
        params["viewNode"] = [{type:"basic",opt:{btn:["customerInfosBtn"]}}, {type:"quotation",opt:{btn:["btnPrintDefaultQuotationInfo"]}}, {type:"picture",opt:{display:["OriginalPicture", "designPictures", "projectPictures", "contractMap", "CADProjectPicture"],show:["designPictureUpload", "projectPictureUpload", "CADUpload", "ContractUpload", "OriginalUpload"]}}, {type:"material"}, {type:"activity"},{type:"payment"},{type:"belong"}, {type: "addreduce"}];
        com.switchPage(api.index.decorationDetailIndex.url);
    };

    var viewdecorationTimelineIndex = function(orderId){
        params.decorationOrderId = orderId;
        com.switchPage(api.index.decorationTimelineIndex.url);
    };
});