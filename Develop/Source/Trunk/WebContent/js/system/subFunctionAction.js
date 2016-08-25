var subFunctionAction = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	subFunctionActionItems:{},
	
	postParam: {},
	
	repeatFlg: false,
};

jQuery(function($) {
	
	subFunctionAction.saveBtn = $("#saveBtn").on("click", saveData);
	subFunctionAction.cancelBtn = $("#cancelBtn");
	
	subFunctionAction.modal = $("#subFunctionActionModal");
	
	subFunctionAction.subFunctionActionItems.subFunctionId=$("#subFunctionId");
	subFunctionAction.subFunctionActionItems.defaultFlag = $("#defaultFlag");
	subFunctionAction.subFunctionActionItems.defaultFlag.switchBtn();
	subFunctionAction.subFunctionActionItems.defaultFlag.click(function(e){
		subFunctionAction.subFunctionActionItems.defaultFlag.value = subFunctionAction.subFunctionActionItems.defaultFlag.value == 0 ? 1 : 0;
	});
	
	subFunctionAction.subFunctionActionItems.moduleId = $("#moduleId").on("change",function(){
		$this = $(this);
		bindFunction($this.val());
	});
	
	subFunctionAction.subFunctionActionItems.functionId = $("#functionId").on("change",function(){
		$this = $(this);
		bindSubFunction($this.val());
	});
	
	subFunctionAction.subFunctionActionItems.actionId = $("#actionId");
	subFunctionAction.subFunctionActionItems.actionDes = $("#actionDes");
	subFunctionAction.subFunctionActionItems.actionName = $("#actionName");
	
	subFunctionAction.modal.on('show.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#actionName", true);
	});
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.actionName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["所属模块:", v.subFunction['function'].module.moduleName, "grey"],
               ["所属功能:", v.subFunction['function'].functionName, "grey"],
               ["所属子功能:", v.subFunction.subFunctionName, "grey"],
               ["默认权限:", v.defaultFlag == 0 ? '否' : '是', "red"],
               ["描述:", v.actionDes, "grey"],
           ];

           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editAction(v.subFunction['function'].module.moduleId, v.subFunction['function'].functionId, v.subFunction.subFunctionId, v.actionId, v.actionName, v.actionDes, v.defaultFlag);
            });
            
            $btnDel.click(function(){
            	deleteAction(v.actionId);
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
	
	searcher.init(["subFunctionName"], "condList", api.system.pageSubFunctionAction, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "subFunctionActionPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addAction').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addAction"]', '#pagenation').click(function(){
		subFunctionAction.editFlg = false;
		
		com.cleanItems(subFunctionAction.subFunctionActionItems);
		
		if(subFunctionAction.subFunctionActionItems.defaultFlag.value == undefined){
			subFunctionAction.subFunctionActionItems.defaultFlag.value = 0;
		}else{
			if(subFunctionAction.subFunctionActionItems.defaultFlag.value == 1){
				subFunctionAction.subFunctionActionItems.defaultFlag.click();
			}
			subFunctionAction.subFunctionActionItems.defaultFlag.value = 0;
		}
		
		bindModule();
		
		subFunctionAction.modal.modal("show");   
    });
	
	function editAction(moduleId, functionId, subFunctionId, actionId, actionName, actionDes, defaultFlag){
		
		subFunctionAction.editFlg = true;
		
		bindModule(moduleId, functionId, subFunctionId);
		
		subFunctionAction.subFunctionActionItems.actionId.val(actionId);
		subFunctionAction.subFunctionActionItems.actionName.val(actionName);
		subFunctionAction.subFunctionActionItems.actionDes.val(actionDes);
		subFunctionAction.subFunctionActionItems.moduleId.val(moduleId);
		subFunctionAction.subFunctionActionItems.functionId.val(functionId);
		subFunctionAction.subFunctionActionItems.subFunctionId.val(subFunctionId);
		
		if(subFunctionAction.subFunctionActionItems.defaultFlag.value == undefined){
			if(defaultFlag == 1){
				subFunctionAction.subFunctionActionItems.defaultFlag.click();
			}
			subFunctionAction.subFunctionActionItems.defaultFlag.value = defaultFlag;
		}else{
			if(subFunctionAction.subFunctionActionItems.defaultFlag.value != defaultFlag){
				subFunctionAction.subFunctionActionItems.defaultFlag.click();
			}
			subFunctionAction.subFunctionActionItems.defaultFlag.value = defaultFlag;
		}
		
		subFunctionAction.modal.modal("show");
	}
	
	function deleteAction(actionId){
		
		var options = {
			"actionIds[0]": actionId,
		};
		
		com.post(api.system.deleteSubFunctionAction, options, function(res){
			searcher.doSearch();
		});
	}
	
	function saveData(){
		
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'subFunctionActions.actionName': subFunctionAction.subFunctionActionItems.actionName.val(),
			'subFunctionActions.actionDes': subFunctionAction.subFunctionActionItems.actionDes.val(),
			'subFunctionActions.subFunction.subFunctionId':subFunctionAction.subFunctionActionItems.subFunctionId.val(),
			'subFunctionActions.defaultFlag': subFunctionAction.subFunctionActionItems.defaultFlag.value,
		};
		
		if(subFunctionAction.editFlg){
			url = api.system.updateSubFunctionAction;
			options['subFunctionActions.actionId'] = subFunctionAction.subFunctionActionItems.actionId.val();
		}else{
			url = api.system.addSubFunctionAction;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		subFunctionAction.modal.modal("hide");   
	}
	
	function bindModule(moduleId,functionId,subFunctionId){
		com.post(api.system.queryModule, {}, function(res){
			subFunctionAction.subFunctionActionItems.moduleId.bindData(res.moduleList, "moduleId", "moduleName", false);
			
			if(typeof(moduleId) == "undefined" || moduleId == null){
				subFunctionAction.subFunctionActionItems.moduleId.get(0).selectedIndex = 0;
			}else{
				subFunctionAction.subFunctionActionItems.moduleId.val(moduleId);
			}
			
			bindFunction(subFunctionAction.subFunctionActionItems.moduleId.val(),functionId, subFunctionId);
		});
	}

	function bindFunction(moduleId,functionId,subFunctionId){
		com.post(api.system.queryFunctionByModuleId, {"function.module.moduleId":moduleId}, function(res){
			subFunctionAction.subFunctionActionItems.functionId.bindData(res.functionList, "functionId", "functionName");
			
			if(typeof(functionId) == "undefined" || functionId==null){
				subFunctionAction.subFunctionActionItems.functionId.get(0).selectedIndex = 0;
			}else{
				subFunctionAction.subFunctionActionItems.functionId.val(functionId);
			}
			
			bindSubFunction(subFunctionAction.subFunctionActionItems.functionId.val(),subFunctionId);
		});
	}

	function bindSubFunction(functionId,subFunctionId){
		com.post(api.system.querySubFunctionByFunctionId, {"subFunction.function.functionId":functionId}, function(res){
			subFunctionAction.subFunctionActionItems.subFunctionId.bindData(res.subFunctionList, "subFunctionId", "subFunctionName");
			
			if(typeof(subFunctionId) == "undefined" || subFunctionId == null){
				subFunctionAction.subFunctionActionItems.subFunctionId.get(0).selectedIndex = 0;
			}else{
				subFunctionAction.subFunctionActionItems.subFunctionId.val(subFunctionId);
			}
		});
	}
	
});
