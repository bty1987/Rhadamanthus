
jQuery(function($) {
	var servicePaymentPostData = {};
	var servicePayment = {
		paymentModelNameData: ["cash", "bank", "checkv"],
		moreMsg: {},
		items: {
			cashCheckbox: com.focusPage("#cashCheckbox"),
			bankCheckbox: com.focusPage("#bankCheckbox"),
			checkvCheckbox: com.focusPage("#checkvCheckbox")
		},
		orderId: null,
		checkvNums: [],
		spid: null,
		pid: null,
		htmlName: "service",
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
		servicePayment.checkBankUtilForGrade = [];
		com.focusPage("#serviceposDivGroup").html("");
		com.focusPage("#servicebankDivGroup").html("");
		com.focusPage("#bankCheckbox").removeAttr("disabled");
		com.closeTip();
	});

    com.focusPage("#baseItemModal :checkbox").on("change", function(){
        $(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide()
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#servicebankDivGroup").html("");
			paymentUtils.addBankPosUtil("#servicebankDivGroup", servicePayment.bankUtilForGrade, servicePayment);
		}
	});

	paymentUtils.getReceiptType(servicePayment);

	com.selectTypeahead("servicecashInfo", servicePayment.cashUtil, "key", "value", null);

	com.post(api.ds.payment, {}, function(res){
		$.each(res.posway, function (i, v) {
			servicePayment._posway.push(v);
		});
	}, null, false);

	com.focusPage("#servicecheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#servicecheckvDivGroup", servicePayment.checkvNums, servicePayment.checkBankUtilForGrade, servicePayment);

		return false;
	});

	com.focusPage("#collectBtn").bindClick(function(){
		paymentUtils.servicePaymentCollect(servicePayment, searcher, hsearcher);
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
            var $btnRefunds = $('<a></a>').addClass('btn btn-minier');

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

			$divBtnWrap.append($btnCollect).append($btnService).append($btnRefunds).appendTo($h3);

			$btnCollect.text('收款').addClass("btn btn-minier btn-primary");
			$btnService.text('服务费').addClass("btn btn-minier btn-success");
            $btnRefunds.text('服务费退款').addClass("btn btn-minier btn-warning");

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

            $btnRefunds.click(function(){
                if(v.servicePaidup == 0){
                    com.showAlert(com.error, "当前服务费未交,不能退款!");
                    return false;
                }
                servicePayment.modals.baseModal.attr("ChargeType","3");
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

	searcher.init(["orderId", "paymentDesigner", "village"], "condList", api.decoration.pageDecorationHolonomy, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationHolonomyPostData");


    var hdisplayFunc  = (function(){
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.type == 0 ? '收款' : '退款'));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier');

            var propertyArr = [
                ["订单号:", v.decoration.orderId, "blue"],
                ["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"],
                ["客户:", v.decoration.customer.name, "grey"],
                ["设计师:", v.decoration.designer.currentName, "grey"],
                ["设计部:", v.decoration.designer.dept.name, "grey"],
				["等级:", v.decoration.grade, "red"],
                ["预付款金额:", v.advanceMoney, "blue"],
                ["服务费:", v.serviceMoney, "blue"],
                ["收款人:", v.serviceReceipt.collecter.currentName, "grey"],
                ["收款时间:", v.serviceReceipt.collectTime, "green"],
                ["状态:", v.status == "1" ? "已付款" : "已确认", "red"],
                ["备注:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
                var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			//详情显示
			var styleArr = [];

			v.serviceReceipt.cash != null && v.serviceReceipt.cash != "0" ? styleArr.push(["现金:", v.serviceReceipt.cash, "blue"]) : true;
			v.serviceReceipt.bank != null && v.serviceReceipt.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(v.serviceReceipt.bank, v.serviceReceipt.bankInfo, servicePayment.bankInfo), "blue"]) : true;
			v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.serviceReceipt.checkv, v.serviceReceipt.checkvBank, servicePayment.checkBankInfo), "blue"]) : true;
			v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? styleArr.push(["分期:", v.serviceReceipt.installment, "blue"]) : true;
			v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? styleArr.push(["对公帐户:", v.serviceReceipt.accounts, "blue"]) : true;

			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});

            $divBtnWrap.append($btnPrint).appendTo($h3);

            $btnPrint.text('打印').addClass("btn btn-minier btn-primary");

			$btnPrint.click(function(){
				if(v.serviceReceipt.collecter.userId!=params.userInfo.user.userId){
					com.showAlert(com.warning, "收款人不匹配, 不能打印");
					return false;
				}else{
					params.decorationOrderSOrderId = v.decoration.orderId;
					params.servicePaymentSOrderId = v.decoration.orderId;
					params.serviceReceiptSrId = v.serviceReceipt.srId;
					com.popup("专用收款收据__装修单号:" + v.decoration.orderId, api.index.servicePaymentReceiptIndex.url ,function () {
						parent.layer.getFrameIndex(window.name);
					},null,true)
				}
			});

			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

			if(v.status == 1){
				$divBtnWrap.append($btnUpdate);
			}

			$btnUpdate.click(function(){
				servicePayment.modals.baseModal.attr("ChargeType","4");
				servicePayment.spid = v.spid;
				servicePayment.pid = v.pid;

				com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.decoration.orderId, "pointofsales.rid": v.serviceReceipt.srId}, function(res){
					$.each(res.pointofsaleses, function(i, value){
						if(value.status == 4) {
							paymentUtils.addPos(value, servicePayment.htmlName);
							com.focusPage("#bankCheckbox").prop("checked", true);
							com.focusPage("#posDiv").prop("style", "display: block");
							com.focusPage("#bankDiv").prop("style", "display: block");
						}
					});
				});

				paymentUtils.serviceDialogPayment(v, servicePayment);
			});

            $liLine.append($h3).append($ulProperty).append($ulStyle);

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

    var hsearcher = new Searcher();

    hsearcher.init(["orderId", "paymentDesigner", "paymentVillage", "collectTimeDateRange"], "hcondList", api.payment.pageServicePaymentForHistory, function(data){

		hdisplayFunc.init('hresultList', data);
    }, "hpagenation", "servicePaymentPostData", null, false, null, function(){
		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		return [$impa];
	}, "hresultList");

	com.focusPage('a[name="import"]', '#hpagenation').click(function () {

	 if(com.focusPage('span[name="totalRecords"]').text() == 0){
		 com.showAlert(com.warning, "请通过条件进行查询");
		 return false;
	 }

	 if(com.focusPage('span[name="totalRecords"]').text() > 1000){
		 com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
		 return false;
	 }

	 com.post(api.payment.pageServicePaymentForHistory, $.extend({}, params.servicePaymentPostData, {"paging.noPage": 1}), function(res){
		 $.exceler({
			 column : [
				 ["订单号","decoration.orderId"],
				 ['楼盘地址',['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']],
				 ['客户','decoration.customer.name'],
				 ['设计师','decoration.designer.currentName'],
				 ['设计部','decoration.designer.dept.name'],
				 ['预付款金额', 'advanceMoney'],
				 ['服务费', 'serviceMoney'],
				 ['收款人', 'serviceReceipt.collecter.currentName'],
				 ['收款时间', 'serviceReceipt.collectTime'],
				 ['类型', 'type == "0" ? "收款" : "退款"'],
				 ['状态', 'status == "1" ? "已付款" : "已确认"'],
				 ['备注', 'comment'],
				 ['现金', 'serviceReceipt.cash'],
				 ['刷卡', ['serviceReceipt.bank', 'serviceReceipt.bankInfo']],
				 ['银行', ['serviceReceipt.checkv', 'serviceReceipt.checkvBank']],
				 ['分期', ['serviceReceipt.installment', 'serviceReceipt.installBank']],
				 ['对公', ['serviceReceipt.accounts', 'serviceReceipt.accountsBank']]
				 ],
				 	list: res.paging.data
				 }, function(v){
			 			if(v.serviceReceipt.bank != null && v.serviceReceipt.bank != 0){
							 var $info = ' ';
							 var _s = v.serviceReceipt.bankInfo.split('#');
							 for(var i=1;i<_s.length-1;i++){
								 var _i = _s[i].split('|');
								 $info += servicePayment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
							 }

				 			v.serviceReceipt.bankInfo = $info;
				 		}

						 if(v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != 0){
							 var checkBankInfoStr = v.serviceReceipt.checkvBank;
							 if(checkBankInfoStr.indexOf("#") != -1){
								 var $checkvInfo = ' ';
								 var _c = v.serviceReceipt.checkvBank.split('#');
								 for(var i=1;i<_c.length-1;i++){
									 var _i = _c[i].split('|');
									 $checkvInfo += servicePayment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
								 }

								 v.serviceReceipt.checkvBank = $checkvInfo;
							 }else{
								 v.serviceReceipt.checkvBank = v.serviceReceipt.checkv != null && v.serviceReceipt.checkv != "0" ? servicePayment.checkBankInfo[v.serviceReceipt.checkvBank] : '';
							 }

						 }

				 v.serviceReceipt.installBank = v.serviceReceipt.installment != null && v.serviceReceipt.installment != "0" ? servicePayment.bankInfo[v.serviceReceipt.installBank] : '';
				 v.serviceReceipt.accountsBank = v.serviceReceipt.accounts != null && v.serviceReceipt.accounts != "0" ? servicePayment.accountsInfo[v.serviceReceipt.accountsBank] : '';
			 });
		 });
	 });

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
			res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#servicebankDivGroup", servicePayment.bankUtilForGrade, servicePayment) : "";
		});
	}
});

