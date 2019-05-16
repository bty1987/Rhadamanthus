var QuotationDetail = (function(){
	var orderId = params.orderId;
	var loginTime = params.loginTime;
	var quo = {
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
				$btnAddDomain : com.focusPage('#functionAreaTemplateBtn').click(function(){
					that.quoModals.$domainTempletModal.modal("show");
				}),

				//计算总价  todo
				$btnCalculateTotal: com.focusPage('#calculateTotalBtn').on(ace.click_event, function(){
				}),
				//统计
				$btnReport : com.focusPage('#viewStatisticalBtn'),
				//保存
				$btnSave : com.focusPage('#saveQuotationBtn').on(ace.click_event, function(){ // 保存报价信息
					com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){
						com.showAlert(com.info, "操作成功");
					});
				}),
				//打印
				//$btnPrint : com.focusPage('#printFinanceBtn').attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quo.quotationid + "&type=2&time=" + params.loginTime),
				$btnPrint : com.focusPage('#printFinanceBtn').click(function(){
					com.popup("家装预算__装修单号:" + orderId  ,api.index.quotationOutputIndex.url + "?quotation.qid=" + quo.quotationid + "&type=2&time=" + loginTime,function () {
						parent.layer.getFrameIndex(window.name);
					});
				}),
				//返回
				$btnBack : com.focusPage('#detailBckBtn').on(ace.click_event, function(){
				    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function() {
                        com.switchPage(api.index.quotationIndex.url);
                    });
				}),
				//展开
				$btnSpread : com.focusPage('#openFunctionAreasBtn').click(function(){
					com.focusPage('.icon-chevron-down').parent().trigger('click');
				}),
				//收起
				$btnCollapse : com.focusPage('#closeFunctionAreasBtn').click(function(){

					com.focusPage('.icon-chevron-up').parents('[data-action="collapse"]').trigger('click');
				}),
			};
			return that;
		},
		initQuoModals : function(){
			var that = this;
			that.quoModals = {
				//编辑功能区
				$domainEditModal : com.focusPage("#functionAreaModal"),
				//添加功能区
				$domainTempletModal : com.focusPage("#functionAreaTemplateModal").on("show.bs.modal", function(a) {
					com.focusPage('input[name="quotempl"]:checked').removeAttr('checked');
				}),

				//添加默认报价项
				$quoteModal : com.focusPage("#quotationItemModal").on("show.bs.modal", function(a) {
					com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//添加自定义报价项
				$quoteAddModal : com.focusPage("#customFunctionAreaItemsModal").on("show.bs.modal", function(a) {
					com.focusPage("#itemName").val("");
					com.focusPage("#quotationItemDes").val("");
					com.focusPage("#unitPrice").val("");
					com.focusPage("#num").val("");
					com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
					com.focusPage("#workType").get(0).selectedIndex = 0;
					com.focusPage("#discountFlag").removeAttr("checked");
				}),
				//历史记录
				$historyModal : com.focusPage("#historyQuotationItemModal").on("show.bs.modal", function(a) {
					com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
			};
			//初始化功能区添加弹层
			com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.versionId" : that.versionId}, function(data){

				if(data.functionAreas.length){

					var _type1 = $('<div class="clearfix"></div>');
					var _type2 = $('<div class="clearfix"></div>');
					var _type3 = $('<div class="clearfix"></div>');

					that.quoModals.$domainTempletModal.find('.modal-body')
						.append(_type1).append('<div class="hr hr8 hr-double"></div>')
						.append(_type2).append('<div class="hr hr8 hr-double"></div>')
						.append(_type3);


					$.each(data.functionAreas, function(i, v){

						var $dtempl = painter.createDomainTemplete(v);

						if(v.type == 1){$dtempl.appendTo(_type1);}
						if(v.type == 2){$dtempl.appendTo(_type2);}
						if(v.type == 3){$dtempl.appendTo(_type3);}
					});
				}

			}, null, false);
			//初始化报价项选择弹层
			var extraParams  = {"quotationItem.versionId": quo.versionId};
			var _condArr = ['itemName', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationWorkTypeId'];
			var quotationItemSeacher = new Searcher();
			quotationItemSeacher.init( _condArr, "condList", api.quotation.pageQuotationItemByVersionId,  function(data){
				var $tableWrap = com.focusPage('#resultList').empty();
				var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

				if(data && data.length){
					$.each(data,function(i, v){
						var $liLine = painter.createQuoteModalItem(v);
						$liLine.appendTo($ul);
					});
					$ul.appendTo($tableWrap);

					if(quote.quotesRecord.length){
						$.each(quote.quotesRecord, function(index, val){
							var $input = com.focusPage('input[name="modalQuots"][value="'+ $(val).val() +'"]');
							$input.length &&($input.prop('checked',true)) ;
						});
					}
				}
			}, "pagenation", "quotationDetailItemPostData", extraParams);

			//初始化自定义报价项弹层
			com.post(api.common.queryMeasurementUnit, {}, function(res){
				com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
			}, null, false);
			com.post(api.common.queryWorkType, {} ,function(res){
				com.focusPage("#workType").bindData(res.workTypes, "name", "name");
			}, null, false);

			return that;
		},
		//统计总价
		calculateQuoFees: function(func){
			var _totalfee = 0,
				_basicMoney = parseFloat(quo.basicParams["quotation.basicPrice"]),
				_materialMoney = 0;
			var $domains = com.focusPage('#functionAreaDetailList .widget-box');
			if(!$domains.length){
				return;
			}

			$domains.each(function(){
				var sum;
				var $this = $(this);
				var _fatype = $this.attr('data-fatype');
				if(_fatype == 1 || _fatype == 2){
					
					if(func){
						func($this);
					}
				}
				sum = parseFloat($this.attr('data-totalprice'));
				if(_fatype == 2){
					sum =  utils.accAdd(sum , parseFloat($this.attr('data-extra-totalprice')));
				}
				_totalfee = utils.changeThrDecimal(utils.accAdd(_totalfee, sum));
			});

			com.focusPage('#quotionMoney').text( _totalfee );
			_materialMoney = utils.changeThrDecimal(material.tools.cyclTotal());
			_totalfee = utils.changeThrDecimal(utils.accAdd( utils.accAdd(_totalfee , _basicMoney),  _materialMoney));

			com.focusPage('#materialMoney').text( _materialMoney );
			com.focusPage('#sumLabSumMoney').text(_totalfee);

			quo.basicParams["quotation.totalPrice"] = _totalfee;//报价总额
		},
		//计算功能区总价
		calculateDomainFees  : function($domain, func){
			var _domanFees = 0, _domanExtraFees = 0;
			var $arr = com.focusPage('.fl-quo-item', $domain);
			var sum = 0;

			var fatype = $domain.attr('data-fatype');

			if($arr.length){
				$arr.each(function(){
					var _totlaPrice = 0;
					$this = $(this);
					if(func){
						func($this);
					}

					_totlaPrice = parseFloat($this.attr("data-totalprice"));

					if(fatype == 1){
						sum = utils.changeThrDecimal(utils.accAdd(sum, _totlaPrice));
					}

					if(fatype == 2 && $this.find('.type').attr('data-type') != 4){
						_domanExtraFees = utils.changeThrDecimal(utils.accAdd(_domanExtraFees, _totlaPrice));
					}

				});
				if(fatype == 1){
					$domain.attr('data-totalprice', sum);
					_domanFees = sum;
				}
				if(fatype == 2){
					$domain.attr('data-extra-totalprice', _domanExtraFees);
				}
			}

			if(fatype == 2){
				_domanFees = utils.changeThrDecimal(parseFloat($domain.attr('data-totalprice')));

				_domanFees = utils.changeThrDecimal(utils.accAdd(_domanExtraFees, _domanFees));
			}

			return _domanFees;
		},
		//计算报价项各种值
		calculateQuoteFee : function($quote){
			var _num = parseFloat($quote.find('.num .cell-wrap').text());
			var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
			var _totalprice;
			_totalprice = utils.changeThrDecimal(utils.accMul(_num,  _unitprice));
			$quote.find('.totalprice-discount .cell-wrap').text(_totalprice);
			$quote.attr('data-totalprice', _totalprice);
		},
		// 计算报价总金额 todo
		calculateTotalFee: function(discount){
			var  _totalfee = 0, _total = 0;
			
			var $arr = com.focusPage('.fl-quo-item');
			
			$arr.length && $arr.each(function(i, v){
				
				var $quote = $(v);
				
				if(['0', '1'].indexOf($quote.find(".cell.type").attr('data-type')) == -1) return true;
				
				var _num = parseFloat($quote.find('.num .cell-wrap').text());
				var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());

				var _totalprice = utils.accMul(_num,  _unitprice);

				_totalfee = utils.accAdd(_totalfee, _totalprice);
			});

			_total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(_dtotalfee, _transfee), _managefee));

			com.focusPage('#calTrafficPrice').val(_transfee);
			com.focusPage('#calManagePrice').val(_managefee);
			com.focusPage('#calTotalPrice').val(_total);
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
			com.focusPage("#functionAreaName").val($domain.find('.widget-header strong').text());
			//com.focusPage("#functionAreaIndex").val(dv.functionAreaIndex);
			com.focusPage("#functionAreaOrder").val($domain.attr('data-dlevel'));

			quo.quoModals.$domainEditModal.modal("show");

			return false;
		},
		//编辑功能区保存按钮点击
		saveDomainEdit : function(){
			var that = this;
			com.focusPage('#saveFunctionAreaBtn').on(ace.click_event, function(){ // 编辑功能区页面
				
				if(com.validate()){
					return;
				}
				
				var _dname = com.focusPage("#functionAreaName").val();
				var _dorder = com.focusPage("#functionAreaOrder").val();

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
					var $dmoney = com.focusPage('[data-qfaid="'+that.nowEditDomain.attr('data-qfaid') +'"]','#functionAreaSumList');
					$dmoney.find('.order').text(_dorder);
					$dmoney.find('.name').text(_dname);
					$dmoney.remove();
					if(_index != 0) {

						$dmoney.insertAfter(com.focusPage('#functionAreaSumList > div').eq(_index - 1));
					}else{
						$dmoney.insertBefore(com.focusPage('#functionAreaSumList > div').eq(0));
					}

					quo.quoModals.$domainEditModal.modal("hide");
				},null, false);

			});
		},
		//删除功能区
		deletDomain : function($domain){

			com.showConfirm("是否确定要删除功能区", function(){
			    
				$domain.remove();
				com.focusPage('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').remove();
				quo.calculateQuoFees();

				var _params = $.extend({}, {
					'quotationFunctionArea.qfaId' : $domain.attr('data-qfaid') , //功能区Id
				}, quo.basicParams);

				com.post(api.quotation.deleteQuotationFunctionArea, _params, function(){}, null, false);
			});
		},
		//保存功能区修改
		saveDomainTemplete : function(){
			var that = this;
			com.focusPage('#addFunctionAreasBtn').click(function(){
				
				var $darr = com.focusPage('input[name="quotempl"]:checked');
				var _param = $.extend({}, quo.basicParams);
				var $aimDomains = com.focusPage('.widget-box', '#functionAreaDetailList');
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

						if(v.type == 2){
							sum = utils.accAdd(sum, parseFloat($domain.attr('data-extra-totalprice')));
						}

						sumd = parseFloat($domain.attr('data-d-totalprice'));

						var _index = $domain.index();
						$dmoney = painter.createDomainMoney(sum, v);
						if(_index == 0){
							$dmoney.appendTo(com.focusPage('#functionAreaSumList'));
						}else{
							$dmoney.insertAfter(com.focusPage('#functionAreaSumList > div').eq(_index - 1));
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

			maxflag && $domain.appendTo(com.focusPage('#functionAreaDetailList'));
			quo.quoModals.$domainEditModal.modal("hide");
		},
		//保存默认报价项
		saveQuotesToDomain : function(){
			com.focusPage('#addFunctionAreaItemsBtn').click(function(){
				quote.addDefaultQuotes();
				quo.quoModals.$quoteModal.modal("hide");
			});
		},

		//绑定各种关于报价的操作
		init: function(){
			this.saveDomainEdit();
			this.saveDomainTemplete();
			this.saveQuotesToDomain();
		},

	};
	//报价
	var quote = {
		quotesRecord  : [],
		$nowLine : null,
		$nowEditInput : null,
		//排序报价项
		sortQuote : function($domain){
			var $arr = com.focusPage('.fl-quo-item', $domain);
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
			
			com.focusPage('.fl-quo-item.current').removeClass('current');
			$line.addClass('current');
			$editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();
			that.$nowLine = $line;
			that.$nowEditInput = $editInput;
			that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
				var $input = $(this);
				that.bindInputKeydown($input.val(), e);
			});
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
				com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
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
			var $quos = com.focusPage('[name="deleteItems"]:checked', $domain);
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
				com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
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
				com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
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
			com.focusPage("#saveCustomFunctionAreaItemBtn").on(ace.click_event, function(event){
				
				if(com.validate()){
					return;
				}

				var addRow = {
					discount : com.focusPage("#discountFlag").prop("checked") ? 1 : 0,
					num : com.focusPage("#num").val(),
					itemName : com.focusPage("#itemName").val(),
					measurementUnit : com.focusPage("#measurementUnit").val(),
					unitPrice : com.focusPage("#unitPrice").val(),
					content : com.focusPage("#quotationItemDes").val(),
					type : 1,
					workType : com.focusPage('#workType').val()
				};

				var args = {
                    "quotationFunctionAreaItem.discount" : addRow.discount,// 是否打折
					"quotationFunctionAreaItem.itemName" : addRow.itemName,// 报价项名
					"quotationFunctionAreaItem.measurementUnit" : addRow.measurementUnit,// , 单位 ;
					"quotationFunctionAreaItem.workType" : com.focusPage('#workType').val(),//工种 workTypeId : $("#workType").val(),
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
					"workType" : com.focusPage('#workType').val(),
					"discount" : addRow.discount,
				});
				quote.recordHistoryQuotes($historyItem);
				_fee = quo.calculateDomainFees(domain.nowEditDomain);
				com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
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
			com.focusPage('body').click( function(e){
				if(!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')){
					that.hideInputWrap();
				}
			});
		},
		addHistoryQuotes : function(){
			com.focusPage('#addHistoryItemsBtn').on(ace.click_event, function(event){
				quote.addDefaultQuotes();
				quo.quoModals.$historyModal.modal("hide");
			});
		},
		//记录历史数据
		recordHistoryQuotes : function($historyQuo){
			var addflag = true;
			var $quos = com.focusPage('[type="checkbox"]', '#historyQuotationItemDiv');
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
				if($this.val() && com.focusPage('input[data-qiid="' + $this.val() +'"]', domain.nowEditDomain).length){
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
				"$btnEdit" : ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>'],
				"$btnAdd" : ["添加报价项", '<i class="bigger-125 icon-plus purple"></i>'],
				"$btnSet" : ["自定义报价项", '<i class="bigger-125 icon-plus-sign purple"></i>'],
				"$btnHistory" : ["历史报价项", '<i class="bigger-125 icon-star green"></i>'],
				"$btnDelQuo" : ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>'],
				"$btnDelDomain" : ["删除功能区", '<i class="bigger-125 icon-trash red"></i>'],
				"$btnFold" : ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>']
			};

			var sum = 0; //功能区总价(折前)
			var extraSum = 0;

			$domain = $('<div></div>').addClass('widget-box transparent').attr({
				"data-dlevel" : dv.functionAreaOrder,
				"data-qfaId" : dv.qfaId,
				"data-fatype" : dv.type
			}).css({"margin-bottom" : "20px"});

			$dhead = $('<div></div>').addClass('widget-header');
			$dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.functionAreaName));
			$dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

			$.each(_btnSet, function(k, v){

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

					//1(工程量), 2(功能区总额), 3(不计算)
					if(dv.type == 1){
						if(!isNaN($item.attr('data-totalprice'))){
							sum = utils.changeThrDecimal(utils.accAdd(sum, parseFloat($item.attr('data-totalprice'))));
						}
					}

					if(dv.type == 2){
						if(v.type != 4 && !isNaN($item.attr('data-totalprice'))){
							extraSum = utils.changeThrDecimal(utils.accAdd(extraSum, parseFloat($item.attr('data-totalprice'))));
						}
					}
				});
			}

			if(dv.type == 2){
				sum = utils.changeThrDecimal(dv.total);
				$domain.attr('data-extra-totalprice', extraSum);

			}
			
			if(dv.type == 3){
				sum = 0;
			}

			$btns.$btnEdit.click(function(){//编辑功能区
				domain.editDomain($domain);
			});
			$btns.$btnAdd.click(function(){//添加报价项
				domain.nowEditDomain = $domain;
				quo.quoModals.$quoteModal.modal("show");
				com.focusPage('#addItemFunctionAreaIndex').val(dv.qfaId);
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
			$domain.attr('data-totalprice', sum);

			return $domain;
		},
		//创建报价项
		createQuote : function(linenum, qv){
			var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);

			var _dcp =  qv.unitPrice;

			var _lineSet = [
				["line", linenum],
				["num", qv.num],
				["name", qv.itemName],
				["type", qv.type== 0 ? "普通" : qv.type== 1 ? "自定义" : "-", ["data-type", qv.type]],
				["unit", qv.measurementUnit],
				["worktype", qv.workType],
				["price unitprice", qv.unitPrice],
				["price discountprice", _dcp],
				["price totalprice-discount", utils.changeThrDecimal(utils.accMul(qv.num ,  _dcp))],
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
				qv.content && com.showTip(this, qv.content, 'left');
			});

			$item.attr('data-totalprice',utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)));

			return $item;
		},

		//创建添加功能区中的功能区
		createDomainTemplete : function(v){
			var $label = $('<label></label>').addClass('col-xs-6');
			var $radio = $('<input>').addClass('ace').attr({"name" : "quotempl", "type" : "checkbox"}).val(v.faId);
			var $span = $('<span></span>').addClass('lbl').text(v.functionAreaName + (v.type == 2 ? '(总价固定)' : v.type == 3 ? '(基础，不计算)' : ''));
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

	var material = {
		//0: 初始 , 1: 升级 , 2: 折价
		statusSetting : ['初始', '升级', '折价'],
		materialSaleOrder : {
			saveBtn:  com.focusPage("#saveBtn"),
			cancellBtn: com.focusPage("#cancelBtn"),
			modal: null,
			materialSaleOrderItems: {
				materialerName : com.focusPage("#materialerName"),
				msoType : com.focusPage("#msoType"),
				des : com.focusPage("#des"),
			},
			mmIdLimit: 2,
			record: {},
			editFlag: false,
		},
		lastRowId : 0,
		autoFillList : [],
		autoFillNameList : [],

		options : {
			add : function(){
				var num = com.focusPage('.line.existed', '#list').length;

				quo.calculateQuoFees();
				var $line = material.tools.addline(num + 1);
				$line.appendTo('#list');
			},
			changeBtns : function($line){
				$line.find('.option .ui-inline-save').remove();

				var $btnUpgrade = com.focusPage('<div class="ui-pg-div action-buttons upgrade"><a href="javascript:void(0)" class="blue"><i class="icon-arrow-up bigger-110"></i></a></div>');
				var $btnDiscount = com.focusPage('<div class="ui-pg-div action-buttons discount"><a href="javascript:void(0)" class="purple"><i class="icon-arrow-down bigger-110"></i></a></div>');

				$line.find('.option').append($btnUpgrade).append($btnDiscount);

				$btnDiscount.click(function(){
					material.tools.changePice($line, 0);
				});
				$btnUpgrade.click(function(){
					material.tools.changePice($line, 1);
				});

			},

			//升级和折扣保存按钮
			saveMaterial : function(){
				com.focusPage('#saveMaterialBtn').click(function(){

					if(!com.validate('saveMaterialBtn')){
						var flag = com.focusPage('#materialModal').attr('data-action');
						var diff = com.focusPage('#diff').val();

						var options = {
							"quotationMaterialItem.qmiId": com.focusPage('#materialModal').attr('data-qmiid'),
							"quotationMaterialItem.diff": diff
						};
						com.post(flag == 0 ? api.quotation.discountQuotationMaterialItem : api.quotation.upgradeQuotationMaterialItem, options, function(res){
							com.focusPage('#materialModal').modal('hide');
							material.$line.find('.diff').html(diff);
							material.$line.find('.status').html(flag == 0 ? material.statusSetting[2] : material.statusSetting[1]);
							quo.calculateQuoFees();
						});
					}
				});
			},
		},

		tools : {
			//添加一个空行
			addline : function (lineindex){

				var tools = material.tools;

				var $line = $('<li></li>').addClass('line editable');
				var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
				var $lineInfoWrap = $('<div></div>').addClass('line-wrap content').css('width', '10%');
				var $optWrap= $('<div></div>').addClass('line-wrap action');
				var _lineInfoSet = [
					{cellClass: "name materialModelName", hasInput : !0},
					{cellClass: "type materialTypeName"},
					{cellClass: "brand materialBrandName"},
					{cellClass: "unit measurementUnitName"},
					//{cellClass: "num", hasInput : !0},
					{cellClass: "type status", hasInput : !0},
					{cellClass: "money total", hasInput : !0},
					{cellClass: "money diff", hasInput : !0},
					{cellClass: "remark des", hasInput : !0},
				];

				var $btncheck = $('<div class="ui-pg-div ui-inline-save"><span class="ui-icon ui-icon-disk"></span></div>');
				var $btndel = $('<div class="ui-pg-div ui-inline-cancel"><span class="ui-icon ui-icon-cancel"></span></div>');

				$.each(_lineInfoSet, function(i, v){
					var $input;
					var $cell = $('<div></div>').addClass('cell cell-grow '+ v.cellClass);
					if(v.hasInput){
						$input = $('<input>').prop('type', 'text').addClass('editable');
						$cell.append($input);
					}
					$cell.appendTo($lineInfoWrap);

					if($cell.hasClass('materialModelName')){
						$input.typeahead({
							url: api.material.queryMaterialModelForAllByName,
							//reverseFlag: limitFlag,
							source: function (query, process) {
								var options = {};

								/*if(materialOrder.saleType == "mend"){
									options[materialSaleOrder.typeahead.optionMsoId] = materialOrder.msoId;
								}*/

								options['materialModel.materialModelName'] = query;
								com.post(this.options.url, options, function(data){
									var materialModels = data['materialModels'];
									material.autoFillList = [];
									material.autoFillNameList = [];
									for(var i=0;i<materialModels.length;i++){

										var _ = materialModels[i];

										material.autoFillList[i] = _.materialModelName;
										material.autoFillNameList[i] = _["mmId"];
									}
									process(material.autoFillList);
								});
							},
							matcher: function (item) {
								return true;
							},
							updater: function(v){
								//k: key, v:value

								tools.fillData(v, $line);
								$line.addClass('selected');

								return v;

							}
						}).attr("autocomplete", "off");
							/*.on("change", function(){
							fillData($(this).val(), $line);
							$line.addClass('selected');
						});*/
					}
				});

				$optWrap.append($('<div></div>').addClass('cell option').append($btncheck).append($btndel));

				$line.append($indexWrap).append($lineInfoWrap).append($optWrap);

				$line.click(function(){
					com.focusPage('.current').removeClass('current');
					$(this).addClass('current');
				});

				$btncheck.click(function(e){
					e.stopPropagation();
					if(tools.checkRowValue($line)){

						tools.addQuotationMaterialItem($line);
					}
				});

				$btndel.click(function(e){
					e.stopPropagation();


					if($line.hasClass('existed')){
						tools.deleteQuotationMaterialItem($line);
					}else{
						$line.remove();
						tools.reorder();
						quo.calculateQuoFees();
					}
				});

				return $line;
			},
			//autofill选中给一行赋值
			columnActionInit : function($line, data, flag){


				var _materialModel = data;

				if(flag){
					$line.find('.materialTypeName').text(_materialModel.materialTypeName);
					$line.find('.materialBrandName').text(_materialModel.materialBrandName);
					$line.find('.measurementUnitName').text(_materialModel.measurementUnitName);

					$line.find('.diff').text('0');
					$line.find('.status').text(material.statusSetting[0]);

					$line.attr('materialModelNo', _materialModel.materialModelNo);
				}
			},
			initline : function($line, data, flag){
				var _materialModel = data;

				if(flag){

					//给总价赋值
					$line.find('.materialModelName').html(_materialModel.name );//名称
					$line.find('.materialTypeName').text(_materialModel.category);//品类
					$line.find('.materialBrandName').text(_materialModel.brand);//品牌
					$line.find('.measurementUnitName').text(_materialModel.measurementUnit);//单位
					$line.find('.total').html(_materialModel.price);//总价
					$line.find('.des').html(_materialModel.des);//备注

					$line.find('.diff').text(_materialModel.diff);
					$line.find('.status').text(material.statusSetting[_materialModel.status]);

					$line.attr('data-qmiid', _materialModel.qmiId);
					$line.attr('data-diff', _materialModel.diff);
					$line.attr('materialModelNo', _materialModel.no);
					$line.addClass('existed').removeClass('editable');
					material.options.changeBtns($line);
				}
			},
			//获取主材信息
			fillData : function(content, $line){

				var options = {};
				var itemId = material.autoFillNameList[material.autoFillList.indexOf(content)];

				if(itemId){
					options['materialModel.mmId'] = itemId;
				}else{
					return false;
				}

				com.post(api.material.queryMaterialModelById, options, function(data){

					var _item = data['materialModel'];

					material.tools.columnActionInit($line, _item, true);
				}, function(data){
					com.showAlert(com.error, "获取数据失败!");
				});

				//materialSaleOrder.record[id] = true;
			},

			checkRowValue: function ($line){
				var flag = true;


				var checkInputValue = function(cellClass, cond, msg){
					var $input = $line.find('.' + cellClass + ' input');
					if(cond){
						$input.focus().select();

						$input.addClass('popover-notitle').attr({
							"data-rel" : "popover",
							"data-placement" : "top",
							"data-original-title" : "",
							"title" : "",
							"data-content" : msg

						}).popover('show');

						flag =  false;
					}else{
						$input.popover('destroy');
					}
				};

				var materialModelName = $line.find('.materialModelName input');
				if(!materialModelName.val()){
					materialModelName.focus().select();

					materialModelName.addClass('popover-notitle').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "请填写主材名称"

					}).popover('show');

					flag =  false;
				}else{
					materialModelName.popover('destroy');
				}

				/*var num = $line.find('.num input');
				var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
				if(!(numRex.test(num.val()) && parseFloat(num.val()) > 0)){
					num.focus().select();
					num.addClass('tooltip-info').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "数量输入内容格式错误!"
					}).popover('show');
					flag =  false;
				}else{
					num.popover('destroy');
				}*/

				var total = $line.find('.total input');
				var totalRex = /^([0-9]+|[0-9]+\.[0-9]{1,2})$/;
				if(!(totalRex.test(total.val()) && parseFloat(total.val()) > 0)){
					total.focus().select();
					total.addClass('tooltip-info').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "总价输入内容格式错误!"

					}).popover('show');
					flag =  false;
				}else{
					total.popover('destroy');
				}

				var des = $line.find('.des input');
				if(des.val().length > 128){
					des.focus().select();
					des.addClass('tooltip-info').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "备注信息长度需要小于128!"
					}).popover('show');
					flag =  false;
				}else{
					des.popover('destroy');
				}

				return flag;
			},
			//计算总价的和
			cyclTotal : function (){

				var _total = 0;

				var $list = com.focusPage('.line.existed', '#list');
				$list.length && $list.each(function(){
					var $this = $(this);
					if($this.find('.diff').text()){
						var _status = $this.find('.status').text();
						var _money = $this.find('.diff').text();
						if( _status == material.statusSetting[1]){
							_money = parseFloat(_money);
						}else{
							_money = -parseFloat(_money);
						}
						_total = utils.accAdd(_money, _total);
					}
				});

				material.materialSaleOrder.totalSum = _total;

				com.focusPage("#totalSpan").text(_total);
				com.focusPage("#materialMoney").text(_total);
				return _total;
			},
			//重排序
			reorder : function (){
				var $list = com.focusPage('.line', '#list');
				$list.length && $list.each(function(i){
					var $this = $(this);
					$this.find('.index').text(i + 1);
				});
			},
            //添加主材项
			addQuotationMaterialItem : function($line){
				var options = {
					'quotationMaterialItem.qid': quo.quotationid,
					"quotationMaterialItem.no": $line.attr('materialModelNo'),
					"quotationMaterialItem.name": $line.find('.materialModelName input').val(),
					"quotationMaterialItem.category": $line.find('.materialTypeName').text(),
					"quotationMaterialItem.brand": $line.find('.materialBrandName').text(),
					"quotationMaterialItem.measurementUnit": $line.find('.measurementUnitName').text(),
					"quotationMaterialItem.price": $line.find('.total input').val(),
					"quotationMaterialItem.des": $line.find('.des input').val()
				};
				com.post(api.quotation.addQuotationMaterialItem, options, function(res){

					var name = $line.find('.materialModelName input').val();
					var total = $line.find('.total input').val();
					var des = $line.find('.des input').val();

					$line.find('.materialModelName').html(name);
					$line.find('.total').html(total);
					$line.find('.des').html(des);
					$line.addClass('existed').removeClass('editable').attr('data-qmiid', res.quotationMaterialItem.qmiId);
					material.options.changeBtns($line);
					quo.calculateQuoFees();

					if (!com.focusPage('.line.editable', '#list').length){
						material.options.add();
					}
				});
			},
			//删除主材项
			deleteQuotationMaterialItem : function($line){

				var options = {
					"quotationMaterialItem.qmiId": $line.attr('data-qmiid'),
					"quotationMaterialItem.diff": $line.find('.diff').text(),
				};
				com.post(api.quotation.deleteQuotationMaterialItem, options, function(res){
					$line.remove();
					material.tools.reorder();
					quo.calculateQuoFees();
				});
			},

			//升级折价报价中主材项 0:折扣, 1升级
			changePice : function($line, flag){
				//materialModal materialTitle diff

				com.focusPage('#diff').val(null);

				com.focusPage('#materialModal').attr({
					'data-action' : flag,
					'data-qmiid' : $line.attr('data-qmiid')
				}).modal('show');

				com.focusPage('#materialTitle').text(flag == 0 ? '折价' : '升级');

				material.$line = $line;
			},
		},

		init : function(){
			var that = this;

			com.post(api.quotation.queryQuotationMaterialItemByQId, {"quotation.qid": quo.quotationid}, function(res){
				if(res.quotationMaterialItems.length){
					$.each(res.quotationMaterialItems, function(i, v){
						var $line = that.tools.addline(i + 1).addClass('current').appendTo('#list');
						that.tools.initline($line, v, true);
					});
					//添加一条空行
					that.tools.addline(res.quotationMaterialItems.length + 1).addClass('current').appendTo('#list');
				}else{
					//添加一条空行
					that.tools.addline(1).addClass('current').appendTo('#list');
					that.tools.addline(2).addClass('current').appendTo('#list');
				}
			}, null, false);

			that.options.saveMaterial();
		},
	};

	return {
		init : function(){
			quo.orderid = params.orderId;
			quo.quotationid = params.quotationId;

			com.post(api.quotation.queryQuotationById, {"quotation.qid" : quo.quotationid}, function(data){
				com.focusPage('#quotationName').text(data.quotation.quotationName);
				quo.basicParams = {
					"quotation.qid" : data.quotation.qid,//报价Id
					"quotation.discount" : data.quotation.discount,//报价折扣
					"quotation.totalPrice" : data.quotation.totalPrice,//报价总额
					"quotation.latexCut" : data.quotation.latexCut,//乳胶漆提成
					"quotation.manageRate" : data.quotation.manageRate,//管理费比例
					"quotation.managePrice" : data.quotation.managePrice,//管理费
					"quotation.trafficPrice" : data.quotation.trafficPrice,//车运费
					"quotation.basicPrice" : data.quotation.basicPrice,//基础额
					"quotation.houseArea" : data.quotation.houseArea,//面积
					"quotation.setpackage" : data.quotation.setpackage,//套系金额
				};
				quo.versionId = data.quotation.versionId;
				quo.notSalesmanRate = data.quotation.notSalesmanRate;
				com.focusPage('#basicMoney').text(data.quotation.basicPrice);

			},null, false);
			
			com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid" : quo.quotationid}, function(data){
				var _totalfee = 0;
				if(data.quotationFunctionAreas.length){

					$.each(data.quotationFunctionAreas, function(i, v){
						var sum;
						var $domain = painter.createdomain(v);
						$domain.appendTo(com.focusPage('#functionAreaDetailList'));

						sum = parseFloat($domain.attr('data-totalprice'));

						if(v.type == 2){
							sum = utils.accAdd(sum, parseFloat($domain.attr('data-extra-totalprice')));
						}

						$dmoney = painter.createDomainMoney(sum, v);
						$dmoney.appendTo(com.focusPage('#functionAreaSumList'));
						_totalfee = utils.changeThrDecimal(utils.accAdd(_totalfee, sum));
					});
				}
			}, null, false);

			quo.init();
			domain.init();
			quote.init();

			material.init();

			quo.calculateQuoFees();
		}
	};

})();

$(function(){
	QuotationDetail.init();
});
