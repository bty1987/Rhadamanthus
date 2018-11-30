
jQuery(function($) {
	
	var category = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		categoryItems:{},
		
		editFlg: false,
		repeatFlg: false,
		
		validator: {
			categoryId: {
				type: "v_categoryId", 
				regex: /^C_\d{3}$/g,
				errorMsg: "请以C_作为前缀 , 之后以三位数字组成(如C_001)."
			}
		}
	};
	
//	com.focusPage('#fl-statement').statement("主材品类", "主材品类信息列表");
	
	category.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	category.cancelBtn = com.focusPage("#cancelBtn");
	
	category.modal = com.focusPage("#categoryModal").on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#categoryId", true);
	});
	
	category.categoryItems.cId = com.focusPage("#cId");
	category.categoryItems.categoryId = com.focusPage("#categoryId");
	category.categoryItems.categoryName = com.focusPage("#categoryName");
	
	$.extend(com.validator, category.validator);
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.categoryId + " " + v.categoryName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            
            $divBtnWrap.append($btnEdit).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editCategory(v);
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
	
	searcher.init(["categoryName"], "condList", api.data.pageCategory, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "categoryPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'add').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	com.focusPage('a[name="add"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(category.categoryItems);
		
		category.categoryItems.categoryId.css("display", "none");
		
		category.modal.modal("show");     
    });
	
	function editCategory(v){
		editFlg = true;
		
		category.categoryItems.cId.val(v.cid);
		category.categoryItems.categoryId.val(v.categoryId).attr("disabled", "true").css("display", "block");
		category.categoryItems.categoryName.val(v.categoryName);
		
		category.modal.modal("show");
	}
	
	function saveData(){
		if(com.validate() || category.repeatFlg){
			return;
		}
		
		var url;
		var options = {
			'category.cid': category.categoryItems.cId.val(),
			'category.categoryId': category.categoryItems.categoryId.val(),
			'category.categoryName': category.categoryItems.categoryName.val()
		};
		
		if(editFlg){
			url = api.data.updateCategory;
		}else{
			url = api.data.addCategory;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		category.modal.modal("hide");
	}
	
});
