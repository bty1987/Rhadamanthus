$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ,用来显示的div的id
     * result.list 列表的json数组
     * */
    var displayFunc  = (function(){

        var renderList = function(tableId,listData){
            var $tableWrap = com.focusPage('#' + tableId);
            var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

            if(listData && listData.length){
                $.each(listData,function(i, v){
                    var $liLine = creatLine(v);

                    $liLine.appendTo($ul);
                });

                $ul.appendTo($tableWrap);
            }
        };

        var creatLine = function(v){   //页面中的一条数据

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html( v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');


			//启用禁用
			var $btnStatus = $('<div></div>').addClass('pull-right');
			var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $span = $('<span></span>').addClass('lbl');

			$btnStatus.append($statusSwitch).append($span);

			$divBtnWrap.append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

           //编辑按钮的点击事件
            $btnEdit.click(function(){
                edit(v);
            });


			!v.status && $statusSwitch.prop("checked", true);
			$statusSwitch.switchBtn("status-lbl").on("click",function() {
				$statusSwitch.prop("checked") ? (updateStatus(v.did, 0, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.did, 1,function(){$statusSwitch.prop("checked")}));
			});
			return $liLine;
        };
      
        return {
            init : function(tableId,listData){
                com.focusPage('#' + tableId).html(null);
                renderList(tableId,listData);
            },
            drawLine : function(v){
                return creatLine(v);
            }
        };
    })();


   var dutySeacher = new Searcher();

	dutySeacher.init( ["dutyName"], "condList", api.system.pageDuty, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "dutyPostData", null, false, null, function(){

    	var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'addDuty').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span ></span>').text('添加').appendTo($adda);

    	return [$adda];
    });
    
    //定义全局变量  json
    var duty = {
    		
		saveBtn: com.focusPage("#saveAddItemBtn").on("click", saveData),//绑定事件
		cancelBtn: null,
		modal: null,
		dutyItems: {},
		validator: {
			duty: {
				type: "v_duty",
				regex: /^([1-9]\d|\d)$/,
				errorMsg: "请输入0~99数字 (如:1)."
			},
		},
		editFlg: false,
		repeatFlg:false
	};
    	
   //给全局变量赋值(主要操作是制定页面标签)
//	duty.saveBtn = com.focusPage("#saveAddItemBtn").on("click", saveData);
	duty.cancelBtn = com.focusPage("#cancelBtn");
	duty.modal = com.focusPage("#addItemModal");
	duty.dutyItems.did = com.focusPage("#did");
	duty.dutyItems.name = com.focusPage("#dutyName");
	duty.dutyItems.lead = com.focusPage("#lead");
	duty.dutyItems.depttype = com.focusPage("#depttype");
	$.extend(com.validator, duty.validator); //将多个对象合并成一个对象


	com.post(api.communion.queryDepartmentType,{}, function(res){
		duty.dutyItems.depttype.bindData(res.departmentTypes ,"dtid","name", false);
	});

    //编辑
    function edit(row){
    	//给页面标签赋值
		duty.editFlg=true;
		duty.repeatFlg=false;
		duty.dutyItems.depttype.val(row.departmentType.dtid);
		duty.dutyItems.lead.val(row.lead);
		duty.dutyItems.did.val(row.did);
		duty.dutyItems.name.val(row.name);
		duty.modal.modal("show"); //弹出弹层
    }
    //保存
    function saveData(){
    	if(com.validate()|| duty.repeatFlg)
    		return;
    	var url;
    	var options = {
    		"duty.name": duty.dutyItems.name.val(),
			"duty.lead":duty.dutyItems.lead.val(),
			"duty.departmentType.dtid":duty.dutyItems.depttype.val(),
			"duty.type":0,
    	};
    	if(duty.editFlg) {
    		url = api.system.updateDuty;
    		options["duty.did"] = duty.dutyItems.did.val();
    	}else{
    		url = api.system.addDuty;
    	}
    	com.post(url, options, successCallback);

		duty.modal.modal("hide");
    }
    
    //添加
    com.focusPage('[name="addDuty"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数
		duty.editFlg = false;

		com.cleanItems(duty.dutyItems);
		duty.modal.modal("show");
    });

	//启用禁用功能
	function updateStatus(id, status, failcallBack) {

		com.post(api.system.updateDutyForStatus, {
			"duty.did": id,
			"duty.status": status
		}, function () {

		}, function () {
			failcallBack && failcallBack();
		});
	}
	//刷新
    function successCallback(){
    	//$('button.btn-search','#condList').click();//调用成功后,执行查询操作  
		dutySeacher.doSearch();//调用成功后,执行com.Seacher中的doSeach方法
    }
    
});
