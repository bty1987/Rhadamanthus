
jQuery(function($) {

    var constructionCost = {

        ccid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
            updateBtn: com.focusPage("#updateBtn")
        },

        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items:{

            name: com.focusPage("#name"),
            areaLeft : com.focusPage("#areaLeft"),
            areaRight : com.focusPage("#areaRight"),
            accessory  : com.focusPage("#accessory"),
            salary  : com.focusPage("#salary"),

            uName : com.focusPage("#uName"),
            uAreaLeft : com.focusPage("#uAreaLeft"),
            uAeaRight : com.focusPage("#uAeaRight"),
            uAccessory  : com.focusPage("#uAccessory"),
            uSalary  : com.focusPage("#uSalary")
        },

        costStatus:{},
        editFlg: false,
    };

    constructionCost.btns.saveBtn.bindClick(saveData);
    constructionCost.btns.updateBtn.bindClick(update);

    constructionCost.modals.addModal .on("hide.bs.modal", function () {
        com.cleanItems(constructionCost.items);
        com.clearValidator();
        com.closeTip();
    });

    constructionCost.modals.updateModal.on("hide.bs.modal", function () {
        com.cleanItems(constructionCost.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.data, {}, function(res){
        constructionCost.costStatus = res.costStatus.split("key", "value");
    },null ,false);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
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
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid')
            var $title = $('<small></small>').addClass('blue').html(' ' + v.name);
            var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

            var $invalid = $('<div></div>').addClass('pull-right');
            var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
            var $span = $('<span></span>').addClass('lbl status-lbl');
            var $btnUpdate= $("<a></a>").addClass("btn btn-minier btn-yellow").html("编辑");

            var propertyArr = [
                ["起始面积: ", v.areaLeft, "blue"],
                ["终止面积: ", v.areaRight, "blue"],
                ["辅料额: ", v.accessory, "blue"],
                ["工费额: ", v.salary, "blue"],
                ["状态: ", constructionCost.costStatus[v.status], "red"],
                ["排序: ", v.sort, "blue"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });


            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnUpdate);
            $h3.append($title).append($btnDiv);

            $btnUpdate.click(function(){

                constructionCost.ccid = v.ccid;
                constructionCost.items.uName.val(v.name);
                constructionCost.items.uAreaLeft.val(v.areaLeft);
                constructionCost.items.uAeaRight.val(v.areaRight);
                constructionCost.items.uAccessory.val(v.accessory);
                constructionCost.items.uSalary.val(v.salary);
                constructionCost.modals.updateModal.modal("show");
            });

            !v.status && $statusSwitch.prop("checked", true);

            $invalid.click(function(){
                var cvalue = $statusSwitch.prop("checked") ? 0:1;

                updataStatus(v.ccid, cvalue);
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
        }
    })();

    var searcher = new Searcher();

    searcher.init(["cc_name"], "condList", api.data.pageConstructionCost, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionCostPostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addConstructionCost').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addConstructionCost').click(function(){
        constructionCost.modals.addModal.modal("show");
    });

    function update(){
        if (com.validate('updateModal')) {
            return false;
        };

        var options = {
            "constructionCost.ccid": constructionCost.ccid,
            "constructionCost.name": constructionCost.items.uName.val(),
            "constructionCost.areaLeft": constructionCost.items.uAreaLeft.val(),
            "constructionCost.areaRight": constructionCost.items.uAeaRight.val(),
            "constructionCost.accessory": constructionCost.items.uAccessory.val(),
            "constructionCost.salary": constructionCost.items.uSalary.val()
        }

        com.post(api.data.updateConstructionCost, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        constructionCost.modals.updateModal.modal("hide");
    };

    function updataStatus(ccid, cvalue){

        var options = {
            "constructionCost.ccid": ccid,
            "constructionCost.status": cvalue
        }

        com.post(api.data.updateConstructionCostForStatus, options, function(res){
            cvalue == 0? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
            searcher.doSearch();
        });
    }

    function saveData(){

        if (com.validate('addModal')) {
            return false;
        };

        var options = {
            'constructionCost.name': constructionCost.items.name.val(),
            "constructionCost.areaLeft": constructionCost.items.areaLeft.val(),
            "constructionCost.areaRight": constructionCost.items.areaRight.val(),
            "constructionCost.accessory": constructionCost.items.accessory.val(),
            "constructionCost.salary": constructionCost.items.salary.val()
        };

        com.post(api.data.addConstructionCost, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        constructionCost.modals.addModal.modal("hide");
    }

})