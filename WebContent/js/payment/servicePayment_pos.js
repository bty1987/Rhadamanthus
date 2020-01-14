
jQuery(function($) {
	var servicePayment = {
		paymentModelNameData: ["bank"],
		moreMsg: {},
		items: {
			bankCheckbox: com.focusPage("#bankCheckbox")
		},
		orderId: null,
		checkvNums: [],
		spid: null,
		pid: null,
		htmlName: "servicePos",
		modelId: 'baseItemModal',
		modals: {
			baseModal: com.focusPage("#baseItemModal")
		},

		cash: [],
		bank: [],
		checkBank: [],
		accounts: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkBankUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkBankInfo: {},
		accountsInfo: {},

		bankUtilForGrade: [],
		checkBankUtilForGrade: [],

		mno: null,
		_posway: [],
		pointofsalesType: 4
	};

	//隐藏触发
	servicePayment.modals.baseModal.on('hide.bs.modal', function () {
		servicePayment.bankUtilForGrade = [];
		com.focusPage("#servicePosposDivGroup").html("");
		com.focusPage("#servicePosbankDivGroup").html("");
		com.focusPage("#bankCheckbox").removeAttr("disabled");
		com.closeTip();
	});

    com.focusPage("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide()
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#servicePosbankDivGroup").html("");
			paymentUtils.addBankPosUtil("#servicePosbankDivGroup", servicePayment.bankUtilForGrade, servicePayment);
		}
	});

	paymentUtils.getReceiptType(servicePayment);

	com.post(api.ds.payment, {}, function(res){
		$.each(res.posway, function (i, v) {
			servicePayment._posway.push(v);
		});
	}, null, false);

	com.focusPage("#collectBtn").bindClick(function(){
		paymentUtils.servicePaymentCollect(servicePayment, searcher);
	});

	com.focusPage("#historyService").removeClass("active");

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

		var creatLine = function(v){
			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html('服务款'));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnCollect = $('<a></a>').addClass('btn btn-minier');
			var $btnService = $('<a></a>').addClass('btn btn-minier');

			var propertyArr = [
				["订单号:", v.decoration.orderId, "blue"],
				["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + ' '+ v.decoration.house.houseNumber, "grey"],
				["客户:", v.decoration.customer.name, "grey"],
				["设计师:", v.decoration.designer.currentName, "grey"],
				["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
				["主材金额:", v.materialPrice, "blue"],
				["服务费:", v.servicePrice, "blue"],
				["工程造价:", v.projectPrice, "blue"],
				["管理费:", v.managePrice, "blue"]
			];
            var money = v.servicePrice - v.servicePaidup;
			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnCollect).append($btnService).appendTo($h3);

			$btnCollect.text('收款').addClass("btn btn-minier btn-primary");
			$btnService.text('服务费').addClass("btn btn-minier btn-success");

			$liLine.append($h3).append($ulProperty);

			$btnCollect.click(function(){
				getServicePosInfo(v.decoration.orderId);
				servicePayment.modals.baseModal.attr("ChargeType","1");
				paymentUtils.serviceDialogPayment(v, servicePayment);
			});

			$btnService.click(function(){
			    if(money <= 0){
                    com.showAlert(com.error, "当前服务费已交满,不能重复交款!");
                    return false;
                }
				getServicePosInfo(v.decoration.orderId);
				servicePayment.modals.baseModal.attr("ChargeType","2");
				paymentUtils.serviceDialogPayment(v, servicePayment);
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

	var searcher = new Searcher();

	searcher.init(["orderId"], "condList", api.decoration.pageDecorationHolonomy, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationHolonomyPosPostData");

	//获取销售点信息
	function getServicePosInfo(orderId){
		com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": orderId}, function(res){
			$.each(res.pointofsaleses, function(i, value){
				if(value.status == 0 || value.status == 1) {
					paymentUtils.addPos(value, servicePayment.htmlName);
					com.focusPage("#bankCheckbox").prop("checked", true);
					com.focusPage("#posDiv").prop("style", "display: block");
					com.focusPage("#bankDiv").prop("style", "display: block");
				}
			});
			res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#servicePosbankDivGroup", servicePayment.bankUtilForGrade, servicePayment) : "";
		});
	}
});

