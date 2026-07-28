jQuery(function ($) {

    var productionWorkPlan = {

        productionWorkPlanID : com.focusPage('#productionWorkPlanID'),
        param : {
            ppid: params["productionPlan.ppid"],
            workstatus: params["productionPlan.status"],
        },
        workshop : null
    };

    function renderList(){
        com.post(api.production.queryProductionWorkPlanByPpid,{"productionWorkPlan.ppid":productionWorkPlan.param.ppid},function (res) {
            displayFunc1.init(productionWorkPlan.productionWorkPlanID, res.productionWorkPlans);
        });
    };

    renderList();

    var displayFunc1 = (function () {

        var renderList1 = function (tableId, listData) {
            var $tableWrap = tableId.empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine1(v);
                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine1 = function (v) {

            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid');
            var $title = $('<small></small>').addClass('blue').html(' ' + v.sort+ '. '+ v.workplan.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $endBtn = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('完结');
            var $deleteBtn = $('<a></a>').addClass('btn btn-minier btn-success').html("废弃");

            switch (v.status) {
                case 0:
                    $status = '初始';
                    break;
                case 1:
                    $status = '执行';
                    break;
                case 2:
                    $status = '完结';
                    break;
                case 3:
                    $status = '废除';
                    break;
            }

            var $h5 = $('<h5></h5>').addClass('action-buttons pull-right');
            var $createTimeVIew =  $('<strong></strong>').html("创建时间: ").appendTo($h5);
            var $createTimeVIews = $('<b></b>').addClass("green").html(v.createTime+'&nbsp;&nbsp;&nbsp;').appendTo($createTimeVIew);
            var $endTimeVIew = $('<strong></strong>').html("完成时间: ").appendTo($h5);
            var $endTimeVIews = $('<b></b>').addClass("green").html(v.finishTime + '&nbsp;&nbsp;&nbsp;').appendTo($endTimeVIew);
            v.finishTime != null ? '' : $endTimeVIew.empty();
            var $statusVIew = $('<strong></strong>').html("状态: ").appendTo($h5);
            var $statusVIews = $('<b></b>').addClass("red").html($status+ '&nbsp;&nbsp;&nbsp;').appendTo($statusVIew);

            com.post(api.production.queryProductionWorkFlowByPwpid,{"productionWorkFlow.pwpid":v.pwpid},function (res) {
                productionWorkPlan.workshop = v.workplan.workshop.name;
                displayFunc2.init($ulProperty, res.productionWorkFlows);
            },null,false);

            $deleteBtn.click(function () {

                if(productionWorkPlan.param.workstatus == 0){
                    var option = {
                        "productionWorkPlan.ppid": productionWorkPlan.param.ppid ,
                        "productionWorkPlan.pwpid": v.pwpid
                    };

                    com.post(api.production.deleteProductionWorkPlan,option,function () {
                        com.showAlert(com.info, "操作成功");
                        renderList();
                    },null,true);
                }else{
                    com.showAlert(com.warning, "该生产计划单已经进行生产,不允许更改工序组");
                }

            });

            $endBtn.click(function(){
                com.post(api.production.finishProductionWorkPlan,{
                    "productionWorkPlan.ppid": productionWorkPlan.param.ppid ,"productionWorkPlan.pwpid": v.pwpid},function () {
                    com.showAlert(com.info, "操作成功");
                    renderList();
                });
            });
            $liLine.append($h3).append($ulProperty);
            switch (v.status) {
                case 0:
                    $btnDiv.append($endBtn).append($deleteBtn);
                    break;
                case 1:
                    $btnDiv.append($endBtn).append($deleteBtn);
                    break;
            }
            $h3.append($title).append($btnDiv);
            $h3.append($title).append($h5);
            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                if (!listData.length) {
                    var $resultList = productionWorkPlan.productionWorkPlanID.addClass('dz-default dz-message').html('');
                    var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
                    var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
                    var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
                    return $resultList;
                } else {
                    tableId.html(null);
                    renderList1(tableId, listData);
                }
            },
            drawLine: function (v) {
                return creatLine1(v);
            }
        };
    })();

    var displayFunc2 = (function () {
        var renderList2 = function (tableId, listData) {

            var $tableWrap = tableId.empty();
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
            var $div = $('<div></div>').addClass('widget-body');
            if (listData && listData.length) {
                $.each(listData, function (i, v) {
                    var $liLine = creatLine2(v);
                    $div.appendTo($ul);
                    $liLine.appendTo($div);
                });
                $ul.appendTo($tableWrap);
            }
        };

        var creatLine2 = function (v) {
            var $liLine = $('<div></div>').addClass('col-xs-6 col-sm-6').attr('id','portlet');
            var $h4 = $('<h4></h4>').addClass('oid');
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $div = $('<div></div>').addClass('widget-body');
            var $implementBtn = $('<a></a>').addClass('btn btn-minier btn-warning').html('执行');

            var propertyArr = [
                ["工序 : ",v.workflow.name, "blue"],
                ["操作状态 : ", constant.production().productionWorkFlow.status.keys[v.status], "red"],
                ["车间 : ", productionWorkPlan.workshop, "grey"],
                v.operator.currentName != null ? ["操作人 : ", v.operator.currentName, "grey"] : []
            ];



            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty).append($div);
            });

            $liLine.append($h4).append($ulProperty);
            switch (v.status) {
                case 0:
                    $btnDiv.append($implementBtn);
                    break;
            }
            $h4.append($btnDiv);

            $implementBtn.click(function(){
                com.post(api.production.operateProductionWorkFlow,{
                    "productionWorkFlow.pwfid": v.pwfid},function () {
                    com.showAlert(com.info, "操作成功");
                    renderList();
                });
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                tableId.html(null);
                renderList2(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine2(v);
            }
        };
    })();

    com.focusPage('#addWorkPlans').click(function () {

        if(productionWorkPlan.param.workstatus == 0){
            params.ppid = productionWorkPlan.param.ppid;
            com.popup4page("#addPopUp", "/views/production/workplan2add.html","查看工序");
        }else{
            com.showAlert(com.warning, "该生产计划单已经进行生产,不允许更改工序组");
        }

    });

    com.focusPage("#back").click(function () {
        if (params.differentiate) {
            com.switchPage(api.index.productionPlanIndex.url);
        } else {
            com.switchPage(api.index.productionPlanCreateIndex.url);
        }
    });
})();
