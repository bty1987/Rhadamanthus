jQuery(function($) {

    var userContract = {
            uid: params.uid,
            ucid: null,
            modals: {
            	addContractModal: com.focusPage("#addContractModal")
            },
            items:{},
            flag: true
    };
    
    userContract.items.name = com.focusPage("#name");
    userContract.items.signTime = com.focusPage("#signTime");
    userContract.items.startTime = com.focusPage("#startTime");
    userContract.items.endTime = com.focusPage("#endTime");
    userContract.items.status = com.focusPage("#status");
    userContract.items.comment = com.focusPage("#comment");
    
    com.post(api.ds.personel, {}, function(res){
		userContract.items.status.bindData(res.contractStatus , "key", "value");
	}, null, false);
    
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
                var $title = $('<small></small>').addClass('blue').html(' ' + v.no);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                
                var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow pull-right action-buttons').css('margin-right','5px').html('修改');
                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger pull-right action-buttons').html('删除');

                var propertyArr = [
                    ["名称:", v.name, "grey"],
                    ["签订时间:",v.signTime,"green" ],
                    ["开始时间:", v.startTime, "green"],
                    ["结束时间:",v.endTime,"green" ],
                    ["创建时间:",v.createTime, "green" ],
                    ["状态:",v.status == 0 ? "有效" : "无效", "blue" ],
                    ["说明:",v.comment, "grey" ],
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
                	deleteContract(v.ucId);
                });
                
                $btnUpdate.click(function(){
                	userContract.flag = false;
                	userContract.ucid = v.ucId;
                	
                	userContract.items.name.val(v.name);
                	userContract.items.signTime.val(v.signTime)
                    userContract.items.startTime.val(v.startTime);
                    userContract.items.endTime.val(v.endTime);
                    userContract.items.status.val(v.status);
                    userContract.items.comment.val(v.comment);
                	userContract.modals.addContractModal.modal("show");
                });
                
            });
            $ul.appendTo($tableWrap);
        }
    };
    
    com.datetime(com.focusPage("#signTime"));
    com.datetime(com.focusPage("#startTime"));
    com.datetime(com.focusPage("#endTime"));

    queryUserContract(userContract.uid);

    function queryUserContract(uid) {

        com.post(api.personel.queryUserContract, {"userContract.uid": uid}, function (data) {

            initList(data.userContracts);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };
    
    com.focusPage('#addBtn').click(function () {
    	userContract.flag = true;
    	userContract.modals.addContractModal.modal("show");
    });
    
    userContract.modals.addContractModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(userContract.items);
    });
    
	function deleteContract(ucid){

	    com.post(api.personel.deleteUserContract, {"userContract.ucId": ucid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryUserContract(userContract.uid);
	    	
	    },null,false);
	}
    
    com.focusPage("#saveBtn").bindClick(function(){
    	
        if(com.validate("addContractModal")){
            return false;
        }
    	
    	var options = {
    		"userContract.uid": userContract.uid,
    		"userContract.name": userContract.items.name.val(),
    		"userContract.signTime": userContract.items.signTime.val(),
    		"userContract.startTime": userContract.items.startTime.val(),
    		"userContract.endTime": userContract.items.endTime.val(),
    		"userContract.status": userContract.items.status.val(),
    		"userContract.comment": userContract.items.comment.val()
    	};
    	
    	var url = "";
    	userContract.flag ? url = api.personel.addUserContract : (url = api.personel.updateUserContract, options['userContract.ucId'] = userContract.ucid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		queryUserContract(userContract.uid);
            
    		userContract.modals.addContractModal.modal("hide");
    	}, null, false);
    });

});
