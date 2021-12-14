$(function(){
	
	com.focusPage('#fl-statement').statement("子功能区", "报价项配置");
	
	var functionArea = {
        
        btns: {
            saveBtn: com.focusPage("#saveBtn"),
        },
        
        modals: {
            functionAreaModal: com.focusPage("#functionAreaModal"),
        },
        
        items: {
            faid: com.focusPage("#faid"),
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            versionId: com.focusPage("#versionId"),
            functionAreaType: com.focusPage("#functionAreaType"),
            functionAreaOrder: com.focusPage("#functionAreaOrder"),
            type: com.focusPage("#type"),
            total: com.focusPage("#total")
        },
        
        postParam: {},
    };
	
    $.extend(com.validator, functionArea.validator);
    
	com.post(api.ds.quotation, {}, function(res){
        functionArea.items.type.bindData(res.functionType, 'key', 'value');
    });
	
	com.post(api.quotation.queryQuotationVersion, {}, function(res) {
        functionArea.items.versionId.bindData(res.quotationVersions, "no", "name");
    });
	
	functionArea.modals.functionAreaModal.on("hide.bs.modal",function(a) {
	    
        com.clearValidator();
        com.cleanItems(functionArea.items);
    });
	
	functionArea.btns.saveBtn.on("click", saveFunctionArea);
	
	functionArea.items.type.on('change', function(){
	    
	    if($(this).val() == "2"){
	        functionArea.items.total.addClass('v_required').removeAttr('disabled');
	    }else{
	        functionArea.items.total.removeClass('v_required').attr('disabled', 'disabled').val(0);
	    }
    });

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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');
            var $btnAssign = $('<a></a>').addClass('btn btn-minier btn-warning').html('分配报价项');

            var propertyArr = [
                ["编号: ", v.no, "grey"],
                ["报价版本: ", v.version.no, "grey"],
                ["类型: ", v.functionAreaType, "red"],
                ["总价: ", v.total, "blue"],
                ["排序: ", v.functionAreaOrder, "blue"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).append($btnDel).append($btnAssign).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

            $btnEdit.click(function(){
                com.showConfirm("功能区的类型修改,会清空以前包含的报价项,是否确认修改?", function() {
                    editFunctionArea(v);
                });
            });

            $btnAssign.click(function(){
                params.functionArea = {
                    "faid": v.faid,
                    "versionId": v.version.no,
                }
                com.popup4page("#functionAreaItemPopUp", "/views/quotation/functionAreaItem.html", "功能区-报价项");
            });

            $btnDel.click(function(){
                removeFunctionArea(v.faid);
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

    var _condArr = ['data-quotation-functionArea-name','data-quotation-version'];

    var searcher = new Searcher();
    searcher.init( _condArr, "condList", api.quotation.pageFunctionArea, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "functionAreaPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addFunctionArea').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });

    //功能区添加按钮
    com.focusPage('a[name="addFunctionArea"]', '#pagenation').on('click', function () {
        
        functionArea.items.faid.val(0);
        
        functionArea.items.no.css("display", "none");
        functionArea.items.versionId.removeAttr("disabled");

        functionArea.items.total.attr("disabled", "disabled").val(0);
        
        functionArea.modals.functionAreaModal.modal("show");
    });

    //功能区编辑按钮
    function editFunctionArea(v) {
        
        functionArea.items.faid.val(v.faid);
        functionArea.items.no.val(v.no);
        functionArea.items.name.val(v.name);
        functionArea.items.functionAreaOrder.val(v.functionAreaOrder);
        functionArea.items.functionAreaType.val(v.functionAreaType);
        functionArea.items.versionId.val(v.version.no);
        functionArea.items.type.val(v.type);
        
        if(v.type == 2){
            functionArea.items.total.val(v.total).removeAttr("disabled");
        } else {
            functionArea.items.total.attr("disabled", "disabled").val(0);
        }

        functionArea.items.no.css("display", '').attr("disabled", "disabled");
        functionArea.items.versionId.attr("disabled", "disabled")
        
        functionArea.modals.functionAreaModal.modal("show");
    }
    
    //功能区保存按钮点击事件
    function saveFunctionArea() {
        
        if(com.validate("functionAreaModal")) return false;
        
        var versionId = functionArea.items.versionId.val();
        
        var url = api.quotation.addFunctionArea;
        var options = {
            "functionArea.no": functionArea.items.no.val(),
            "functionArea.name": functionArea.items.name.val(),
            "functionArea.functionAreaOrder": functionArea.items.functionAreaOrder.val(),
            "functionArea.functionAreaType": functionArea.items.functionAreaType.val(),
            "functionArea.version.no": versionId,
            "functionArea.type": functionArea.items.type.val(),
            "functionArea.total": functionArea.items.total.val()
        };
        
        if(functionArea.items.faid.val() != '0'){
            url = api.quotation.updateFunctionArea;
            options["functionArea.faid"] = functionArea.items.faid.val();
        }

        com.post(url, options, function(){
            com.showAlert(com.info, "操作成功");
            searcher.doSearch();
            functionArea.modals.functionAreaModal.modal("hide");
        });
    }
    
    //功能区删除事件
    function removeFunctionArea(faid) {
        com.showConfirm("是否确认删除", function() {
            com.post(api.quotation.deleteFunctionArea, {"functionArea.faid": faid}, function(){
                
                com.showAlert(com.info, "操作成功");
                
                searcher.doSearch();
            });
        });
    }
    
});
