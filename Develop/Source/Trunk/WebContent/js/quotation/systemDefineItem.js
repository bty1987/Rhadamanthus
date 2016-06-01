$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
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

        var creatLine = function(v){   //页面中的一条数据
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.itemName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-primary').html('编辑');
            var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-primary').html('删除');

            var propertyArr = [
                ["编号:", v.itemId, "grey"],
                ["大类:", v.quotationBigCategory, "grey"],
                ["单位:", v.measurementUnit, "grey"],
                ["工种", v.itemWorkType, "grey"],
                ["单价", v.unitPrice, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            $divBtnWrap.append($btnEdit).appendTo($h3);
            
            $divBtnWrap.append($btnDelete).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

           //编辑按钮的点击事件
            $btnDelete.click(function(){
            	removeSystemDefine(v.autoId);
            });
            
            $btnEdit.click(function(){
                edit(v);
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

    var _condArr = ['itemName','quotationBigCategoryId','quotationWorkTypeId'];//与condition.js中名字相同
   
   var systemDefineItemSeacher = new Searcher();
   
    systemDefineItemSeacher.init( _condArr, "condList", api.quotation.pageSystemDefineItem, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "SystemDefineItemPostData");
    
    //定义全局变量  json
    var systemDefineItem = {
    		
		saveBtn: $("#saveAddItemBtn").on("click", saveData),//绑定事件
		cancelBtn: null,

		modal: null,
		systemDefineItemItems: {},
		
		addSystemDefineItemUrl:api.quotation.addSystemDefineItem,
		
		updateSystemDefineItemUrl:api.quotation.updateSystemDefineItem,
		
		deleteSystemDefineItemsByAutoIdsUrl:api.quotation.deleteSystemDefineItemByIds,
		
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
    	
   //给全局变量赋值（主要操作是制定页面标签）
	//systemDefineItem.saveBtn = $("#saveAddItemBtn").on("click", saveData);
	systemDefineItem.cancelBtn = $("#cancelBtn");
	systemDefineItem.modal = $("#addItemModal");

	systemDefineItem.systemDefineItemItems.autoId = $("#autoId");
	systemDefineItem.systemDefineItemItems.quotationBigCategory = $("#quotationBigCategory");
	systemDefineItem.systemDefineItemItems.itemName = $("#itemName");
	systemDefineItem.systemDefineItemItems.measurementUnit = $("#measurementUnit");
	systemDefineItem.systemDefineItemItems.itemWorkType = $("#itemWorkType");
	systemDefineItem.systemDefineItemItems.quotationItemDes = $("#quotationItemDes");
	systemDefineItem.systemDefineItemItems.unitPrice = $("#unitPrice");
	systemDefineItem.systemDefineItemItems.itemId = $("#itemId").on("blur",function(){
		$this = $(this);
		if($this.val() == ""){
			return;
		}
		
		com.post(systemDefineItem.checkItemIdUrl, {"systemDefineItem.itemId":$this.val()}, function(res){
			if(res.systemDefineItem&&res.systemDefineItem.itemId){
				com.showTips($this, "该版本的编号已存在", true);
				systemDefineItem.repeatFlg = true;
			}else{
				com.clearValidator("#itemId", true);
				systemDefineItem.repeatFlg = false;
			}
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
    		$("#measurementUnit").bindData(systemDefineItem.measurementUnits, "id", "name");// bindData 给select标签 绑定一组数据
    		
    	}, null, false);
    	
    	com.post(systemDefineItem.queryQuotationBigCategoryUrl,{},function(res){
    	
    		systemDefineItem.quotationBigCategorys = res.quotationBigCategorys;
    		systemDefineItem.quotationBigCategorysStr = "";
    		
    		for(var tem=0;tem<res.quotationBigCategorys.length;++tem){
    			systemDefineItem.quotationBigCategorysStr+=(res.quotationBigCategorys[tem].id+":"+res.quotationBigCategorys[tem].name+";");
    		}
    		systemDefineItem.quotationBigCategorysStr = systemDefineItem.quotationBigCategorysStr.substr(0,systemDefineItem.quotationBigCategorysStr.length-1);
    		
    		
    		$("#quotationBigCategory").bindData(systemDefineItem.quotationBigCategorys, "id", "name");
    		
    	}, null, false);
    	
    	com.post(api.common.queryWorkType,{},function(res){

    		systemDefineItem.workTypes = res.workTypes;
    		systemDefineItem.workTypesStr = "";
    		
    		for(var tem=0;tem<res.workTypes.length;++tem){
    			systemDefineItem.workTypesStr += (res.workTypes[tem].id+":"+res.workTypes[tem].name+";");
    		}
    		systemDefineItem.workTypesStr = systemDefineItem.workTypesStr.substr(0,systemDefineItem.workTypesStr.length-1);
    		
    		$("#itemWorkType").bindData(systemDefineItem.workTypes, "id", "name");
    	
    	}, null, false);
    }
    
    //编辑
    function edit(row){
    	//给页面标签赋值
    	
    	systemDefineItem.editFlg=true;
    	systemDefineItem.repeatFlg=false;
		systemDefineItem.systemDefineItemItems.autoId.val(row.autoId);
		systemDefineItem.systemDefineItemItems.itemId.val(row.itemId);
		systemDefineItem.systemDefineItemItems.itemName.val(row.itemName);
		systemDefineItem.systemDefineItemItems.quotationBigCategory.val(row.quotationBigCategoryId); 
		systemDefineItem.systemDefineItemItems.itemWorkType.val(row.itemWorkTypeId); 
		systemDefineItem.systemDefineItemItems.measurementUnit.val(row.measurementUnitId); 
		
		systemDefineItem.systemDefineItemItems.quotationItemDes.val(row.quotationItemDes);
		systemDefineItem.systemDefineItemItems.unitPrice.val(row.unitPrice);	
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
    		"systemDefineItem.unitPrice": systemDefineItem.systemDefineItemItems.unitPrice.val()
    	};
    	
    	if(systemDefineItem.editFlg) {
    		url = systemDefineItem.updateSystemDefineItemUrl;
    		options["systemDefineItem.autoId"] = systemDefineItem.systemDefineItemItems.autoId.val();
    	}else{
    		url = systemDefineItem.addSystemDefineItemUrl;
    	}
    	
    	com.post(url, options, successCallback);
    	
    	systemDefineItem.modal.modal("hide");
    }
    
    //添加
    $('[name="add"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数
    	systemDefineItem.editFlg = false;
		systemDefineItem.systemDefineItemItems.itemId.prop("disabled", false);
		com.cleanItems(systemDefineItem.systemDefineItemItems);
		systemDefineItem.modal.modal("show");
    })

    //删除
     function removeSystemDefine(id) {

        bootbox.confirm("删除所选记录？",function(flag) {
            var c = {"ids[0]" :id};

            flag && com.post(api.quotation.deleteSystemDefineItemByIds, c, successCallback);
        });
    }
		
    function successCallback(){
    	//$('button.btn-search','#condList').click();//调用成功后，执行查询操作  
    	systemDefineItemSeacher.doSearch();//调用成功后，执行com.Seacher中的doSeach方法
    }
    
});
