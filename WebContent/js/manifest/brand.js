
jQuery(function($) {
	
	var brand = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		brandItems:{},
		data:{
			categoryData: {}
		},
		
		editFlg: false,
		repeatFlg: false,
		
		validator: {
			brandId: {
				type: "v_brandId", 
				regex: /^B_\d{3}$/g,
				errorMsg: "请以B_作为前缀 , 之后以三位数字组成(如B_001)."
			}
		}
	};
	
	com.focusPage('#fl-statement').statement("主材品牌", "主材品牌信息列表");
	
	brand.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	brand.cancelBtn = com.focusPage("#cancelBtn");
	brand.modal = com.focusPage("#brandModal");
	
	brand.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#brandId", true);
	});
	
	brand.brandItems.bId = com.focusPage("#bId");
	brand.brandItems.brandId = com.focusPage("#brandId");
	brand.brandItems.brandName = com.focusPage("#brandName");
	brand.brandItems.categoryId = com.focusPage("#categoryId");
	
	$.extend(com.validator, brand.validator);
	
	com.post(api.data.queryCategory, {}, function(res){
		com.focusPage("#categoryId").bindData(res.categorys, "cid", "categoryName");
	});
	
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
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.brandId + " " + v.brandName + " " + v.categoryName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            
            $divBtnWrap.append($btnEdit).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editBrand(v);
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
	
	searcher.init(["categoryId", "brandName"], "condList", api.data.pageBrand, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "brandPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	com.focusPage('a[name="add"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(brand.brandItems);
		
		brand.brandItems.brandId.val("").css("disabled", false).css("display", "none");
		
		brand.modal.modal("show");   
    });
	
	function editBrand(v){
		editFlg = true;
		
		brand.brandItems.bId.val(v.bid);
		brand.brandItems.brandId.val(v.brandId).attr("disabled", "true").css("display", "block");
		brand.brandItems.brandName.val(v.brandName);
		brand.brandItems.categoryId.val(v.cid);
		
		brand.modal.modal("show");
	}
	
	function saveData(){
		if(com.validate() || brand.repeatFlg)
			return;
		
		var url;
		var options = {
			'brand.bid': brand.brandItems.bId.val(),
			'brand.brandId': brand.brandItems.brandId.val(),
			'brand.brandName': brand.brandItems.brandName.val(),
			'brand.cid': brand.brandItems.categoryId.val()
		};
		
		if(editFlg){
			url = api.data.updateBrand;
		}else{
			url = api.data.addBrand;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		brand.modal.modal("hide");   
	}
	
});
