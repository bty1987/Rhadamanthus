$(function(){
    
  //定义全局变量  json
    var systemDefineItem = {
            
        btns: {
            saveBtn: com.focusPage("#saveBtn")
        },

        modals: {
            addItemModal: com.focusPage("#addItemModal")
        },
        
        items: {
            sdiid: com.focusPage("#sdiid"),
            no: com.focusPage("#no"),
            name: com.focusPage("#name"),
            quotationBigCategory: com.focusPage("#quotationBigCategory"),
            measurementUnit: com.focusPage("#measurementUnit"),
            workType: com.focusPage("#workType"),
            addPrice: com.focusPage("#addPrice"),
            unitPrice: com.focusPage("#unitPrice"),
            subPrice: com.focusPage("#subPrice"),
            
            comment: com.focusPage("#comment"),
        },
        
        validator: {
            systemDefineItem: {
                type: "v_systemDefaineItemId", 
                regex: /^SI_\d{5}$/,
                errorMsg: "请以SI_作为前缀 , 之后以五个位数字组成(如SI_00001)."
            }
        },
    };
    
    $.extend(com.validator, systemDefineItem.validator); //将多个对象合并成一个对象
    
    com.post(api.common.queryMeasurementUnit, {}, function(res){
        com.focusPage("#measurementUnit").bindData(res.measurementUnits, "id", "name");
    });
    
    com.post(api.quotation.queryQuotationBigCategory, {}, function(res){
        com.focusPage("#quotationBigCategory").bindData(res.quotationBigCategorys, "id", "name");
    });
    
    com.post(api.common.queryWorkType,{},function(res){
        com.focusPage("#workType").bindData(res.workTypes, "id", "name");
    });
    
    systemDefineItem.btns.saveBtn.on("click", saveData);
    
    systemDefineItem.modals.addItemModal.on('hide.bs.modal', function(e){
        com.clearValidator();
        com.cleanItems("addItemModal");
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

        var creatLine = function(v){   //页面中的一条数据
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
			var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

			//启用禁用
			var $btnStatus = $('<div></div>').addClass('pull-right');
			var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $span = $('<span></span>').addClass('lbl status-lbl');
			//是否打折
			var $btnDiscount = $('<div></div>').addClass('pull-right');
			var $discountSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $dspan = $('<span></span>').addClass('lbl discount-lbl');

            var propertyArr = [
                ["编号:", v.no, "blue"],
                ["大类:", v.bigCategory.name, "red"],
                ["单位:", v.unit.name, "red"],
                ["工种:", v.workType.name, "red"],
                ["增补价:", v.addPrice, "blue"],
                ["原单价:", v.unitPrice, "blue"],
                ["退减价:", v.subPrice, "blue"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			$btnStatus.append($statusSwitch).append($span);
			$btnDiscount.append($discountSwitch).append($dspan);

			$divBtnWrap.append($btnEdit).append($btnDelete).append($btnDiscount).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

           //编辑按钮的点击事件
            $btnDelete.click(function(){
            	remove(v.sdiid);
            });
            
            $btnEdit.click(function(){
                edit(v);
            });

			v.status && $statusSwitch.prop("checked", true);
			$statusSwitch.switchBtn("status-lbl").on("click",function() {
				updateStatus(v.sdiid, $statusSwitch.prop("checked") ? 1 : 0, function(){
				    $statusSwitch.removeAttr("checked");
				});
			});

			v.discount && $discountSwitch.prop("checked", true);
			$discountSwitch.switchBtn("discount-lbl").on("click",function() {
				updateDiscount(v.sdiid, $discountSwitch.prop("checked") ? 1 : 0, function(){
				    $discountSwitch.removeAttr("checked");
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
        };
    })();

    var _condArr = ['data-quotation-item-name', 'data-quotation-bigcategory', 'quotation-worktype'];
   
   var searcher = new Searcher();
   
    searcher.init( _condArr, "condList", api.quotation.pageSystemDefineItem, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "SystemDefineItemPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addSystemDefineItem').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
    
    //编辑
    function edit(row){
    	//给页面标签赋值
    	
		systemDefineItem.items.sdiid.val(row.sdiid);
		systemDefineItem.items.no.val(row.no);
		systemDefineItem.items.name.val(row.name);
		
		systemDefineItem.items.quotationBigCategory.val(row.bigCategory.id); 
		systemDefineItem.items.workType.val(row.workType.id); 
		systemDefineItem.items.measurementUnit.val(row.unit.id); 
		
		
		systemDefineItem.items.addPrice.val(row.addPrice);
		systemDefineItem.items.unitPrice.val(row.unitPrice);
		systemDefineItem.items.subPrice.val(row.subPrice);
		
		systemDefineItem.items.comment.val(row.comment);
		
		systemDefineItem.items.no.prop("disabled", true);

		systemDefineItem.modals.addItemModal.modal("show"); //弹出弹层
    }
    
    function saveData(){
        
        com.clearValidator();
        
    	if(com.validate("addItemModal")){
    		return false;
    	}
    	
    	var url = api.quotation.addSystemDefineItem;
    	var options = {
    		"systemDefineItem.no": systemDefineItem.items.no.val(),
    		"systemDefineItem.name": systemDefineItem.items.name.val(),
    		"systemDefineItem.bigCategory.id": systemDefineItem.items.quotationBigCategory.val(),
    		"systemDefineItem.unit.id": systemDefineItem.items.measurementUnit.val(),
    		"systemDefineItem.workType.id": systemDefineItem.items.workType.val(),
    		"systemDefineItem.addPrice": systemDefineItem.items.addPrice.val(),
    		"systemDefineItem.unitPrice": systemDefineItem.items.unitPrice.val(),
    		"systemDefineItem.subPrice": systemDefineItem.items.subPrice.val(),
    		"systemDefineItem.comment": systemDefineItem.items.comment.val(),
    	};
    	
    	if(systemDefineItem.items.sdiid.val()) {
    		url = api.quotation.updateSystemDefineItem;
    		options["systemDefineItem.sdiid"] = systemDefineItem.items.sdiid.val();
    	}
    	
    	com.post(url, options, function(res){
    	    
    	    com.showAlert(com.info, "操作成功");
    	    
    	    searcher.doSearch();
    	    systemDefineItem.modals.addItemModal.modal("hide");
    	});
    }
    
    //添加
    com.focusPage('[name="addSystemDefineItem"]', '#pagenation').on("click", function(){  //选择器 [属性名="属性值"]  匿名函数
        
		systemDefineItem.items.no.prop("disabled", false);
		
		com.cleanItems(systemDefineItem.items);
		
		systemDefineItem.modals.addItemModal.modal("show");
    });

    //删除
     function remove(sdiid) {
        com.showConfirm("是否删除所选记录", function() {
            com.post(api.quotation.deleteSystemDefineItem, {"systemDefineItem.sdiid": sdiid}, function(res){
                searcher.doSearch();
            });
        });
    }

	//启用禁用功能
	function updateStatus(sdiid, status, failcallBack) {

	    var options = {
            "systemDefineItem.sdiid": sdiid,
            "systemDefineItem.status": status
        };

		com.post(api.quotation.updateSystemDefineItemForStatus, options);
	}

	//是否打折设置
	function updateDiscount(sdiid, discount, failcallBack) {

	    var options = {
            "systemDefineItem.sdiid": sdiid,
            "systemDefineItem.discount": discount
	    };

		com.post(api.quotation.updateSystemDefineItemForDiscount, options);
	}
		
});
