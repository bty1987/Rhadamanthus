$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
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

        var creatLine = function(v){   //页面中的一条数据
            var $liLine = $('<li></li>').addClass('item-orange clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.itemName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
			var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

			//启用禁用
			var $btnStatus = $('<div></div>').addClass('pull-right');
			var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $span = $('<span></span>').addClass('lbl');
			//是否打折
			var $btnDiscount = $('<div></div>').addClass('pull-right');
			var $discountSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $dspan = $('<span></span>').addClass('lbl');

            var propertyArr = [
                ["编号:", v.itemId, "blue"],
                ["大类:", v.quotationBigCategory, "red"],
                ["单位:", v.measurementUnit, "red"],
                ["工种:", v.itemWorkType, "red"],
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
            	removeSystemDefine(v.sdiId);
            });
            
            $btnEdit.click(function(){
                edit(v);
            });

			v.status && $statusSwitch.prop("checked", true);
			$statusSwitch.switchBtn("status-lbl").on("click",function() {
				$statusSwitch.prop("checked") ? (updateStatus(v.sdiId, 1, function(){$statusSwitch.removeAttr("checked");})) : (updateStatus(v.sdiId, 0,function(){$statusSwitch.prop("checked");}));
			});

			v.discount && $discountSwitch.prop("checked", true);
			$discountSwitch.switchBtn("discount-lbl").on("click",function() {
				$discountSwitch.prop("checked") ? (updateDiscount(v.sdiId, 1, function(){$discountSwitch.removeAttr("checked");})) : (updateDiscount(v.sdiId, 0,function(){$discountSwitch.prop("checked");}));
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

    var _condArr = ['itemName','quotationBigCategoryId','quotationWorkTypeId'];//与condition.js中名字相同
   
   var systemDefineItemSeacher = new Searcher();
   
    systemDefineItemSeacher.init( _condArr, "condList", api.quotation.pageSystemDefineItem, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "SystemDefineItemPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addSystemDefineItem').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
    
    //定义全局变量  json
    var systemDefineItem = {
    		
		saveBtn: com.focusPage("#saveAddItemBtn").on("click", saveData),//绑定事件
		cancelBtn: null,

		modal: null,
		systemDefineItemItems: {},
		
		addSystemDefineItemUrl:api.quotation.addSystemDefineItem,
		
		updateSystemDefineItemUrl:api.quotation.updateSystemDefineItem,
		
		queryQuotationTypeUrl:api.common.queryWorkType,
		
		queryQuotationClassificationUrl: api.quotation.queryQuotationClassification,
		
		queryQuotationBigCategoryUrl: api.quotation.queryQuotationBigCategory,
		
		queryQuotationSmallCategoryUrl: api.quotation.queryQuotationSmallCategory,
		
		querySystemDefineItemUrl:api.quotation.pageSystemDefineItem,
		
		checkItemIdUrl:api.quotation.querySystemDefineItemByItemId,
		
		quotationTypes:null,
		quotationClassifications:null,
		quotationBigCategorys:null,
		quotationSmallCategorys:null,
		measurementUnits:null,
		workTypes:null,
		
		quotationTypesStr:"",
		quotationClassificationsStr:"",
		quotationBigCategorysStr:"",
		quotationSmallCategorysStr:"",
		measurementUnitsStr:"",
		workTypesStr:"",
		
		validator: {
			region: {
				type: "v_itemId", 
				regex: /^SI_\d{5}$/g,
				errorMsg: "请以SI_作为前缀 , 之后以五个位数字组成(如SI_00001)."
			}
		},
		editFlag: false,
		repeatFlg:false
	};
    	
   //给全局变量赋值(主要操作是制定页面标签)
	//systemDefineItem.saveBtn = $("#saveAddItemBtn").on("click", saveData);
	systemDefineItem.cancelBtn = com.focusPage("#cancelBtn");
	systemDefineItem.modal = com.focusPage("#addItemModal");

	systemDefineItem.systemDefineItemItems.sdiId = com.focusPage("#sdiId");
	systemDefineItem.systemDefineItemItems.quotationBigCategory = com.focusPage("#quotationBigCategory");
	systemDefineItem.systemDefineItemItems.itemName = com.focusPage("#itemName");
	systemDefineItem.systemDefineItemItems.measurementUnit = com.focusPage("#measurementUnit");
	systemDefineItem.systemDefineItemItems.itemWorkType = com.focusPage("#itemWorkType");
	systemDefineItem.systemDefineItemItems.quotationItemDes = com.focusPage("#quotationItemDes");
	systemDefineItem.systemDefineItemItems.addPrice = com.focusPage("#addPrice");
	systemDefineItem.systemDefineItemItems.unitPrice = com.focusPage("#unitPrice");
	systemDefineItem.systemDefineItemItems.subPrice = com.focusPage("#subPrice");
	systemDefineItem.systemDefineItemItems.itemId = com.focusPage("#itemId").on("blur",function(){
		$this = $(this);
		if($this.val() == ""){
			return;
		}
		
		com.post(systemDefineItem.checkItemIdUrl, {"systemDefineItem.itemId":$this.val()}, function(res){
			if(res.systemDefineItem && res.systemDefineItem.itemId){
				com.showTips($this, "该版本的编号已存在", true);
				systemDefineItem.repeatFlg = true;
			}else{
				com.clearValidator("#itemId", true);
				systemDefineItem.repeatFlg = false;
			}
		}, function(res){
			com.clearValidator("#itemId", true);
			systemDefineItem.repeatFlg = false;
		});
	});
	
	systemDefineItem.modal.on('shown.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#itemId", true);
		
		if(systemDefineItem.editFlg == false){
			systemDefineItem.systemDefineItemItems.quotationBigCategory.get(0).selectedIndex = 0;
			systemDefineItem.systemDefineItemItems.itemWorkType.get(0).selectedIndex = 0;
			systemDefineItem.systemDefineItemItems.measurementUnit.get(0).selectedIndex = 0;
		}
	
	});
	$.extend(com.validator, systemDefineItem.validator); //将多个对象合并成一个对象
	
	initDataMap();

	//给select下拉列表绑定数据
	function initDataMap(){
    	
    	com.post(api.common.queryMeasurementUnit, {}, function(res){

    		systemDefineItem.measurementUnits = res.measurementUnits;
    		systemDefineItem.measurementUnitsStr = "";
    		
    		for(var tem=0;tem<res.measurementUnits.length;++tem){
    			systemDefineItem.measurementUnitsStr+=(res.measurementUnits[tem].id+":"+res.measurementUnits[tem].name+";");
    		}
    		
    		systemDefineItem.measurementUnitsStr = systemDefineItem.measurementUnitsStr.substr(0,systemDefineItem.measurementUnitsStr.length-1);
    		com.focusPage("#measurementUnit").bindData(systemDefineItem.measurementUnits, "id", "name");// bindData 给select标签 绑定一组数据
    		
    	}, null, false);
    	
    	com.post(systemDefineItem.queryQuotationBigCategoryUrl,{},function(res){
    	
    		systemDefineItem.quotationBigCategorys = res.quotationBigCategorys;
    		systemDefineItem.quotationBigCategorysStr = "";
    		
    		for(var tem=0;tem<res.quotationBigCategorys.length;++tem){
    			systemDefineItem.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
    		}
    		systemDefineItem.quotationBigCategorysStr = systemDefineItem.quotationBigCategorysStr.substr(0,systemDefineItem.quotationBigCategorysStr.length-1);
    		
    		
    		com.focusPage("#quotationBigCategory").bindData(systemDefineItem.quotationBigCategorys, "id", "name");
    		
    	}, null, false);
    	
    	com.post(api.common.queryWorkType,{},function(res){

    		systemDefineItem.workTypes = res.workTypes;
    		systemDefineItem.workTypesStr = "";
    		
    		for(var tem=0;tem<res.workTypes.length;++tem){
    			systemDefineItem.workTypesStr += (res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
    		}
    		systemDefineItem.workTypesStr = systemDefineItem.workTypesStr.substr(0,systemDefineItem.workTypesStr.length-1);
    		
    		com.focusPage("#itemWorkType").bindData(systemDefineItem.workTypes, "id", "name");
    	
    	}, null, false);
    }
    
    //编辑
    function edit(row){
    	//给页面标签赋值
    	
    	systemDefineItem.editFlg=true;
    	systemDefineItem.repeatFlg=false;
		systemDefineItem.systemDefineItemItems.sdiId.val(row.sdiId);
		systemDefineItem.systemDefineItemItems.itemId.val(row.itemId);
		systemDefineItem.systemDefineItemItems.itemName.val(row.itemName);
		systemDefineItem.systemDefineItemItems.quotationBigCategory.val(row.quotationBigCategoryId); 
		systemDefineItem.systemDefineItemItems.itemWorkType.val(row.itemWorkTypeId); 
		systemDefineItem.systemDefineItemItems.measurementUnit.val(row.measurementUnitId); 
		
		systemDefineItem.systemDefineItemItems.quotationItemDes.val(row.quotationItemDes);
		systemDefineItem.systemDefineItemItems.addPrice.val(row.addPrice);
		systemDefineItem.systemDefineItemItems.unitPrice.val(row.unitPrice);
		systemDefineItem.systemDefineItemItems.subPrice.val(row.subPrice);
		systemDefineItem.systemDefineItemItems.itemId.prop("disabled", true);

		systemDefineItem.modal.modal("show"); //弹出弹层
    }
    
    function saveData(){
    	if(com.validate()|| systemDefineItem.repeatFlg)
    		return;
    	
    	var url;
    	var options = {
    		"systemDefineItem.itemId":systemDefineItem.systemDefineItemItems.itemId.val(),
    		"systemDefineItem.itemName": systemDefineItem.systemDefineItemItems.itemName.val(),
    		"systemDefineItem.quotationBigCategoryId": systemDefineItem.systemDefineItemItems.quotationBigCategory.val(),
    		"systemDefineItem.quotationBigCategory": "",
    		"systemDefineItem.measurementUnitId": systemDefineItem.systemDefineItemItems.measurementUnit.val(),
    		"systemDefineItem.measurementUnit": "",
    		"systemDefineItem.itemWorkTypeId": systemDefineItem.systemDefineItemItems.itemWorkType.val(),
    		"systemDefineItem.itemWorkType": "",
    		"systemDefineItem.quotationItemDes": systemDefineItem.systemDefineItemItems.quotationItemDes.val(),
    		"systemDefineItem.addPrice": systemDefineItem.systemDefineItemItems.addPrice.val(),
    		"systemDefineItem.unitPrice": systemDefineItem.systemDefineItemItems.unitPrice.val(),
    		"systemDefineItem.subPrice": systemDefineItem.systemDefineItemItems.subPrice.val(),
    	};
    	
    	if(systemDefineItem.editFlg) {
    		url = systemDefineItem.updateSystemDefineItemUrl;
    		options["systemDefineItem.sdiId"] = systemDefineItem.systemDefineItemItems.sdiId.val();
    	}else{
    		url = systemDefineItem.addSystemDefineItemUrl;
    	}
    	
    	com.post(url, options, successCallback);
    	
    	systemDefineItem.modal.modal("hide");
    }
    
    //添加
    com.focusPage('[name="addSystemDefineItem"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数
    	systemDefineItem.editFlg = false;
		systemDefineItem.systemDefineItemItems.itemId.prop("disabled", false);
		com.cleanItems(systemDefineItem.systemDefineItemItems);
		systemDefineItem.modal.modal("show");
    });

    //删除
     function removeSystemDefine(id) {
        com.showConfirm("是否删除所选记录", function() {
            com.post(api.quotation.deleteSystemDefineItemByIds, {"ids[0]" :id}, successCallback);
        });
    }

	//启用禁用功能
	function updateStatus(id, status, failcallBack) {

		com.post(api.quotation.updateSystemDefineItemForStatus, {
			"systemDefineItem.sdiId": id,
			"systemDefineItem.status": status
		}, function () {

		}, function () {
			failcallBack && failcallBack();
		});
	}


	//是否打折设置
	function updateDiscount(id, discount, failcallBack) {

		com.post(api.quotation.updateSystemDefineItemForDiscount, {
			"systemDefineItem.sdiId": id,
			"systemDefineItem.discount": discount
		}, function () {

		}, function () {
			failcallBack && failcallBack();
		});
	}
		
    function successCallback(){
    	//$('button.btn-search','#condList').click();//调用成功后,执行查询操作  
    	systemDefineItemSeacher.doSearch();//调用成功后,执行com.Seacher中的doSeach方法
    }
    
});
