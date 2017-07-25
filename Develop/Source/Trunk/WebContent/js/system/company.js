$(function(){

    /**
     * 回调函数必须提供 init(tableId, result.list)方法
     * tableId ，用来显示的div的id
     * result.list 列表的json数组
     * */
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

        var creatLine = function(v){   //页面中的一条数据

			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.no + " "+ v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-info').html('编辑');
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

			//启用禁用
			var $btnStatus = $('<div></div>').addClass('pull-right');
			var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $span = $('<span></span>').addClass('lbl');

			$btnStatus.append($statusSwitch).append($span);


			$divBtnWrap.append($btnEdit).append($btnEdit).append($btnStatus).appendTo($h3);

            $liLine.append($h3).append($ulProperty);

           //编辑按钮的点击事件
            $btnEdit.click(function(){
                edit(v);
            });

			v.status && $statusSwitch.prop("checked", true);
			$statusSwitch.switchBtn("status-lbl").on("click",function() {
				$statusSwitch.prop("checked") ? (updateStatus(v.cid, 1, function(){$statusSwitch.removeAttr("checked")})) : (updateStatus(v.cid, 0,function(){$statusSwitch.prop("checked")}));
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
        };
    })();


   var companySeacher = new Searcher();

	companySeacher.init( ["name"], "condList", api.system.pageCompany, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "companyPostData", null, false, null, function(){
    	
    	var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addCompany').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('添加').appendTo($adda);
    	
    	return [$adda];
    });
    
    //定义全局变量  json
    var company = {
    		
		saveBtn: $("#saveAddItemBtn").on("click", saveData),//绑定事件
		cancelBtn: null,
		modal: null,
		companyItems: {},
		validator: {
			company: {
				type: "v_company",
				regex: /^([1-9]\d|\d)$/,
				errorMsg: "请输入0~99数字 (如:1)."
			},
		},
		editFlg: false,
		repeatFlg:false
	};
    	
   //给全局变量赋值（主要操作是制定页面标签）
//	company.saveBtn = $("#saveAddItemBtn").on("click", saveData);
	company.cancelBtn = $("#cancelBtn");
	company.modal = $("#addItemModal");
	company.companyItems.cid = $("#cid");
	company.companyItems.name = $("#_name");


	company.companyItems.no = $("#no").on("blur",function(){
		$this = $(this);
		if($this.val() == "") {
			return;
		}
	});

	company.modal.on('shown.bs.modal', function(e){
		com.clearValidator();
		com.clearValidator("#no", true);
	});
	$.extend(com.validator, company.validator); //将多个对象合并成一个对象

    //编辑
    function edit(row){
    	//给页面标签赋值

		company.editFlg=true;
		company.repeatFlg=false;

		company.companyItems.cid.val(row.cid);
		company.companyItems.no.val(row.no);
		company.companyItems.name.val(row.name);

		company.companyItems.no.prop("disabled", true);

		company.modal.modal("show"); //弹出弹层
    }
    //保存
    function saveData(){
    	if(com.validate()|| company.repeatFlg)
    		return;
    	
    	var url;
    	var options = {
			
    		"company.no":company.companyItems.no.val(),
    		"company.name": $('#_name').val()
    	};

    	if(company.editFlg) {
    		url = api.system.updateCompany;
    		options["company.cid"] = company.companyItems.cid.val();
    	}else{
    		url = api.system.addCompany;
    	}
    	com.post(url, options, successCallback);

		company.modal.modal("hide");
    }
    
    //添加
    $('[name="addCompany"]' , '#pagenation').on("click",function(){  //选择器 [属性名="属性值"]  匿名函数
		company.editFlg = false;
		company.companyItems.no.prop("disabled", false);
		com.cleanItems(company.companyItems);
		company.modal.modal("show");
    });

	//启用禁用功能
	function updateStatus(id, status, failcallBack) {

		com.post(api.system.updateCompanyForStatus, {
			"company.cid": id,
			"company.status": status
		}, function () {

		}, function () {
			failcallBack && failcallBack();
		});
	}
	//刷新
    function successCallback(){
    	//$('button.btn-search','#condList').click();//调用成功后，执行查询操作  
		companySeacher.doSearch();//调用成功后，执行com.Seacher中的doSeach方法
    }
    
});
