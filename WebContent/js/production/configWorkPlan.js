/**
 * Created by Administrator on 2017/9/27 0027.
 */
jQuery(function ($) {
    var workplans = [];//定义数组 存放已加入工序组的wpid 增加工序组时将该工序组的wpid插入数组 删除工序组时将该工序组的wpid从数组中删除。
    var productionworkplanitems = {

    };

    var ppid = $('#viewPopUp').attr('data-ppid');
  
    (function () {
        var index = $('.line', '#list').length;
        com.post(api.production.queryProductionWorkPlanByPpid, {
            "productionWorkPlan.ppid": ppid
        }, function (res) {
            for (var i = 0; i < res.productionWorkPlans.length; i++) {
                index = $('.line', '#list').length;
                autoAddline(index);
            }
            function autoAddline(index) {
                index = $('.line', '#list').length;
                addline(index+1).appendTo('#list');
                var $lineInfoWrap1 = $('#list li:nth-of-type(' + (index + 1) + ') div.content');
                $('#list li:nth-of-type(' + (index + 1) + ')').attr({
                    'data-wpid': res.productionWorkPlans[i].workplan.wpid,
                    'data-name': res.productionWorkPlans[i].workplan.name
                });
                workplans.push(res.productionWorkPlans[i].workplan.wpid);
                $lineInfoWrap1.find('div.workplanname').text(res.productionWorkPlans[i].workplan.name);
                $lineInfoWrap1.find('div.workplanstatus').text(res.productionWorkPlans[i].workplan.status == 0 ? '启用' : '禁用');
            }
        });
    }());


    $('#addItem').click(function () {
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

        com.post(api.production.queryWorkplan,{}, function(res){
            var workplanStatus = [];
            $.each(res.workplans,function(i,v){
                if(workplans.indexOf(v.wpid)==-1){
                    workplanStatus.push(v);
                }
            });
            productionworkplanitems.items = workplanStatus;
        }, null, false);

        var $line = addline(num);
        $line.appendTo('#list');
    });


    function addline(lineindex) {

        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col3');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {cellClass: "workplanname", hasInput: !0},//名称
            {cellClass: "workplanstatus"},//编号
        ];
        var $btncheck = $('<button class="btn btn-minier btn-yellow" name="confirm">保存</button>');
        var $btndel = $('<button class="btn btn-minier btn-danger" name="delete">删除</button>');
        $.each(_lineInfoSet, function (i, v) {
            //var $input;
            var $cell = $('<div></div>').addClass('cell  ' + v.cellClass + '  col-xs-6');
            if (v.hasInput) {
                $select = $('<select></select>').addClass('col-xs-12  selected');
                $select.bindData(productionworkplanitems.items,"wpid","name");
                $cell.append($select);
            }
            $cell.appendTo($lineInfoWrap);
        });


        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function (e) {
            if( $line.find('.workplanname select').find("option:selected").text()!="") {
                var option = [];
                e.stopPropagation();
                $line.attr('data-wpid', $line.find('.workplanname select').val());
                $line.attr('data-name', $line.find('.workplanname select').find("option:selected").text());
                $line.find('.workplanname').html($line.attr('data-name'));
                var wpid = $line.attr('data-wpid');
                option["productionWorkPlan.workplan.wpid"] = $line.attr('data-wpid');
                option["productionWorkPlan.ppid"] = ppid;
                workplans.push(parseInt(wpid));
                $lineInfoWrap.find('.workplanstatus').text("启用");
                com.post(api.production.addProductionWorkPlan,option,function (res) {
                    layer.msg("添加成功");
                },function (e) {
                    layer.msg(e.exception.errorMessage);
                    //添加失败 将当前<li>删除不允许保存
                    $line.remove();
                    removeByValue(workplans,parseInt(wpid));
                });
            }
        });

        $btndel.click(function (e) {
            e.stopPropagation();
            var option = [];
            var wpid = $line.attr('data-wpid');
            option["productionWorkPlan.workplan.wpid"] = $line.attr('data-wpid');
            option["productionWorkPlan.ppid"] = ppid;
            removeByValue(workplans,parseInt(wpid));
            com.post(api.production.deleteProductionWorkPlan,option,function (res) {
                layer.msg("删除成功");
            },function (e) {
                layer.msg(e.exception.errorMessage);
            });
            $line.remove();
            //return;

        });

        return $line;
    }



    function checkRowValue($line) {
        var flag = true;
        var selected =  $line.find('.selected');
        var status = $line.find('.workplanstatus').text();
        if (status == "" || status == null) {
            selected.focus().select();
            selected.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "请选择工序组并保存",
            }).popover('show');
            flag = false;
        } else {
            selected.popover('destroy');
        }

        return flag;
    }

    function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
})();
