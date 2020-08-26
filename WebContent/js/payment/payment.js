jQuery(function($) {
	var payment = {
		saveBtn: com.focusPage("#collectBtn"),
		cancelBtn: com.focusPage("#cancelBtn"),
		createBtn: com.focusPage("#createBtn"),
		items: {
			cashCheckbox: com.focusPage("#cashCheckbox"),
			bankCheckbox: com.focusPage("#bankCheckbox"),
			checkvCheckbox: com.focusPage("#checkvCheckbox"),
			cash: com.focusPage("#cash"),
			paymentTypeSel: com.focusPage("#paymentTypeSel"),
			des: com.focusPage("#des")
		},
		paymentTypes: null,
		temp: [],
		typeData: [],
		paymentTypeData: [],
		statusData: [],
		checkvNums: [],
		decorationType: [],
		htmlName: "payment",
		modelId: 'paymentModal',
		modals: {
			modal: com.focusPage("#paymentModal"),
			createModal: com.focusPage("#createPaymentModal")
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
		pointofsalesType: 0
	};
	
	payment.saveBtn.bindClick(function(){
		paymentUtils.paymentSaveData(payment, searcher, hsearcher);
	});

	payment.createBtn.bindClick(function(){
		if(com.validate("createPaymentModal")){
			return;
		}

		var url = api.payment.addAdvancePayment;
		var createOptions = {
			"advancePayment.decoration.orderId": com.focusPage("#decorationOrderId").val()
		};
		
		com.post(url, createOptions, function(res){
			com.showAlert(com.info, "创建成功");
			searcher.doSearch();
			payment.modals.createModal.modal("hide");
		});
	});

	payment.modals.modal.on('show.bs.modal',function(e){
		com.focusPage('.payWayError').hide();
	});

	//隐藏触发
	payment.modals.modal.on('hide.bs.modal', function () {
		payment.bankUtilForGrade = [];
		payment.checkBankUtilForGrade = [];
		com.focusPage("#paymentposDivGroup").html("");
		com.focusPage("#paymentbankDivGroup").html("");
		com.focusPage("#bankCheckbox").removeAttr("disabled");
		com.closeTip();
	});

	com.post(api.ds.payment, {}, function(res){
		$.each(res.type, function (i,v) {
			payment.typeData[v.key] = v.value;
		});

		$.each(res.paymentType, function (i,v) {
			payment.paymentTypeData[v.key] = v.value;
		});

		$.each(res.status, function (i,v) {
			payment.statusData[v.key] = v.value;
		});

		$.each(res.posway, function (i, v) {
			payment._posway.push(v);
		});
	}, null, false);

	com.post(api.ds.decoration, {}, function(res){
		payment.decorationType = res.typeness;
	}, null, false);
	
	com.focusPage("#paymentModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#paymentbankDivGroup").html("");
			paymentUtils.addBankPosUtil("#paymentbankDivGroup", payment.bankUtilForGrade, payment);
		}
	});
	
	//切换合同和主材预付款
	com.focusPage("#paymentTypeSel").on("change", function(){
		payment.bankUtilForGrade = [];
		payment.checkBankUtilForGrade = [];
		payment.checkvNums = [];
		com.focusPage("#paymentbankDivGroup").html("");

		com.focusPage("#paymentbankDivGroup").empty();
		com.focusPage("#paymentcheckvDivGroup").empty();

		var currentGrade = com.focusPage("#paymentModal").attr("grade");
		getReceiptTypeForGrade(com.focusPage("#paymentTypeSel").val(), currentGrade);

		paymentUtils.addBankPosUtil("#paymentbankDivGroup", payment.bankUtilForGrade, payment);
	});

	//info信息是分页显示信息的, util是下拉框信息
	paymentUtils.getReceiptType(payment);

	com.selectTypeahead("paymentcashInfo", payment.cashUtil, "key", "value", null);

	com.focusPage("#paymentcheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#paymentcheckvDivGroup", payment.checkvNums, payment.checkBankUtilForGrade, payment);

		return false;
	});
	
	com.focusPage("#paymentHistoryList").removeClass("active");
	
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.decoration.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').attr("id",v.decoration.orderId+"ul");
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');
            var $btnCashout = $('<a></a>').addClass('btn btn-minier btn-warning').html('提款');

            var propertyArr = [
				["客户:", v.decoration.customer.name, "grey"],
				["楼盘地址:", v.decoration.house.village.cityProper.city.name + ' ' + v.decoration.house.village.cityProper.name + ' ' + v.decoration.house.village.name + " " + v.decoration.house.houseNumber, "grey"],
				["设计师:", v.decoration.designer.currentName, "grey"],
				["等级:", v.decoration.grade, "red"],
				["合同预付款:", v.balance, "blue"],
				["工程预付款:", v.projectBalance, "blue"],
				["主材预付款:", v.materialBalance, "blue"],
				["正林预付款:", v.zhenglinBalance, "blue"]
            ];
            
            $.each(propertyArr, function (index,value) {
            	var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.append($btnCollect).append($btnCashout).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty);

            $btnCollect.click(function(){
            	v.decoration.paymentType="收款";
				payment.typeUpdate = 1;
				com.focusPage("#paymentModal").attr("grade", v.decoration.grade);
            	showPaymentModal(v.decoration);
            });
            
            $btnCashout.click(function(){
				v.decoration.paymentType="提款";
				payment.typeUpdate = 2;
				com.focusPage("#paymentModal").attr("grade", v.decoration.grade);
				com.focusPage("#bankCheckbox").attr("disabled","disabled");

				com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": v.decoration.orderId}, function(res){
					showPaymentModal(v.decoration,res);
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
	
	searcher.init(["orderId", "village", "houseNumber", "designer"], "condList", api.payment.pageAdvancePayment, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createPayment').css("margin", "0px 3px");
		var $addspan = $('<span></span>').text('创建预付款').appendTo($adda);

		return [$adda];
	});

	//创建预付款
	com.focusPage('a[name="createPayment"]', '#pagenation').click(function(){
		com.focusPage("#decorationOrderId").val("");
		payment.modals.createModal.modal("show");
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
            var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnDecorationInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdateP = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');
            
            var propertyArr = [
				["客户:", v.customer.name, "grey"],
                ["收款类型:", payment.typeData[v.type], "red"],
                ["预付款类型:", payment.paymentTypeData[v.paymentType], "red"],
                ["操作金额:", v.recharge, "blue"],
                ["余额:", v.balance, "blue"],
                ["收款人:", v.collectUser.userName, "grey"],
                ["收款时间:", v.collectTime, "green"],
                ["状态:", payment.statusData[v.status], "red"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["刷卡:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, payment.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, payment.checkBankInfo), "blue"]) : true;
			v.installment != null && v.installment != "0" ? styleArr.push(["分期:", v.installment, "blue"]) : true;
			v.accounts != null && v.accounts != "0" ? styleArr.push(["对公帐户:", v.accounts, "blue"]) : true;
			v.advance != null && v.advance != "0" ? styleArr.push(["预付款:", v.advance, "blue"]) : true;
			v.coupon != null && v.coupon != "0" ? styleArr.push(["优惠券:", v.coupon + v.couponInfo.split('#').join(' '), "blue"]) : true;
			v.transfer != null && v.transfer != "0" ? styleArr.push(["预付款转换:", v.transfer, "blue"]) : true;
			
			$.each(styleArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulStyle);
			});
           
            $divBtnWrap.append($btnDecorationInfo).append($btnPrint).appendTo($h3);

			if(v.status == 1 && v.type != 2 && v.transfer == 0){
				$divBtnWrap.append($btnUpdateP).appendTo($h3);
			}
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);

			//查看装修单
			$btnDecorationInfo.click(function(){
				paymentUtils.decorationInfoShow(v.orderId, payment.decorationType);
			});

			$btnPrint.click(function(){
				params.paymentPaymentId = v.pid;
				com.popup("专用收款收据__装修单号:" + v.orderId  ,api.index.paymentReceiptIndex.url ,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true)
			});

			$btnUpdateP.click(function(){
				payment.typeUpdate = 3;
				v.grade = "allGrade";

				com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.orderId, "pointofsales.rid": v.arId}, function(res){
					$.each(res.pointofsaleses, function(i, value){
						if(value.status == 4) {
							paymentUtils.addPos(value, payment.htmlName);
							com.focusPage("#bankCheckbox").prop("checked", true);
							com.focusPage("#posDiv").prop("style", "display: block");
							com.focusPage("#bankDiv").prop("style", "display: block");
						}
					});
				});

				paymentUtils.paymentDialogPaymentUpdate(v, payment);
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
	
	var hsearcher = new Searcher();
	
	hsearcher.init(["orderId", "advancePaymentcollectTime"], "hcondList", api.payment.pagePaymentForHistory, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hpaymentPostData", null, false, null, function(){
    	var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
    	var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
    	var $impspan = $('<span></span>').text('导出').appendTo($impa);
    	
    	return [$impa];
    }, "hresultList");

	function showPaymentModal(v,res){
		payment.checkvNums=[];
		com.focusPage("#historyUpdateP").addClass("hide");
		com.focusPage("#paymentTypeSel").removeAttr("disabled");
		com.focusPage("#des").removeAttr("disabled");

		com.cleanTypeahead('paymentcashInfo');

		// 根据等级在数组中筛选出符合要求的用于显示
		getReceiptTypeForGrade(0, v.grade);

		if(v.paymentType.search('收款') != -1 || v.paymentType=="收款"){
			com.focusPage("#myModalLabel").text("收款信息");
			com.focusPage("#paymentMethod").text("付款方式");
			com.focusPage("#refundSumBalanceDiv").addClass("hide");
			com.focusPage("#refundSumWithdrawDiv").addClass("hide");
			com.focusPage("#collectBtn").text("收款");
			payment.paymentTypes = v.paymentType;
			payment.mno = v.orderId;


			com.post(api.payment.queryPointofsalesByPidAndRid, {"pointofsales.pid": v.orderId}, function(res){
				$.each(res.pointofsaleses, function(i, value){
					if(value.status == 0 || value.status == 1) {
						paymentUtils.addPos(value, payment.htmlName);
						com.focusPage("#bankCheckbox").prop("checked", true);
						com.focusPage("#posDiv").prop("style", "display: block");
						com.focusPage("#bankDiv").prop("style", "display: block");
					}
				});
				res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#paymentbankDivGroup", payment.bankUtilForGrade, payment) : "";
			});
		}else{
			com.focusPage("#myModalLabel").text("提现信息");
			com.focusPage("#paymentMethod").text("提现方式");
			com.focusPage("#refund").val("");
			com.focusPage("#refundSumBalanceDiv").removeClass("hide");
			com.focusPage("#refundSumWithdrawDiv").removeClass("hide");
			com.focusPage("#paymentTypeSel").find("option:first").prop("selected", true);
			com.focusPage("#paymentTypeSel").on("change", function(){
				if($(this).val() == 0){
					com.focusPage("#refundSum").val(res.balanceAdvance);
				}else if($(this).val() == 1){
					com.focusPage("#refundSum").val(res.projectAdvance);
				}else if($(this).val() == 2){
					com.focusPage("#refundSum").val(res.materialAdvance);
				}else if($(this).val() == 3){
					com.focusPage("#refundSum").val(res.zaterialAdvance);
				}
			}).trigger("change");
			com.focusPage("#collectBtn").text("提现");
			payment.paymentTypes = v.paymentType;
		}

		params.orderId = v.orderId;
		
		com.focusPage("#paymentcheckvDivGroup").html("");
		com.focusPage("#paymentcheckvAdd").attr("num", 0).attr("maxnum",0);
		
		com.cleanItems(payment.items);
		payment.modals.modal.modal("show");
		
		com.focusPage("#paymentTypeDiv").css("display", "inline");
		
		payment.temp = v;
	}
	
	com.focusPage('a[name="import"]', '#hpagenation').click(function () {
    	if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}
    	
    	if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}
		
		com.post(api.payment.pagePaymentForHistory, $.extend({}, params.hpaymentPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["订单号","orderId"],
					['收款类型','type'],
					['预付款类型','paymentType'],
					['操作金额','recharge'],
					['收款人', 'collectUser.currentName'],
					['收款时间', 'collectTime'],
					['状态', 'status'],
					['备注', 'comment'],
					['现金', 'cash'],
					['刷卡', ['bank', 'bankInfo']],
					['银行', ['checkv', 'checkvBank']],
					['分期', ['installment', 'installmentBank']],
					['对公', ['accounts', 'accountsBank']],
					['预付款转换', 'transfer']
				],
				list: res.paging.data
			}, function(v){
				if(v.bank != null && v.bank != 0){
					var $info = ' ';
					var _s = v.bankInfo.split('#');
					for(var i=1;i<_s.length-1;i++){
					    var _i = _s[i].split('|');
					    $info += payment.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
							$checkvInfo += payment.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? payment.checkBankInfo[v.checkvBank] : '';
					}
				}
				
				v.installmentBank = v.installment != null && v.installment != "0" ? payment.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? payment.accountsInfo[v.accountsBank] : '';
				v.type = v.type != null ? payment.typeData[v.type] : v.type;
				v.paymentType = v.paymentType != null ? payment.paymentTypeData[v.paymentType] : v.paymentType;
				v.status = v.status != null ? payment.statusData[v.status] : v.status;
			});
		});
    });

	function getReceiptTypeForGrade(paymentType, decorationGrade){
		var gradeParam;

		if(decorationGrade == "allGrade"){
			payment.bankUtilForGrade = payment.bankUtil;
			payment.checkBankUtilForGrade = payment.checkBankUtil;
		}else{
			if(paymentType == 0){
				if(decorationGrade == "A" || decorationGrade == "C"){
					gradeParam = "A";
				}else{
					gradeParam = "";
				}
			}else if(paymentType  == 2){
				if(decorationGrade == "C"){
					gradeParam = "B";
				}else{
					gradeParam = "";
				}
			}

			var returnGradeParams = paymentUtils.getValueForGrade(payment.bank, payment.checkBank, gradeParam);
			payment.bankUtilForGrade = returnGradeParams[0];
			payment.checkBankUtilForGrade = returnGradeParams[1];
		}
	}
});
