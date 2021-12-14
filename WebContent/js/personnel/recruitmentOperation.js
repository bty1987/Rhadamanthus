jQuery(function($) {

    var recruitmentOperation = {
            rid: params.rid,
            roid: null,
            modals: {
            	addOperationModal: com.focusPage("#addOperationModal")
            },
            items:{},
            flag: true
    };

    recruitmentOperation.items.company = com.focusPage("#company");
    recruitmentOperation.items.trade = com.focusPage("#trade");
    recruitmentOperation.items.duty = com.focusPage("#duty");
    recruitmentOperation.items.beginTime = com.focusPage("#beginTime");
    recruitmentOperation.items.endTime = com.focusPage("#endTime");
    recruitmentOperation.items.salary = com.focusPage("#salary");
    recruitmentOperation.items.comment = com.focusPage("#comment");
    
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
                	deleteOperation(v.roid);
                });
                
                $btnUpdate.click(function(){
                    recruitmentOperation.flag = false;
                    recruitmentOperation.roid = v.roid;

                    recruitmentOperation.items.company.val(v.company);
                    recruitmentOperation.items.trade.val(v.trade);
                    recruitmentOperation.items.duty.val(v.duty);
                    recruitmentOperation.items.beginTime.val(v.beginTime);
                    recruitmentOperation.items.endTime.val(v.endTime);
                    recruitmentOperation.items.salary.val(v.salary);
                    recruitmentOperation.items.comment.val(v.comment);
                    recruitmentOperation.modals.addOperationModal.modal("show");
                });
                
            });
            $ul.appendTo($tableWrap);
        }
    };
    
    com.datetime(com.focusPage("#beginTime"));
    com.datetime(com.focusPage("#endTime"));

    queryRecruitmentOperation(recruitmentOperation.rid);

    function queryRecruitmentOperation(rid) {

        com.post(api.personel.queryRecruitmentOperation, {"recruitmentOperation.rid": rid}, function (data) {

            initList(data.recruitmentOperations);
        }, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    };

    recruitmentOperation.modals.addOperationModal.on("hide.bs.modal", function () {
        com.clearValidator();
        com.cleanItems(recruitmentOperation.items);
    });
    
    com.focusPage('#addBtn').click(function () {
        recruitmentOperation.flag = true;
        recruitmentOperation.modals.addOperationModal.modal("show");
    });
    
	function deleteOperation(roid){

	    com.post(api.personel.deleteRecruitmentOperation, {"recruitmentOperation.roid": roid}, function(){
	    	
	    	com.showAlert(com.info, "操作成功");

            queryRecruitmentOperation(recruitmentOperation.rid);
	    	
	    },null,false);
	}
    
    com.focusPage("#saveBtn","#addOperationModal").bindClick(function(){
    	
        if(com.validate("addOperationModal")){
            return false;
        }
    	
    	var options = {
    		"recruitmentOperation.rid": recruitmentOperation.rid,
    		"recruitmentOperation.company": recruitmentOperation.items.company.val(),
    		"recruitmentOperation.trade": recruitmentOperation.items.trade.val(),
    		"recruitmentOperation.duty": recruitmentOperation.items.duty.val(),
    		"recruitmentOperation.beginTime": recruitmentOperation.items.beginTime.val(),
    		"recruitmentOperation.endTime": recruitmentOperation.items.endTime.val(),
    		"recruitmentOperation.salary": recruitmentOperation.items.salary.val(),
    		"recruitmentOperation.comment": recruitmentOperation.items.comment.val()
    	};
    	
    	var url = "";
        recruitmentOperation.flag ? url = api.personel.addRecruitmentOperation : (url = api.personel.updateRecruitmentOperation, options['recruitmentOperation.roid'] = recruitmentOperation.roid);
    	
    	com.post(url, options, function(res){
    		
    		com.showAlert(com.info, "操作成功");
            queryRecruitmentOperation(recruitmentOperation.rid);

            recruitmentOperation.modals.addOperationModal.modal("hide");
    	}, function (e) {
            com.showAlert(com.error, e.errorMsg);
        }, false);
    });

});
