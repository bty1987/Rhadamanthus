$(function () {

    var workshop = {
        saveBtn : com.focusPage("#saveBtn"),
        cancelBtn : com.focusPage("#cancelBtn"),

        modals: {
            workshopModal: com.focusPage("#workshopModal")
        },
        items : {
            name : com.focusPage("#name")
        },
        editFlg : true,
    };

    workshop.saveBtn.bindClick(saveData);

    workshop.modals.workshopModal.on("hide.bs.modal", function(){
        com.clearValidator();
        com.cleanItems(workshop.items);
    });
    var displayFunc = (function () {

        var renderList = function (tableId, listData) {
            var $tableWrap = com.focusPage('#' + tableId);

            if (listData && listData.length) {

                var $ulTitle = createTableTitle();
                var $ulData = $('<ul></ul>').addClass('flex-table');
                $tableWrap.append($ulTitle).append($ulData);

                $.each(listData, function (i, v) {
                    var $liLine = creatLine(i, v, i == listData.length - 1);

                    $liLine.appendTo($ulTitle);
                });
            }
        };

        var createTableTitle = function () {

            var $ulTitle = $('<ul></ul>').addClass('flex-table');
            var $liTitle = $('<li></li>').addClass('line table-title');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>'));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

            var titleName = '名称,状态';

            $.each(titleName.split(','), function (i, v) {
                var $cell = $('<div></div>').addClass('cell col-xs-6').html(v);
                $cell.appendTo($contentWrap);
            });

            var $optionWrap = $('<div></div>').addClass('line-wrap action').html($('<div>操作</div>').addClass('cell option'));

            $liTitle.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap)
                .appendTo($ulTitle);

            return $ulTitle;
        };

        var creatLine = function (i, v, lastFlag) {

            var $liLine = $('<li></li>').addClass('line');

            var $indexWrap = $('<div></div>').addClass('line-wrap order').html($('<div></div>').addClass('cell index blue').html(i + 1));
            var $contentWrap = $('<div></div>').addClass('line-wrap  content col2');

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
            var $btncheck = $('<li></li>').append($('<a></a>').html('查看'));

            $btnUl
                .append($btnEdit)
                .append($btnStart)
                .append($btnStop)
                .append($btncheck);

            $btnGroup
                .append($btn)
                .append($btnUl)
                .appendTo($cellOption);

            $cellOption.appendTo($optionWrap);

            $liLine.append($indexWrap)
                .append($contentWrap)
                .append($optionWrap);

            $btnEdit.click(function () {
                workshop.editFlg = false;

                workshop.items.wsid = v.wsid;
                workshop.items.name.val(v.name);
                workshop.modals.workshopModal.modal("show");
            });

            $btnStart.click(function () {
                changeQuoteTypeStatus(v.wsid, 0, v.status);
            });

            $btnStop.click(function () {
                changeQuoteTypeStatus(v.wsid, 1, v.status);
            });

            $btncheck.click(function () {
                com.focusPage('#viewPopUp').attr('data-wsid', v.wsid);
                com.popup4page("#viewPopUp","views/production/viewWorkshop.html","查看工序组");
            });

            return $liLine;
        };

        return {
            init: function (tableId, listData) {
                com.focusPage('#' + tableId).html(null);
                renderList(tableId, listData);
            },
            drawLine: function (v) {
                return creatLine(v);
            }
        };
    })();

    var workshopSeacher = new Searcher();

    workshopSeacher.init(['p_workshopName'], "condList", api.production.pageWorkshop, function (data) {
        displayFunc.init('resultList', data);
    }, "pagenation", "workshopPostData", null, false, null, function () {

        var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addWorkshop').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage("#addWorkshop").click(function() {
        workshop.editFlg = true;
        workshop.modals.workshopModal.modal("show");
    });


    function changeQuoteTypeStatus(id, btnType, statusFlag) {

        var status = btnType == 0 ? "启用" : "禁用";

        if(statusFlag == btnType){
            com.showAlert(com.info, "已"+status+"无需重复当前操作");
            return false;
        }

        com.post(api.production.updateWorkshopForStatus, {
            "workshop.wsid": id,
            "workshop.status": btnType
        }, function (res) {
            com.showAlert(com.info, "已"+status);
            workshopSeacher.doSearch();
        });
    }

    function saveData(id) {

        if (com.validate('workshopModal')) {
            return false;
        }
        var url;
        var options = {
            "workshop.name": workshop.items.name.val()
        };

        workshop.editFlg ? url = api.production.addWorkshop : url = api.production.updateWorkshop, options["workshop.wsid"] =  workshop.items.wsid;

        com.post(url, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            workshopSeacher.doSearch();
        });
        workshop.modals.workshopModal.modal("hide");
    }
});
