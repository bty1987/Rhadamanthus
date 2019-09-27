$(function(){

    var workflow = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            workflowModal: com.focusPage("#workflowModal")
        },
        items : {
            name : com.focusPage("#name")
        },
        editFlg : true,
    };

    workflow.saveBtn.bindClick(saveData);

    workflow.modals.workflowModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(workflow.items);
    });

    var displayFunc = (function(){

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

            var titleName = '工序名称,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap).append($contentWrap).append($optionWrap).appendTo($ulTitle);

            return $ulTitle;
        };

        var  creatLine = function(i, v, lastFlag) {
            var $liLine = $('<li></li>').addClass('line');
            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col4');
            var propertyArr = [
                [v.name,'grey'],
                [v.status == 0 ? "启用" : "禁用",'red']
            ];

            $.each(propertyArr, function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6 '+v[1]+'').html(v[0]);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action');
            var $cellOption = $('<div></div>').addClass('cell option');

            var $btnGroup = $('<div></div>').addClass('btn-group');
            var $btn = $('<button></button>').addClass('btn btn-primary dropdown-toggle').attr('data-toggle', 'dropdown').append('操作').append('<i class="icon-angle-down"></i>');
            var $btnUl = $('<ul></ul>').addClass('dropdown-menu').addClass(lastFlag ? 'bottom-up' : '');

            var $btnEdit = $('<li></li>').append($('<a></a>').html('编辑'));
            var $btnStart = $('<li></li>').append($('<a></a>').html('启用'));
            var $btnStop = $('<li></li>').append($('<a></a>').html('禁用'));

            $btnUl.append($btnEdit).append($btnStart).append($btnStop);
            $btnGroup.append($btn).append($btnUl).appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap).append($contentWrap).append($optionWrap);

            $btnEdit.click(function () {
                workflow.editFlg = false;

                workflow.items.wfid = v.wfid;
                workflow.items.name.val(v.name);
                workflow.modals.workflowModal.modal("show");
            });

            $btnStart.click(function () {
                changeQuoteTypeStatus(v.wfid, 0, v.status);
            });

            $btnStop.click(function () {
                changeQuoteTypeStatus(v.wfid, 1, v.status);
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

    var Seacher = new Searcher();

    Seacher.init(["p_workflowName"], "condList", api.production.pageWorkflow, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "Workflow",null,false, null,function() {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addWorkflow').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addWorkflow").click(function() {
        workflow.editFlg = true;

        workflow.modals.workflowModal.modal("show");
    });

    function saveData(){

        if (com.validate('workflowModal')) {
            return false;
        }
        var url;
        var options = {
            "workflow.name": workflow.items.name.val()
        };

        workflow.editFlg ? url = api.production.addWorkflow : url = api.production.updateWorkflow, options["workflow.wfid"] =  workflow.items.wfid;

        com.post(url, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            Seacher.doSearch();
        });
        workflow.modals.workflowModal.modal("hide");
    }

    /*btnType:0 启用功能,1 禁用功能
     statusFlag:当前状态是否与想要完成的功能相冲 */

    function changeQuoteTypeStatus(qtid,btnType,statusFlag) {

        var status = btnType == 0 ? "启用" : "禁用";

        if(statusFlag == btnType){
            com.showAlert(com.info, "已"+status+"无需重复当前操作");
            return false;
        }

        com.post(api.production.updateWorkflowForStatus, {
            "workflow.wfid": qtid,
            "workflow.status": btnType
        }, function (res) {
            Seacher.doSearch();
            com.showAlert(com.info, "已"+status);
        });
    }
});
