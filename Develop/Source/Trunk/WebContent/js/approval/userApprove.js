var approve = {
	saveBtn: null,
	cancelBtn: null,
	modal: null,
	items:{},
	
	editFlg: false,
	postParam: {},
};

jQuery(function($) {
	
	approve.saveBtn = $("#saveBtn").on("click", saveData);
	approve.cancelBtn = $("#cancelBtn");
	approve.modal = $("#approveModal");
	approve.items.userSel = $("#userSel");
	
	com.post(api.ds.approvalType, {"timestamp": new Date().getTime()}, function(res){
		approve.approvalType = res.approvalType;
		
		approve.approvalTypeData = {};
		
		for(var i=0;i<approve.approvalType.length;i++){
			var _ = approve.approvalType[i];
			approve.approvalTypeData[_["key"]] = _["value"];
		}
	}, null, false);
	
	com.initChosen('userSel', api.personel.queryUserForNameByPinyinName, "pinyinName", {}, "autoFillKeyValue", "key", "value");
	
	approve.items.type = $("#type").bindData(approve.approvalType, "key", "value", false);
	
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
        	
        	var user = v.user;
        	
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + user.currentName));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
            var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

            var propertyArr = [
                ["编号:", user.userId, "grey"],
                ["职位:", user.duty, "grey"],
                ["类型:", approve.approvalTypeData[v.type], "red"]
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
            	editApprovalUser(v.approveId, user.userId, user.currentName, v.type);
            });
            
            $btnDel.click(function(){
            	deleteApprovalUser(v.approveId);
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

	searcher.init(["userName", "approvalType"], "condList", api.system.pageUserApprove, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "approvalUserPostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addApprovalUser').css('margin-top', '7px').css('margin-right', '7px');
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="addApprovalUser"]', '#pagenation').click(function(){
		editFlg = false;
		
		com.updateChosen('userSel', '', '');
		approve.items.userSel.prop("disabled", false).trigger("chosen:updated");
		
		approve.modal.modal("show");
    });
	
	function editApprovalUser(approveId, userId, userName, type){
		
		editFlg = true;
		
		approve.items.approveId = approveId;
		
		com.updateChosen('userSel', userId, userName);
		approve.items.type.val(type);
		
		approve.modal.modal("show");
	}

	function deleteApprovalUser(approveId){
		
		var options = {
			"userApproveIds[0]": approveId
		}
		
		com.post(api.system.deleteUserApprove, options, function(){
			searcher.doSearch();
		});
	}

	function saveData(){
		
		var url;
		var options = {
			'userApprove.user.userId': approve.items.userSel.val(),
			'userApprove.type': approve.items.type.val(),
		};
		
		if(editFlg){
			url = api.system.updateUserApprove;
			options['userApprove.approveId'] = approve.items.approveId;
		}else{
			url = api.system.addUserApprove;
		}
		
		com.post(url, options, function(res){
			searcher.doSearch();
		});
		
		approve.modal.modal("hide");   
	}
	
});
