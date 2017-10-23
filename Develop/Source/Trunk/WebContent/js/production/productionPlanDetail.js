jQuery(function ($) {

	var $pageDiv = $('.pageDiv');
    var ppid = params["productionPlan.ppid"];
    var workstatus = params["productionPlan.status"];
    var $productionStatus = params["production.status"]

    function drawProgress() {
        com.post(api.production.queryProductionWorkPlanByPpid,{"productionWorkPlan.ppid":ppid},function (res) {
            var $pageDiv = $('.pageDiv');
            //清空之前形成的页面
            $("div[name='portlet']").remove();
            var workplans = res.productionWorkPlans;

            $.each(workplans,function (i,v) {
                var $detailBox = createDiv(v);
                var workFlowsArr = showWorkFlow(v);
                $.each(workFlowsArr,function (index,val) {
                    var $workshopDiv = $('<li></li>').addClass('lab')
                        .append($('<span></span>').html('车'+'&nbsp;&nbsp;&nbsp;&nbsp;'+'间：'))
                        .append($('<span></span>').html(v.workplan.workshop.name));
                    $workshopDiv.appendTo(workFlowsArr[index].find('.target'));
                    workFlowsArr[index].appendTo($detailBox.find('div[name="portletbody"]'));
                });
                $detailBox.appendTo($pageDiv);
            });

        },function (e) {
            layer.msg(e.exception.errorMessage);
        });
    }

    drawProgress();

    function showWorkFlow(data) {
        var pwpid = data.pwpid;
        var options = [];
        com.post(api.production.queryProductionWorkFlowByPwpid,{"productionWorkFlow.pwpid":pwpid},function (res) {
            var workflows = res.productionWorkFlows;
            $.each(workflows,function (index,val) {

                var pwfid = val.pwfid;
                var $workflowul = $('<ul></ul>').addClass('workflow item-list fl-table-list ui-sortable');
                var $workflowli = $('<li></li>').addClass('workflowList item-blue clearfix');
                var $detailul = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix target');
                var $workflowDiv = $('<li></li>').addClass('lab')
                                .append($('<span></span>').html('工'+'&nbsp;&nbsp;&nbsp;&nbsp'+'序：'))
                                .append($('<span></span>').html(val.workflow.name));

                $workflowDiv.appendTo($detailul);
                var $operateStatus = $('<li></li>').addClass('lab')
                                    .append($('<span></span>').attr('style','color:black;margin-left:10px;').html('操作状态：'));

                com.post(api.production.queryProductionUserWorkFlowByPwfid,{"productionUserWorkFlow.productionworkflow.pwfid":pwfid},function (res) {
                        var productionUserWorkFlows = res.productionUserWorkFlows;

                        if(productionUserWorkFlows != null){
                            //var a = 0;
                            $.each(productionUserWorkFlows,function (i,v) {
                                var imgUrl = config.media + '/showImg.do' + '?imgBasePath=' + v.userPhoto + '&divFlag=1&width=' + 150 + '&height=' + 150 + '&timestamp='+ new Date().getTime();

                                var $photo = $('<img onerror="javascript:this.src=\'./assets/altogether/images/avatar2.png\';" />').attr("src",imgUrl).css("margin", "10px 10px").css("width", "50px").css("height", "50px").css("margin-bottom", "10px");

                                var $operator = $('<span></span>').html('操作人：');
                                var $workflowSpan = $('<span></span>').html(v.operator.currentName != null ? v.operator.currentName : '暂无').addClass('workflowSpan').css('font-size','150%');

                                $workflowli.append($photo).append($operator).append($workflowSpan);

                                //a++;
                                //if(a == 1){
                                //    var $isOperate = $('<span></span>').html(v.operator.currentName != null ? '已操作': '').attr('style','color:red;margin-left:10px;');
                                //}
                            })

                        }
                        var $isOperate = $('<span></span>').html(productionUserWorkFlows != null ? '已操作': '').attr('style','color:red;margin-left:10px;');
                        $operateStatus.append($isOperate);
                },null,false);

                $operateStatus.appendTo($detailul);
                $workflowul.append($workflowli.append($detailul));
                options.push($workflowul);
            });
        },null,false);

        return options;
    }

    function createDiv(data) {
    	
        var $topspan = $('<div></div>').addClass('col-xs-6 col-sm-6 ui-sortable widget-container-span').attr('name','portlet');
        var $top = $('<div></div>').addClass('widget-box transparent');
        var $title = $('<div></div>').addClass('widget-header');
        var $body = $('<div></div>').addClass('widget-body').attr('name','portletbody');
        var $span = $('<h4></h4>').html($('<strong></strong>').text(data.workplan.name));

        $title.append($span).appendTo($top);
        $body.appendTo($top);
        $top.appendTo($topspan);
        return $topspan;
    }

    $('#configWorkPlan').click(function () {
        if(workstatus == 0 && $productionStatus != 4 && $productionStatus != 5 ){
            configProductionWorkPlan(ppid);
        }else{
            layer.msg('该生产计划单已经进行生产，不允许更改工序组');
        }

    });

    $('#back').click(function () {
        com.switchPage(api.index.productionPlanIndex.url);
    });

    function configProductionWorkPlan(ppid) {
        var $popup = $('#viewPopUp');
        $popup.attr({'data-ppid': ppid});
        //弹出即全屏
        layer.open({
            type: 1,
            skin: 'layui-layer-molv',
            title: "查看工序",
            content: $popup,
            area:["1200px",( $(window).height()*0.84 < 620 ?  $(window).height()*0.84 : 620 )+"px"],
            maxmin: false,
            zIndex: 9999,
            btn: ['确定', '取消'],
            success: function (layer, index) {
                params["ppid"] = ppid;
                //params["v"] = v ;
                $popup.load("views/production/configWorkPlan.html");
            },
            end: function () {
                $popup.attr('data-ppid', null);
                drawProgress();
            },
            yes:function () {
                $pageDiv.empty();
                drawProgress();
                layer.closeAll();
            }
        });
    }


})();
