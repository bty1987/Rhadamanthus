
jQuery(function($) {

    var constructionNode = {
        
        cnid: null,
        
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
           updateBtn: com.focusPage("#updateBtn") 
        },
        
        modals: {
            addModal: com.focusPage("#addModal"),
            updateModal: com.focusPage("#updateModal")
        },

        items:{
            
            name: com.focusPage("#name", "#addModal"),
            
            precheck: com.focusPage("#precheck", "#updateModal"),
            postcheck: com.focusPage("#postcheck", "#updateModal"),
            stacheck: com.focusPage("#stacheck", "#updateModal"),
            fincheck: com.focusPage("#fincheck", "#updateModal"),
            startalk: com.focusPage("#startalk", "#updateModal"),
            endtalk: com.focusPage("#endtalk", "#updateModal"),
            timeLimit: com.focusPage("#timeLimit", "#updateModal")
        },

        editFlg: false,
    };
    
    constructionNode.btns.saveBtn.on("click", saveData);
    constructionNode.btns.updateBtn.on("click", update);

    constructionNode.modals.addModal = com.focusPage("#addModal");
    
    constructionNode.modals.addModal.on('show.bs.hide',function(e){
        com.cleanItems(constructionNode.items);
    });
    
    constructionNode.modals.updateModal.on('show.bs.hide',function(e){
        com.cleanItems(constructionNode.items);
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
               ["开工销售比例: ", v.stacheck, "blue"],
               ["完工销售比例: ", v.fincheck, "blue"],
               ["开工话术:" ,v.startalk, "grey"],
               ["完工话术:" ,v.endtalk, "grey"],
               ["工期:" ,v.timeLimit, "grey"],
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
            var $btnUpdate = $('<div></div>').addClass('pull-right action-button').append($('<a></a>').addClass('btn btn-yellow btn-minier').html('更新'))

            $divBtnWrap.append($btnUpdate).appendTo($h3);
            //$divBtnWrap.append($btnCheck).append($btnSpan).appendTo($h3);

            $liLine.append($h3).append($ulProperty);
            
            $btnUpdate.click(function(){
                
                constructionNode.cnid = v.cnid;
                
                constructionNode.items.precheck.val(v.precheck);
                constructionNode.items.postcheck.val(v.postcheck);
                constructionNode.items.stacheck.val(v.stacheck);
                constructionNode.items.fincheck.val(v.fincheck);
                constructionNode.items.startalk.val(v.startalk);
                constructionNode.items.endtalk.val(v.endtalk);
                constructionNode.items.timeLimit.val(v.timeLimit);
                
                constructionNode.modals.updateModal.modal("show");
            });

            $btnCheck.click(function(){
                updateStatus(v.cnid, $btnDel.prop("checked") ? 0 : 1);
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

    searcher.init(["data-construction-node-name"], "condList", api.data.pageConstructionNode, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "constructionNodePostData",null, false, null, function(){

        var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addConstructionNode').css("margin", "0px 3px");
        var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
        var $addspan = $('<span></span>').text('添加').appendTo($adda);

        return [];
    });

    $('a[name="addConstructionNode"]', com.focusPage('#pagenation')).click(function(){
        constructionNode.modals.addModal.modal("show");
    });
    
    function update(){
        
        if(com.validate("updateModal")) return false;
        
        var options = {
            "constructionNode.cnid": constructionNode.cnid,
            "constructionNode.precheck": constructionNode.items.precheck.val(),
            "constructionNode.postcheck": constructionNode.items.postcheck.val(),
            "constructionNode.stacheck": constructionNode.items.stacheck.val(),
            "constructionNode.fincheck": constructionNode.items.fincheck.val(),
            "constructionNode.startalk": constructionNode.items.startalk.val(),
            "constructionNode.endtalk": constructionNode.items.endtalk.val(),
            "constructionNode.timeLimit": constructionNode.items.timeLimit.val()
        }
        
        com.post(api.data.updateConstructionNode, options, function(res){
            com.closePopup();
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
        });
        
        constructionNode.modals.updateModal.modal("hide");
    }

    function updateStatus(cnid, cvalue){
        
        var options = {
            "constructionNode.cnid": cnid,
            "constructionNode.status": cvalue
        }

        com.post(api.data.updateConstructionNodeForStatus, options, function(res){
            searcher.doSearch();
        });
    }

    function saveData(){
        
        if(com.validate("addModal")){
            return false;
        }

        var options = {
            'constructionNode.name': constructionNode.items.constructionNodeName.val()
        };

        com.post(api.data.addConstructionNode, options, function(res){
            searcher.doSearch();
        });

        constructionNode.modals.addModal.modal("hide");
    }
});
