$(function(){
    var workPlan = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            workplanModal: com.focusPage("#workplanModal")
        },
        items : {
            name : com.focusPage("#name"),
            workshop : com.focusPage("#workshop"),
            comment : com.focusPage("#comment")
        },
        editFlg : true,
        wsid : null
    }
    workPlan.saveBtn.bindClick(saveData);

    workPlan.modals.workplanModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(workPlan.items);
    });

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            if(listData && listData.length){
                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);
                $.each(listData,function(i, v){
                    var $liLine = creatLine(i, v, i == listData.length - 1);
                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function(){
            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var titleName = '名称,车间,说明,状态';
            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-4').html(v);
                $cell.appendTo($contentWrap);
            });
            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));
            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);
            return $ulTitle;
        };
        var creatLine = function(i, v, lastFlag){
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                [v.name,'grey'],
                [v.workshop.name,'grey'],
                [ v.comment,'grey'],
                [constant.data().common.status.keys[v.status],'red']
            ];
            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell '+ v[1]).html(v[0]);
                $cell.appendTo($contentWrap);
            });
            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');
            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle','dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑')) ;
            var $btnView = $('<li></li>').append($('<a></a>').html('工序'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用')) ;
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用')) ;
            $btnUl.append($btnEdit).append($btnView).append($btnStart).append($btnStop);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);
            $cellOption.appendTo($optionWrap);
            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnEdit.click(function(){

                workPlan.editFlg = false;
                workPlan.items.wpid = v.wpid
                workPlan.items.workshop.val(v.workshop.wsid);
                workPlan.items.name.val(v.name);
                workPlan.items.comment.val(v.comment);
                workPlan.modals.workplanModal.modal("show");
            });

            //查看
            $btnView.click(function () {
                com.focusPage('#checkWorkflow').attr('data-wpid', v.wpid);
                com.popup4page("#checkWorkflow","views/production/workflow2check.html",v.name);

            });

            $btnStart.click(function() {
                changeQuoteTypeStatus(v.wpid, 0, v.status);
            });
            $btnStop.click(function () {
                changeQuoteTypeStatus(v.wpid, 1, v.status);
            });

            return $liLine;
        };

        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();
    var workplanSeacher = new Searcher();

    workplanSeacher.init(["production-workplan-name"], "condList", api.production.pageWorkplan, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "assisTypePostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addWorkplan').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    //绑定车间下拉菜单
    com.post(api.production.queryWorkshop,{},function(res){
        com.focusPage("#workshop").bindData(res.workshops,"wsid","name");
    });

    com.focusPage("#addWorkplan").click(function() {
        workPlan.editFlg = true;
        workPlan.modals.workplanModal.modal("show");
    });

    function changeQuoteTypeStatus(qtid,btnType,statusFlag) {

        var status = btnType == 0 ? "启用" : "禁用";

        if(statusFlag == btnType){
            com.showAlert(com.warning, "已"+status+"无需重复当前操作");
            return false;
        }

        com.post(api.production.updateWorkplanForStatus, {
            "workplan.wpid": qtid,
            "workplan.status": btnType
        }, function (res) {
            com.showAlert(com.info, "已"+status);
            workplanSeacher.doSearch();
        });
    }

    function saveData() {

        if (com.validate('workplanModal')) {
            return false;
        }
        var url;
        var options = {
            "workplan.name" : workPlan.items.name.val(),
            "workplan.comment" : workPlan.items.comment.val(),
            "workplan.workshop.wsid" : workPlan.items.workshop.val()
        };

        workPlan.editFlg ? url = api.production.addWorkplan : url = api.production.updateWorkplan, options["workplan.wpid"] =  workPlan.items.wpid;

        com.post(url, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            workplanSeacher.doSearch();
        });
        workPlan.modals.workplanModal.modal("hide");
    }
});