jQuery(function($) {

    var userOperation = {
            uid: params.uid,
            uoid: null,
            modals: {
            	addOperationModal: com.focusPage("#addOperationModal")
            },
            items:{},
            flag: true
    };
    
    userOperation.items.company = com.focusPage("#company");
    userOperation.items.trade = com.focusPage("#trade");
    userOperation.items.duty = com.focusPage("#duty");
    userOperation.items.beginTime = com.focusPage("#beginTime");
    userOperation.items.endTime = com.focusPage("#endTime");
    userOperation.items.salary = com.focusPage("#salary");
    userOperation.items.comment = com.focusPage("#comment");
    
    var initList = function (listData) {

        var $tableWrap = com.focusPage('#list').empty();
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if(!listData.length){
        	
            var $resultList = com.focusPage("#list").addClass('dz-default dz-message').html('');
            var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
            var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
            var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
            return $resultList;
            
        }else if (listData && listData.length) {

            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $title = $('<small></small>').addClass('blue').html(' ' + v.company);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                
                var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow pull-right action-buttons').css('margin-right','5px').html('修改');
                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger pull-right action-buttons').html('删除');

                var propertyArr = [
                    ["行业:", v.trade, "grey"],
                    ["职位:",v.duty,"green" ],
                    ["薪资:",v.salary,"blue" ],
                    ["开始时间:", v.beginTime, "green"],
                    ["结束时间:", v.endTime, "green"],
                    ["创建时间:",v.createTime,"green" ],
                    ["描述:",v.comment, "grey" ],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);
                $h3.append($title).append($btnDel).append($btnUpdate);

                $btnDel.bindClick(function(){
                	deleteOperation(v.uoid);
                });
                
                $btnUpdate.click(function(){
                	userOperation.flag = false;
                	userOperation.uoid = v.uoid;
                	
                	userOperation.items.company.val(v.company);
                	userOperation.items.trade.val(v.trade);
                    userOperation.items.duty.val(v.duty);
                    userOperation.items.beginTime.val(v.beginTime);
                    userOperation.items.endTime.val(v.endTime);
                    userOperation.items.salary.val(v.salary);
                    userOperation.items.comment.val(v.comment);
                	userOperation.modals.addOperationModal.modal("show");
                });
                
            });
            $ul.appendTo($tableWrap);
        }
    };
    
    com.datetime(com.focusPage("#beginTime"));
    com.datetime(com.focusPage("#endTime"));

    queryuserOperation(userOperation.uid);

    function queryuserOperation(uid) {

        com.post(api.personel.queryUserOperation, {"userOperation.uid": uid}, function (data) {

            initList(data.userOperations);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };
    
    userOperation.modals.addOperationModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(userOperation.items);
    });
    
    com.focusPage('#addBtn').click(function () {
    	userOperation.flag = true;
    	userOperation.modals.addOperationModal.modal("show");
    });
    
	function deleteOperation(uoid){

	    com.post(api.personel.deleteUserOperation, {"userOperation.uoid": uoid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryuserOperation(userOperation.uid);
	    	
	    },null,false);
	}
    
    com.focusPage("#saveBtn").bindClick(function(){
    	
        if(com.validate("addOperationModal")){
            return false;
        }
    	
    	var options = {
    		"userOperation.uid": userOperation.uid,
    		"userOperation.company": userOperation.items.company.val(),
    		"userOperation.trade": userOperation.items.trade.val(),
    		"userOperation.duty": userOperation.items.duty.val(),
    		"userOperation.beginTime": userOperation.items.beginTime.val(),
    		"userOperation.endTime": userOperation.items.endTime.val(),
    		"userOperation.salary": userOperation.items.salary.val(),
    		"userOperation.comment": userOperation.items.comment.val()
    	};
    	
    	var url = "";
    	userOperation.flag ? url = api.personel.addUserOperation : (url = api.personel.updateUserOperation, options['userOperation.uoid'] = userOperation.uoid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		queryuserOperation(userOperation.uid);
    		
    		userOperation.modals.addOperationModal.modal("hide");
    	}, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    });

});
