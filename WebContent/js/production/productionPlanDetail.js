jQuery(function ($) {

    var $pageDiv = com.focusPage('.pageDiv');
    var ppid = params["productionPlan.ppid"];
    var workstatus = params["productionPlan.status"];
    var $productionStatus = params["production.status"];

    function drawProgress() {
        com.post(api.production.queryProductionWorkPlanByPpid,{"productionWorkPlan.ppid":ppid},function (res) {
            com.focusPage("div[name='portlet']").remove();//清空之前形成的页面
            var workplans = res.productionWorkPlans;

            $.each(workplans,function (i,v) {

                var $detailBox = createDiv(v);
                var workFlowsArr = showWorkFlow(v);

                $.each(workFlowsArr,function (index,val) {
                    var $workshopDiv = $('<li></li>').addClass('lab')
                        .append($('<span></span>').html('车'+'&nbsp;&nbsp;&nbsp;&nbsp;'+'间:'))
                        .append($('<span></span>').html(v.workplan.workshop.name));
                    $workshopDiv.appendTo(workFlowsArr[index].find('.target'));

                    workFlowsArr[index].appendTo($detailBox.find('div[name="portletbody"]'));
                });
                $detailBox.appendTo($pageDiv);
            });

        },null,true);
    }

    drawProgress();

    function showWorkFlow(data) {
        var pwfids = [];//查询操作状态用
        var options = [];
        var workflows ={};
        var returnOptions ={};

        com.post(api.production.queryProductionWorkFlowByPwpid,{"productionWorkFlow.pwpid":data.pwpid},function (res) {
            workflows = res.productionWorkFlows;
        },null,false);

        $.each(workflows,function(i,v){
            pwfids["productionUserWorkFlows["+i+"].productionworkflow.pwfid"] = v.pwfid;//查询操作状态用

        });
        console.log(pwfids)
        com.post(api.production.queryProductionUserWorkFlowsByPwfid,pwfids,function (res) {

            returnOptions = res.productionUserWorkFlows;
        },null,false);

        $.each(workflows,function (index,val) {
            var productionUserWorkFlows = [];

            $.each(returnOptions,function(i,v){
                if(v.productionworkflow.pwfid == val.pwfid){
                    productionUserWorkFlows.push(v);
                }
            });

            var $workflowul = $('<ul></ul>').addClass('workflow item-list fl-table-list ui-sortable');
            var $workflowli = $('<li></li>').addClass('workflowList item-blue clearfix');
            var $detailul = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix target');
            var $workflowDiv = $('<li></li>').addClass('lab')
                .append($('<span></span>').html('工'+'&nbsp;&nbsp;&nbsp;&nbsp'+'序:'))
                .append($('<span></span>').html(val.workflow.name));
            $workflowDiv.appendTo($detailul);
            var $operateStatus = $('<li></li>').addClass('lab')
                .append($('<span></span>').attr('style','color:black;margin-left:10px;').html('操作状态:'));

            if(productionUserWorkFlows.length != 0){

                $.each(productionUserWorkFlows,function (i,v) {

                    var $photo = $('<div Style="border: 1px solid #ccc ; display : contents;"></div>').css("width", "50px").css("height","50px").css("margin-bottom", "10px").css("margin", "10px 10px");
                    var img = $('<img />').appendTo($photo);
                    var url =com.showImg(img, v.userPhoto, 50, 50, '', null, 0);

                    var $operator = $('<span></span>').html('操作人:');
                    var $workflowSpan = $('<span></span>').html(v.operator.currentName != null ? v.operator.currentName : '暂无').addClass('workflowSpan').css('font-size','150%');

                    $workflowli.append($photo).append($operator).append($workflowSpan)
                        .append(i%2 == 0 ? null : $('<br/>'))
                })

            }
            var $isOperate = $('<span></span>').html(productionUserWorkFlows.length != 0 ? '已操作': '').attr('style','color:red;margin-left:10px;');

            $operateStatus.append($isOperate);
            $operateStatus.appendTo($detailul);
            $workflowul.append($workflowli.append($detailul));
            options.push($workflowul);
        });

        return options;
    }

    function createDiv(data) {

        var $topspan = $('<div></div>').addClass('col-xs-6 col-sm-6').attr('name','portlet');
        var $top = $('<div></div>').addClass('widget-box transparent');
        var $title = $('<div></div>').addClass('widget-header');
        var $body = $('<div></div>').addClass('widget-body').attr('name','portletbody');
        var $span = $('<h4></h4>').html($('<strong></strong>').text(data.workplan.name));
        var $deleteBtn = $('<a></a>').addClass('btn btn-xs btn-danger pull-right').attr('name', 'delete').text("删除");

        $deleteBtn.click(function () {

            if(workstatus == 0 && $productionStatus != 4 && $productionStatus != 5 ){
                var option = {};
                option["productionWorkPlan.workplan.wpid"] = data.workplan.wpid;
                option["productionWorkPlan.ppid"] = ppid;

                com.post(api.production.deleteProductionWorkPlan,option,function (res) {
                    layer.msg("删除成功");
                    $topspan.remove();
                },null,true);
            }else{
                layer.msg('该生产计划单已经进行生产，不允许更改工序组');
            }

        });

        $deleteBtn.appendTo($span);
        $title.append($span).appendTo($top);
        $body.appendTo($top);
        $top.appendTo($topspan);
        return $topspan;
    }

    com.focusPage('#addWorkPlans').click(function () {

        if(workstatus == 0 && $productionStatus != 4 && $productionStatus != 5 ){
            addProductionWorkPlans(ppid);
        }else{
            layer.msg('该生产计划单已经进行生产，不允许更改工序组');
        }

    });

    com.focusPage('#back').click(function () {
        com.switchPage(api.index.productionPlanIndex.url);
    });

    function addProductionWorkPlans(ppid) {
        var $popup = com.focusPage('#addPopUp');
        $popup.attr('data-ppid', ppid);
        //弹出即全屏
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看工序",
            content: $popup,
            area:["1200px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: false,
            zIndex: 9000,
            success: function (layer, index) {
                params["ppid"] = ppid;
                $popup.load("views/production/addWorkPlans.html");
            },
            end: function () {
                $popup.attr('data-ppid', null);
                drawProgress();
            },
            yes:function () {
                $pageDiv.empty();
                drawProgress();
            }
        });
    }

})();
