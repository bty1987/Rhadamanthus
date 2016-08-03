var dRegion = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	
	items:{},
	
	editFlg: false,
	postParam: {
		'dept.type': '设计大区',
	},
	
	validator: {
		designRegion: {
			type: "v_designRegion", 
			regex: /^FL_DR_\d{2}$/g, 
			errorMsg: "请以FL_DR_作为前缀 , 之后以两位数字组成(如FL_DR_01)."
		}
	},
	
};

jQuery(function($) {

	dRegion.saveBtn = $("#saveBtn").on("click", saveData);
	dRegion.cancelBtn = $("#cancelBtn");
	
	dRegion.items.designRegionId = $("#designRegionId");
	dRegion.items.designRegionName = $("#designRegionName");
	dRegion.items.designRegionDes = $("#designRegionDes");
	
	dRegion.modal = $("#designRegionModal");
	dRegion.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#designRegionId", true);
	});
	
	$.extend(com.validator, dRegion.validator);
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.deptName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
            
            var propertyArr = [
               ["编号:", v.deptId, "grey"],
               ["创建时间:", v.createTime, "grey"],
               ["描述:", v.des, "grey"],
           ];

           $.each(propertyArr, function (index,value) {
               var $liProperty = $('<li></li>');
               $('<strong></strong>').html(value[0]).appendTo($liProperty);
               $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
               $liProperty.appendTo($ulProperty);
           });

            $divBtnWrap.append($btnEdit).append($btnDel).appendTo($h3);
            
            $liLine.append($h3).append($ulProperty);
            
            $btnEdit.click(function(){
            	editDesignRegion(v.deptId, v.deptName, v.des);
            });
            
            $btnDel.click(function(){
            	deleteDesignRegion(v.deptId);
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
	
	searcher.init(["sdeptName"], "condList", api.department.pageDepartment, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "designRegionPostData", dRegion.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addDesignRegion').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addDesignRegion"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(dRegion.items);
		dRegion.items.designRegionId.prop("disabled", false).css("display", "none");
		
		dRegion.modal.modal("show");   
    });
	
	function editDesignRegion(deptId, deptName, des){
		editFlg = true;
		
		dRegion.items.designRegionId.val(deptId).prop("disabled", true).css("display", "block");
		dRegion.items.designRegionName.val(deptName);
		dRegion.items.designRegionDes.val(des);
		
		dRegion.modal.modal("show");
	}
	
	function deleteDesignRegion(deptId){
		var options = {
			"deptIds[0]": deptId,
		};
		
		com.post(api.department.deleteDepartment, options, function(res){
			searcher.doSearch();
		});
	}
	
	function saveData(){
		if(com.validate()){
			return;
		}
		
		var url;
		var options = {
			'dept.ident': 12,
			'dept.deptName': dRegion.items.designRegionName.val(),
			'dept.type': com.deptType.designRegion,
			'dept.des': dRegion.items.designRegionDes.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = dRegion.items.designRegionId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "DR_";
			options['dept.company'] = config.company;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		dRegion.modal.modal("hide");   
	}
	
});
