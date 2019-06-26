jQuery(function ($) {

    com.focusPage('#checkWorkflow').css({'margin': '0 auto', 'margin-top': '2%', 'width': '98%'});

    var workflowItem = {
        wpid: com.focusPage('#checkWorkflow').attr('data-wpid'),
        workflows:[],
        currentWpid : []   //当前启用以及要启用的工序
    };

    /*添加一条新的工序*/
    com.focusPage('#addWorkPlan').click(function () {
        var $lines = com.focusPage('.line', '#list');

        var returnFlag = false;
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
            /*将已添加的工序从下拉菜单中删除*/
            $.each(res.workflows,function(i,v){
                if(workflowItem.currentWpid.indexOf(v.wfid) == -1){
                    workflowStatus.push(v);
                }
            });
            workflowItem.workflows = workflowStatus;
        }, null, false);

        var $line = addline($lines.length + 1);
        $line.appendTo('#list');
        reorder();
    });

    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index blue').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col2');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [

            {cellClass: "name", hasInput: !0,color:'grey'},//名称
            {cellClass: "status",color:'red'},             //编号

        ];
        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $cell = $('<div></div>').addClass(v.color + ' cell ' + v.cellClass);
            if (v.hasInput) {
                var $select = $('<select></select>');
                $select.bindData(workflowItem.workflows,"wfid","name");
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function () {

            var $selectValue = $line.find('select option:selected');

            if($selectValue.text()){
                $line.attr('data-wfid', $line.find('.name select').val());
                $line.find('.name').html($selectValue.text());
                workflowItem.currentWpid.push(parseInt($selectValue.val()));

                $lineInfoWrap.find('.status').text("启用");
            }

        });

        $btndel.click(function () {

            var wfid = $line.attr('data-wfid');
            $line.remove();

            removeByValue(workflowItem.currentWpid,parseInt(wfid));
            reorder();

        });

        return $line;

    }

    workflowAdd();

    com.focusPage("#submitHardwareItem").click(function () {

        var options = {};
        var returnFlag = false;
        var $lines = com.focusPage('.line', '#list');

        $lines.each(function(i){
            var $this = $(this);
            if(!checkRowValue($this)){
                returnFlag = true;
            }

            options["wfids["+i+"]"] = $this.attr('data-wfid');           //– 名称

        });

        if(returnFlag) return;

        options["workflowPlan.workplan.wpid"] = workflowItem.wpid;

        com.post(api.production.updateWorkflowPlan,options,function(res){
            $lines.remove()
            com.closePopup();
            workflowAdd();
            com.showAlert(com.info, "操作成功");
        })
    });

    function workflowAdd() {
        var wpid = workflowItem.wpid;
        var index ;

        com.post(api.production.queryWorkflowPlanByWpid, {
            "workflowPlan.workplan.wpid": wpid
        }, function (res) {
            for (var i = 0, len = res.workflowPlans.length; i < len; i++) {

                index = $('.line', '#list').length;
                workflowItem.currentWpid.push(res.workflowPlans[i].workflow.wfid);
                autoAddline(index,res.workflowPlans[i]);

            }

        });

    }

    /*添加*/
    function autoAddline(index,data) {

        addline(1 + index).appendTo('#list');

        var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + (index + 1) + ') div.content');

        com.focusPage('#list li:nth-of-type(' + (index + 1) + ')').attr({
            'data-wfid': data.workflow.wfid
        });

        $lineInfoWrap1.find('div.status').text(data.workflow.status == 0 ? "启用":"禁用");
        $lineInfoWrap1.find('div.name').text(data.workflow.name);

    }

    function checkRowValue($line) {
        var flag = true;
        var status = $line.find('.status');
        var iconok = $line.find('.green');

        if (!status.text()) {
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
        var $list = com.focusPage('.line', '#list');

        $list.length && $list.each(function(i){
            var $this = $(this);
            $this.find('.index').text(i + 1);
        });

    }

    //在currentWpid数组中移除需要删除的工序
    function removeByValue(arr, val) {
        for(var i = 0,len = arr.length; i < len; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
});
