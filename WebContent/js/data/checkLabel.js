jQuery(function ($) {
    var workflowItem = {
        id: com.focusPage('#label').attr('data-uid'),
        workflows:[],
        labellid : [],  //当前启用的标签
        currentId: params.id
    };

    /*添加一条标签*/
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

        com.post(api.data.queryLabel,{"label.status" : 0}, function(data){
            var workflowStatus = [];

            /*将已添加的标签从下拉菜单中删除*/
            $.each(data.labels, function(i,v){
                if(workflowItem.labellid.indexOf(v.lid) == -1){
                    workflowStatus.push(v);
                }
            });
            workflowItem.workflows = workflowStatus;
        }, null, false);

        if(workflowItem.workflows.length != 0){
            var $line = addline($lines.length + 1);
            $line.appendTo('#list');
            reorder();
        }else{
            layer.msg("没有任何标签");
        }
    });

    function addline(lineindex) {
        var $line = $('<li></li>').addClass('line');
        var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index blue').text(lineindex));
        var $lineInfoWrap = $('<div></div>').addClass('line-wrap content col2');
        var $optWrap = $('<div></div>').addClass('line-wrap action');
        var _lineInfoSet = [
            {labelClass: "name", hasInput: !0, color:'grey'},             //名称
            {labelClass: "value",hasvalue: !0, color:'blue'}             //编号
        ];

        var $btncheck = $('<a class="green" style="font-size: 18px"><i class="icon-ok"></i></a>');
        var $btndel = $('<a class="red" style="font-size: 18px"><i class=" icon-remove"></i></a>');

        $.each(_lineInfoSet, function (i, v) {
            var $cell = $('<div></div>').addClass(v.color + ' cell ' + v.labelClass);
            if (v.hasInput) {
                var $select = $('<select id="lid"></select>');
                $select.bindData(workflowItem.workflows,"lid","name");
                $cell.append($select);
            }

            var $input;
            if(v.hasvalue){
                $input = $('<input id="value" maxlength="5">').prop({'type': 'text', 'autocomplete': 'off'}).addClass('editable v_required v_float').css("width","60%");
                $cell.append($input);
            }

            $cell.appendTo($lineInfoWrap);
        });

        $optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

        $line.append($indexWrap).append($lineInfoWrap).append($optWrap);

        $btncheck.click(function () {
            if(com.validate())
                return;

            var $selectValue = $line.find('select option:selected');
            var $lines = com.focusPage('.line', '#list');
            var ulid =  $line.attr('data-ulid');

            if(ulid == null){
                com.post(api.data.addUserLabel, {
                    "userlabel.user.uid": workflowItem.currentId,
                    "userlabel.label.lid": com.focusPage("#lid").val(),
                    "userlabel.scope": com.focusPage("#value").val()
                }, function (res) {
                    layer.msg('贴标签成功!', {icon: 1});
                    $line.find('.name').html($selectValue);
                    $line.find('.value').html(com.focusPage("#value").val());
                    $lines.remove();
                    workflowAdd();
                })
            }
        });

        $btndel.click(function () {
            var ulid =  $line.attr('data-ulid');
            if(ulid == null){
                $line.remove();
            }else{
                com.post(api.data.deleteUserLabel, {"userlabel.ulid" : $line.attr('data-ulid')}, function(res){
                    layer.msg('移除标签成功!', {icon: 1});
                    $line.remove();
                    reorder();
                })
            }
        });
        return $line;
    }

    workflowAdd();

    function workflowAdd() {
        var index ;

        com.post(api.data.queryUserLabelByUid, {"userlabel.user.uid":workflowItem.currentId}, function (res) {
            for (var i = 0, len = res.userlabels.length; i < len; i++) {
                index = com.focusPage('.line', '#list').length;
                workflowItem.labellid.push(res.userlabels[i].label.lid);
                autoAddline(index,res.userlabels[i]);
            }
        });
    }

    function autoAddline(index, data) {
        addline(1 + index).appendTo(com.focusPage('#list'));
        var $lineInfoWrap1 = com.focusPage('#list li:nth-of-type(' + (index + 1) + ') div.content');

        com.focusPage('#list li:nth-of-type(' + (index + 1) + ')').attr({
            'data-lid': data.label.lid,
            'data-ulid':data.ulid
        });
        $lineInfoWrap1.find('div.name').text(data.label.name);
        $lineInfoWrap1.find('div.value').text(data.scope);
    }

    function checkRowValue($line) {
        var flag = true;
        var input = $line.find('.value');
        var iconok = $line.find('.green');

        if (!input.text()) {
            iconok.focus().select();
            iconok.addClass('tooltip-info').attr({
                "data-rel": "popover",
                "data-placement": "top",
                "data-original-title": "",
                "title": "",
                "data-content": "请确定"
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
});