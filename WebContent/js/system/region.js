
jQuery(function($) {
	
	var region = {
		saveBtn: null,
		cancelBtn: null,
		modal: null,
		regionItems:{},
		
		postParam: {'template.templateDeleteFlag': 0},
		
		validator: {
			region: {
				type: "v_region", 
				regex: /^A_\d{2}$/g, 
				errorMsg: "请以A_作为前缀 , 之后以两位数字组成(如A_01)."
			}
		},
		
		editFlg: false,
		repeatFlg: false
	};
	
	region.saveBtn = com.focusPage("#saveBtn").on("click", saveData);
	region.cancelBtn = com.focusPage("#cancelBtn");
	
	region.modal = com.focusPage("#regionModal");
	
	region.regionItems.name = com.focusPage("#regionName");
	region.regionItems.no = com.focusPage("#regionId");
	
	$.extend(com.validator, region.validator);
	
	function buildRegionLinebtns() {

		return {
			edit: {
				name: "编辑",
				clazz: "btn-yellow",
				handle: function(v) {
					editRegion(v.rid, v.no, v.name);
				}
			},
			del: {
				name: "删除",
				clazz: "btn-success",
				handle: function(v) {
					deleteRegion(v.rid);
				}
			}
		};
	}

	function buildRegionButtons() {

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRegion').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	}

	var searcher = new Searcher();

	searcher.set("condList", "pagenation", "resultList", api.system.pageRegion, null, ["system-region-name"], "regionPostData", null, false, buildRegionButtons);
	searcher.line(function(v) { return v.no + " " + v.name; }, [], buildRegionLinebtns()).render();
		
	com.focusPage('[name="addRegion"]', com.focusPage('#pagenation')).click(function(){
		editFlg = false;
		
		com.cleanItems(region.regionItems);
		region.regionItems.no.prop("disabled", false).css("display", "none");
		
		region.modal.modal("show");  
    });
	
	function editRegion(rid, no, name){
		
		editFlg = true;
		
		com.clearValidator();
		com.clearValidator("#regionId", true);
		
		region.regionItems.rid = rid;
		region.regionItems.no.val(no).prop("disabled", true).css("display", "block");
		region.regionItems.name.val(name);
		
		region.modal.modal("show");
	}
	
	function deleteRegion(rid){
		
		var options = {
			"rids[0]": rid,
		};
		
		com.post(api.system.deleteRegion, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		if(com.validate("regionModal") || region.repeatFlg){
			return false;
		}
		
		var url;
		var options = {
			'region.rid': region.regionItems.rid,
			'region.no': region.regionItems.no.val(),
			'region.name': region.regionItems.name.val(),
		};
		
		if(editFlg){
			url = api.system.updateRegion;
		}else{
			url = api.system.addRegion;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		region.modal.modal("hide");   
	}
	
});
