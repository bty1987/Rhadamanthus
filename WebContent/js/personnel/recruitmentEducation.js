jQuery(function($) {

    var recruitmentEducation = {
        rid: params.rid,
        reid: null,
        modals: {
        	addEducationModal: com.focusPage("#addEducationModal")
        },
        items:{},
        flag: true
    };

    recruitmentEducation.items.organ = com.focusPage("#organ");
    recruitmentEducation.items.certificate = com.focusPage("#certificate");
    recruitmentEducation.items.beginTime = com.focusPage("#beginTime");
    recruitmentEducation.items.endTime = com.focusPage("#endTime");
    recruitmentEducation.items.content = com.focusPage("#content");
    recruitmentEducation.items.specialty = com.focusPage('#specialty');
    
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
                	deleteEducation(v.reid);
                });
                
                $btnUpdate.click(function(){
                    recruitmentEducation.flag = false;
                    recruitmentEducation.reid = v.reid;

                    recruitmentEducation.items.organ.val(v.organ);
                    recruitmentEducation.items.certificate.val(v.certificate);
                    recruitmentEducation.items.beginTime.val(v.beginTime);
                    recruitmentEducation.items.endTime.val(v.endTime);
                    recruitmentEducation.items.content.val(v.content);
                    recruitmentEducation.items.specialty.val(v.specialty);
                    recruitmentEducation.modals.addEducationModal.modal("show");
                });
                
            });
            $ul.appendTo($tableWrap);
        }
    };
    
    com.datetime(com.focusPage("#beginTime"));
    com.datetime(com.focusPage("#endTime"));

    queryRecruitmentEducation(recruitmentEducation.rid);

    recruitmentEducation.modals.addEducationModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(recruitmentEducation.items);
    });
    
    function queryRecruitmentEducation(rid) {

        com.post(api.personel.queryRecruitmentEducation, {"recruitmentEducation.rid": rid}, function (data) {

            initList(data.recruitmentEducations);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };
    
    com.focusPage('#addBtn').click(function () {
        recruitmentEducation.flag = true;
        recruitmentEducation.modals.addEducationModal.modal("show");
    });
    
	function deleteEducation(reid){

	    com.post(api.personel.deleteRecruitmentEducation, {"recruitmentEducation.reid": reid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");

            queryRecruitmentEducation(recruitmentEducation.rid);
	    	
	    },null,false);
	}
    
    com.focusPage("#saveBtn","#addEducationModal").click(function(){

        if(com.validate("addEducationModal")){
            return false;
        }
    	
    	var options = {
    		"recruitmentEducation.rid": recruitmentEducation.rid,
    		"recruitmentEducation.organ": recruitmentEducation.items.organ.val(),
    		"recruitmentEducation.certificate": recruitmentEducation.items.certificate.val(),
    		"recruitmentEducation.beginTime": recruitmentEducation.items.beginTime.val(),
    		"recruitmentEducation.endTime": recruitmentEducation.items.endTime.val(),
            "recruitmentEducation.content": recruitmentEducation.items.content.val(),
    		"recruitmentEducation.specialty": recruitmentEducation.items.specialty.val()
    	};
    	
    	var url = "";
        recruitmentEducation.flag ? url = api.personel.addRecruitmentEducation : (url = api.personel.updateRecruitmentEducation, options['recruitmentEducation.reid'] = recruitmentEducation.reid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
            queryRecruitmentEducation(recruitmentEducation.rid);

            recruitmentEducation.modals.addEducationModal.modal("hide");
    	}, null, false);
    });
    
});
