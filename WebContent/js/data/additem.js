
jQuery(function($) {

    var additem = {

        aiid: null,

        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },

        modals: {
            addModal: com.focusPage("#addModal"),
        },

        items:{
            name: com.focusPage("#name"),
            node : com.focusPage("#node"),
        },
        status : {},
        node:{}
    };

    additem.btns.saveBtn.bindClick(saveData);

    additem.modals.addModal .on("hide.bs.modal", function () {
        com.cleanItems(additem.items);
        com.clearValidator();
        com.closeTip();
    });

    com.post(api.ds.data, {}, function(res){
        additem.status = res.costStatus.split("key", "value");
    },null ,false);

    com.post(api.data.queryConstructionNode,{}, function(res){
        additem.items.node.bindData(res.constructionNodes, "cnid", "name", false);
    }, null, false);

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
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-yellow').html('删除');

            var propertyArr = [
                ["工程节点: ", v.constructionNode.name, "grey"],
                ["状态: ", additem.status[v.status], "red"],
            ];

            $.each(propertyArr, function (index, value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $invalid.append($statusSwitch).append($span);
            $liLine.append($h3).append($ulProperty);
            $btnDiv.append($invalid).append($btnDelete);
            $h3.append($title).append($btnDiv);

            !v.status && $statusSwitch.prop("checked", true);

            $btnDelete.click(function(){
                com.showConfirm("是否确认删除", function(){
                    com.post(api.data.deleteAdditem, {"additem.aiid" : v.aiid}, function () {
                        searcher.doSearch();
                        com.showAlert(com.info, "操作成功");
                    });
                });
            })

            $invalid.click(function(){
                 var cvalue = $statusSwitch.prop("checked") ? 0:1;

                 var options = {
                     "additem.aiid": v.aiid,
                     "additem.status": cvalue
                 }

                 com.post(api.data.updateAdditemForStatus, options, function(res){
                     cvalue == 0? com.showAlert(com.info, "已启用") : com.showAlert(com.info, "已禁用");
                     searcher.doSearch();
                 });
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

    searcher.init(["data-quotation-additem-name"], "condList", api.data.pageAdditem, function(data){

        displayFunc.init('resultList', data);
    }, "pagenation", "addItemPostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('id', 'addItemBtn').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [$adda];
    });

    com.focusPage('#addItemBtn').click(function(){
        additem.modals.addModal.modal("show");
    });

    function saveData(){

        if (com.validate('addModal')) {
            return false;
        };

        var options = {
            'additem.name': additem.items.name.val(),
            "additem.constructionNode.cnid": additem.items.node.val(),
        };

        com.post(api.data.addAdditem, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });

        additem.modals.addModal.modal("hide");
    }

})