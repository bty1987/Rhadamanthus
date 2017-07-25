var decorationOrderPostData = {};


jQuery(function($) {


    var displayFunc = (function () {
        //ID名,API分页查询的返回值
        var renderList = function (tableId, listData) {
            //创建DIV
            var $tableWrap = $('#' + tableId);
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decorationOrder.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnView = $('<a></a>').addClass('btn btn-minier btn-primary').html('查看');
            var $btnPrice = $('<a></a>').addClass('btn btn-minier btn-default').html('扣款');
            var $btnAddMinus = $('<a></a>').addClass('btn btn-minier btn-success').html('信息轴');
            var $btnInfo = $('<a></a>').addClass('btn btn-minier btn-danger').html('申请审核');


            var propertyArr = [
                //显示的信息类型,显示信息的数据,显示信息的颜色
                ["楼盘地址:", v.decorationOrder.village.villageName + ' ' + v.decorationOrder.houseNumber, "grey"],
                ["客户:", v.decorationOrder.customer.customerName, "grey"],
                ["设计师:", v.decorationOrder.designer, "grey"],
                ["设计部:", v.decorationOrder.designDepartment, "grey"],
                ["设计部经理:", v.deptDutyName, "grey"],
                ["面积:", v.decorationOrder.houseArea, "grey"],
                ["量房时间:", v.decorationOrder.createTime , "grey"],
                ["签单时间:", v.decorationOrder.contractTime, "grey"],
                ["类型:", v.decorationOrder.type == 0 ? '半包' : (v.type == 1 ? '全包' : '半价'), "red"],
                ["状态:", v.decorationOrder.status, "red"],
                ["审核状态:", v.auditer?'已审核':'未审核', "red"],
            ];
            if(v.auditer){
                $btnInfo = null;
                propertyArr.push(["审核人:", v.auditer.currentName, "red"]);
                propertyArr.push(["审核时间:", v.auditTime, "red"]);

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
                auditScale(v.decorationOrder.orderId,v.decorationOrder.type, v.versionId, v.notSalesmanRate);
            })

            $btnPrice.click(function(){
                viewAuditRecord(v.decorationOrder.orderId, v.designerId,v.deptId,v.deptDutyUId);
            });

            $btnAddMinus.click(function(){
                viewDecorationOrderTimelineIndex(v.decorationOrder.orderId);
            })

            $btnInfo && $btnInfo.click(function(){
                applyAudit(v.aid);
            });


            return $liLine;
        };

        var viewAuditRecord = function (aid,designerId,deptId,deptDutyUserId){
            params['decorationOrderId'] = aid;
            params["designerId"] = designerId;
            params["deptId "] = deptId;
            params["managerId"] = deptDutyUserId;
            params['auditStatusType'] = 'admin';
            params['rollback'] = api.index.auditIndex.url;
            com.switchPage(api.index.auditRecordIndex.url);
        }

        return {
            //数据显示框的ID,分页查询API的返回值
            init: function (tableId, listData) {
                //创建DIV 并且内容为null
                $('#' + tableId).html(null);

                renderList(tableId, listData);
            },
            audit: function (v) {
                return creatLine(v);
            }
        }
    })();
    var _condArr = ['orderId', 'village', 'designer','supervisor','designerDepartmentId',
        'createTimeDateRange','signTimeDateRange','status','auditStatus','auditName'];
    var searcher = new Searcher();
    //查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名
    searcher.init(_condArr, "condList", api.decoration.pageAudit, function (data) {
        //resultList是显示数据的DIV,data是返回值
        displayFunc.init('resultList', data);
    }, "pagenation");


    function applyAudit(aid){
        bootbox.confirm("确认审核吗？",function(res){
            //如果为ture
            if(res){
                com.post(api.decoration.applyAudit, {"auditVO.aid":aid}, function(res){
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
            }
        });

    }


    var auditScale = function (decorationOrderId, type, versionId, notSalesmanRate){
        decorationOrderPostData["decorationOrderId"] = decorationOrderId;
        decorationOrderPostData["orderType"] = type;
        decorationOrderPostData["versionId"] = versionId;
        decorationOrderPostData["notSalesmanRate"] = notSalesmanRate;
        com.switchPage(api.index.auditDetail.url);
    }

    var viewDecorationOrderTimelineIndex = function(orderId){
        params.decorationOrderId = orderId;
        com.switchPage(api.index.decorationOrderTimelineIndex.url);
    }
})