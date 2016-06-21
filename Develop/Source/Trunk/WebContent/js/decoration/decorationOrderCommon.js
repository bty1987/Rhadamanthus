var decorationOrderPostData = {};
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
 
        var creatLine = function(v){   
            var $liLine = $('<li></li>').addClass('item-blue clearfix');
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(' ' + v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
            var $btnAgreement = $('<a></a>').addClass('btn btn-minier').html('合同');

            var propertyArr = [
                ["订单编号:", v.orderId, "grey"],
                ["楼盘地址:", v.village.villageName, "grey"],
                ["客户名:", v.customer.customerName, "grey"],
                ["余额:", v.customer.balance, "grey"],
                ["设计部:", v.designDepartment, "grey"],
                ["设计师:", v.designer, "grey"],
                ["业务部:", v.businessDepartment, "grey"],
                ["业务员:", v.salesman, "grey"],
                ["面积:", v.houseArea, "grey"],
                ["合同报价:", v.orderTotalPrice, "grey"],
                ["折扣:", v.discount, "grey"],
                ["量房时间:", v.createTime, "grey"],
                ["签单时间:", v.contractTime, "grey"],
                ["状态:", v.status, "grey"],
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			$divBtnWrap.append($btnLook);
			  
            if(v.status == "已签约" || v.status == "已完工"){//判断的条件是ListData中的status,所以取v.status
                	
            	$divBtnWrap.append($btnAgreement);
            }

	    	$divBtnWrap.appendTo($h3);
	    	
            $liLine.append($h3).append($ulProperty);
         
            //查看按钮点击事件
            $btnLook.click(function(){
            	viewDecorationOrderDetail(v.orderId);
            });
            
            //合同按钮点击事件
            $btnAgreement.click(function(){
            	modalAgreementModal(v.orderId);
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

    var _condArr = ['orderId','village','houseNumber','houseArea','customerPhone','designer','salesman','designerRegionId','designerDepartmentId','salesmanRegionId','salesmanDepartmentId', 'createTimeDateRange','signTimeDateRange','houseClass','status'];

    var decorationOrderCommonSeacher = new Searcher();
    decorationOrderCommonSeacher.init( _condArr, "condList", api.decoration.pageDecorationOrderForCommon, function(data){
        displayFunc.init('resultList', data);
    }, "pagenation", "DecorationOrderCommonPostData");

 //定义全局变量  
	var order = {
	    listGrid: null,
	    gridPager: null,
	    saveBtn: null,
	    cancellBtn: null,
	    orderItems: {},
	    orderStatus: [],
	    businessDepartments: [],
	    postParam: {},
	    editFlag: !1
	},
	
	contract = {
		decorationOrderId: null
	};
	
	//给全局变量赋值（主要操作是制定页面标签）
	
	order.agreementModal = $("#agreementModal");
	
	decorationUtils.createDecorationOrderCondition(order.listGrid, api.decoration.pageDecorationOrderForCommon.url, "orderSearchDiv", {}, "");
	
	//-----------------------------------合同----------------------------
	$("#additionalInfoBtn").on('click',function(res){
		
		com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
			if(res.decorationContract == null || res.decorationContract.autoId == null){
				$("#workingDuration").val("");
				$("#startTime").val("");
				$("#endTime").val("");
				$("#additionalInfo").html("");
				$("#additionalTermsModal").modal("show");
				$("#printContractBtn").attr("disabled",true);
			}else{
				$("#printContractBtn").attr("disabled",false);
				$("#signContractBtn").attr("disabled",false);
				$("#workingDuration").val(res.decorationContract.workingDuration);
				$("#endTime").datepicker('update',res.decorationContract.endTime);
				$("#startTime").datepicker('update',res.decorationContract.startTime);
				$("#additionalInfo").html(res.decorationContract.additionalInfo);
				$("#additionalTermsModal").modal("show");
			}
		});
	});
		
	initializeContent();
	
	$('.date-picker').datepicker({format:'yyyy-mm-dd' , autoclose:true,todayBtn:true,todayHighlight:true}).next().on(ace.click_event, function(){
		$(this).prev().focus();
	});
	
	function initializeContent(){
		$('#additionalInfo').ace_wysiwyg({
			toolbar:['font', null, 'fontSize', null, {name:'bold', className:'btn-info'}, {name:'italic', className:'btn-info'}, {name:'strikethrough', className:'btn-info'},
				{name:'underline', className:'btn-info'}, null,{name:'insertunorderedlist', className:'btn-success'},{name:'insertorderedlist', className:'btn-success'},
				{name:'outdent', className:'btn-purple'},{name:'indent', className:'btn-purple'},null,{name:'justifyleft', className:'btn-primary'},
				{name:'justifycenter', className:'btn-primary'},{name:'justifyright', className:'btn-primary'},{name:'justifyfull', className:'btn-inverse'},null,
				null,null,null,null,null,'foreColor',null,{name:'undo', className:'btn-grey'},
				{name:'redo', className:'btn-grey'}],
			'wysiwyg': {fileUploadError: showErrorAlert}
		}).prev().addClass('wysiwyg-style2');
		
		if (typeof jQuery.ui !== 'undefined' && /applewebkit/.test(navigator.userAgent.toLowerCase())) {
			var lastResizableImg = null;
			
			function destroyResizable() {
				if(lastResizableImg == null){
					return;
				}
				
				lastResizableImg.resizable( "destroy" );
				lastResizableImg.removeData('resizable');
				lastResizableImg = null;
			}
			var enableImageResize = function() {
				$('.wysiwyg-editor').on('mousedown', function(e) {
					var target = $(e.target);
					if(e.target instanceof HTMLImageElement) {
						if(!target.data('resizable')) {
							target.resizable({
								aspectRatio: e.target.width / e.target.height
							});
							target.data('resizable', true);
							
							if( lastResizableImg != null ) {
								lastResizableImg.resizable( "destroy" );
								lastResizableImg.removeData('resizable');
							}
							lastResizableImg = target;
						}
					}
				}).on('click', function(e) {
					if( lastResizableImg != null && !(e.target instanceof HTMLImageElement) ) {
						destroyResizable();
					}
				}).on('keydown', function() {
					destroyResizable();
				});
		    };
			enableImageResize();
		}
	}

	//查看
    function viewDecorationOrderDetail(decorationOrderId) { 
    	decorationOrderPostData.decorationOrderId = decorationOrderId;
        com.switchPage(api.index.decorationOrderCommonDetailIndex.url);
    } 
	    
    //合同
    function modalAgreementModal(decorationOrderId){
    	contract.decorationOrderId = decorationOrderId;
    	
    	com.post(api.decoration.queryDecorationContractByOrderId, {"decorationContract.orderId":contract.decorationOrderId}, function(res){
    		if(res.decorationContract == null || res.decorationContract.autoId == null){
    			$("#printContractBtn").attr("disabled",true);
    		}else{
    			$("#printContractBtn").attr("disabled",false);
    		}
    		order.agreementModal.modal("show");
    	});
    	
    	$("#printContractBtn").attr('href', api.decoration.decorationContractIndex.url + "?decorationContract.orderId=" + contract.decorationOrderId);
    }
    
    function showErrorAlert (reason, detail) {
    	var msg='';
    	if(reason === 'unsupported-file-type') {
    		msg = "Unsupported format " + detail; 
    	}else{
    		console.log("error uploading file", reason, detail);
    	}
    	$('<div class="alert"> <button type="button" class="close" data-dismiss="alert">&times;</button>' + '<strong>File upload error</strong> '+msg+' </div>').prependTo('#alerts');
    }
	     
    function successCallback() {
	    decorationOrderSalesmanSeacher.doSearch();
    }
});
    

