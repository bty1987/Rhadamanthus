jQuery(function($) {
	var payment = {
		htmlName: "payment",
		type: params['urlLoadParams'].paytype,
		paytypes: [],
		payment: null,
		items: {
			checkbox: com.focusPage("#checkbox", "#payment"),
			cashCheckbox: com.focusPage("#cashCheckbox", "#payment"),
			bankCheckbox: com.focusPage("#bankCheckbox", "#payment"),
			checkvCheckbox: com.focusPage("#checkvCheckbox", "#payment"),

			historyDiv: com.focusPage("#historyDiv", "#payment"),
			historyData: com.focusPage("#historyData", "#payment"),
			cashDiv: com.focusPage("#cashDiv", "#payment"),
			checkvDiv: com.focusPage("#checkvDiv", "#payment"),

			cash: com.focusPage("#cash", "#payment"),
			cashInfo: com.focusPage("#cashInfo", "#payment"),

			bankName: com.focusPage("#bankName", "#payment"),
			bank: com.focusPage("#bank", "#payment"),
			posway: com.focusPage("#posway", "#payment"),

			posDiv: com.focusPage("#posDiv", "#payment"),
			posGroup: com.focusPage("#posGroup", "#payment"),
			bankDiv: com.focusPage("#bankDiv", "#payment"),
			bankGroup: com.focusPage("#bankGroup", "#payment"),
			checkvGroup: com.focusPage("#checkvGroup", "#payment"),

			advanceType: com.focusPage("#advanceType", "#payment"),
			balanceDiv: com.focusPage("#balanceDiv", "#payment"),
			balance: com.focusPage("#balance", "#payment"),
			withdrawDiv: com.focusPage("#withdrawDiv", "#payment"),
			withdraw: com.focusPage("#withdraw", "#payment"),
			des: com.focusPage("#des", "#payment"),

			myModalLabel: com.focusPage("#myModalLabel", "#payment"),
			paymentMethod: com.focusPage("#paymentMethod", "#payment")
		},

		createItems : {
			orderId : com.focusPage("#decorationOrderId", "#payment")
		},

		btns: {
			collectBtn: com.focusPage("#collectBtn", "#payment"),
			createBtn: com.focusPage("#createBtn", "#payment"),

			checkvAdd: com.focusPage("#checkvAdd", "#payment"),
			posPush: com.focusPage("#posSend", "#payment")
		},

		modals: {
			collectModal: com.focusPage("#collectModal", "#payment"),
			createModal: com.focusPage("#createPaymentModal", "#payment")
		},

		cash: [],
		bank: [],
		checkv: [],
		accounts: [],
		posValues: {},

		cashUtil: [],
		bankUtil: [],
		checkvUtil: [],

		cashInfo: {},
		bankInfo: {},
		checkvInfo: {},
		accountsInfo: {},

		bankGrade: [],
		checkvGrade: [],

		url: "",
		conditions: [],
		extraParams: {},
		functions: [],
		decorationType: [],

		typeData: [],
		paymentTypeData: [],
		statusData: [],
		typeUpdate: "",
		pageConfig: {}
	};

	//隐藏触发
	payment.modals.collectModal.on('hide.bs.modal', function () {
		payment.bankGrade = [];
		payment.checkvGrade = [];

		payment.items.posGroup.html("");
		payment.items.bankGroup.removeClass('hide');
		payment.items.checkvGroup.html("");
		payment.items.historyData.html("");

		payment.items.bankName.removeClass("v_required v_typeahead");
		payment.items.bank.removeClass("v_required v_float_3");

		payment.payment = null;

		com.closeTip();
		com.cleanItems(payment.items);
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

		payment.items.posway.bindData(res.posway, "key", "value");
	}, null, false);

	com.post(api.ds.decoration, {}, function(res){
		payment.decorationType = res.typeness;
	}, null, false);

	com.focusPage("#collectModal :checkbox", "#payment").on("change", function(){
		var that = $(this);
		var checked = that.prop("checked");
		var id = that.attr("id");

		var boxdiv = com.focusPage("[referCheckbox=" + id + "]", "#payment");

		checked ? boxdiv.show() : boxdiv.hide();
	});

	//info信息是分页显示信息的, util是下拉框信息
	paymentUtils.getReceiptType(payment);

	//现金方式
	com.selectTypeahead("cashInfo", payment.cashUtil, "key", "value", null);

	//转账方式(银行)
	payment.btns.checkvAdd.click(function(){
		paymentUtils.addBank(payment);
		return false;
	});

	payment.btns.collectBtn.bindClick(collect);

	payment.btns.posPush.unbind().click(function(){
		paymentUtils.pushPos(payment, 0, payment.payment.orderId);
		return false;
	});

	payment.btns.createBtn.bindClick(function(){
		if(com.validate("createPaymentModal")) return;

		var url = api.payment.addAdvancePayment;
		var createOptions = {"advancePayment.decoration.orderId": payment.createItems.orderId.val()};

		com.post(url, createOptions, function(res){
			com.showAlert(com.info, "创建成功");
			searcher.doSearch();
			payment.modals.createModal.modal("hide");
		});
	});

	//切换合同和主材预付款
	payment.items.advanceType.on("change", function(){
		payment.bankGrade = [];
		payment.checkvGrade = [];

		payment.items.bankCheckbox.prop("checked", false);
		payment.items.posDiv.hide();
		payment.items.bankDiv.hide();
		payment.items.checkvGroup.html("");
		com.cleanTypeahead(payment.items.bankName);
		payment.items.bank.val("");

		var currentGrade = payment.modals.collectModal.attr("grade");
		getReceiptTypeForGrade(payment.items.advanceType.val(), currentGrade);
		payment.items.bankName.data('typeahead').options.list = payment.bankGrade;

	});

	//不同页面的不同参数
	payment.pageConfig = paymentUtils.getConfig(payment.type, 1);

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
			var orderId = v.decoration ? v.decoration.orderId : v.orderId;
            var $h3 = $('<h3></h3>').addClass('oid');
			var $label = $('<label></label>').appendTo($h3);

			var $input = $('<input>').attr({"type": "checkbox", "name": "pids", "class": "ace ace-checkbox-2"});
			if (payment.pageConfig.pageBtn.contains("selectall")) $label.append($input.attr({"pid": v.pid}));

			var $span = $('<span></span>').addClass('lbl blue bigger-150').html(orderId).appendTo($label);
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').attr("id",orderId+"ul");
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnCollect = $('<a></a>').addClass('btn btn-minier btn-primary').html('收款');
            var $btnCashout = $('<a></a>').addClass('btn btn-minier btn-warning').html('提款');

			var $btnDecorationInfo = $('<a></a>').addClass('btn btn-minier btn-yellow').html('装修单信息');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
			var $btnUpdateP = $('<a></a>').addClass('btn btn-minier btn-success').html('更新');

			var project =  ["common", "pos"].contains(payment.type) ? v.decoration : v;
            var propertyArr = paymentUtils.getPropertyArr(payment, v, project, payment.statusData);

            $.each(propertyArr, function (index,value) {
            	var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
           
            $divBtnWrap.appendTo($h3);
            $liLine.append($h3).append($ulProperty);

			if(payment.pageConfig.pageBtn.contains("payway")) paymentUtils.drawHistoryData(payment, v, $liLine, "");

			if (payment.pageConfig.pageBtn.contains("collect")) $divBtnWrap.append($btnCollect);
			if (payment.pageConfig.pageBtn.contains("withdraw")) $divBtnWrap.append($btnCashout);
			if (v.status != 0 && payment.pageConfig.pageBtn.contains("decorationInfo")) $divBtnWrap.append($btnDecorationInfo);
			if (v.status != 0 && payment.pageConfig.pageBtn.contains("print")) $divBtnWrap.append($btnPrint);
			if (v.status == 1 && v.type != 2 && v.transfer == 0 && payment.pageConfig.pageBtn.contains("update")) $divBtnWrap.append($btnUpdateP);

			//收款
            $btnCollect.click(function(){
            	v.decoration.paymentType = "收款";
				payment.typeUpdate = 0;

				paymentUtils.showPos(payment, {"pointofsales.pid": v.decoration.orderId}, [0, 1]);

            	initCollect(v.decoration);
            });

			//提款
            $btnCashout.click(function(){
				v.decoration.paymentType = "提款";
				payment.typeUpdate = 1;

				com.post(api.payment.queryAdvancePaymentByOrderId, {"advancePayment.decoration.orderId": v.decoration.orderId}, function(res){
					initCollect(v.decoration, res);
				});
            });

			//更新
			$btnUpdateP.click(function(){
				payment.typeUpdate = 2;
				v.grade = "allGrade";

				initUpdate(v);
			});

			//查看装修单
			$btnDecorationInfo.click(function(){
				paymentUtils.decorationInfoShow(v.orderId, payment.decorationType);
			});

			//打印
			$btnPrint.click(function(){
				params.paymentPaymentId = v.pid;
				com.popup("专用收款收据__装修单号:" + v.orderId  ,api.index.paymentReceiptIndex.url ,function () {
					parent.layer.getFrameIndex(window.name);
				},null,true)
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

	var extraParams = {};
	if (payment.pageConfig.statusExtraParam != null && payment.pageConfig.statusExtraParam.length > 0) {
		extraParams["payment.status"] = payment.pageConfig.statusExtraParam[0];
	}

	if (payment.pageConfig.typeExtraParam != null && payment.pageConfig.typeExtraParam.length > 0) {
		extraParams["payment.type"] = payment.pageConfig.typeExtraParam[0];
	}

	searcher.init(payment.pageConfig.condArr, "condList", payment.pageConfig.apiPage, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentPostData"+payment.type, extraParams, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createPayment').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('创建预付款').appendTo($adda);

		var $checka = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'checks').css("margin", "0px 3px");
		var $checki = $('<i></i>').addClass('icon-check bigger-110').appendTo($checka);
		var $checkspan = $('<span></span>').text('全选').appendTo($checka);

		var $confirma = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'confirms').css("margin", "0px 3px");
		var $confirmi = $('<i></i>').addClass('icon-ok bigger-110').appendTo($confirma);
		var $confirmpan = $('<span></span>').text('批量确认').appendTo($confirma);

		var $impa = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'import').css("margin", "0px 3px");
		var $impi = $('<i></i>').addClass('icon-download-alt bigger-110').appendTo($impa);
		var $impspan = $('<span></span>').text('导出').appendTo($impa);

		var btnParams = [];

		if(payment.pageConfig.pageBtn.contains("createAdvance")) btnParams.push($adda);
		if(payment.pageConfig.pageBtn.contains("selectall")) btnParams.push($checka);
		if(payment.pageConfig.pageBtn.contains("confirms")) btnParams.push($confirma);
		if(payment.pageConfig.pageBtn.contains("export")) btnParams.push($impa);

		return btnParams;
	});

	function initCollect(decoration, res){

		payment.items.historyDiv.hide();
		payment.items.advanceType.removeAttr("disabled");
		payment.items.des.removeAttr("disabled");

		payment.payment = decoration;

		// 根据等级在数组中筛选出符合要求的用于显示
		getReceiptTypeForGrade(0, decoration.grade);

		payment.items.myModalLabel.text(decoration.paymentType+"信息");
		payment.items.paymentMethod.text(decoration.paymentType+"方式");
		payment.btns.collectBtn.text(decoration.paymentType);
		//payment.paymentTypes = v.paymentType;

		if(payment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(payment);
		if(payment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(payment, payment.typeUpdate);
		if(payment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(payment);

		payment.modals.collectModal.attr("grade", decoration.grade);

		if(decoration.paymentType == "收款"){
			payment.items.balanceDiv.hide();
			payment.items.withdrawDiv.hide();
		}else{
			payment.items.balanceDiv.show();
			payment.items.withdrawDiv.show();
			payment.items.advanceType.on("change", function(){
				if($(this).val() == 0){
					payment.items.balance.val(res.balanceAdvance);
				}else if($(this).val() == 2){
					payment.items.balance.val(res.materialAdvance);
				}
			}).trigger("change");
		}

		payment.modals.collectModal.modal("show");

	}
	
	//更新
	function initUpdate(v){

		com.cleanItems(payment.items);

		payment.items.myModalLabel.text("更新款项信息");

		payment.items.historyDiv.show();

		payment.payment = v;

		payment.items.balanceDiv.hide();
		payment.items.withdrawDiv.hide();
		payment.items.advanceType.attr("disabled", "disabled");
		payment.items.des.val(v.comment).attr("disabled", "disabled");

		if(payment.pageConfig.paytypes.contains("cash")) paymentUtils.initCash(payment);
		if(payment.pageConfig.paytypes.contains("bank")) paymentUtils.initBank(payment, 1);
		if(payment.pageConfig.paytypes.contains("checkv")) paymentUtils.initCheckv(payment);

		getReceiptTypeForGrade(0, v.grade);

		//历史收款信息
		paymentUtils.drawHistoryData(payment, payment.payment, payment.items.historyData, "update");

		payment.modals.collectModal.modal("show");
	}

	//收款
	function collect(){

		if(com.validate("collectModal", "#decorationPayment")){
			return false;
		}

		var url = "";
		var realPayment = 0;
		var options = {};
		var posids = {};

		options["payment.customer.cid"] = payment.payment.customer.cid;
		options["payment.paymentType"] = payment.items.advanceType.val();
		options["payment.orderId"] = payment.payment.orderId;

		var decorationOrPayment = payment.payment;

		//计算总额
		var cash = paymentUtils.paramCash(payment, "payment", options);

		realPayment = utils.accAdd(realPayment, parseFloat(cash));

		var bank = paymentUtils.paramBank(payment, payment.payment, "payment", options, payment.typeUpdate);

		if(bank < 0){
			com.showAlert(com.warning, "存在未处理POS收款");
			return false;
		}

		realPayment = utils.accAdd(realPayment, parseFloat(bank));

		var checkv = paymentUtils.paramCheckv(payment, "payment", options);

		realPayment = utils.accAdd(realPayment, parseFloat(checkv));

		if($.isEmptyObject(options)){
			com.showAlert(com.warning, "无收款方式信息");
			return false;
		}

		if(payment.typeUpdate == 0){

			if(parseFloat(realPayment) <= 0){
				com.showAlert(com.warning, "收款金额需要大于零!");
				return false;
			}

			url = api.payment.collectPayment;

			options["payment.type"] = 1; //收款
			options["payment.comment"] = payment.items.des.val().trim();
			options["payment.uniqueid"] = new Date().getTime();

			$.extend(options, {}, posids);

		}else if(payment.typeUpdate == 1){

			var balance = payment.items.balance.val(); //余额
			var withdraw = payment.items.withdraw.val(); //提现余额

			if(parseFloat(withdraw) <= 0){
				com.showAlert(com.warning, "提款金额需要大于零!");
				return false;
			}

			if(parseFloat(balance) < parseFloat(withdraw)){
				com.showAlert(com.warning, "提款金额不能大于余额!");
				return false;
			}

			if(parseFloat(realPayment)!=parseFloat(withdraw)){
				com.showAlert(com.warning, "当前提款项总数与提款金额不等,请核实再进行提交!");
				return false;
			}

			url = api.payment.withdrawPayment;
			options["payment.type"] = 0;
			options["payment.comment"] = payment.items.des.val().trim();
			options["payment.uniqueid"] = new Date().getTime();

		} else if (payment.typeUpdate == 2) {
			var historyRealPayment = utils.accAdd(utils.accAdd(decorationOrPayment.cash, decorationOrPayment.bank), decorationOrPayment.checkv);

			if(parseFloat(realPayment) != parseFloat(historyRealPayment)){
				com.showAlert(com.warning, "当前更新款项金额与原收款金额不等,请核实再进行提交!");
				return false;
			}

			url = api.payment.updatePayment;
			options["payment.pid"] = decorationOrPayment.pid;
		}

		com.post(url, options, function(res) {
			searcher.doSearch();
			payment.modals.collectModal.modal("hide");

			if (decorationOrPayment.paymentType && decorationOrPayment.paymentType == "收款") {
				com.showConfirm("是否需要打印当前收款对应的收据信息?", function (result) {
					params.paymentPaymentId = res.payment.pid;
					com.popup("专用收款收据__装修单号:" + res.payment.orderId, api.index.paymentReceiptIndex.url, function () {
						parent.layer.getFrameIndex(window.name);
					}, null, true)
				});
			}
		});

	}

	//创建预付款
	com.focusPage('a[name="createPayment"]', '#pagenation').click(function(){
		com.cleanItems(payment.createItems);
		payment.modals.createModal.modal("show");
	});

	//全选
	com.focusPage('a[name="checks"]', '#pagenation').click(function(){
		paymentUtils.checkAll();
	});

	//批量确认
	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="pids"]:checked');

		$.each($inputs, function(i, v){
			options["paymentIds["+i+"]"] = $(v).attr('pid');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的预付款项信息");
			return false;
		}

		com.showConfirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			com.post(api.payment.confirmPayment, options, function(res){
				searcher.doSearch();
				com.showAlert(com.info, "确认成功")
			});
		});
	});

	//导出
	com.focusPage('a[name="import"]', '#pagenation').click(function () {
		if(com.focusPage('span[name="totalRecords"]').text() == 0){
			com.showAlert(com.warning, "请通过条件进行查询");
			return false;
		}

		if(com.focusPage('span[name="totalRecords"]').text() > 1000){
			com.showAlert(com.warning, "查询结果大于阀值 , 不能完成导出动作");
			return false;
		}

		com.post(api.payment.pagePayment, $.extend({}, params["paymentPostData"+payment.type], {"paging.noPage": 1}), function(res){
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
				v.collectUser = v.collectUser == null ? {"collectUser": ""} : v.collectUser;
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
					var checkvInfoStr = v.checkvBank;
					if(checkvInfoStr.indexOf("#") != -1){
						var $checkvInfo = ' ';
						var _c = v.checkvBank.split('#');
						for(var i=1;i<_c.length-1;i++){
							var _i = _c[i].split('|');
							$checkvInfo += payment.checkvInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? payment.checkvInfo[v.checkvBank] : '';
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
			payment.bankGrade = payment.bankUtil;
			payment.checkvGrade = payment.checkvUtil;
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

			paymentUtils.initBankGrade(payment, gradeParam);
		}
	}
});
