
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + " " + v.name));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editRegion(v.rid, v.no, v.name);
            });
            
            $btnDel.click(function(){
            	deleteRegion(v.rid);
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
	
	var searcher = new Searcher();
	
	searcher.init(["system-region-name"], "condList", api.system.pageRegion, function(data){         
		displayFunc.init('resultList', data);
	}, "pagenation", "regionPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRegion').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
		
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
