var bRegion = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {
		'dept.type': '业务大区',
	},
	
	validator: {
		businessRegion: {
			type: "v_businessRegion", 
			regex: /^FL_BR_\d{2}$/g, 
			errorMsg: "请以FL_BR_作为前缀 , 之后以两位数字组成(如FL_BR_01)."
		}
	},
};

jQuery(function($) {
	
	bRegion.saveBtn = $("#saveBtn").on("click", saveData);
	bRegion.cancelBtn = $("#cancelBtn");
	
	bRegion.items.businessRegionId = $("#businessRegionId");
	bRegion.items.businessRegionName = $("#businessRegionName");
	bRegion.items.businessRegionDes = $("#businessRegionDes");
	
	bRegion.modal = $("#businessRegionModal");
	bRegion.modal.on('show.bs.modal',function(e){
		com.clearValidator();
		com.clearValidator("#businessRegionId", true);
	});
	
	$.extend(com.validator, bRegion.validator);
	
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
            	editSalesmanRegion(v.deptId, v.deptName, v.des);
            });
            
            $btnDel.click(function(){
            	deleteSalesmanRegion(v.deptId);
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
	}, "pagenation", "businessRegionPostData", bRegion.postParam, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addSalesmanRegion').css('margin-top', '7px').css('margin-right', '7px');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addSalesmanRegion"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.cleanItems(bRegion.items);
		bRegion.items.businessRegionId.prop("disabled", false).css("display", "none");
		
		bRegion.modal.modal("show");   
    });
	
	function editSalesmanRegion(deptId, deptName, des){
		editFlg = true;
		
		bRegion.items.businessRegionId.val(deptId).prop("disabled", true).css("display", "block");
		bRegion.items.businessRegionName.val(deptName);
		bRegion.items.businessRegionDes.val(des);
		
		bRegion.modal.modal("show");
	}
	
	function deleteSalesmanRegion(deptId){
		var options = {
			"deptIds[0]": deptId
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
			'dept.ident': 14,
			'dept.deptName': bRegion.items.businessRegionName.val(),
			'dept.type': com.deptType.businessRegion,
			'dept.des': bRegion.items.businessRegionDes.val()
		};
		
		if(editFlg){
			url = api.department.updateDepartment;
			options['dept.deptId'] = bRegion.items.businessRegionId.val();
		}else{
			url = api.department.addDepartment;
			options['dept.deptId'] = "BR_";
			options['dept.company'] = config.company;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		bRegion.modal.modal("hide");   
	}
	
});

