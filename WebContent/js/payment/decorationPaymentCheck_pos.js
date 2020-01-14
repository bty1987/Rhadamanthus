
jQuery(function($) {
	var decorationPaymentCheck = {
		paymentStatusArray: ["未付款", "已付款", "已确认", "审批中", "历史"],
		paymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
		checkvNums: [],
		items: {
			cashCheckbox: com.focusPage("#cashCheckbox"),
			bankCheckbox: com.focusPage("#bankCheckbox"),
			checkvCheckbox: com.focusPage("#checkvCheckbox"),
			advanceCheckbox: com.focusPage("#advanceCheckbox"),
			couponCheckbox: com.focusPage("#couponCheckbox"),
			couponType: com.focusPage("#couponType"),
			advanceType: com.focusPage("#advanceType"),
			cash: com.focusPage("#cash"),
			advance: com.focusPage("#advance")
		},
		htmlName: "decorationCheck",
		modelId: "baseItemModalDecorationCheck",
		modals: {
			baseModal: com.focusPage("#baseItemModalDecorationCheck")
		},

		cash: [],
		bank: [],
		checkBank: [],
		accounts: [],
		couponType: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkBankUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkBankInfo: {},
		accountsInfo: {},
		couponTypeData: {},

		bankUtilForGrade: [],
		checkBankUtilForGrade: []
	};

	var decorationPaymentCheckPostData = {};

	com.focusPage("#collectBtn").bindClick(function(){
		paymentUtils_pos.payment(decorationPaymentCheck, decorationPaymentCheckPostData, searcher, hsearcher);
	});

	//隐藏触发
	decorationPaymentCheck.modals.baseModal.on('hide.bs.modal', function () {
		decorationPaymentCheck.bankUtilForGrade = [];
		decorationPaymentCheck.checkBankUtilForGrade = [];
		com.cleanTypeahead('decorationCheckcashInfo');
		com.closeTip();
		com.focusPage("#decorationCheckposDivGroup").html("");
	});

	com.focusPage("#baseItemModalDecorationCheck :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
	});

	//绑定收款单位的基础信息
	paymentUtils_pos.getReceiptType(decorationPaymentCheck);

	//现金方式
	com.selectTypeahead("decorationCheckcashInfo", decorationPaymentCheck.cashUtil, "key", "value", null);

	//转账方式
	com.focusPage("#decorationCheckcheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils_pos.addBankUtil(maxNum, "checkvDiv", "#decorationCheckcheckvDivGroup", decorationPaymentCheck.checkvNums, decorationPaymentCheck.checkBankUtilForGrade, decorationPaymentCheck);
		return false;
	});

	com.focusPage("#advanceType").bindData([{"key":"1", "value":"合同"}, {"key":"2", "value":"工程"}], 'key', 'value');
	
	com.focusPage("#decorationPaymentHistoryList").removeClass("active");
	
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			var $btnUpdate = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

            var propertyArr = [
               ["订单号:", v.decoration.orderId, "blue"],
               ["楼盘地址:",v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + ' '+ v.decoration.house.houseNumber, "grey"],
               ["客户:", v.decoration.customer.name, "grey"],
               ["设计师:", v.decoration.designer.currentName, "grey"],
               ["设计部:", v.decoration.designer.dept.name, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", decorationPaymentCheck.paymentStatusArray[v.paymentStatus], "red"],
               ["备注:", v.comment, "grey"]
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "dpIds",
				"class": "ace ace-checkbox-2",
				"dpId": v.dpid
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.paymentType);
            
            $.each(propertyArr, function (index,value) {
            	var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

			$divBtnWrap.append($btnUpdate).appendTo($h3);
            $label.append($input).append($span).appendTo($h3);

			var styleArr = [];

			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils_pos.splitBankInfo(v.bank, v.bankInfo, decorationPaymentCheck.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils_pos.splitBankInfo(v.checkv, v.checkvBank, decorationPaymentCheck.checkBankInfo), "blue"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});

			$liLine.append($h3).append($ulProperty).append($ulStyle);

			$btnUpdate.click(function(){
				decorationPaymentCheck.typeUpdate = 2;
				var updateReturnParams = paymentUtils_pos.dialogPaymentUpdate(v, decorationPaymentCheck);
				decorationPaymentCheckPostData.paymentInfo = updateReturnParams[0];
				decorationPaymentCheckPostData.orderId = updateReturnParams[1];
				decorationPaymentCheckPostData.customerId = updateReturnParams[2];
				decorationPaymentCheck.couponUpdate = updateReturnParams[3];

				com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.decoration.orderId, "pointofsales.rid": v.drId}, function(res){
					$.each(res.pointofsaleses, function(i, value){
						if(value.status == 4) {
							paymentUtils_pos.addPos(value, decorationPaymentCheck.htmlName);
							com.focusPage("#bankCheckbox").prop("checked", true);
							com.focusPage("#posDiv").prop("style", "display: block");
							com.focusPage("#bankDiv").prop("style", "display: block");
						}
					});
				});
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
        }
    })();
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "paymentDesigner", "paymentVillage", "houseNumber", "collectTimeDateRange"], "condList", api.payment.pageDecorationPaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "decorationPaymentCheckPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
    	var $addi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('批量确认').appendTo($adda);
    	
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$adda, $impa];
	});
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.paymentType));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var propertyArr = [
               ["订单号:", v.decoration.orderId, "blue"],
               ["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + ' ' + v.decoration.house.houseNumber, "grey"],
               ["客户:", v.decoration.customer.name, "grey"],
               ["设计师:", v.decoration.designer.currentName, "grey"],
               ["设计部:", v.decoration.designer.dept.name, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
		       ["确认人:", v.confirmer.currentName, "grey"],
			   ["确认时间:", v.confirmTime, "green"],
               ["状态:", decorationPaymentCheck.paymentStatusArray[v.paymentStatus], "red"],
               ["备注:", v.comment, "grey"]
            ];

            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });

            var styleArr = [];

			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils_pos.splitBankInfo(v.bank, v.bankInfo, decorationPaymentCheck.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils_pos.splitBankInfo(v.checkv, v.checkvBank, decorationPaymentCheck.checkBankInfo), "blue"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;

			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
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
        }
    })();

	var hsearcher = new Searcher();
	hsearcher.init(["orderId", "paymentDesigner", "paymentVillage", "houseNumber", "collectTimeDateRange"], "hcondList", api.payment.pageDecorationPaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hdecorationPaymentCheckPostData", null, false, null, null, "hresultList");

	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="dpIds"]:checked');

		$.each($inputs, function(i, v){
			options["paymentIds["+i+"]"] = $(v).attr('dpId');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的装修款项信息");
			return false;
		}
		
		com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			com.post(api.payment.confirmDecorationPayment, options, function(res){
				searcher.doSearch();
				hsearcher.doSearch();
				com.showAlert(com.info, "确认成功")
			});
		});
	});

	com.focusPage('a[name="import"]', '#pagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.payment.pageDecorationPaymentForCollect, $.extend({}, params.decorationPaymentCheckPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["订单号","decoration.orderId"],
					['楼盘地址',['decoration.house.village.cityProper.city.name', 'decoration.house.village.cityProper.name', 'decoration.house.village.name', 'decoration.house.houseNumber']],
					['客户','decoration.customer.name'],
					['设计师','decoration.designer.currentName'],
					['设计部','decoration.designer.dept.name'],
					['应收金额', 'referMoney'],
					['收款人', 'collecter.currentName'],
					['收款时间', 'collectTime'],
					['类型', 'paymentType'],
					['状态', 'paymentStatus'],
					['备注', 'comment'],
					['现金', 'cash'],
					['银行', ['bank', 'bankInfo']],
					['转账', ['checkv', 'checkvBank']],
					['分期', ['installment', 'installmentBank']],
					['对公', ['accounts', 'accountsBank']],
					['预付款', 'advance'],
					['券', ['coupon', 'couponInfo']]
				],
				list: res.paging.data
			}, function(v){
				if(v.bank != null && v.bank != 0){
					  var $info = ' ';
					  var _s = v.bankInfo.split('#');
					  for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    $info += decorationPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
					  }
					  
					  v.bankInfo = $info;
				}

				if(v.checkv != null && v.checkv != 0){
					var checkBankInfoStr = v.checkvBank;
					if(checkBankInfoStr.indexOf("#") != -1){
						var $checkvInfo = ' ';
						var _c = v.checkvBank.split('#');
						for(var i=1;i<_c.length-1;i++){
							var _i = _c[i].split('|');
							$checkvInfo += decorationPaymentCheck.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? decorationPaymentCheck.checkBankInfo[v.checkvBank] : '';
					}
				}
				
				v.installmentBank = v.installment != null && v.installment != "0" ? decorationPaymentCheck.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? decorationPaymentCheck.accountsInfo[v.accountsBank] : '';
				v.paymentStatus = decorationPaymentCheck.paymentStatusArray[v.paymentStatus];
			});
		});
    });
});

