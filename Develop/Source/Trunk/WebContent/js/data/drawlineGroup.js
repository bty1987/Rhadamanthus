$(function(){

    var group = {
        addmodal : null,
        groupadd : {},
        cancelBtn : null,
        savebtn : null,
        editFlg : false,
    }

    group.cancelBtn = $("#cancelBtn");
    group.groupadd.gid = $("#gid");
    group.addmodal = $("#addModal");
    group.groupadd.drawLineGroup = $("#drawLineGroup");
    group.groupadd.contentadd = $("#contentadd");
    //添加的保存按钮
    group.savebtn = $("#groupadd").on("click", saveData);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = $('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPosition = $('<a></a>').addClass('btn btn-minier btn-warning').html('编辑');
            var $btnStatus = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl');
            if(v.content) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html('说明 ').appendTo($liProperty);
                $('<b></b>').html(v.content).addClass("grey").appendTo($liProperty);
                $liProperty.appendTo($ulProperty);

            }
            $btnStatus.append($statusSwitch).append($span);

            $divBtnWrap.append($btnPosition).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);



            $btnPosition.click(function(){
                update(v);
            });

            !v.status && $statusSwitch.prop("checked", true);
            $statusSwitch.switchBtn("status-lbl").on("click",function() {
                $statusSwitch.prop("checked") ? (updateStatus(v.gid, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.gid, 1,function(){$statusSwitch.prop("checked")}));
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                $('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        }
    })();

    var searcher = new Searcher();
    //查询的字段名称,查询框DIV的ID,API地址,成功回调函数,分页DIV的ID,保存历史查询的查询名
    searcher.init(['groupName'], "condList", api.data.pageDrawlineGroup, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "groupPostData", null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addGroup').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    function popoverInit(){
        $("[data-toggle='popover']").popover({
            html : true,
            trigger:'blur',

        });
        $('#drawLineGroup').css('border-color', '');

    }

    //添加按钮
    $('a[name="addGroup"]','#pagenation').click(function(){
        group.editFlg = true;
        com.cleanItems(group.groupadd);
        group.addmodal.modal("show");
        popoverInit();
    });

    function saveData(){

                var url;

                var judgment2 = /^[\u4e00-\u9fa5][\u4e00-\u9fa5][\u653e][\u7ebf][\u5c0f][\u7ec4]$/;
                var judgment = /^[\u653e][\u7ebf][\u4e00|\u4e8c|\u4e09|\u56db|\u4e94|\u516d|\u4e03|\u516b|\u4e5d|\u5341][\u7ec4]$/;
                var Group = group.groupadd.drawLineGroup.val();

                if(Group == null || Group == ''){
                    bootbox.alert("放线小组不能为空");
                    popoverInit();
                    return;
                }

                if (judgment.test(Group) || judgment2.test(Group)) {

                var options = {
                    "drawLineGroup.gid" : group.groupadd.gid.val(),

                    "drawLineGroup.name": group.groupadd.drawLineGroup.val(),

                    "drawLineGroup.content": group.groupadd.contentadd.val(),

                };

                if(group.editFlg){
                    url = api.data.addDrawlineGroup;
                }else{
                    url = api.data.updateDrawlineGroup;
                }

                com.post(url, options, function (res) {
                    //刷新页面所有条件,点击保存之后 刷新页面条件 重新载入
                    com.showAlert(com.info, "操作成功");
                    searcher.doSearch();
                });
                //隐藏动态框
                group.addmodal.modal("hide");
            }else{
                    bootbox.alert("请严格按照放线小组输入规则输入");
                    popoverInit();
                    $('#drawLineGroup').popover('show');
                    return;
                }
            }

    function update(v){
        group.editFlg = false ;
        com.cleanItems(group.groupadd);
        group.groupadd.gid.val(v.gid);
        group.groupadd.drawLineGroup.val(v.name);
        group.groupadd.contentadd.val(v.content);
        group.addmodal.modal("show");
        popoverInit();

    }

    function updateStatus(id, status, failcallBack){
        com.post(api.data.updateDrawlineGroupForStatus, {"drawLineGroup.gid" : id, "drawLineGroup.status" : status}, function(){

        },function(){
            failcallBack && failcallBack();
        });
    }

})