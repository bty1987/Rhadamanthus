
jQuery(function($) {
	var materialPaymentCheck = {
		materialPaymentTypeData: {},
		materialPaymentRevTypeData: {},
		ouponType: {},
		paymentModelNameData: ["cash", "bank", "checkv", "advance", "coupon"],
		bankNums:[],
		checkvNums: [],
		couponType: {},
		items: {},
		htmlName: "materialCheck"
	};

	var materialPaymentCheckPostData = {};

	materialPaymentCheck.baseModal = com.focusPage("#baseItemModalMaterialCheck").on('show.bs.modal', function(e){
		com.clearValidator();
		com.focusPage("#paymentInfo").val("");
	});

	//隐藏触发
	com.focusPage("#baseItemModalMaterialCheck").on('hidden.bs.modal', function () {
		materialPaymentCheck.bankUtilForGrade = [];
		materialPaymentCheck.checkBankUtilForGrade = [];
		paymentUtils.EmptyChosen('materialCheckcashInfo');
	});

	materialPaymentCheck.saveBtn = com.focusPage("#saveBtn").bindClick(function(){
		paymentUtils.materialPayment(materialPaymentCheck, materialPaymentCheckPostData, searcher, hsearcher);
	});

	materialPaymentCheck.items.cashCheckbox = com.focusPage("#cashCheckbox");
	materialPaymentCheck.items.bankCheckbox = com.focusPage("#bankCheckbox");
	materialPaymentCheck.items.checkvCheckbox = com.focusPage("#checkvCheckbox");
	materialPaymentCheck.items.couponCheckbox = com.focusPage("#couponCheckbox");
	materialPaymentCheck.items.advanceCheckbox = com.focusPage("#advanceCheckbox");
	materialPaymentCheck.items.couponType = com.focusPage("#couponType");
	materialPaymentCheck.items.advanceType = com.focusPage("#advanceType");

	materialPaymentCheck.cash = [];
	materialPaymentCheck.bank = [];
	materialPaymentCheck.checkBank = [];
	materialPaymentCheck.accounts = [];
	materialPaymentCheck.couponType = [];

	materialPaymentCheck.cashInfo = {};
	materialPaymentCheck.bankInfo = {};
	materialPaymentCheck.checkBankInfo = {};
	materialPaymentCheck.accountsInfo = {};
	materialPaymentCheck.couponTypeData = {};

	materialPaymentCheck.cashUtil = [];
	materialPaymentCheck.bankUtil = [];
	materialPaymentCheck.checkBankUtil = [];

	materialPaymentCheck.bankUtilForGrade = [];
	materialPaymentCheck.checkBankUtilForGrade = [];

	paymentUtils.getReceiptType(materialPaymentCheck);

	com.focusPage("#baseItemModalMaterialCheck :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show()  : com.focusPage("[referCheckbox="+this.id+"]").hide()
	});
	
	com.post(api.ds.payment, {}, function(res){
		com.focusPage("#advanceType").bindData(res.advanceType, 'key', 'value');

		for(var i=0;i<res.materialPaymentType.length;i++){
			var paymentType = res.materialPaymentType[i];
			materialPaymentCheck.materialPaymentTypeData[paymentType.key] = paymentType.value;
			materialPaymentCheck.materialPaymentRevTypeData[paymentType.value] = paymentType.key;
		}
	}, null, false);

	com.focusPage("#couponType").chosen({width: "216px", multi_type: "input"});

	paymentUtils.dynamicChosen('baseItemModalMaterialCheck',"materialCheckcashInfo",materialPaymentCheck.cashUtil,"key","value");

	com.focusPage("#materialCheckbankAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);

		paymentUtils.addBankUtil(maxNum, "bankDiv", "#materialCheckbankDivGroup", materialPaymentCheck.bankNums, materialPaymentCheck.bankUtilForGrade, materialPaymentCheck.htmlName, 'baseItemModalMaterialCheck');

		return false;
	});

	com.focusPage("#materialCheckcheckvAdd").click(function(){
		var num = $(this).attr("num");
		var nextNum = parseInt(num)+1;
		$(this).attr("num", nextNum);

		var maxNum = $(this).attr("maxnum");
		maxNum = parseInt(maxNum)+1;
		$(this).attr("maxnum", maxNum);
		paymentUtils.addBankUtil(maxNum, "checkvDiv", "#materialCheckcheckvDivGroup", materialPaymentCheck.checkvNums, materialPaymentCheck.checkBankUtilForGrade, materialPaymentCheck.htmlName, 'baseItemModalMaterialCheck');
		return false;
	});

	com.focusPage("#materialPaymentHistoryList").removeClass("active");
	
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
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons').appendTo($h3);
			var $btnUpdateM = $('<a></a>').addClass('btn btn-minier btn-success').html('更新').appendTo($divBtnWrap);

            var propertyArr = [
               ["订单号:", v.material.orderId, "blue"],
               ["主材号:", v.material.no, "blue"],
               ["楼盘地址:", v.material.house.village.name+ '' +v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.material.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
               ["状态:", v.paymentStatus == 1 ? '已付款' : '已确认', "red"],
               ["备注:", v.comment, "grey"]
            ];
            
            var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "mpIds",
				"class": "ace ace-checkbox-2",
				"mpId": v.mpId
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(materialPaymentCheck.materialPaymentTypeData[v.paymentType]);
            
            $.each(propertyArr, function (index,value) {
            var $liProperty = $('<li></li>');
                $('<strong></strong>').html(value[0]).appendTo($liProperty);
                $('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
                $liProperty.appendTo($ulProperty);
            });
            
            var styleArr = [];

			v.cash != null && v.cash != "0" ? styleArr.push(["现金:", v.cash, "blue"]) : true;
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, materialPaymentCheck.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, materialPaymentCheck.checkBankInfo), "blue"]) : true;
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
            
            $label.append($input).append($span).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty).append($ulStyle);

			//更新
			$btnUpdateM.click(function(){
				materialPaymentCheck.typeUpdate = 2;
				var returnMaterialParams = paymentUtils.materialDialogPaymentUpdate(v, materialPaymentCheck);
				materialPaymentCheckPostData.orderId = returnMaterialParams[0];
				materialPaymentCheckPostData.customerId = returnMaterialParams[1];
				materialPaymentCheckPostData.paymentInfo = returnMaterialParams[2];
				materialPaymentCheck.couponUpdate = returnMaterialParams[3];
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
	
	searcher.init(["orderId", "msoNo", "paymentMsoDesigner", "paymentOrderAddr", "collectTimeDateRange"], "condList", api.payment.pageMaterialPaymentForCollect, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialPaymentCheckPostData", null, false, null, function(){
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
            var $h3 = $('<h3></h3>').addClass('oid');
            var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $ulStyle = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
            var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

            var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-info').html('打印');
            var $btnEdit = $('<a></a>').addClass('btn btn-minier btn-yellow').html('编辑');

            var propertyArr = [
               ["订单号:", v.material.orderId, "blue"],
               ["主材号:", v.material.no, "blue"],
               ["楼盘地址:", v.material.house.village.name+ '' +v.material.house.houseNumber, "grey"],
               ["客户:", v.material.customer.name, "grey"],
               ["品牌:", v.material.brand, "grey"],
               ["操作人:", v.creater.currentName, "grey"],
               ["应收金额:", v.referMoney, "blue"],
               ["收款人:", v.collecter.currentName, "grey"],
               ["收款时间:", v.collectTime, "green"],
		       ["确认人:", v.confirmer.currentName, "grey"],
		       ["确认时间:", v.confirmTime, "green"],
               ["状态:", v.paymentStatus == 1 ? '已付款' : '已确认', "red"],
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
			v.bank != null && v.bank != "0" ? styleArr.push(["银行:", paymentUtils.splitBankInfo(v.bank, v.bankInfo, materialPaymentCheck.bankInfo), "blue"]) : true;
			v.checkv != null && v.checkv != "0" ? styleArr.push(["转账:", paymentUtils.splitBankInfo(v.checkv, v.checkvBank, materialPaymentCheck.checkBankInfo), "blue"]) : true;
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
			
			$h3.append($('<small></small>').addClass('blue').html(materialPaymentCheck.materialPaymentTypeData[v.paymentType]));
           
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
	
	hsearcher.init(["orderId", "msoNo", "paymentMsoDesigner", "paymentOrderAddr", "collectTimeDateRange"], "hcondList", api.payment.pageMaterialPaymentForConfirm, function(data){
		hdisplayFunc.init('hresultList', data);
	}, "hpagenation", "hmaterialPaymentCheckPostData", null, false, null, null, "hresultList");


	com.focusPage('a[name="confirms"]', '#pagenation').click(function(){
		var options = {};
		var $inputs = com.focusPage('input[name="mpIds"]:checked');

		$.each($inputs, function(i, v){
			var $input = $(v);
			options["mpIds["+i+"]"] = $input.attr('mpId');
		});

		if($inputs.length == 0){
			com.showAlert(com.warning, "当前未选择要确认的主材款项信息");
			return false;
		}
		
		bootbox.confirm("确定要将符合条件的所有收款项目,置为已确认状态吗?", function(result) {
			if(result) {
				com.post(api.payment.confirmMaterialPayment, options, function(res){
					searcher.doSearch();
					hsearcher.doSearch();
				});
			}
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
		
		com.post(api.payment.pageMaterialPaymentForCollect, $.extend({}, params.materialPaymentCheckPostData, {"paging.noPage": 1}), function(res){
			$.exceler({
				column : [
					["订单号","material.orderId"],
					["主材号","material.no"],
					['楼盘地址',['material.house.village.name', 'material.house.houseNumber']],
					['品牌','material.brand'],
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
					    $info += materialPaymentCheck.bankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
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
							$checkvInfo += materialPaymentCheck.checkBankInfo[_i[0]] + " " + _i[1] + ", " + _i[2] + ", ";
						}

						v.checkvBank = $checkvInfo;
					}else{
						v.checkvBank = v.checkv != null && v.checkv != "0" ? materialPaymentCheck.checkBankInfo[v.checkvBank] : '';
					}
				}
				
				v.installmentBank = v.installment != null && v.installment != "0" ? materialPaymentCheck.bankInfo[v.installmentBank] : '';
				v.accountsBank = v.accounts != null && v.accounts != "0" ? materialPaymentCheck.accountsInfo[v.accountsBank] : '';
				
				v.paymentType = materialPaymentCheck.materialPaymentTypeData[v.paymentType];
				v.paymentStatus = v.paymentStatus == 1 ? '已付款' : '已确认';
			});
		});
    });
	
});
