var materialOrderPreBalance = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderPreBalanceItems: {},
	
	caclTypeData: [{"id":"0", "name":"底价"}, {"id":"1", "name":"点位"}],
	
	editFlag: false,
};

var materialOrderPreBalancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	materialOrderPreBalance.saveBtn = $("#saveBtn").on("click", saveData);
	materialOrderPreBalance.saveMalingBtn = $("#saveMalingBtn").on("click", saveMalingData);
	materialOrderPreBalance.cancelBtn = $("#cancelBtn");
	materialOrderPreBalance.modal = $("#materialOrderPreBalanceCalModal").on('show.bs.modal',function(e){
		com.clearValidator("#value", true);
		com.clearValidator();
	});
	materialOrderPreBalance.malingModal = $("#materialOrderMalingModal").on('show.bs.modal',function(e){
		com.clearValidator("#venderMaling", true);
		com.clearValidator();
	});
	
	materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint = $("#oldPoint");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldBase = $("#oldBase");
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType = $("#caclType");
	materialOrderPreBalance.materialOrderPreBalanceItems.value = $("#value");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal = $("#malingTotal");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling = $("#oldMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling = $("#oldVenderMaling");
	materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling = $("#venderMaling");
	
	materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid');
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnItem = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
					var $btnValue = $('<a></a>').addClass('btn btn-minier btn-success').html('结算值');
					var $btnMaling = $('<a></a>').addClass('btn btn-minier btn-danger').html('抹零');
					
					var propertyArr = [
						["楼盘地址:", v.orderAddr, "grey"],
						["客户名:", v.customerName, "grey"],
						["业务员:", v.salesmanName, "grey"],
						["点位:", v.point, "blue"],
						["底价:", v.base, "blue"],
						["抹零:", v.maling, "green"],
						["厂商抹零:", v.venderMaling, "green"],
						["创建时间:", v.createTime, "grey"],
						["补款时间:", v.fullCollectTime, "grey"],
					];
					
					var $label = $('<label></label>');
					var $input = $('<input>').attr({
						"type": "checkbox",
						"name": "msoIds",
						"class": "ace ace-checkbox-2",
						"msoId": v.msoId,
						"packageFlag": v.packageFlag,
					}).val(v.arId);
					var $span = $('<span></span>').addClass('lbl');

					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
					
					$label.append($input).append($span).appendTo($h3);
					$h3.append($('<small></small>').addClass('blue').html(v.msoNo));

					$btnItem.click(function(){
						viewMaterialOrderBalanceDetailIndex(v.msoId);
					});
					
					$btnValue.click(function(){
						dialogMaterialOrderPreBalanceBacl(v);
					});
					
					$btnMaling.click(function(){
						dialogMaterialOrderMaling(v);
					});

					$divBtnWrap.append($btnItem).append($btnValue).append($btnMaling).appendTo($h3);
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "msoNo", "orderAddr", "msalesman", "fullCollectTimeRange"], "condList", api.material.pageMaterialSubOrderForPreBalance, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOrderPreBalancePostData", null, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'prebalances').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('预结算').appendTo($adda);
    	
    	return [$adda];
	});
	
	$('a[name="prebalances"]', '#pagenation').click(function(){
		
		var $inputs = $('input[name="msoIds"]:checked');
		
		var options = {};
		var _packageFlag = 0;
		
		$.each($inputs, function(i, v){
			options["msoIds[" + i + "]"] = $(v).attr("msoId");
			
			$(v).attr("packageFlag") == 1 && (_packageFlag = 1);
		});
		
		var message = "<p>确定需要提交当前子订单的预结算处理吗?</p>";
		
		if(_packageFlag == "1"){
			message += "<p class='text-warning bigger-110 orange'><i class='icon-warning-sign'></i>当前存在套餐,是否已经设置完成计算点位?</p>";
		}
	
		bootbox.confirm(message, function(result) {
			if(result){
				com.post(api.material.preBalanceMaterialSubOrder, options, function(result){
					searcher.doSearch();
				});
			}
		});
	});
	
	
	function viewMaterialOrderBalanceDetailIndex(msoId){
		materialOrderPreBalancePostData["materialOrderPreBalance.msoId"] = msoId;
		$("#materialOrderPreBalancePageContent").load(api.index.materialOrderPreBalanceDetailIndex.url);
	}

	function dialogMaterialOrderPreBalanceBacl(v){
		
		materialOrderPreBalancePostData.msoId = v.msoId;
		
		materialOrderPreBalance.materialOrderPreBalanceItems.value.val("");
		materialOrderPreBalance.materialOrderPreBalanceItems.caclType.bindData(materialOrderPreBalance.caclTypeData, "id", "name");
		materialOrderPreBalance.materialOrderPreBalanceItems.oldPoint.val(v.point);
		materialOrderPreBalance.materialOrderPreBalanceItems.oldBase.val(v.base);
		
		materialOrderPreBalance.modal.modal("show");
	}

	function dialogMaterialOrderMaling(v){
		
		materialOrderPreBalancePostData.msoId = v.msoId;
		
		var maling = v.maling;
		var venderMaling = v.venderMaling;
		
		materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val(utils.accAdd(maling, venderMaling));
		materialOrderPreBalance.materialOrderPreBalanceItems.oldMaling.val(maling);
		materialOrderPreBalance.materialOrderPreBalanceItems.oldVenderMaling.val(venderMaling);
		materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val(0);
		
		materialOrderPreBalance.malingModal.modal("show");
	}
	
	function saveData(){
		
		var options = {};
		
		options["materialSubOrder.msoId"] = materialOrderPreBalancePostData.msoId;
		options["caclType"] = materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val();
		
		if(materialOrderPreBalance.materialOrderPreBalanceItems.caclType.val() == 0){
			
			var base = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
			var priceRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
			if(!(priceRex.test(base) && parseFloat(base) > 0)){
				materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
				com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "底价输入内容格式错误!", true);
				return false;
			}
			
			options["materialSubOrder.base"] = base;
		}else{
			
			var point = materialOrderPreBalance.materialOrderPreBalanceItems.value.val();
			var postDiscountRex = /^(1\.0{1,2}|1|0\.[0-9]{1,2})$/;
			if(!postDiscountRex.test(point)){
				materialOrderPreBalance.materialOrderPreBalanceItems.value.focus().select();
				com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.value, "点位输入内容格式错误!", true);
				return false;
			}
			
			options["materialSubOrder.point"] = point;
		}
		
		com.post(api.material.updateMaterialSubOrderForPreBalancePT, options, function(result){
			searcher.doSearch();
			
		});
		
		materialOrderPreBalance.modal.modal("hide");
	}

	function saveMalingData(){
		
		var malingTotal = materialOrderPreBalance.materialOrderPreBalanceItems.malingTotal.val();
		var venderMaling = materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.val();
		
		var venderMalingRex = /^[0-9]+\.{0,1}[0-9]{0,2}$/;
		if(!venderMalingRex.test(venderMaling)){
			materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据格式不正确!", true);
			return false;
		}
		
		if(parseFloat(venderMaling) > parseFloat(malingTotal)){
			materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling.focus().select();
			com.showTips(materialOrderPreBalance.materialOrderPreBalanceItems.venderMaling, "修改厂商抹零数据不能超过抹零总数!", true);
			return false;
		}
		
		var options = {};
		
		options["materialSubOrder.msoId"] = materialOrderPreBalancePostData.msoId;
		options["materialSubOrder.maling"] = utils.accSub(malingTotal, venderMaling);
		options["materialSubOrder.venderMaling"] = venderMaling;
		
		com.post(api.material.updateMaterialSubOrderForMaling, options, function(result){
			searcher.doSearch();
		});
		
		materialOrderPreBalance.malingModal.modal("hide");
	}
});
