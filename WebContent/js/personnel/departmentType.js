
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

	var buttons = (function() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'departmentTypeModal').css("margin", "0px 3px");
		$('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		$('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	})();

	var departmentTypeSearcher = new Searcher();

	departmentTypeSearcher.set("condList", "pagenation", "resultList", api.communion.pageDepartmentType, null, [], "departmentTypePostData", null, false, buttons);
	departmentTypeSearcher.line("name", [], {}).render();

	$('a[name="departmentTypeModal"]', com.focusPage('#pagenation')).click(function(){
		departmentType.modal.modal("show");
	});
	
	function saveData(){
	    
		if(com.validate("departmentTypeModal")){
			return false;
		}
		
		com.post(api.communion.addDepartmentType, {'departmentType.name': departmentType.items.departmentTypeName.val()}, function(res){
			departmentType.modal.modal("hide");
			departmentTypeSearcher.doSearch();
		});

	}
});

