
jQuery(function($) {
    
	var departmentType = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		items:{}
	};
	
	departmentType.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	departmentType.cancelBtn = com.focusPage("#cancelBtn");
	departmentType.items.departmentTypeName = com.focusPage("#departmentTypeName");
	departmentType.modal = com.focusPage("#departmentTypeModal");
	
	departmentType.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#businessRegionId", true);
	});
	
	com.focusPage('#fl-statement').statement("部门", "类型");

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.name));

			$liLine.append($h3)
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

	searcher.init([], "condList", api.communion.pageDepartmentType, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "departmentTypePostData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'departmentTypeModal').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [];
	});

	$('a[name="departmentTypeModal"]', com.focusPage('#pagenation')).click(function(){
		departmentType.modal.modal("show");
	});
	
	function saveData(){
	    
		if(com.validate("departmentTypeModal")){
			return false;
		}
		
		com.post(api.communion.addDepartmentType, {'departmentType.name': departmentType.items.departmentTypeName.val()}, function(res){
			departmentType.modal.modal("hide");
			searcher.doSearch();
		});

	}
});

