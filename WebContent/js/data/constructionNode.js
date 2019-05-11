
jQuery(function($) {

    var constructionNode = {
        saveBtn: null,
        cancelBtn: null,
        modal: null,

        items:{},

        editFlg: false,
    };

    constructionNode.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
    constructionNode.cancelBtn = com.focusPage("#cancelBtn");

    constructionNode.items.constructionNodeId = com.focusPage("#constructionNodeId");
    constructionNode.items.constructionNodeName = com.focusPage("#constructionNodeName");

    constructionNode.modal = com.focusPage("#constructionNodeModal");
    constructionNode.modal.on('show.bs.modal',function(e){
        com.clearValidator();
        com.clearValidator("#constructionNodeId", true);
    });

    $.extend(com.validator, constructionNode.validator);

    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    creatLine(v).appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){

            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').append($('<small></small>').addClass('blue').html(v.cnid + "  " + v.name)).css("margin", "5px 0px");
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
            
            var propertyArr = [
               ["节点名称: ", v.name, "grey"],
               ["开工款项比: ", v.precheck, "blue"],
               ["完工款项比: ", v.postcheck, "blue"],
               ["状态: ", v.status == 0 ? "启用" : "禁用", "red"],
               ["排序: ", v.sort, "blue"],
           ];

           $.each(propertyArr, function (index, value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            var $btnCheck = $('<input />').attr("type","checkbox").addClass('ace ace-switch ace-switch-5').attr("checked", v.status == 0 ? true : false);
            var $btnSpan = $('<span></span>').addClass("lbl status-lbl");

            //$divBtnWrap.append($btnCheck).append($btnSpan).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnCheck.click(function(){
                updateconstructionNode(v.cnid, $btnDel.prop("checked") ? 0 : 1);
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

    searcher.init(["c_name"], "condList", api.data.pageConstructionNode, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionNodePostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addConstructionNode').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [];
    });

    $('a[name="addConstructionNode"]', com.focusPage('#pagenation')).click(function(){
        com.focusPage("#constructionNodeName").val("");
        com.focusPage("#constructionNodeModal").modal("show");
    });

    function updateconstructionNode(cnid, cvalue){
        
        var options = {
            "constructionNode.cnid": cnid,
            "constructionNode.status": cvalue
        }

        com.post(api.data.updateConstructionNodeForStatus, options, function(res){
            searcher.doSearch();
        });
    }

    function saveData(){
        
        if(com.validate()){
            return;
        }

        var options = {
            'constructionNode.name': constructionNode.items.constructionNodeName.val(),
        };

        com.post(api.data.addConstructionNode, options, function(res){
            searcher.doSearch();
        });

        constructionNode.modal.modal("hide");
    }
});
