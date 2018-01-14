/**
 * Created by Administrator on 2017/4/17.
 */
jQuery(function ($) {

    $('#checkWorkflow').css({'margin': '0 auto', 'margin-top': '2%', 'width': '98%'});

    var mycars = [];

    var workflowItem = {
        wpid: $('#checkWorkflow').attr('data-wpid'),
    };

    $('#addSaleOrder').click(function () {

        var num = $('.line', '#list').length;
        var returnFlag = false;
        var $lines = $('.line', '#list');
        
        $lines.each(function(){
            var $this = $(this);
            if(!checkRowValue($this)){
                returnFlag = true;
                return false;
            }
        });
        
        if(returnFlag) return;

        com.post(api.production.queryWorkflow,{}, function(res){
            var workflowStatus = [];
            $.each(res.workflows,function(i,v){
                if(mycars.indexOf(v.wfid) == -1){
                    workflowStatus.push(v);
                }
            })
            workflowItem.workflows = workflowStatus;
        }, null, false);

        var $line = addline(num + 1);
        $line.appendTo('#list');
        reorder();
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col2');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [

            {cellClass: "name", hasInput: !0},//名称
            {cellClass: "status"},             //编号
        ];
        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');
        $.each(_lineInfoSet, function (i, v) {
            var $input;
            var $cell = $('<div></div>').addClass('cell ' + v.cellClass);
            if (v.hasInput) {
                $select = $('<select></select>');
                $select.bindData(workflowItem.workflows,"wfid","name");
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            if( $line.find('.name select').find("option:selected").text()!="") {
                e.stopPropagation();
                $line.attr('data-wfid', $line.find('.name select').val());
                $line.attr('data-name', $line.find('.name select').find("option:selected").text());
                $line.find('.name').html($line.attr('data-name'));
                var wfid = $line.attr('data-wfid')
                mycars.push(parseInt(wfid));
                $lineInfoWrap.find('.status').text("启用");
            }
        });

        $btndel.click(function (e) {
            e.stopPropagation();
            var wfid = $line.attr('data-wfid')
            removeByValue(mycars,parseInt(wfid));
            $line.remove();

            reorder();
            return;

        });

        return $line;

    }

    workflowAdd();

    $("#submitHardwareItem").click(function () {

        var options = {};
        var $lines = $('.line', '#list');
        var returnFlag = false;
        $lines.each(function(i){
            var $this = $(this);
            if(!checkRowValue($this)){
                returnFlag = true;
            };
            options["wfids["+i+"]"] = $this.attr('data-wfid')           //– 名称
        });
        if(returnFlag) return;
        options["workflowPlan.workplan.wpid"] = workflowItem.wpid;

        com.post(api.production.updateWorkflowPlan,options,function(res){
            layer.closeAll();
            layer.msg("保存成功",{icon: 1,time:2e3})
            $("#list").empty();
            workflowAdd();
        },function(e){
            com.showAlert(com.info, e.exception.errorMessage);
        })
    });

    function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }

    function workflowAdd() {
        var wpid = workflowItem.wpid;
        var index = $('.line', '#list').length;
        com.post(api.production.queryWorkflowPlanByWpid, {
            "workflowPlan.workplan.wpid": wpid
        }, function (res) {
            for (var i = 0; i < res.workflowPlans.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index);
                mycars.push(res.workflowPlans[i].workflow.wfid);
            }
            function autoAddline(index) {
                index = $('.line', '#list').length;
                addline(1 + index).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr({
                    'data-wfid': res.workflowPlans[i].workflow.wfid,
                });
                $lineInfoWrap1.find('div.status').text(res.workflowPlans[i].workflow.status==0?"启用":"禁用");
                $lineInfoWrap1.find('div.name').text(res.workflowPlans[i].workflow.name);
 
            }
        });
    }



    function checkRowValue($line) {
        var flag = true;
        var status = $line.find('.status');
        var iconok = $line.find('.green');

        if (status.text()=="") {
            iconok.focus().select();
            iconok.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "请点击",
            }).popover('show');
            flag = false;
        } else {
            iconok.popover('destroy');
        }

        return flag;
    }

    //重排序
    function reorder(){
        var $list = $('.line', '#list');
        $list.length && $list.each(function(i){
            var $this = $(this);
            $this.find('.index').text(i + 1);
        });
    }
});
