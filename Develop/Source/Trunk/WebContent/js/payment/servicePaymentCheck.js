var servicePaymentCheck = {

	saveBtn: null,
	cancellBtn: null,

	baseModal: null,
	refundModal:null,
	decorationPaymentCheckItems: {},

	editFlg:false,

	editFlag:0

};

$("#servicePaymentHistoryList").removeClass("active");

jQuery(function($) {

	//服务款未确认信息查询
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
			console.log(v.type)
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var propertyArr = [
				["订单号:", v.decorationOrder.orderId, "grey"],
				["楼盘地址:", v.decorationOrder.village.villageName + ''+v.decorationOrder.houseNumber, "grey"],
				["客户:", v.decorationOrder.customer.customerName, "grey"],
				["设计师:", v.decorationOrder.designer, "grey"],
				["设计部:", v.decorationOrder.designDepartment, "grey"],
				["应收金额:", v.advanceMoney, "blue"],
				["服务费:", v.serviceMoney, "blue"],
				["收款人:", v.collecter.currentName, "grey"],
				["收款时间:", v.collcetTime, "grey"],
				["状态:", v.status == "1" ? "已收款" : "", "red"],
				["备注:", v.des, "grey"],
			];

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "spids",
				"class": "ace ace-checkbox-2",
				"spId": v.spid,
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150');

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$label.append($input).append($span).prependTo($h3);

			$liLine.append($h3).append($ulProperty);

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

	//查询服务款未确认信息
	var searcher = new Searcher();

	searcher.init(["orderId", "designer", "village"], "condList", api.payment.pageServicePaymentForNotInit, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "servicePaymentForNotInitPostData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('批量确认').appendTo($adda);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$adda, $impa];
	},"resultList");

	//服务款已确认信息查询
	var hdisplayFunc  = (function(){

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == "0" ? "收款" : (v.type == "1" ? "退款" : "")));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier');

			var propertyArr = [
				["订单号:", v.decorationOrder.orderId, "grey"],
				["楼盘地址:", v.decorationOrder.village.villageName + ''+v.decorationOrder.houseNumber, "grey"],
				["客户:", v.decorationOrder.customer.customerName, "grey"],
				["设计师:", v.decorationOrder.designer, "grey"],
				["设计部:", v.decorationOrder.designDepartment, "grey"],
				["应收金额:", v.advanceMoney, "blue"],
				["服务费:", v.serviceMoney, "blue"],
				["收款人:", v.collecter.currentName, "grey"],
				["收款时间:", v.collcetTime, "grey"],
				["确认人:", v.confirmerName, "grey"],
				["确认时间:", v.confirmTime, "grey"],
				["状态:", v.status == "2" ? "已确认" : "", "red"],
				["备注:", v.des, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});



			$btnPrint.text('打印').addClass("btn btn-minier btn-primary");

			$liLine.append($h3).append($ulProperty);

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

	//查询服务款已确认信息
	var hsearcher = new Searcher();

	hsearcher.init(["orderId", "designer", "village"], "hcondList", api.payment.pageServicePaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "servicePaymentForConfirmPostData", null, false, null, function(){}, "hresultList");

	$('a[name="confirms"]', '#pagenation').click(function(){

		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {

				var options = {};
				var $inputs = $('input[name="spids"]:checked');

				$.each($inputs, function(i, v){
					options["spIds["+i+"]"] = $(v).attr('spid');
				});

				com.post(api.payment.confirmServicePayment, options, function(res){
					searcher.doSearch();
				});
			}
		});
	});

	$('a[name="import"]', '#pagenation').click(function () {

		if ($('span[name="totalRecords"]').text() == 0) {
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if ($('span[name="totalRecords"]').text() > 1000) {
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
	});

});