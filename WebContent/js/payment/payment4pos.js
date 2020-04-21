jQuery(function($) {
	var payment = {
		saveBtn: com.focusPage("#collectBtn"),
		cancelBtn: com.focusPage("#cancelBtn"),
		createBtn: com.focusPage("#createBtn"),
		items: {
			bankCheckbox: com.focusPage("#bankCheckbox"),
			paymentTypeSel: com.focusPage("#paymentTypeSel"),
			des: com.focusPage("#des")
		},
		paymentTypes: null,
		temp: [],
		typeData: [],
		paymentTypeData: [],
		statusData: [],
		decorationType: [],
		htmlName: "paymentPos",
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
		paymentUtils.paymentSaveData(payment, searcher);
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
		com.focusPage("#paymentPosposDivGroup").html("");
		com.focusPage("#paymentPosbankDivGroup").html("");
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
		payment.decorationType = res.type;
	}, null, false);
	
	com.focusPage("#paymentModal :checkbox").on("change", function(){
		$(this).prop("checked") ? com.focusPage("[referCheckbox="+this.id+"]").show() : com.focusPage("[referCheckbox="+this.id+"]").hide();
		if($(this).prop("checked") && this.id == "bankCheckbox"){
			com.focusPage("#paymentPosbankDivGroup").html("");
			paymentUtils.addBankPosUtil("#paymentPosbankDivGroup", payment.bankUtilForGrade, payment);
		}
	});
	
	//切换合同和主材预付款
	com.focusPage("#paymentTypeSel").on("change", function(){
		payment.bankUtilForGrade = [];
		com.focusPage("#paymentPosbankDivGroup").html("");

		var currentGrade = com.focusPage("#paymentModal").attr("grade");
		getReceiptTypeForGrade(com.focusPage("#paymentTypeSel").val(), currentGrade);

		paymentUtils.addBankPosUtil("#paymentPosbankDivGroup", payment.bankUtilForGrade, payment);
	});

	//info信息是分页显示信息的, util是下拉框信息
	paymentUtils.getReceiptType(payment);
	
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
           
            $divBtnWrap.append($btnCollect).appendTo($h3);
           
            $liLine.append($h3).append($ulProperty);

            $btnCollect.click(function(){
            	v.decoration.paymentType="收款";
				payment.typeUpdate = 1;
				com.focusPage("#paymentModal").attr("grade", v.decoration.grade);
            	showPaymentModal(v.decoration);
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
	
	searcher.init(["orderId"], "condList", api.payment.pageAdvancePayment, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "paymentPosPostData", null, false, null, function(){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-yellow pull-left').attr('name', 'createPayment').css("margin", "0px 3px");
		var $addspan = $('<span></span>').text('创建预付款').appendTo($adda);

		return [$adda];
	});

	//创建预付款
	com.focusPage('a[name="createPayment"]', '#pagenation').click(function(){
		com.focusPage("#decorationOrderId").val("");
		payment.modals.createModal.modal("show");
	});

	function showPaymentModal(v,res){
		com.focusPage("#paymentTypeSel").removeAttr("disabled");
		com.focusPage("#des").removeAttr("disabled");

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
				res.pointofsaleses.length > 0 ? paymentUtils.addBankPosUtil("#paymentPosbankDivGroup", payment.bankUtilForGrade, payment) : "";
			});
		}

		params.orderId = v.orderId;
		
		com.cleanItems(payment.items);
		payment.modals.modal.modal("show");
		
		com.focusPage("#paymentTypeDiv").css("display", "inline");
		
		payment.temp = v;
	}

	function getReceiptTypeForGrade(paymentType, decorationGrade){
		var gradeParam;

		if(decorationGrade == "allGrade"){
			payment.bankUtilForGrade = payment.bankUtil;
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
		}
	}
});
