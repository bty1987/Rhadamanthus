$(function () {

    var dutment = {
        name: params.name,
        modals: {
        	addDutmentModal: com.focusPage('#addDutmentModal')
        },
        items:{},
        id: null,
        type: params.type,
        api: null,
        options: {},
        flag: true
    };
    
    dutment.items.dutyName = com.focusPage('#dutyName', '#addDutmentModal');
    dutment.items.deptName = com.focusPage('#deptName', '#addDutmentModal');
    dutment.items.limit = com.focusPage('#limits', '#addDutmentModal');

    com.initTypeahead('dutyName', api.system.queryDutyByName, "pinyinName", {"duty.status":0, "duty.departmentType.dtid": params.typeId}, "dutys", "did", "name", null);
    
    if(dutment.type == 0){
    	
    	dutment.api = api.personel.queryDutmentByDeid;
    	com.focusPage('#fl-statement').statement("部门", "定岗信息");
    	dutment.options = {"dutment.dept.did": params.deptId};
    	
    }else if(dutment.type == 1){
    	
    	dutment.api = api.personel.queryDutmentByDuid;
    	com.focusPage('#fl-statement').statement("职位", "定岗信息");
    	dutment.options = {"dutment.duty.did": params.did};
    	
    	com.focusPage('#addBtn').css('display','none');
    }
    
    var initList = function (listData) {
        var $tableWrap = com.focusPage('#list');
        var $ul = $('<ul></ul>').addClass('item-list ui-sortable  fl-table-list');

        if (listData && listData.length) {
            $.each(listData, function (i, v) {
                var $liLine = $('<li></li>').addClass('item-orange clearfix');
                var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
                var $h3 = $('<h3></h3>').addClass('oid');
                var $small = $('<small></small>').addClass('blue').html(' ' + v.duty.name);
                var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');

                var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('修改');
                var $btnDelete = $('<a></a>').addClass('btn btn-minier btn-success').html('删除');

                var propertyArr = [
                    ["部门:", v.dept.name, "grey"],
                    ["人员上限:", v.limit, "blue"],
                    ["人员数量:", v.num, "blue"],
                ];

                $.each(propertyArr, function (index, value) {
                    var $liProperty = $('<li></li>');
                    $('<strong></strong>').html(value[0]).appendTo($liProperty);
                    $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                    $liProperty.appendTo($ulProperty);
                });

                $liLine.appendTo($ul);
                $liLine.append($h3).append($ulProperty);

                $small.appendTo($h3);
                
                if(params.type == 0) $btnDiv.append($btnEdit).append($btnDelete).appendTo($h3);
                else if(params.type == 1) $btnDiv.appendTo($h3);
                

                $btnEdit.click(function(){
                	dutment.flag = false;
                	com.cleanItems(dutment.items);
                	dutment.id = v.did;
	        		dutment.items.dutyName.val(v.duty.name).attr('disabled','disabled');
                	dutment.items.deptName.val(v.dept.name);
                	dutment.items.limit.val(v.limit);
	        		dutment.modals.addDutmentModal.modal('show');
                });
                
                $btnDelete.bindClick(function(){
                	com.post(api.personel.deleteDutment, {"dutment.did": v.did}, function(){
                		com.showAlert(com.info, "操作成功");
                		com.focusPage('#list').empty();
                		queryDutment();
                	}, null, false);
                });
                
            });

            $ul.appendTo($tableWrap);
        }
    };

    queryDutment();
    
    function queryDutment() {
        com.post(dutment.api, dutment.options, function (data) {
            if(data.dutments.length == 0){
                emptyData("list");
            }else{
                initList(data.dutments);
            }
        }, null, false);
    }
    
    com.focusPage('#addBtn').click(function(){
    	com.cleanItems(dutment.items);
    	dutment.items.deptName.val(dutment.name);
    	dutment.items.dutyName.removeAttr('disabled');
    	dutment.modals.addDutmentModal.modal('show');
    });
    
    dutment.modals.addDutmentModal.on("hide.bs.modal", function () {
        com.clearValidator();
		com.cleanItems(dutment.items);
    });
    
    com.focusPage('#saveAddDutmentBtn').bindClick(function(){

    	if(com.validate("addDutmentModal")){
            return false;
        }
    	
    	var a, options;
    	dutment.flag ? a = api.personel.addDutment : (a = api.personel.updateDutment);
    	
    	dutment.flag ? options = {"dutment.duty.did": com.typeahead("dutyName"), "dutment.dept.did": params.deptId, "dutment.limit": dutment.items.limit.val()} : (options = {"dutment.did": dutment.id, "dutment.limit": dutment.items.limit.val()});
    	
    	com.post(a, options, function(){
    		
    		com.showAlert(com.info, "操作成功");
    		com.focusPage('#list').empty();
    		queryDutment();
    		
    		dutment.modals.addDutmentModal.modal('hide');
    	}, null, false);
    });

    function emptyData(id) {
        var $resultList = com.focusPage('#' + id).html('');
        var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
        var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
        var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
    }

});