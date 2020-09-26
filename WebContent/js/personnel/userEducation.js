jQuery(function($) {

    var userEducation = {
        uid: params.uid,
        ueid: null,
        modals: {
        	addEducationModal: com.focusPage("#addEducationModal")
        },
        items:{},
        flag: true
    };
    
    userEducation.items.organ = com.focusPage("#organ");
    userEducation.items.certificate = com.focusPage("#certificate");
    userEducation.items.beginTime = com.focusPage("#beginTime");
    userEducation.items.endTime = com.focusPage("#endTime");
    userEducation.items.content = com.focusPage("#content");
    userEducation.items.specialty = com.focusPage('#specialty');
    
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
                var $title = $('<small></small>').addClass('blue').html(' ' + v.organ);
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                
                var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-yellow pull-right action-buttons').css('margin-right','5px').html('修改');
                var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger pull-right action-buttons').html('删除');

                var propertyArr = [
                    ["证书:", v.certificate, "grey"],
                    ["专业:", v.specialty, "grey"],
                    ["开始时间:",v.beginTime,"green" ],
                    ["结束时间:", v.endTime, "green"],
                    ["创建时间:",v.createTime,"green" ],
                    ["内容:",v.content, "grey" ],
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
                	deleteEducation(v.ueid);
                });
                
                $btnUpdate.click(function(){
                	userEducation.flag = false;
                	userEducation.ueid = v.ueid;
                	
                	userEducation.items.organ.val(v.organ);
                	userEducation.items.certificate.val(v.certificate)
                    userEducation.items.beginTime.val(v.beginTime);
                    userEducation.items.endTime.val(v.endTime);
                    userEducation.items.content.val(v.content);
                    userEducation.items.specialty.val(v.specialty);
                	userEducation.modals.addEducationModal.modal("show");
                });
                
            });
            $ul.appendTo($tableWrap);
        }
    };
    
    com.datetime(com.focusPage("#beginTime"));
    com.datetime(com.focusPage("#endTime"));

    queryUserEducation(userEducation.uid);

    userEducation.modals.addEducationModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(userEducation.items);
    });
    
    function queryUserEducation(uid) {

        com.post(api.personel.queryUserEducation, {"userEducation.uid": uid}, function (data) {

            initList(data.userEducations);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };
    
    com.focusPage('#addBtn').click(function () {
    	userEducation.flag = true;
    	userEducation.modals.addEducationModal.modal("show");
    });
    
	function deleteEducation(ueid){

	    com.post(api.personel.deleteUserEducation, {"userEducation.ueid": ueid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");
	    	
	    	queryUserEducation(userEducation.uid);
	    	
	    },null,false);
	}
    
    com.focusPage("#saveBtn").bindClick(function(){
    	
        if(com.validate("addEducationModal")){
            return false;
        }
    	
    	var options = {
    		"userEducation.uid": userEducation.uid,
    		"userEducation.organ": userEducation.items.organ.val(),
    		"userEducation.certificate": userEducation.items.certificate.val(),
    		"userEducation.beginTime": userEducation.items.beginTime.val(),
    		"userEducation.endTime": userEducation.items.endTime.val(),
    		"userEducation.content": userEducation.items.content.val(),
    		"userEducation.specialty": userEducation.items.specialty.val()
    	};
    	
    	var url = "";
    	userEducation.flag ? url = api.personel.addUserEducation : (url = api.personel.updateUserEducation, options['userEducation.ueid'] = userEducation.ueid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
    		queryUserEducation(userEducation.uid);
    		
    		userEducation.modals.addEducationModal.modal("hide");
    	}, null, false);
    });
    
});
