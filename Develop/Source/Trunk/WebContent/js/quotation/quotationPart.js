var QuotationDetail = (function(){

	var quo = {
		latexCutScales : {},//乳胶漆提点
		orderid : null,
		quotationid : null,
		versionId : null,
		notSalesmanRate : null,
		basicParams : null,
		quoModals : {},
		settingBtns : {},
		quoteCalculation : {},
		initSettingBtns : function(){
			var that = this;
			that.settingBtns = {
				//功能区
				$btnAddDomain : $('#functionAreaTemplateBtn').click(function(){
					that.quoModals.$domainTempletModal.modal("show");
				}),
				//折扣
				$btnDiscount: $('#discountBtn').on(ace.click_event, function(){ // 折扣界面
					that.quoModals.$domainDiscountModal.modal("show");
				}),
				//计算总价
				$btnCalculateTotal: $('#calculateTotalBtn').on(ace.click_event, function(){
					that.quoModals.$calculateTotalModal.modal("show");
				}),
				//统计
				$btnReport : $('#viewStatisticalBtn'),
				//保存
				$btnSave : $('#saveQuotationBtn').on(ace.click_event, function(){ // 保存报价信息
					com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){
						com.showAlert(com.info, "操作成功");
					});
				}),
				//打印
				$btnPrint : $('#printFinanceBtn').attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quo.quotationid + "&type=2&time=" + params.loginTime),
				//返回
				$btnBack : $('#detailBckBtn').on(ace.click_event, function(){
					bootbox.confirm("当前页面存在重要数据,是否进行当前操作?", function(result) {
						if(result){
							com.switchPage(api.index.quotationIndex.url);
						}
					});
				}),
				//展开
				$btnSpread : $('#openFunctionAreasBtn').click(function(){
					$('.icon-chevron-down').parent().trigger('click');
				}),
				//收起
				$btnCollapse : $('#closeFunctionAreasBtn').click(function(){

					$('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
				}),
			};
			return that;
		},
		initQuoModals : function(){
			var that = this;
			that.quoModals = {
				//编辑功能区
				$domainEditModal : $("#functionAreaModal"),
				//添加功能区
				$domainTempletModal : $("#functionAreaTemplateModal").on("show.bs.modal", function(a) {
					$('input[name="quotempl"]:checked').removeAttr('checked');
				}),
				//编辑折扣
				$domainDiscountModal : $("#discountModal"),
				//计算总价
				$calculateTotalModal: $('#calculateTotalFeeModal'),
				//添加默认报价项
				$quoteModal : $("#quotationItemModal").on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//添加自定义报价项
				$quoteAddModal : $("#customFunctionAreaItemsModal").on("show.bs.modal", function(a) {
					$("#itemName").val("");
					$("#quotationItemDes").val("");
					$("#unitPrice").val("");
					$("#num").val("");
					$("#measurementUnit").get(0).selectedIndex = 0;
					$("#workType").get(0).selectedIndex = 0;
					$("#discountFlag").removeAttr("checked");
				}),
				//历史记录
				$historyModal : $("#historyQuotationItemModal").on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//管理费比例设置saveMrBtn
				$manageRateModal : $('#manageRateModal').on("show.bs.modal", function(a) {
					$('#manageRate').val(null);
				}),
			};
			//初始化功能区添加弹层
			com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.versionId" : that.versionId}, function(data){
				data.functionAreas.length && $.each(data.functionAreas, function(i, v){
					if(v.type == 1){
						var $dtempl = painter.createDomainTemplete(v);
						that.quoModals.$domainTempletModal.find('.modal-body').append($dtempl);
					}
				});
			}, null, false);
			//初始化报价项选择弹层
			var extraParams  = {"quotationItem.versionId": quo.versionId};
			var _condArr = ['itemName', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationWorkTypeId'];
			var quotationItemSeacher = new Searcher();
			quotationItemSeacher.init( _condArr, "condList", api.quotation.pageQuotationItemByVersionId,  function(data){
				var $tableWrap = $('#resultList').empty();
				var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

				if(data && data.length){
					$.each(data,function(i, v){
						var $liLine = painter.createQuoteModalItem(v);
						$liLine.appendTo($ul);
					});
					$ul.appendTo($tableWrap);

					if(quote.quotesRecord.length){
						$.each(quote.quotesRecord, function(index, val){
							var $input = $('input[name="modalQuots"][value="'+ $(val).val() +'"]');
							$input.length &&($input.prop('checked',true)) ;
						});
					}
				}
			}, "pagenation", "quotationDetailItemPostData", extraParams);

			//初始化自定义报价项弹层
			com.post(api.common.queryMeasurementUnit, {}, function(res){
				if(res.errorCode == 0){
					$("#measurementUnit").bindData(res.measurementUnits, "name", "name");
				}else{
					bootbox.alert("系统异常");
				}
			}, null, false);
			com.post(api.common.queryWorkType, {} ,function(res){
				if(res.errorCode == 0){
					$("#workType").bindData(res.workTypes, "name", "name");
				}else{
					bootbox.alert("系统异常");
				}
			}, null, false);


			return that;
		},
		//统计车运费管理费总价折扣价
		calculateQuoFees: function(func){
			var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);
			var  _totalfee = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _totallcs = 0;
			var $domains = $('#functionAreaDetailList .widget-box');
			if(!$domains.length){
				return;
			}

			$domains.each(function(){
				var sum, sumd, $dmoney, sumlcs;
				var $this = $(this);
				var _fatype = $this.attr('data-fatype');
				if(_fatype != 0){
					
					if(func){
						func($this);
					}
					
					sum = parseFloat($this.attr('data-totalprice'));
					sumd = parseFloat($this.attr('data-d-totalprice'));
					sumlcs = parseFloat($this.attr('data-latexCutScaleTotalSum'));
					_totalfee = utils.changeThrDecimal(utils.accAdd(_totalfee, sum));
					_dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
					_totallcs = utils.changeThrDecimal(utils.accAdd(_totallcs, sumlcs ? sumlcs : 0));
				}
			});
			
			_manageRate = parseFloat($('#manageCost').find('.discountprice .cell-wrap').text());
			_manageDiscount = $('#manageCost').find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
			_transRate = parseFloat($('#conveyanceCost').find('.unitprice .cell-wrap').text());
			_transDiscount = $('#conveyanceCost').find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
			_transfee =  utils.changeThrDecimal(utils.accMul(utils.accMul(_totalfee, _transRate), _transDiscount));
			_managefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(_totalfee, _transfee), _manageRate), _manageDiscount));
			
			$('#conveyanceCost').find('.num .cell-wrap').text(_transfee);
			$('#manageCost').find('.num .cell-wrap').text(_managefee);
			$('#sumLabSumMoney').text(utils.changeThrDecimal(utils.accAdd( utils.accAdd(_totalfee , _transfee),  _managefee)));
			$('#sumLabDiscountMoney').text(utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee)));

			quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee));//报价总额
			quo.basicParams["quotation.manageRate"] = utils.accSub(_manageRate, quo.notSalesmanRate);
			quo.basicParams["quotation.managePrice"] = _managefee;//管理费
			quo.basicParams["quotation.trafficPrice"] = _transfee;//车运费
			quo.basicParams["quotation.latexCut"] = _totallcs;//乳胶漆提点
		},
		//计算功能区总价和折扣总价
		calculateDomainFees  : function($domain, func){
			var _domanFees = 0;
			var $arr = $('.fl-quo-item', $domain);
			var sum = 0, sumd = 0, latexCutScaleTotalSum = 0;

			if($arr.length){
				$arr.each(function(){
					$this = $(this);
					if(func){
						func($this);
					}
					var _totlaPrice = parseFloat($this.attr("data-totalprice"));
					var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text());
					var _latexCutScaleTotal = parseFloat($this.attr('data-latexCutScaleTotal'));
					sum = utils.changeThrDecimal(utils.accAdd(sum, _totlaPrice));
					sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount));
					latexCutScaleTotalSum = utils.changeThrDecimal(utils.accAdd(latexCutScaleTotalSum, _latexCutScaleTotal ? _latexCutScaleTotal : 0));
				});
				$domain.attr('data-totalprice', sum);
				$domain.attr('data-d-totalprice', sumd);
				$domain.attr('data-latexCutScaleTotalSum', latexCutScaleTotalSum);
				_domanFees = sumd;
			}
			return _domanFees;
		},
		//计算报价项各种值
		calculateQuoteFee : function($quote){
			var _num = parseFloat($quote.find('.num .cell-wrap').text());
			var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
			var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折，0不打折
			var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == 1 ? utils.accDiv(quo.basicParams['quotation.discount'], 10) : 1)));
			var _totalprice,_totalpriced;
			_totalprice = utils.changeThrDecimal(utils.accMul(_num,  _unitprice));
			_totalpriced =  utils.changeThrDecimal(utils.accMul(_num,  _discountprice));
			$quote.find('.discountprice .cell-wrap').text(_discountprice);
			$quote.find('.totalprice-discount .cell-wrap').text(_totalpriced);
			$quote.attr('data-totalprice', _totalprice);
		},
		// 计算报价总金额
		calculateTotalFee: function(discount){
			var  _manageDiscount, _transDiscount, _totalfee = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _total = 0;
			
			var $arr = $('.fl-quo-item');
			var _discount = utils.accDiv(discount, 10);
			
			$arr.length && $arr.each(function(i, v){
				
				var $quote = $(v);
				
				if(['0', '1'].indexOf($quote.find(".cell.type").attr('data-type')) == -1) return true;
				
				var _num = parseFloat($quote.find('.num .cell-wrap').text());
				var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
				var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折，0不打折
				var _discountprice = utils.changeThrDecimal(utils.accMul(_unitprice, (_discountFlag == 1 ? _discount : 1)));
				
				var _totalprice = utils.accMul(_num,  _unitprice);
				var _totalpriced =  utils.accMul(_num,  _discountprice);
				
				_totalfee = utils.accAdd(_totalfee, _totalprice);
				_dtotalfee = utils.accAdd(_dtotalfee, _totalpriced);
				
			});
			
			_manageDiscount = $('#manageCost').find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
			_transDiscount = $('#conveyanceCost').find('.discountprice').attr('data-discount') == "1" ? _discount : 1;
			_manageRate = parseFloat($('#manageCost').find('.discountprice .cell-wrap').text());
			_tranRate = parseFloat($('#conveyanceCost').find('.unitprice .cell-wrap').text());
			_transfee =  utils.changeThrDecimal(utils.accMul(utils.accMul(_totalfee, _tranRate), _transDiscount));
			_managefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(_totalfee, _transfee), _manageRate), _manageDiscount));
			_total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee));
			
			$('#calTrafficPrice').val(_transfee);
			$('#calManagePrice').val(_managefee);
			$('#calTotalPrice').val(_total);
		},
		init : function () {
			this.initQuoModals();
			this.initSettingBtns();
		}
	};

	//功能区
	var domain = {
		nowEditDomain : null,
		//编辑功能区
		editDomain : function($domain){
			this.nowEditDomain = $domain;
			$("#functionAreaName").val($domain.find('.widget-header strong').text());
			//$("#functionAreaIndex").val(dv.functionAreaIndex);
			$("#functionAreaOrder").val($domain.attr('data-dlevel'));

			quo.quoModals.$domainEditModal.modal("show");

			return false;
		},
		//编辑功能区保存按钮点击
		saveDomainEdit : function(){
			var that = this;
			$('#saveFunctionAreaBtn').on(ace.click_event, function(){ // 编辑功能区页面
				
				if(com.validate()){
					return;
				}
				
				var _dname = $("#functionAreaName").val();
				var _dorder = $("#functionAreaOrder").val();

				var _params = $.extend({}, {
					"quotationFunctionArea.functionAreaName" : _dname,//功能区名 ;
					"quotationFunctionArea.functionAreaOrder" : _dorder ,// 排序 ;
					"quotationFunctionArea.qfaId" :  that.nowEditDomain.attr('data-qfaid'), //功能区Id ;
				}, quo.basicParams);

				com.post(api.quotation.updateQuotationFunctionArea, _params, function(res){
					var $dOrder = that.nowEditDomain.find('.widget-header em');
					var $dname = that.nowEditDomain.find('.widget-header strong');
					var $domains = that.nowEditDomain.siblings('.widget-box');
					$dname.html(_dname);
					$dOrder.html(_dorder);
					that.nowEditDomain.attr('data-dlevel',_dorder);
					that.insertDomainByOrder(_dorder, that.nowEditDomain, $domains, true);

					var _index = that.nowEditDomain.index();
					var $dmoney = $('[data-qfaid="'+that.nowEditDomain.attr('data-qfaid') +'"]','#functionAreaSumList');
					$dmoney.find('.order').text(_dorder);
					$dmoney.find('.name').text(_dname);
					$dmoney.remove();
					if(_index != 0) {

						$dmoney.insertAfter($('#functionAreaSumList > div').eq(_index - 1));
					}else{
						$dmoney.insertBefore($('#functionAreaSumList > div').eq(0));
					}

					quo.quoModals.$domainEditModal.modal("hide");
				},null, false);

			});
		},
		//删除功能区
		deletDomain : function($domain){

			bootbox.confirm("确定要删除功能区吗？", function(res){
				if(res){

					$domain.remove();
					$('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').remove();
					quo.calculateQuoFees();

					var _params = $.extend({}, {
						'quotationFunctionArea.qfaId' : $domain.attr('data-qfaid') , //功能区Id
					}, quo.basicParams);

					com.post(api.quotation.deleteQuotationFunctionArea, _params, function(){
					}, null, false);
				}
			});
		},
		calculateTotal: function(){
			$('#calculateTotalFeeBtn').on(ace.click_event, function(){
				if(com.validate()){
					return;
				}
				
				var dis = $("#calDiscount").val();

				if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
					com.showTips($("#calDiscount"), "折扣非法", true);
					return;
				}else{
					com.clearValidator("#calDiscount", true);
				}
				
				quo.calculateTotalFee(dis);
			});
		},
		//保存报价修改
		saveDiscountEdit : function(){
			$('#saveDisCountBtn').on(ace.click_event, function(){ //折扣保存
				
				if(com.validate()){
					return;
				}
				
				var dis = $("#discount").val();

				if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
					com.showTips($("#discount"), "折扣非法", true);
					return;
				}else{
					com.clearValidator("#discount", true);
				}

				if(parseFloat(dis) < config.quotationLimitDiscount){
					bootbox.prompt("折扣审批", function(res){
						
						if(res){
							quo.basicParams['quotation.discount'] = config.quotationLimitDiscount;
							var options = {
								"approval.comment": res,
								"approvalQuotationDiscount.orderId": quo.orderid,
								"approvalQuotationDiscount.quotationId": quo.quotationid,
								"approvalQuotationDiscount.newDiscount": dis,
							}

							com.post(api.approval.submitApprovalForQuotationDiscount, options, function(res){
								com.showAlert(com.info, "折扣申请成功.");
							});
						}
					});
				}else{
					quo.basicParams['quotation.discount'] =  Math.round(parseFloat(dis) * 100) / 100;
					$('#sumLabDiscount').text(quo.basicParams['quotation.discount']);
				}

				quo.calculateQuoFees(function($domain){
					var dfee = quo.calculateDomainFees($domain, function($quote){
						quo.calculateQuoteFee($quote);
					});
					$('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(dfee);
				});

				com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){
					quo.quoModals.$domainDiscountModal.modal("hide");
				}, function(res){

				});
			});
		},
		//保存功能区修改
		saveDomainTemplete : function(){
			var that = this;
			$('#addFunctionAreasBtn').click(function(){
				
				var $darr = $('input[name="quotempl"]:checked');
				var _param = $.extend({}, quo.basicParams);
				var $aimDomains = $('.widget-box', '#functionAreaDetailList');
				if(!$darr.length){
					return;
				};
				
				$.each($darr, function(i, v){
					_param['functionAreaIds[' + i + ']'] = $(v).val();
				});

				com.post(api.quotation.addQuotationFuctionAreaByFunctionAreaIds, _param, function(data){
					data.quotationFunctionAreas.length && $.each(data.quotationFunctionAreas, function(i, v){
						var sum = 0, sumd = 0, $dmoney;
						var $domain = painter.createdomain(v);
						that.insertDomainByOrder(v.functionAreaOrder, $domain, $aimDomains, false);

						sum = parseFloat($domain.attr('data-totalprice'));
						sumd = parseFloat($domain.attr('data-d-totalprice'));

						var _index = $domain.index();
						$dmoney = painter.createDomainMoney(sumd, v);
						if(_index == 0){
							$dmoney.appendTo($('#functionAreaSumList'));
						}else{
							$dmoney.insertAfter($('#functionAreaSumList > div').eq(_index - 1));
						}

						quo.calculateQuoFees();
					});
				}, null, false);
				
				quo.quoModals.$domainTempletModal.modal("hide");
			});
		},
		/*
		* 将功能区添加到功能区列表中
		* 参数:
		* 	order ：功能区排序
		* 	$domain ：功能区
		* 	$aimDomains ： 参与排序的其他功能区（不包含当前要插入的功能区）
		* 	existed ： 是否已存在功能区列表中
		* */
		insertDomainByOrder : function(order, $domain, $aimDomains, existed){
			var that = this;
			var maxflag = true;

			if(!$aimDomains.length && existed){
				return;
			}

			if($aimDomains.length){
				$aimDomains.each(function(i){
					var _order = parseInt($(this).attr('data-dlevel'));
					if(_order >  parseInt(order) || !_order){
						$domain.insertBefore($(this));
						maxflag = false;
						return false;
					}
				});
			}

			maxflag && $domain.appendTo($('#functionAreaDetailList'));
			quo.quoModals.$domainEditModal.modal("hide");
		},
		//保存默认报价项
		saveQuotesToDomain : function(){
			$('#addFunctionAreaItemsBtn').click(function(){
				quote.addDefaultQuotes();
				quo.quoModals.$quoteModal.modal("hide");
			});
		},

		//管理费比例弹窗保存按钮 saveMrBtn
		saveManageRate : function(){
			$('#saveMrBtn').click(function(){
				if(com.validate()){
					return;
				}
				
				var _manageId = $('#manageCost').attr('qfaiId');
				var _manageRate = parseFloat($('#manageRate').val());
				var mgrate = utils.accAdd(_manageRate, quo.notSalesmanRate);
				
				$('#manageCost').find('.unitprice').text(mgrate);

				$('#manageCost').find('.discountprice .cell-wrap').text(mgrate);
				$('#manageCost').find('.totalprice-discount .cell-wrap').text(mgrate);
				
				quo.calculateQuoFees();
				quo.quoModals.$manageRateModal.modal("hide");

				com.post(api.quotation.updateQuotationFunctionAreaItemForSpec, {"quotationFunctionAreaItem.qfaiId": _manageId, "quotationFunctionAreaItem.unitPrice": _manageRate}, function(res){}, null, false);
				com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){}, null, false);
			});
		},

		//绑定各种关于报价的操作
		init: function(){
			this.saveDomainEdit();
			this.calculateTotal();
			this.saveDiscountEdit();
			this.saveDomainTemplete();
			this.saveQuotesToDomain();
			this.saveManageRate();
		},

	};
	//报价
	var quote = {
		quotesRecord  : [],
		$nowLine : null,
		$nowEditInput : null,
		//排序报价项
		sortQuote : function($domain){
			var $arr = $('.fl-quo-item', $domain);
			if(!$arr){
				return
			}
			$arr.each(function(){
				$this = $(this);
				$this.find('.line .cell-wrap').text($this.index() + 1);
			});
		},
		getNumCellFocus : function($line){
			
			var that = this;
			var $numCell = $line.find('.cell.num');
			var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');
			domain.nowEditDomain = $line.parents('.widget-box');
			
			$('.fl-quo-item.current').removeClass('current');
			$line.addClass('current');
			$editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();
			that.$nowLine = $line;
			that.$nowEditInput = $editInput;
			that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
				var $input = $(this);
				that.bindInputKeydown($input.val(), e);
			})
		},
		bindInputKeydown : function(num, e){
			var that = this;
			var $line = null;
			if(e.keyCode == 13){
				
				if(!/^[0-9]+(\.[0-9]{1,3})?$/.test(num)){
					that.hideInputWrap();
					return;
				}
				
				that.$nowLine.find('.cell.num .cell-wrap').text(num);
				$line = that.$nowLine.next('.fl-quo-item');
				var _type = that.$nowLine.find('.type').attr('data-type');
				
				var args = {
                    "quotationFunctionAreaItem.discount" : that.$nowLine.find('.discountprice').attr('data-discount'),// , 报价项Id , 可空 ;
					"quotationFunctionAreaItem.qfaiId" : that.$nowLine.find('input[name="deleteItems"]').val(),// , 报价项Id , 可空 ;
					"quotationFunctionAreaItem.itemName" : that.$nowLine.find('.name .cell-wrap').text(),// 报价项名
					"quotationFunctionAreaItem.measurementUnit" : that.$nowLine.find('.unit .cell-wrap').text(),// , 单位 ;
					"quotationFunctionAreaItem.workType" : that.$nowLine.find('.worktype .cell-wrap').text(),//工种 workTypeId : $("#workType").val(),

					"quotationFunctionAreaItem.unitPrice" :  that.$nowLine.find('.unitprice .cell-wrap').text(),// 单价 ;
					"quotationFunctionAreaItem.num" : that.$nowLine.find('.num .cell-wrap').text() ,//, 工程量 ;
					"quotationFunctionAreaItem.type" : _type,// , 类型 , 自定义为1 , 普通报价项为0 ;
					"quotationFunctionAreaItem.quotationFunctionAreaId" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
				};

				if(_type == 0){
					args["quotationFunctionAreaItem.quotationItemId"] = that.$nowLine.find('input[name="deleteItems"]').attr('data-qiid');// , 报价项Id , 普通类型报价项需要传递 "data-qiid"
				}
				if(_type == 1){
					args["quotationFunctionAreaItem.content"] = that.$nowLine.prop('title');// , 报价项说明 , 自定义类型报价项需要传递 ;
				}

				that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());

				var _price = parseFloat(that.$nowLine.find('.unitprice .cell-wrap').text());
				var _dprice = parseFloat(that.$nowLine.find('.discountprice .cell-wrap').text());
				var _num = parseFloat(that.$nowLine.find('.num .cell-wrap').text());
				var _latexCutScale = parseFloat(that.$nowLine.attr('data-latexCutScale'));


				that.$nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(_dprice, _num)));
				that.$nowLine.attr('data-totalprice', utils.changeThrDecimal(utils.accMul(_price ,  _num)));
				_latexCutScale && that.$nowLine.attr('data-latexCutScaleTotal', utils.accMul(_latexCutScale ,  _num));
				var _fee = quo.calculateDomainFees(domain.nowEditDomain);
				$('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				quo.calculateQuoFees();

				com.clearValidator();
				
				var _params = $.extend({}, args, quo.basicParams);
				com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res){
					that.$nowLine.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);
				}, null, false);
				if($line.length){
					that.getNumCellFocus($line);
				}else{
					that.hideInputWrap();
				}
				return;
			}

			if(e.keyCode == 38){
				$line = that.$nowLine.prev('.fl-quo-item');
				if($line.length){
					that.getNumCellFocus($line);
				}else{
					that.hideInputWrap();
				}
				return;
			}

			if(e.keyCode == 40 ){
				$line = that.$nowLine.next('.fl-quo-item');
				if($line.length){
					that.getNumCellFocus($line);
				}else{
					that.hideInputWrap();
				}
				return;
			}
		},
		hideInputWrap : function(){
			if(!this.$nowEditInput){
				return;
			}
			this.$nowEditInput.addClass('hide');
			this.$nowEditInput = null;
		},
		//批量删除报价项
		deleteQuoteInBatches : function($domain){
			$domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list'));
			var that = this;
			// , 参数 : qfaiIds[n] , 报价项Id列表 ;
			var $quos = $('[name="deleteItems"]:checked', $domain);
			var $q1 = [], $q2 = [];
			var _params  = {};
			if(!$quos.length){
				return;
			};

			$quos.length && $.each($quos, function(i, v){
				if($(v).val()){
					_params['qfaiIds[' + $q1.length + ']'] = $(v).val();
					$q1[$q1.length] = v;
				}else{
					$q2[$q2.length] = v;
				}
			});

			$q2.length && $.each($q2, function(i, v){
				$(v).parents('li.fl-quo-item').remove();
			});

			if($q1.length){
				$.each($q1, function(i, v){
					$(v).parents('li.fl-quo-item').remove();
				});
				var _fee = quo.calculateDomainFees(domain.nowEditDomain);
				$('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				quo.calculateQuoFees();
				_params = $.extend({},_params, quo.basicParams);
				com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res){

				}, null, false);
			}

			that.sortQuote($domain);
		},
		//删除报价项
		deleteQuote : function($quote){
			var that = this;
			var _qid = $quote.find('input[type="checkbox"]').val();
			var _params = {};
			domain.nowEditDomain = $quote.parents('.widget-box');
			domain.nowEditDomain.find('.fl-quo-input').insertAfter(domain.nowEditDomain.find('.fl-quo-list')).addClass('hide');
			if(!_qid){
				$quote.remove();
			}else{
				$quote.remove();
				var _fee = quo.calculateDomainFees(domain.nowEditDomain);
				$('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				quo.calculateQuoFees();
				_params = $.extend({}, quo.basicParams);
				_params["qfaiIds[0]"] = _qid;
				com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res){

				}, null, false);
			}

			that.sortQuote($quote.parents('.widget-box'));
		},
		//添加自定义报价项
		saveCustomQuotesAdd : function(){
			$("#saveCustomFunctionAreaItemBtn").on(ace.click_event, function(event){
				
				if(com.validate()){
					return;
				}

				var addRow = {
					discount : $("#discountFlag").prop("checked") ? 1 : 0,
					num : $("#num").val(),
					itemName : $("#itemName").val(),
					measurementUnit : $("#measurementUnit").val(),
					unitPrice : $("#unitPrice").val(),
					content : $("#quotationItemDes").val(),
					type : 1,
					workType : $('#workType').val()
				};

				var args = {
                    "quotationFunctionAreaItem.discount" : addRow.discount,// 是否打折
					"quotationFunctionAreaItem.itemName" : addRow.itemName,// 报价项名
					"quotationFunctionAreaItem.measurementUnit" : addRow.measurementUnit,// , 单位 ;
					"quotationFunctionAreaItem.workType" : $('#workType').val(),//工种 workTypeId : $("#workType").val(),
					"quotationFunctionAreaItem.content" : addRow.content,// , 报价项说明 , 自定义类型报价项需要传递 ;
					"quotationFunctionAreaItem.unitPrice" :  addRow.unitPrice,// 单价 ;
					"quotationFunctionAreaItem.num" : addRow.num ,//, 工程量 ;
					"quotationFunctionAreaItem.type" : addRow.type,// , 类型 , 自定义为1 , 普通报价项为0 ;
					"quotationFunctionAreaItem.quotationFunctionAreaId" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
				};

				var _index = domain.nowEditDomain.find('.fl-quo-item').length;
				var $item, $historyItem;
				var _fee = 0;

				$item = painter.createQuote(_index + 1,addRow);
				$item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
				$historyItem = painter.createQuoteModalItem({
					"itemName" : addRow.itemName,
					"unitPrice" : addRow.unitPrice,
//					"measurementUnit" : addRow.measurementUnit,
					"quotationItemDes" : addRow.content,
					"workType" : $('#workType').val(),
					"discount" : addRow.discount,
				});
				quote.recordHistoryQuotes($historyItem);
				_fee = quo.calculateDomainFees(domain.nowEditDomain);
				$('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				quo.calculateQuoFees();
				var _params = $.extend({}, args, quo.basicParams);
				
				com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res){
					$item.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);

				}, null, false);

				quo.quoModals.$quoteAddModal.modal("hide");
				return false;
			});
		},
		/*添加报价项的时候记住上一页选中的报价项
		* 参数
		* $input ：正在操作的input标签
		* ischecked : 选举中或取消选中
		* */
		recordQuots : function($input, ischecked){
			var that = this;
			if(ischecked){
				that.quotesRecord[that.quotesRecord.length] = $input;//据说这样比push快
			}else{
				that.quotesRecord = $.map(that.quotesRecord, function(v){
					return v.val() != $input.val() ? v : null;
				});
			};
		},
        //点击页面其他位置时清除表格行的选中样式
		clearQuoteSelected : function(){
			var that = this;
			$('body').click( function(e){
				if(!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')){
					that.hideInputWrap();
				}
			});
		},
		addHistoryQuotes : function(){
			$('#addHistoryItemsBtn').on(ace.click_event, function(event){
				quote.addDefaultQuotes();
				quo.quoModals.$historyModal.modal("hide");
			});
		},
		//记录历史数据
		recordHistoryQuotes : function($historyQuo){
			var addflag = true;
			var $quos = $('[type="checkbox"]', '#historyQuotationItemDiv');
			if($quos.length){
				$.each($quos, function(i, v){
					
					if($(v).val() == $historyQuo.find('[type="checkbox"]').val()){
						addflag = false;
						return false;
					};
				});
			}

			addflag && $historyQuo.appendTo('#historyQuotationItemDiv > ul.fl-table-list');
		},
		addDefaultQuotes : function(){
			var _arrs = quote.quotesRecord;
			var _index = domain.nowEditDomain.find('.fl-quo-item').length;
			if(!_arrs.length){
				return;
			}

			$.each(_arrs, function(i, v){
				var $this = $(v);
				if($this.val() && $('input[data-qiid="' + $this.val() +'"]', domain.nowEditDomain).length){
					return;
				}
				
				var _quotval = {
					"discount" : $this.attr('data-discount'),
					"content" : $this.attr('data-des'),
					"itemName" : $this.attr('data-itemName'),
					"measurementUnit" : $this.attr('data-itemUnite'),
					"num" : 0,
					"qfaiId" : "",
					"quotationFunctionAreaId" : "",
					"quotationItemId" : $this.val(),
					"type" : $this.val() ? "0" : "1",
					"unitPrice" : $this.attr('data-itemPrice'),
					"workType" : $this.attr('data-workType')
				};

				var $item = painter.createQuote( _index + i + 1, _quotval);
				$item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
				var $historyItem = $this.parents('li.item-blue').clone(true);
				quote.recordHistoryQuotes($historyItem);
			});
			quote.quotesRecord = [];
		},
		init : function(){
			this.saveCustomQuotesAdd();
			this.clearQuoteSelected();
			this.addHistoryQuotes();
		}
	};

	var painter = {
        //创建功能区
		createdomain : function(dv){
			var that = this;
			var $domain,
				$dhead, $dname, $dtoolbar, $btns = {},
				$dbody, $dbodyInner, $list, $input;

			var _btnSet = {
				"$btnEdit" : ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', dv.type == 1],
				"$btnAdd" : ["添加报价项", '<i class="bigger-125 icon-plus purple"></i>', dv.type == 1],
				"$btnSet" : ["自定义报价项", '<i class="bigger-125 icon-plus-sign purple"></i>', dv.type == 1],
				"$btnHistory" : ["历史报价项", '<i class="bigger-125 icon-star green"></i>', dv.type == 1],
				"$btnDelQuo" : ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>', dv.type == 1],
				"$btnDelDomain" : ["删除功能区", '<i class="bigger-125 icon-trash red"></i>', dv.type == 1],
				"$btnFold" : ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
			};

			var sum = 0, //功能区总价(折前)
				sumd = 0,//功能区总价(折后)
				sumlcs = 0;

			$domain = $('<div></div>').addClass('widget-box transparent').attr({
				"data-dlevel" : dv.functionAreaOrder,
				"data-qfaId" : dv.qfaId,
				"data-fatype" : dv.type
			}).css({"margin-bottom" : "20px"});

			$dhead = $('<div></div>').addClass('widget-header');
			$dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.functionAreaName));
			$dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

			$.each(_btnSet, function(k, v){
				if(!v[2]){
					return;
				}
				$btns[k] = $('<a></a>').attr({
					"href" : "javascript:void(0)",
					"data-rel" : "tooltip",
					//"data-placement" : "bottom",
					"data-original-title" : v[0]
				}).addClass('tooltip-info').css({"padding-left": "5px","text-decoration" : "none"}).append(v[1]).appendTo($dtoolbar).tooltip();
			});

			$btns["$btnFold"].attr({"data-action" : "collapse"});

			$dbody = $('<div></div>').addClass('widget-body');
			$dbodyInner = $('<div></div>').addClass('widget-body-inner');
			$list = $('<ul></ul>').addClass('fl-quo-list');
			$input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float'));

			$dhead.append($dname).append($dtoolbar);

			$dbodyInner.append($list).append($input).appendTo($dbody);

			$domain.append($dhead).append($dbody);
			
			if(dv.quotationFunctionAreaItems.length){
				
				var _items = dv.quotationFunctionAreaItems;
				
				_items = _items.sort(function(a, b){ // 按照报价版本中的主键顺序排序
					if(a.quotationItemId == null || b.quotationItemId == null){
						return b.quotationItemId - a.quotationItemId;
					}else{
						return a.quotationItemId - b.quotationItemId;
					}
				});
				
				$.each(_items, function(i,v){
					var $item = that.createQuote( i + 1, v );
					$item.appendTo($list);
					sumd = utils.changeThrDecimal(utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text())));
					if(!isNaN($item.attr('data-totalprice'))){
						sum = utils.changeThrDecimal(utils.accAdd(sum, parseFloat($item.attr('data-totalprice'))));
					}
					sumlcs = utils.changeThrDecimal(utils.accAdd(sumlcs, parseFloat($item.attr('data-latexcutscaletotal') ? $item.attr('data-latexcutscaletotal') : 0)));
				});
			}

			if(dv.type == 1){
				//各种绑定事件

				$btns.$btnEdit.click(function(){//编辑功能区
					domain.editDomain($domain);
				});
				$btns.$btnAdd.click(function(){//添加报价项
					domain.nowEditDomain = $domain;
					quo.quoModals.$quoteModal.modal("show");
					$('#addItemFunctionAreaIndex').val(dv.qfaId);
				});
				$btns.$btnSet.click(function(){//自定义报价项
					domain.nowEditDomain = $domain;
					quo.quoModals.$quoteAddModal.modal("show");
				});
				$btns.$btnHistory.click(function(){//历史报价项
					domain.nowEditDomain = $domain;
					quo.quoModals.$historyModal.modal("show");
				});
				$btns.$btnDelQuo.click(function(){//批量删除报价项
					quote.deleteQuoteInBatches($domain);
				});
				$btns.$btnDelDomain.click(function(){//删除功能区
					domain.deletDomain($domain);
				});
			}

			$domain.attr('data-d-totalprice', sumd);
			$domain.attr('data-totalprice', sum);
			$domain.attr('data-latexCutScaleTotalSum', sumlcs);

			return $domain;
		},
		//创建报价项
		createQuote : function(linenum, qv){
			var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);

			var _dcp ;
			if(qv.type < 2){
				_dcp = utils.accMul(qv.unitPrice, (qv.discount == 1 ? utils.accDiv(quo.basicParams['quotation.discount'], 10) : 1));//折后单价1打折，0不打折
				_dcp = utils.changeThrDecimal(_dcp);
			}
			
			if(qv.type == 2){
				_dcp =  qv.unitPrice;
			}
			
			if(qv.type == 3){
				_dcp = qv.unitPrice + quo.notSalesmanRate;
			}

			var _lineSet = [
				["line", linenum],
				["num", qv.num],
				["name", qv.itemName],
				["type", qv.type== 0 ? "普通" : qv.type== 1 ? "自定义" : "-", ["data-type", qv.type]],
				["unit", qv.measurementUnit],
				["worktype", qv.workType],
				["price unitprice", qv.type == 3 ? _dcp : qv.unitPrice],
				["price discountprice", _dcp, ["data-discount", qv.discount]],
				["price totalprice-discount",  qv.type < 2 ? utils.changeThrDecimal(utils.accMul(qv.num ,  _dcp)) : _dcp],
			];

			var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel, $btnInfo, $btnset;

			//qv.discount
			$.each(_lineSet, function(i, v){
				var $cell = $('<div></div>').addClass('cell ' + v[0]);
				var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
				if(v[2]){
					$cell.attr(v[2][0], v[2][1]);
				}
				$cell.append($cellWrap).appendTo($item);
			});

			if(qv.type < 2){
				$btnCell = $('<div></div>').addClass('cell btns');
				$btnCellWrap = $('<div></div>').addClass('cell-wrap');
				$inputLable = $('<label></label>');
				$input = $('<input>').addClass('cbox ace').attr({
					"type" : "checkbox",
					"role" : "checkbox",
					"name" : "deleteItems",
					"data-qiid" : qv.quotationItemId ? qv.quotationItemId : ""
				}).val(qv.qfaiId);
				$ispan = $('<span></span>').addClass('lbl align-top');

				$inputLable.append($input).append($ispan);
				$btnCellWrap.append($inputLable).appendTo($btnCell);
				$item.append($btnCell);

				$btnDel = $('<a></a>').attr({
					"data-rel" : "tooltip",
					"href" : "javascript:void(0)",
					"data-original-title" : "删除报价项"
				}).css({"padding-left" : "5px","text-decoration" : "none"})
					.append('<i class="bigger-125 icon-remove pink"></i>')
					.tooltip();
				$btnInfo = $('<a></a>').attr({
					"data-rel" : "tooltip",
					"href" : "javascript:void(0)",
					"data-original-title" : "报价信息"
				}).css({"padding-left" : "5px","text-decoration" : "none"})
					.append('<i class="bigger-125 icon-search"></i>')
					.tooltip();
				$btnCellWrap.append($btnDel).append($btnInfo);

				//各种绑定事件
				$item.click(function(){//编辑数量
					quote.getNumCellFocus($item);
				});
				//删除报价项
				$btnDel.click(function(e){
					e.stopPropagation();
					quote.deleteQuote($item);
				});
				//查看
				$btnInfo.click(function(e){
					e.stopPropagation();
					qv.content && com.showInfo(qv.content);
				});
			}else{
				if(qv.type == 2){ // 车运费
					$item.attr('id', 'conveyanceCost');
					$btnCell = $('<div></div>').addClass('cell btns');
					$btnCellWrap = $('<div></div>').addClass('cell-wrap');
					$btnset = $('<a></a>').css('visibility', 'hidden').css('text-decoration',  'none').append('<i class="bigger-125 icon-cog purple"></i>');
					$btnCellWrap.append($btnset).appendTo($btnCell);
					$item.append($btnCell);
				}
				if(qv.type == 3){
					$item.attr('id', 'manageCost').attr('qfaiId', qv.qfaiId);//管理费
					$btnCell = $('<div></div>').addClass('cell btns');
					$btnCellWrap = $('<div></div>').addClass('cell-wrap');
					$btnset = $('<a></a>').attr('data-rel', 'tooltip').attr('href', 'javascript:void(0)').attr('data-original-title', '管理费设置').css('text-decoration',  'none').append('<i class="bigger-125 icon-cog purple"></i>');
					$btnCellWrap.append($btnset).appendTo($btnCell);
					$item.append($btnCell);

					$btnset.click(function(){
						$('#manageRateModal').modal('show');
					});
				}
			}

			$item.attr('data-totalprice', qv.type < 2 ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)) : "-");

			//计算乳胶漆提点
			if(qv.type < 2){
				var latexCutScale = 0;
				qv.quotationItemId && quo.latexCutScales[qv.quotationItemId] && (latexCutScale = quo.latexCutScales[qv.quotationItemId]);
				var calculate = utils.accMul(qv.num ,  latexCutScale);
				$item.attr('data-latexCutScaleTotal', calculate);

				latexCutScale && $item.attr('data-latexCutScale', latexCutScale);
			}

			return $item;
		},

		//创建添加功能区中的功能区
		createDomainTemplete : function(v){
			var $label = $('<label></label>').addClass('col-xs-6');
			var $radio = $('<input>').addClass('ace').attr({"name" : "quotempl", "type" : "checkbox"}).val(v.faId);
			var $span = $('<span></span>').addClass('lbl').text(v.functionAreaName);
			$label.append($radio).append($span);
			return $label;
		},
		//创建添加报价项天窗中的报价项

		createQuoteModalItem : function (v) {
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "modalQuots",
				"class": "ace ace-checkbox-2",
				"data-quotationClassification": v.quotationClassification,
				"data-itemName": v.itemName,
				"data-itemPrice": v.unitPrice,
				"data-itemUnite": v.measurementUnit,
				"data-des": v.quotationItemDes,
				"data-workType": v.workType ? v.workType : "-",
				"data-discount": v.discount
			}).val(v.qiId);
			
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.itemName);
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var propertyArr = [
				["类型:", v.quotationType, "grey"],
				["分类:", v.quotationClassification, "grey"],
				["大类:", v.quotationBigCategory, "grey"],
				["小类:", v.quotationSmallCategory, "grey"],
				["单位:", v.measurementUnit, "grey"],
				["工种:", v.workType, "grey"],
				["单价:", v.unitPrice, "grey"],
				["打折:", v.discount == 0 ? '否' : '是', "red"],
				["版本:", v.version, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$label.append($input).append($span).appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			$input.change(function(){
				var $this = $(this);
				quote.recordQuots($this, $(this).is(':checked'));
			});

			return $liLine;
		},
		//创建左侧功能区金额统计标签
		createDomainMoney : function (sum, v) {
			var $item = $('<div></div>').addClass('col-md-12');
			var $dwrap = $('<label></label>').addClass('col-md-6 no-padding-right');
			var $dorder =$('<span class="order"></span>').text(v.functionAreaOrder);
			var $dname = $('<span class="name"></span>').text(v.functionAreaName);
			var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(sum);
			
			$dwrap.append($dorder).append("  ").append($dname);
			$item.attr("data-qfaId" , v.qfaId ).append($dwrap).append($dsum);
			
			return $item;
		}
	};

	return {
		init : function(){
			quo.orderid = params.orderId;
			quo.quotationid = params.quotationId;

			//管理费选择弹层初始化
			com.post(api.quotation.queryQuotationForConfig, {}, function(res){
				$('#manageRate').bindData(res.configs.manageRates);

				if(res.configs.latexCutScales && res.configs.latexCutScales.length){
					$.each(res.configs.latexCutScales, function(i, v){
						var _arr = v.split(':');
						quo.latexCutScales[_arr[0] + ''] = _arr[1];
					});
				}
			});
			
			com.post(api.quotation.queryQuotationById, {"quotation.qid" : quo.quotationid}, function(data){
				$('#quotationName').text(data.quotation.quotationName);
				quo.basicParams = {
					"quotation.qid" : data.quotation.qid,//报价Id
					"quotation.discount" : data.quotation.discount,//报价折扣
					"quotation.totalPrice" : data.quotation.totalPrice,//报价总额
					"quotation.latexCut" : data.quotation.latexCut,//乳胶漆提成
					"quotation.manageRate" : data.quotation.manageRate,//管理费比例
					"quotation.managePrice" : data.quotation.managePrice,//管理费
					"quotation.trafficPrice" : data.quotation.trafficPrice,//车运费
				};
				quo.versionId = data.quotation.versionId;
				quo.notSalesmanRate = data.quotation.notSalesmanRate;
				$('#sumLabDiscount').text(data.quotation.discount);
			},null, false);
			
			com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid" : quo.quotationid}, function(data){
				var _totalfee = 0,  _dtotalfee = 0, _transfee = 0, _managefee = 0, _totallcs = 0;
				if(data.quotationFunctionAreas.length){

					$.each(data.quotationFunctionAreas, function(i, v){
						var sum, sumd, $dmoney, sumlcs;
						var $domain = painter.createdomain(v);
						$domain.appendTo($('#functionAreaDetailList'));
						if(v.type == 1){
							sum = parseFloat($domain.attr('data-totalprice'));
							sumd = parseFloat($domain.attr('data-d-totalprice'));
							sumlcs = parseFloat($domain.attr('data-latexCutScaleTotalSum'));
							$dmoney = painter.createDomainMoney(sumd, v);
							$dmoney.appendTo($('#functionAreaSumList'));
							
							_totalfee = utils.changeThrDecimal(utils.accAdd(_totalfee, sum));
							_dtotalfee = utils.changeThrDecimal(utils.accAdd(_dtotalfee, sumd));
							_totallcs = utils.changeThrDecimal(utils.accAdd(_totallcs, sumlcs ? sumlcs : 0));
						}
					});
					
//					_transfee =  utils.changeThrDecimal(utils.accMul(_totalfee, parseFloat($('#conveyanceCost').find('.unitprice .cell-wrap').text())));
//					_managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(_totalfee, _transfee), parseFloat($('#manageCost').find('.discountprice .cell-wrap').text())));
					
					_transfee =  parseFloat(quo.basicParams["quotation.trafficPrice"]);
					_managefee = parseFloat(quo.basicParams["quotation.managePrice"]);

					$('#conveyanceCost').find('.num .cell-wrap').text(_transfee);
					$('#manageCost').find('.num .cell-wrap').text(_managefee);
					
					$('#sumLabSumMoney').text(utils.changeThrDecimal(utils.accAdd( utils.accAdd(_totalfee , _transfee),  _managefee)));
					$('#sumLabDiscountMoney').text( utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee)));

					quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal( utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee));//报价总额
					quo.basicParams["quotation.managePrice"] = _managefee;//管理费
					quo.basicParams["quotation.trafficPrice"] = _transfee;//车运费
					quo.basicParams["quotation.latexCut"] = _totallcs;//车运费
				}

			}, null, false);

			quo.init();
			domain.init();
			quote.init();
		}
	};

})();

$(function(){
	QuotationDetail.init();
});
