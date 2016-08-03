var region = {
	listgrid: null,
	gridPager: null,
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

jQuery(function($) {
	
	region.saveBtn = $("#saveBtn").on("click", saveData);
	region.cancelBtn = $("#cancelBtn");
	
	region.modal = $("#regionModal");
	
	region.regionItems.regionName = $("#regionName");
	region.regionItems.regionId = $("#regionId");
	
	$.extend(com.validator, region.validator);
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.regionId + " " + v.regionName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editRegion(v.regionId, v.regionName);
            });
            
            $btnDel.click(function(){
            	deleteRegion(v.regionId);
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
	
	searcher.init(["regionName"], "condList", api.system.pageRegion, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "regionPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addRegion').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
		
	$('a[name="addRegion"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(region.regionItems);
		region.regionItems.regionId.prop("disabled", false).css("display", "none");
		
		region.modal.modal("show");  
    });
	
	function editRegion(regionId, regionName){
		
		editFlg = true;
		
		com.clearValidator();
		com.clearValidator("#regionId", true);
		
		region.regionItems.regionId.val(regionId).prop("disabled", true).css("display", "block");
		region.regionItems.regionName.val(regionName);
		
		region.modal.modal("show");
	}
	
	function deleteRegion(regionId){
		
		var options = {
			"regionIds[0]": regionId,
		};
		
		com.post(api.system.deleteRegion, options, function(res){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		if(com.validate() || region.repeatFlg){
			return;
		}
		
		var url;
		var options = {
			'region.regionId': region.regionItems.regionId.val(),
			'region.regionName': region.regionItems.regionName.val(),
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
