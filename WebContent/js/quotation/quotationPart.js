var QuotationDetail = (function(){
	var quo = {
		//装修单号
		orderid : null,
		//报价ID
		quotationid : null,
		//报价版本
		versionId : null,
		//非业务人员提点
		notSalesmanRate : null,
		basicParams : null,
		quoModals : {},
		settingBtns : {},
		quoteCalculation : {},
		machingType : {},
		typeness: {},
		initSettingBtns : function(){
			var that = this;
			that.settingBtns = {
				//功能区
				$btnAddDomain : com.focusPage('#functionAreaTemplateBtn').click(function(){
					that.quoModals.$domainTempletModal.modal("show");
				}),
				//折扣
				$btnDiscount: com.focusPage('#discountBtn').on('click', function(){ // 折扣界面
					that.quoModals.$domainDiscountModal.modal("show");
				}),
				//计算总价
				$btnCalculateTotal: com.focusPage('#calculateTotalBtn').on('click', function(){
					com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);
					com.focusPage("#calDiscount").val("");
					quo.calculateTotalFee(10);
					that.quoModals.$calculateTotalModal.modal("show");
				}),
				//统计
				$btnReport : com.focusPage('#viewStatisticalBtn').bindClick(function() {
					com.post(api.quotation.amountQuotationNormood, {'quotation.qid': quo.quotationid}, function(res){
						quo.statisticsQuoteNormedData(res.normoods, 0);
					}, null, false);

					com.post(api.quotation.amountQuotationNormrice, {'quotation.qid': quo.quotationid}, function(res){
						quo.statisticsQuoteNormedData(res.normrices, 1);
					}, null, false);

					that.quoModals.$quotationStatisticalModal.modal('show');
				}, 2000),
				//保存
				$btnSave : com.focusPage('#saveQuotationBtn').bindClick(function(){ // 保存报价信息
					com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){
						com.showAlert(com.info, "操作成功");
					});
				},2000),
				//打印
				//$btnPrint : com.focusPage('#printFinanceBtn').attr('href', api.index.quotationOutputIndex.url + "?quotation.qid=" + quo.quotationid + "&orderType="+ quo.decorationType + "&type=2&time=" + params.loginTime),
				$btnPrint : com.focusPage('#printFinanceBtn').click(function () {
					params.quotationId = quo.quotationid;
					params.type = 2;
					params.subtype = [-2];
					params.showType = {itemtype: 7};
					com.popup("打印报价", api.index.quotationOutputIndex.url, null, null, true);
				}),
				//返回
				$btnBack : com.focusPage('#detailBckBtn').on('click', function(){
				    com.showConfirm("当前页面存在重要数据,是否进行当前操作", function(result) {
                        com.switchPage(api.index.quotationIndex.url);
                        com.closePopover();
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
				$closeStatisticalBtn : com.focusPage('#closeStatisticalBtn').click(function(){
					quo.quoModals.statisticalNormedDataDiv.empty();
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
				//编辑折扣
				$domainDiscountModal : com.focusPage("#discountModal"),
				//计算总价
				$calculateTotalModal: com.focusPage('#calculateTotalFeeModal'),
				//添加默认报价项
				$quoteModal : com.focusPage("#quotationItemModal").on("show.bs.modal", function(a) {
					com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//添加自定义报价项
				$quoteAddModal : com.focusPage("#customFunctionAreaItemsModal").on("show.bs.modal", function(a) {
					com.focusPage("#itemName").val("");
					com.focusPage("#quotationItemDes").val("");
					com.focusPage("#unitPrice").val("");
					com.focusPage('#formula').val("");
					com.focusPage("#num").val("");
					com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
					com.focusPage("#workType").get(0).selectedIndex = 0;
					com.focusPage("#discountFlag").removeAttr("checked");
				}),
				//历史记录
				$historyModal : com.focusPage("#historyQuotationItemModal").on("show.bs.modal", function(a) {
					com.focusPage('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//管理费比例设置saveMrBtn
				$manageRateModal : com.focusPage('#manageRateModal').on("show.bs.modal", function(a) {
					com.focusPage('#manageRate').val(null);
				}),
				$quotationStatisticalModal : com.focusPage('#quotationStatisticalModal'),
				statisticalNormedDataDiv: com.focusPage('#statisticalNormedDataDiv')
			};
			//初始化功能区添加弹层
			com.post(api.quotation.queryFunctionAreaByVersionId, {"functionArea.versionId" : that.versionId}, function(data){
				data.functionAreas.length && $.each(data.functionAreas, function(i, v){
					if(v.type != 0) {
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
			//初始化自定义报价中的类型
			com.post(api.quotation.queryQuotationType, {},function(res) {
				com.focusPage("#quotationType").bindData(res.quotationTypes,"id", "name");
			});

			com.post(api.ds.decoration, {}, function (res) {
				$.each(res.typeness, function(i, v){
					quo.typeness["typeness[" + i + "]"] = v.key;
				});
			}, null, false);
            //初始化半价/满减配比
            com.post(api.data.queryDecorationMatching, quo.typeness, function (res) {
                quo.machingType = res.decorationMatchings;
            });

			return that;
		},
		//统计车运费管理费总价折扣价
		calculateQuoFees: function(func){
		    
			var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10);
			var _undisPrice = 0, _disPrice = 0,_dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0;
			
			var $domains = com.focusPage('#functionAreaDetailList .widget-box:not([data-del-sign="1"])');

			if(!$domains.length){
				return false;
			}

			$domains.each(function(){
				var sum, sumd, sumdp;
				var $this = $(this);
				
				var _areaType = $this.attr('data-areaType');
				if(_areaType != 0 && _areaType!=3){
					if(func) func($this);
					
					sum = parseFloat($this.attr('data-undisPrice')); // 非折扣总价格
					sumdp = parseFloat($this.attr('data-disPrice')); // 折扣总价格
					sumd = parseFloat($this.attr('data-desTotalprice')); // 折扣后总价格
					
					_undisPrice = utils.accAdd(_undisPrice, sum); // 非折扣总价格
					_disPrice = utils.accAdd(_disPrice, sumdp); // 折扣总价格
					_dtotalfee = utils.accAdd(_dtotalfee, sumd); // 格式化折扣后的总价格
				}
			});
			
			var manageCost = com.focusPage('#manageCost'); // 管理费
			var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
			
			_transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1; // 车运费的折扣
			_manageDiscount = manageCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1; // 管理费的折扣
			
			_tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
			_manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
			
			_transfee = utils.changeThrDecimal(utils.accMul(utils.accAdd(_undisPrice, _disPrice), _tranRate)); // 未计算车运费之前的总价格*车运费比例=车运费
			_managefee = utils.changeThrDecimal(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _transfee), _manageRate)); // (未计算车运费之前的总价格+车运费)*管理费
			
			_dtransfee =  utils.changeThrDecimal(utils.accMul(_transfee, _transDiscount)); // 车运费*车运费折扣
			_dmanagefee = utils.changeThrDecimal(utils.accMul(utils.accMul(utils.accAdd(utils.accAdd(_undisPrice, _disPrice), _transfee), _manageRate), _manageDiscount)); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣
			_total = utils.changeThrDecimal(utils.accAdd( utils.accAdd(utils.accAdd(_undisPrice, _disPrice) , _transfee),  _managefee)); // 未计算车运费之前的总价格+车运费+管理费(未打折的总价格)
			
			// 基数是否存在,无需判断装修单类型
			if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0){
				//(工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
				var total = utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee);  //工程基数
				var remainder = utils.changeThrDecimal(total % quo.basicParams['quotation.basePrice']); //余数
                _dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total,remainder),_discount),remainder),_managefee));
            } else {
                //(未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                _dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _dtransfee), _dmanagefee));
            }

			converyanceCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtransfee)); // 显示到生成项目  车运费(折扣后的车运费)
			manageCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dmanagefee)); // 显示到生成项目 管理费(折扣后的管理费)

			com.focusPage('#basePrice').text(utils.changeThrDecimal(quo.basicParams["quotation.basePrice"])); // 显示到左上角的总价
			com.focusPage('#sumLabDiscount').text(utils.changeThrDecimal(quo.basicParams["quotation.discount"])); // 显示到左上角的总价
			
			com.focusPage('#disPrice').text(utils.changeThrDecimal(_disPrice)); // 显示到左上角的总价
            com.focusPage('#undisPrice').text(utils.changeThrDecimal(_undisPrice)); // 显示到左上角的折扣价
			com.focusPage('#sumLabSumMoney').text(utils.changeThrDecimal(_total)); // 显示到左上角的总价
			com.focusPage('#sumLabDiscountMoney').text(utils.changeThrDecimal(_dtotal)); // 显示到左上角的折扣价
			
			quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(_dtotal); // 报价总额
			quo.basicParams["quotation.manageRate"] = utils.changeThrDecimal(utils.accSub(_manageRate, quo.notSalesmanRate)); // 管理费比例
			quo.basicParams["quotation.managePrice"] = utils.changeThrDecimal(_managefee); // 管理费
			quo.basicParams["quotation.trafficPrice"] = utils.changeThrDecimal(_transfee); // 车运费
			quo.basicParams["quotation.trafficRate"] = utils.changeThrDecimal(_tranRate); // 车运费比例
			quo.basicParams["quotation.undisPrice"] = utils.changeThrDecimal(_undisPrice); // 非打折项折前总额
			quo.basicParams["quotation.disPrice"] = utils.changeThrDecimal(_disPrice); // 打折项折前总额
		},
		//计算功能区总价和折扣总价
		calculateDomainFees  : function($domain, func){
			var _domanFees = 0;
			//选中报价项
			var $arr = com.focusPage('.fl-quo-item:not([data-del-sign="1"])', $domain);
			var sum = 0, sumd = 0,sumdp = 0;
			if($arr.length){
				$arr.each(function(){
					$this = $(this);
					if(func){
						func($this);
					}

					var _undisPrice = parseFloat($this.attr("data-undisPrice"));//报价项非折扣总价
					var _disPrice = parseFloat($this.attr("data-disPrice"));//报价项折扣总价
					var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text());//折扣后的一个工程的(折扣单价*数量)
					sum = utils.changeThrDecimal(utils.accAdd(sum, _undisPrice));//无折扣总价
					sumdp = utils.changeThrDecimal(utils.accAdd(sumdp,_disPrice));//折扣总价
					sumd = utils.changeThrDecimal(utils.accAdd(sumd, _totlaPriceDiscount));//折扣后的总价格
				});
				_domanFees = sumd;
			}

			$domain.attr('data-undisPrice', sum);//总价格存入
			$domain.attr('data-desTotalprice', sumd);//折扣后的总价格
			$domain.attr('data-disPrice',sumdp);//折扣项总价

			return _domanFees;
		},
		//计算报价项各种值
		calculateQuoteFee : function($quote){
			var _num = parseFloat($quote.find('.num .cell-wrap').text());
			var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
			var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折,0不打折
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
			var  _manageDiscount, _transDiscount, _totalfee = 0, _dtotalfee = 0, _transfee = 0, _managefee = 0, _manageRate = 0, _total = 0,cdiscount=0,ndiscount = 0;

			var _undisPrice = quo.basicParams["quotation.undisPrice"];
			var _disPrice = quo.basicParams["quotation.disPrice"];
			var _dtransfee = quo.basicParams["quotation.trafficPrice"];
			var _dmanagefee = quo.basicParams["quotation.managePrice"];

			drawTable(_undisPrice, _disPrice, _dtransfee, _dmanagefee, discount);
			//报价计算器
			function drawTable(undisPrice, disPrice, transfee, managefee, discount) {

			    var _discount = utils.accDiv(discount, 10);
			    
				var total = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(undisPrice, disPrice), transfee), managefee)); // 折前总额
				var dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(disPrice, _discount), undisPrice), transfee), managefee)); // 半包折扣总额

				var table = com.focusPage('#calculateTotalFeeModal').find('.fl-quo-cal').html(null);

				var divItem1 = $('<div></div>').addClass('fl-quo-cal-item');

				divItem1.append(createCalItem("基础",'normal border-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left-right alert-info')).append(createCalItem("",'normal border-left alert-info'))
					.append(createCalItem("装修",' small border-left-right alert-success')).append(createCalItem("",'normal border-left alert-success'))
					.append(createCalItem("主材",'small border-left-right alert-danger')).append(createCalItem("",'normal border-left-right alert-danger'))
					.append(createCalItem("综合",'normal border-left-right alert-warning')).append(createCalItem("",'normal border-left-right alert-warning'));
				divItem1.appendTo(table);

				var divItem2 = $('<div></div>').addClass('fl-quo-cal-item');
				divItem2.append(createCalItem("版本",'normal')).append(createCalItem("折前总价",'normal')).append(createCalItem("打折项总额",'normal')).append(createCalItem("非打折项总额",'normal')).append(createCalItem("管理费",'normal')).append(createCalItem("折扣",'small')).append(createCalItem("折后总价",'normal')).append(createCalItem("配比",'small')).append(createCalItem("主材额",'normal')).append(createCalItem("服务费",'normal')).append(createCalItem("实花总额",' normal alert-warning'));
				divItem2.appendTo(table);

				var halfPacksDiv = $('<div></div>').addClass('fl-quo-cal-item');
				halfPacksDiv.append(createCalItem("半包",'normal')).append(createCalItem(total,'normal')).append(createCalItem(disPrice,'normal')).append(createCalItem(utils.changeTwoDecimal(utils.accAdd(undisPrice,transfee)),'normal')).append(createCalItem(managefee,'normal')).append(createCalItem(discount,'small')).append(createCalItem(dtotal,'normal')).append(createCalItem("-",'small')).append(createCalItem("-",'normal')).append(createCalItem("-",'normal')).append(createCalItem(dtotal,'normal alert-warning'));
				halfPacksDiv.appendTo(table);

                $.each(quo.machingType, function (i, v) {

					if ((v.vision & 1) != 1 || v.type != 2) return true;

                    var materialPrice = utils.changeThrDecimal(utils.accMul(total, v.material));
                    var servicePrice = utils.changeThrDecimal(utils.accMul(materialPrice, v.service));
                    var _totalProject = utils.accAdd(utils.accAdd(undisPrice, disPrice), transfee); // 工程总额
                    var _balance = _totalProject % v.base; // 余数 = 工程总额%基数
                    //满减折后总额   //折后工程总额=(工程总额-余数)*折扣 + (余数) + 管理费
                    var _projectPrice = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(_totalProject, _balance), utils.accDiv(v.discount, 10)), _balance), managefee))
                    var $_total = utils.changeThrDecimal(utils.accAdd(_projectPrice, utils.accAdd(materialPrice, servicePrice)));

                    var halfPriceDiv = $('<div></div>').addClass('fl-quo-cal-item');

					if (i == Math.ceil(quo.machingType.length / 2) - 1) {
						halfPriceDiv.append(createCalItem(v.name, 'normal border-top'),
							createCalItem(total, 'normal border-top'),
							createCalItem(utils.accAdd(utils.accAdd(cdiscount, ndiscount), transfee), 'normal border-top'),
							createCalItem("-", 'normal border-top'), createCalItem(managefee, 'normal border-top'),
							createCalItem(v.discount, 'small'), createCalItem(_projectPrice, 'normal'),
							createCalItem(utils.accMul(v.material, 100) + "%", 'small'),
							createCalItem(materialPrice, 'normal'), createCalItem(servicePrice, 'normal'), createCalItem($_total, 'normal alert-warning'));
					} else {
						halfPriceDiv.append(createCalItem(v.name, 'normal'),
							createCalItem(total, 'normal'),
							createCalItem(utils.accAdd(utils.accAdd(cdiscount, ndiscount), transfee), 'normal'),
							createCalItem("-", 'normal'), createCalItem(managefee, 'normal'),
							createCalItem(v.discount, 'small'), createCalItem(_projectPrice, 'normal'),
							createCalItem(utils.accMul(v.material, 100) + "%", 'small'),
							createCalItem(materialPrice, 'normal'), createCalItem(servicePrice, 'normal'), createCalItem($_total, 'normal alert-warning'));
					}

                    halfPriceDiv.appendTo(table);

                });

            }
			function createCalItem(text,inclass) {
				return $('<div></div>').html(text).addClass('cell').addClass(inclass);
			}
		},
		calculateNowQuoteItem: function(num, areaType, $nowLine){
			var price = 0,dprice = 0;

			if(areaType != 3){
				price = parseFloat($nowLine.find('.unitprice .cell-wrap').text());//单价
				dprice = parseFloat($nowLine.find('.discountprice .cell-wrap').text());//折扣单价
			}
			//折扣单价*数量
			$nowLine.find('.totalprice-discount .cell-wrap').text(utils.changeThrDecimal(utils.accMul(dprice, num)));
			//单价*数量
			$nowLine.find('.discountprice').attr('data-discount') == 0 ? $nowLine.attr('data-undisPrice', utils.changeThrDecimal(utils.accMul(price ,  num))) : $nowLine.attr('data-disPrice', utils.changeThrDecimal(utils.accMul(price ,  num)));

			if(areaType != 3) {
				var _fee = quo.calculateDomainFees(domain.nowEditDomain);
			}
			quo.calculateQuoFees();

			return _fee;
		},
		statisticsQuoteNormedData: function(norms, classify) {

			var title = {'0': '定额材料统计', '1': '定额工费统计'};
			var nameStr = {'0': '商品名: ', '1': '工程节点: '};
			var numStr = {'0': '数量: ', '1': '工费共计: '};
			var args = {"0": "goods", "1": "constructionNode"};

			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(title[classify]));

			$liLine.append($h3);

			if (norms != null) {
				$.each(norms, function(i, v){

					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

					var propertyArr = [
						[nameStr[classify], v[args[classify]].name, "blue"],
						[numStr[classify], v.amount, "blue"],
					];

					$.each(propertyArr, function (index, value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});

					quo.quoModals.statisticalNormedDataDiv.append($ul.append($liLine.append($ulProperty)));
				});
			}
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
			//$("#functionAreaIndex").val(dv.functionAreaIndex);
			com.focusPage("#functionAreaOrder").val($domain.attr('data-dlevel'));

			quo.quoModals.$domainEditModal.modal("show");

			return false;
		},
		//编辑功能区保存按钮点击
		saveDomainEdit : function(){
			var that = this;
			com.focusPage('#saveFunctionAreaBtn').on('click', function(){ // 编辑功能区页面
				
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
		    
		    com.showConfirm("是否确定要删除功能区", function(res){

				$domain.attr("data-del-sign", 1);
                quo.calculateQuoFees();

                var _params = $.extend({}, {
                    'quotationFunctionArea.qfaId' : $domain.attr('data-qfaid') , //功能区Id
                }, quo.basicParams);

                com.post(api.quotation.deleteQuotationFunctionArea, _params, function(res){
					$domain.remove();
					com.focusPage('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').remove();
				}, function(res){
					com.showAlert(com.error, res.errorMsg);
					$domain.removeAttr('data-del-sign');
					quo.calculateQuoFees();
				}, false);
            });
		},
		calculateTotal: function(){
			com.focusPage('#calculateTotalFeeBtn').on('click', function(){
				if(com.validate()){
					return;
				}

				var table = com.focusPage('#calculateTotalFeeModal').find('table');
				table.find('thead').remove();
				table.find('tbody').remove();

				var dis = com.focusPage("#calDiscount").val();

				if(parseFloat(dis) <= 0 || parseFloat(dis) > 10){
                    com.showPopover(com.focusPage("#calDiscount"),{errorMsg: "折扣非法"},  "right");
					return;
				}else{
                    com.focusPage("#calDiscount").css("border","1px solid #d5d5d5").popover("destroy");
				}

				quo.calculateTotalFee(dis);
				
			});
		},
		//保存报价修改
		saveDiscountEdit : function(){
			com.focusPage('#saveDisCountBtn').on('click', function(){ //折扣保存
				
				if(com.validate("discountModal")){
					return false;
				}
				
				var dis = com.focusPage("#discount").val();
				var basePrice = com.focusPage('input[name="basePrice"]:checked').val();
				var disableFlag = com.focusPage("#discount").prop("disabled");

				if(!dis || parseFloat(dis) <= 0 || parseFloat(dis) > 10){
                    com.showPopover(com.focusPage("#discount"),{errorMsg: "请选择正确的折扣"},  "right");
					return;
				}else{
                    com.focusPage("#discount").css("border","1px solid #d5d5d5").popover("destroy");
				}
				
				quo.quoModals.$domainDiscountModal.modal("hide");

				if(!disableFlag && parseFloat(dis) < config.quotationLimitDiscount){
					approvalUtils.initqueryApprovalUser("approveManSel",4);
					
					com.focusPage("#customerApproveModal").modal("show");
					com.focusPage("#cApproveSaveBtn").bindClick( function(){
						if(com.validate()){
						    return false;
						}
						var receiverId = com.focusPage("#approveManSel").find('input:checked').attr('userid');
						if(receiverId == null || receiverId == ""){
							com.showAlert(com.error,"请选择审批人!");
							return false;
						}
						var options = {
							"approval.comment": com.focusPage('#customerDes').val(),
							"approval.receiver.userId": receiverId,
							"approvalQuotationDiscount.orderId": quo.orderid,
							"approvalQuotationDiscount.qid": quo.quotationid,
							"approvalQuotationDiscount.newDiscount": dis,
							"approvalQuotationDiscount.basePrice": basePrice
						};

						com.post(api.approval.submitApprovalForQuotationDiscount, options, function (res) {
							com.showAlert(com.info, "折扣申请成功.");
							com.focusPage('#customerDes').html("");
							com.focusPage("#customerApproveModal").modal("hide");
						});
					}, 5000);

				}else{
				    
				    quo.basicParams['quotation.basePrice'] = parseFloat(basePrice);
					quo.basicParams['quotation.discount'] =  Math.round(parseFloat(dis) * 1000) / 1000;
					
	                quo.calculateQuoFees(function($domain){
	                    var dfee = quo.calculateDomainFees($domain);
	                    com.focusPage('[data-qfaid="'+ $domain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(dfee);
	                });

	                com.post(api.quotation.updateQuotationForAdvance, quo.basicParams, function(res){
	                    quo.quoModals.$domainDiscountModal.modal("hide");
	                }, null, false);
				}
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
				}
				
				$.each($darr, function(i, v){
					_param['functionAreaIds[' + i + ']'] = $(v).val();
				});
				
				console.log(api.quotation.addQuotationFunctionAreaByFunctionAreaIds);

				com.post(api.quotation.addQuotationFunctionAreaByFunctionAreaIds, _param, function(data){
					data.quotationFunctionAreas.length && $.each(data.quotationFunctionAreas, function(i, v){
						var sum = 0, sumd = 0,sumdp = 0, $dmoney;
						var $domain = painter.createdomain(v);
						that.insertDomainByOrder(v.functionAreaOrder, $domain, $aimDomains, false);
						sum = parseFloat($domain.attr('data-undisPrice'));
						sumdp = parseFloat($domain.attr('data-disPrice'));
						sumd = parseFloat($domain.attr('data-desTotalprice'));

						var _index = $domain.index();
						$dmoney = painter.createDomainMoney(sumd, v);
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
		* 	order : 功能区排序
		* 	$domain : 正在编辑的功能区
		* 	$aimDomains :  参与排序的其他功能区（不包含当前要插入的功能区）
		* 	existed :  是否已存在功能区列表中
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
		deleteQuotesToDomain : function() {
			quo.quoModals.$quoteModal.on('hide.bs.modal', function () {
				quote.quotesRecord = [];
			});
		},

		//管理费比例弹窗保存按钮 saveMrBtn
		saveManageRate : function(){
			com.focusPage('#saveMrBtn').click(function(){
				if(com.validate('manageRateModal')){
					return;
				}

				var _manageId = com.focusPage('#manageCost').attr('qfaiId');
				var _qfaId = com.focusPage('#manageCost').find('.cell.name').attr("data-qfaId");

				var _manageRate = parseFloat(com.focusPage('#manageRate').val());
				var mgrate = utils.accAdd(_manageRate, quo.notSalesmanRate);
				
				com.focusPage('#manageCost').find('.unitprice').text(mgrate);

				com.focusPage('#manageCost').find('.discountprice .cell-wrap').text(mgrate);
				com.focusPage('#manageCost').find('.totalprice-discount .cell-wrap').text(mgrate);
				
				quo.calculateQuoFees();
				quo.quoModals.$manageRateModal.modal("hide");
				
				var args = {
			        "quotationFunctionAreaItem.qfaiId": _manageId,
                    "quotationFunctionAreaItem.quotationFunctionAreaId": _qfaId,
                    "quotationFunctionAreaItem.unitPrice": _manageRate
				}
				
				var _params = $.extend(true, {}, args, quo.basicParams);

				com.post(api.quotation.updateQuotationFunctionAreaItemForSpec, _params);
			});
		},
		//折扣窗体配置基数
        showDiscountBasePrice: function () {
			com.focusPage("#showBaseVersion").empty();
			com.focusPage("#discount").prop("disabled","disabled");
            com.post(api.data.queryDecorationMatching, quo.typeness, function (res) {
                $.each(res.decorationMatchings, function(i, v){
                    if ((v.vision & 2) != 2 || v.type != 2) return true;
                    var radio = $('<div class="radio no-padding" style="margin-bottom:10px"></div>');
                    var lableInput = $('<label> <input type="radio" name="basePrice" class="ace" value="'+ v.base +'" data-baseDiscount="'+ v.discount +'" data-name="'+ v.name +'"/> <sapn class="lbl"></sapn></label>');
                    var lbl1 = $('<label>'+ v.name +'</label>').addClass('quotation-base-price-radio').addClass('quotation-base-price-radio-width15');
                    var lbl2 = $('<label> 折扣数: '+v.discount +'</label>').addClass('quotation-base-price-lbl');
                    var lbl3 = $('<label> 基数: '+v.base +'</label>').addClass('quotation-base-price-lbl').addClass('hide');

                    radio.append(lableInput).append(lbl1).append(lbl2).append(lbl3).appendTo(com.focusPage("#showBaseVersion"));
                });
                var customInput = $('<label> <input type="radio" name="basePrice" class="ace" value="'+ 0 +'" data-customDiscount="true"/> <sapn class="lbl"></sapn></label>');  // 以上类型之外，自定义折扣数
                var customlbl = $('<label>半包/全包</label>').addClass('quotation-base-price-radio quotation-base-price-radio-width15');
                var customlb2 = $('<label>请自定义折扣数</label>').addClass('quotation-base-price-lbl');
                com.focusPage("#showBaseVersion").append(customInput).append(customlbl).append(customlb2);

                com.focusPage('input[name="basePrice"]').click(function (e) {
                	if ($(this).attr("data-customDiscount")){
                        com.focusPage("#discount").val('').removeAttr("disabled");
					}else {
                        com.focusPage("#discount").prop("disabled","disabled").val($(this).attr("data-baseDiscount"));
                    }
                });
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
			this.deleteQuotesToDomain();
			this.showDiscountBasePrice();
		}

	};
	//报价
	var quote = {
		quotesRecord  : [],
		$nowLine : null,
		$nowEditInput : null,
		//排序报价项
		sortQuote : function($domain){
			var $arr = $domain.find('.fl-quo-item');
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
			//选中后代中带有*class的标签
			var $numCell = $line.find('.cell.formula');
			var $editInput = that.$nowEditInput ? that.$nowEditInput : $line.parents('.widget-body-inner').find('.fl-quo-input');
			//报价项的模块
			domain.nowEditDomain = $line.parents('.widget-box');
			quote.checkedStyle($line);
			//选中元素中input标签 val赋值为$numCell的文本值   并且点击input标签获取焦点      .focus()获取焦点     .select()选中
			$editInput.removeClass('hide').appendTo($numCell).find('input').val($numCell.find('.cell-wrap').text()).focus().select();
			that.$nowLine = $line;
			that.$nowEditInput = $editInput;
			that.$nowEditInput.find('input').off('keydown').on("keydown",function (e) {
				var $input = $(this);
				that.bindInputKeydown($input.val(), e);
			});
		},
		bindInputKeydown : function(formula, e){

			var that = this;
			var $line = null;

			//keyCode码  13为回车符
			if(e.keyCode == 13){
				try {
					formula = formula.replace(/\s+/g,"");
					var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
					if(test.test(formula) || formula == null || formula == ''){
						that.hideInputWrap();
						return false;
					}
					var num = utils.changeThrDecimal(eval(formula));
					if(num<0 || num>10000000){
						that.hideInputWrap();
						return false;
					}
					} catch (e) {
						that.hideInputWrap();
						return false;
					}
				//保留原先的工程量和数量
				var oldFormula = that.$nowLine.find('.cell.formula .cell-wrap').text();
				var oldNum = that.$nowLine.find('.cell.num .cell-wrap').text();

				//赋值给外部的公式显示
				that.$nowLine.find('.cell.formula .cell-wrap').text(formula);
				//赋值给外部显示DIV 显示数量
				that.$nowLine.find('.cell.num .cell-wrap').text(num);
				//获取下一个报价项的整体元素标签
				$line = that.$nowLine.next('.fl-quo-item');

				var _type = that.$nowLine.find('.type').attr('data-type');
				var _areaType = that.$nowLine.find('.line').attr('data-areaType');

				var args = {
					"quotationFunctionAreaItem.discount" : that.$nowLine.find('.discountprice').attr('data-discount'),// 折扣标示 1:打折 ;
					"quotationFunctionAreaItem.qfaiId" : that.$nowLine.find('input[name="deleteItems"]').val(),// 报价项Id , 可空 ;
					"quotationFunctionAreaItem.itemName" : that.$nowLine.find('.name .cell-wrap').text(),// 报价项名
					"quotationFunctionAreaItem.measurementUnit" : that.$nowLine.find('.unit .cell-wrap').text(),//  单位 ;
					"quotationFunctionAreaItem.formula" : that.$nowLine.find('.formula .cell-wrap').text(),//计算公式
					"quotationFunctionAreaItem.workType" : that.$nowLine.find('.worktype .cell-wrap').text(),//工种 workTypeId : $("#workType").val(),

					"quotationFunctionAreaItem.unitPrice" :that.$nowLine.find('.unitprice .cell-wrap').text(),// 单价 ;
					"quotationFunctionAreaItem.initNum" : that.$nowLine.find('.num .cell-wrap').text(),//初始化数量
					"quotationFunctionAreaItem.num" : that.$nowLine.find('.num .cell-wrap').text() ,//数量;
					"quotationFunctionAreaItem.subtype"  :that.$nowLine.find('.num').attr('data-subtype') ,// 1工程,2主材
					"quotationFunctionAreaItem.type" : _type,// , 类型 , 自定义为1 , 工程报价项为0  不计算为4
					"quotationFunctionAreaItem.quotationFunctionAreaId" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id
					"quotationFunctionAreaItem.index": parseInt(that.$nowLine.find(".line .cell-wrap").text())
				};

				if(_type == 0  || _type == 4){
					//报价项Id , 普通类型报价项需要传递 "data-qiid"
					args["quotationFunctionAreaItem.quotationItemId"] = that.$nowLine.find('input[name="deleteItems"]').attr('data-qiid');
				}else if(_type == 1){
					//报价项说明 , 自定义类型报价项需要传递 ;
					args["quotationFunctionAreaItem.content"] = that.$nowLine.prop('title');
				}
				that.$nowLine.find('input[name="deleteItems"]').val(that.$nowLine.find('input[name="deleteItems"]').val());

				var _fee = quo.calculateNowQuoteItem(num, _areaType, that.$nowLine);

				com.clearValidator();

				that.$nowLine.find(".icon-arrow-up").removeClass("grey").addClass("green"),that.$nowLine.find(".icon-arrow-down").removeClass("grey").addClass("red");

				var _params = $.extend({}, args, quo.basicParams);

				com.post(api.quotation.updateQuotationFunctionAreaItem, _params, function(res){
					//选中左上角报价中的功能区ID 将总价格显示
					com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
					that.$nowLine.find('input[name="deleteItems"]').val(res.quotationFunctionAreaItem.qfaiId);
				}, function(res){
					com.showAlert(com.error, res.errorMsg);

					that.$nowLine.find('.cell.formula .cell-wrap').text(oldFormula);
					that.$nowLine.find('.cell.num .cell-wrap').text(oldNum);

					quo.calculateNowQuoteItem(oldNum, _areaType, that.$nowLine);
				}, false);

				if($line.length){
					that.getNumCellFocus($line);
				}else{
					that.hideInputWrap();
				}
				return;
			}
			//如果按键为上 调整焦点到功能区内上一个报价项
			if(e.keyCode == 38){
				$line = that.$nowLine.prev('.fl-quo-item');
				if($line.length){
					that.getNumCellFocus($line);
				}else{
					that.hideInputWrap();
				}
				return;
			}
			//如果按键为下  调整焦点到功能区内的下一个报价项
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
			//this.$nowEditInput = null;
		},
		//批量删除报价项
		deleteQuoteInBatches : function($domain){
			$domain.find('.fl-quo-input').insertAfter($domain.find('.fl-quo-list')).addClass('hide');
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
					$(v).parents('li.fl-quo-item').attr("data-del-sign", 1);
				});

				var _fee = quo.calculateDomainFees(domain.nowEditDomain);

				quo.calculateQuoFees();
				_params = $.extend({},_params, quo.basicParams, {"quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')});
				com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res){
					$.each($q1, function(i, v){
						$(v).parents('li.fl-quo-item').remove();
					});

					com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				}, function(res){
					com.showAlert(com.error, res.errorMsg);

					$.each($q1, function(i, v){
						$(v).parents('li.fl-quo-item').removeAttr("data-del-sign");
					});

					quo.calculateDomainFees(domain.nowEditDomain);
					quo.calculateQuoFees();
				}, false);
			}
			quote.sortQuote(domain.nowEditDomain);
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
				$quote.attr('data-del-sign', 1);
				var _fee = quo.calculateDomainFees(domain.nowEditDomain);
				quo.calculateQuoFees();

				_params = $.extend({}, quo.basicParams,{"quotationFunctionArea.qfaId": domain.nowEditDomain.attr('data-qfaid')});
				_params["qfaiIds[0]"] = _qid;
				com.post(api.quotation.deleteQuotationFunctionAreaItem, _params, function(res){

					$quote.remove();
					com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				}, function(res){
					com.showAlert(com.error, res.errorMsg);

					$quote.removeAttr("data-del-sign");

					quo.calculateDomainFees(domain.nowEditDomain);
					quo.calculateQuoFees();
				}, false);
			}
			quote.sortQuote(domain.nowEditDomain);
		},
		//添加自定义报价项
		saveCustomQuotesAdd : function(){
			com.focusPage("#saveCustomFunctionAreaItemBtn").on('click', function(event){
				var _areaType = domain.nowEditDomain.attr('data-areaType');
				if(com.validate("customFunctionAreaItemsModal")){
					return;
				}

				var _index = domain.nowEditDomain.find('.fl-quo-item').length;

				var addRow = {
					discount : com.focusPage("#discountFlag").prop("checked") ? 1 : 0,
					formula:com.focusPage("#formula").val(),
					subtype:com.focusPage("#quotationType").val(),
					num : com.focusPage("#num").val(),
					itemName : com.focusPage("#itemName").val(),
					measurementUnit : com.focusPage("#measurementUnit").val(),
					unitPrice : com.focusPage("#unitPrice").val(),
					content : com.focusPage("#quotationItemDes").val(),
					type : 1,
					workType : com.focusPage('#workType').val(),
					areaType : _areaType,
				};
				var args = {
					"quotationFunctionAreaItem.discount" : addRow.discount,// 是否打折
					"quotationFunctionAreaItem.itemName" : addRow.itemName,// 报价项名
					"quotationFunctionAreaItem.measurementUnit" : addRow.measurementUnit,// , 单位 ;
					"quotationFunctionAreaItem.workType" : com.focusPage('#workType').val(),//工种 workTypeId : $("#workType").val(),
					"quotationFunctionAreaItem.content" : addRow.content,// , 报价项说明 , 自定义类型报价项需要传递 ;
					"quotationFunctionAreaItem.unitPrice" : addRow.unitPrice,// 单价 ;
					"quotationFunctionAreaItem.subtype" : addRow.subtype,
					"quotationFunctionAreaItem.formula": addRow.formula,//公式
					"quotationFunctionAreaItem.initNum" : addRow.num ,//原数
					"quotationFunctionAreaItem.num" : addRow.num ,//, 工程量 ;
					"quotationFunctionAreaItem.type" : addRow.type,// , 类型 , 自定义为1 , 普通报价项为0 ;
					"quotationFunctionAreaItem.quotationFunctionAreaId" : domain.nowEditDomain.attr('data-qfaId'),// 功能区Id ;
					"quotationFunctionAreaItem.index" : (_index + 1),
				};


				var $item, $historyItem;
				var _fee = 0;

				$item = painter.createQuote(_index + 1,addRow);
				$item.find(".icon-arrow-up").removeClass("grey").addClass("green"),$item.find(".icon-arrow-down").removeClass("grey").addClass("red");
				$item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
				$historyItem = painter.createQuoteModalItem({
					"itemName" : addRow.itemName,
					"unitPrice" : addRow.unitPrice,
					"measurementUnit" : addRow.measurementUnit,
					"quotationItemDes" : addRow.content,
					"workType" : com.focusPage('#workType').val(),
					"discount" : addRow.discount,
				});
				quote.recordHistoryQuotes($historyItem);
				_fee = quo.calculateDomainFees(domain.nowEditDomain);
				com.focusPage('[data-qfaid="'+ domain.nowEditDomain.attr('data-qfaid') +'"]', '#functionAreaSumList').find('label.no-padding-left').text(_fee);
				quo.calculateQuoFees();
				quote.sortQuote(domain.nowEditDomain);
				
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
		* $input : 正在操作的input标签
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
		//删除上一个选中的报价项选中样式 并添加当前报价项选中样式
		checkedStyle : function($item){
			com.focusPage('.fl-quo-item.current').removeClass('current');
			$item.addClass('current');
		},
		calculationNum : function(){
			com.focusPage('#formula').blur(function(){
				var that = $(this) ;
				try {
					var formula = that.val();
					formula = formula.replace(/\s+/g,"");
					var test = /([\D][\.][\D])|([\d][\.][\D])|([\D][\.][\d])|(\.$)|(^\.)|([\+\-\*\/\(][\+\-\*\/])|([^\d|^\+|^\-|^\*|^\/|^\.|^\(|^\)])/;
					if(test.test(formula) || formula == null || formula == ''){
						com.focusPage('#num').val('');
						return false;
					}
					var num = utils.changeThrDecimal(eval(formula));
					if(num < 0 || num > 10000000){
						com.focusPage('#num').val('');
						return false;
					}
					that.val(formula);
					com.focusPage('#num').val(num);
				}
				catch (e) {
					com.focusPage('#num').val('');
					return false;
				}
			});
		},
		addHistoryQuotes : function(){
			com.focusPage('#addHistoryItemsBtn').on('click', function(event){
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
					return false;
				}

				var _quotval = {
					"discount" : parseInt($this.attr('data-discount')),
					"content" : $this.attr('data-des'),
					"itemName" : $this.attr('data-itemName'),
					"measurementUnit" : $this.attr('data-itemUnite'),
					"formula":'0',
					"num" : 0,
					"qfaiId" : "",
					"quotationFunctionAreaId" : "",
					"quotationItemId" : $this.val(),
					"type" : $this.val() ? domain.nowEditDomain.attr('data-areaType') == 3 ? '4': '0' : "1",
					"subtype" : $this.attr('data-quotationTypeId'),
					"unitPrice" :  $this.attr('data-itemPrice'),
					"workType" : $this.attr('data-workType'),
					"quotationType": $this.attr('data-quotationType'),
					"quotationTypeId" : $this.attr('data-quotationTypeId'),
					"areaType" : domain.nowEditDomain.attr('data-areaType'),
				};

				var $item = painter.createQuote( _index + i + 1, _quotval);
				$item.appendTo(domain.nowEditDomain.find('.fl-quo-list'));
				var $historyItem = $this.parents('li.item-blue').clone(true);
				quote.recordHistoryQuotes($historyItem);
			});
			quote.quotesRecord = [];
		},
		moveAreaItem : function($quote,$movequote,$direction){
			if(!$quote.find('input[name="deleteItems"]').val()){
				return;
			}
			if($direction == "up"){
				if($quote.prev().length == 0 || !$movequote.find('input[type="checkbox"]').val()){
					return;
				}
				$quote.insertBefore($movequote);
			}
			if($direction == "down" ){
				if($quote.next().length == 0 || !$movequote.find('input[type="checkbox"]').val()){
					return;
				}
				$quote.insertAfter($movequote);
			}

			var _nowline = $quote.find(".cell.line .cell-wrap").text();
			var _upline =$movequote.find(".cell.line .cell-wrap").text();

			$quote.find(".cell.line .cell-wrap").text(_upline);
			$movequote.find(".cell.line .cell-wrap").text(_nowline);

			var _data = {};
			_data["quotationFunctionAreaItems["+0+"].qfaiId"] =  $quote.find('input[type="checkbox"]').val();
			_data["quotationFunctionAreaItems["+0+"].index"] = _upline;
			_data["quotationFunctionAreaItems["+1+"].qfaiId"] = $movequote.find('input[type="checkbox"]').val();
			_data["quotationFunctionAreaItems["+1+"].index"] = _nowline;

			var _quotationFunctionArea = {"quotationFunctionArea.qfaId":$quote.parents('div.widget-box.transparent').attr('data-qfaid')};
			
			var _params = $.extend({},_data,_quotationFunctionArea)

			com.post(api.quotation.updateQuotationFunctionAreaItemForIndex, _params);
		},
		init : function(){
			this.saveCustomQuotesAdd();
			this.clearQuoteSelected();
			this.calculationNum();
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
				"$btnEdit" : ["编辑功能区", '<i class="bigger-125 icon-pencil blue"></i>', dv.type!=0],
				"$btnAdd" : ["添加工程项", '<i class="bigger-125 icon-plus purple"></i>', dv.type!=0],
				"$btnSet" : ["自定义报价项", '<i class="bigger-125  icon-plus-sign purple"></i>', dv.type!=0],
				"$btnHistory" : ["历史报价项", '<i class="bigger-125 icon-star green"></i>', dv.type!=0],
				"$btnDelQuo" : ["批量删除报价项", '<i class="bigger-125 icon-remove pink"></i>',dv.type!=0],
				"$btnDelDomain" : ["删除功能区", '<i class="bigger-125 icon-trash red"></i>',dv.type!=0],
				"$btnFold" : ["折叠", '<i class="bigger-125 icon-chevron-up" functionindexdata="1" id="oneChevron_1"></i>', true]
			};

			var sum = 0, //功能区总价(不打折总价)
				sumdp = 0,//功能区总价(打折前的打折总价)p
				sumd = 0,//功能区总价(打折后总价)

			$domain = $('<div></div>').addClass('widget-box transparent').attr({
				"data-dlevel" : dv.functionAreaOrder,//排序
				"data-qfaId" : dv.qfaId,//报价项中的功能区ID
				"data-areaType" : dv.type//类型
			}).css({"margin-bottom" : "20px"});

			$dhead = $('<div></div>').addClass('widget-header');
			$dname = $('<h5></h5>').append($('<em></em>').text(dv.type == 0 ? '' : dv.functionAreaOrder)).append('  ').append($('<strong></strong>').html(dv.functionAreaName));
			$dtoolbar = $('<div></div>').addClass('widget-toolbar no-border');

			$.each(_btnSet, function(k, v){
			    
				if(!v[2]) return true;
				
				$btns[k] = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append(v[1]).appendTo($dtoolbar).mouseenter(function(){
                    com.showTip($btns[k], v[0], "top");
                });
			});

			$btns["$btnFold"].attr({"data-action" : "collapse"});

			$dbody = $('<div></div>').addClass('widget-body');
			$dbodyInner = $('<div></div>').addClass('widget-body-inner');
			$list = $('<ul></ul>').addClass('fl-quo-list');
			$input = $('<div></div>').addClass('fl-quo-input hide').append($('<input type="text">').addClass('v_required v_float').attr('maxlength','16'));

			$dhead.append($dname).append($dtoolbar);

			$dbodyInner.append($input).append($list).appendTo($dbody);

			$domain.append($dhead).append($dbody);

			if(dv.quotationFunctionAreaItems.length) {
				//功能区中的报价项
				var _items = dv.quotationFunctionAreaItems;
				// 按照报价项主键顺序排序
				_items = _items.sort(function (a, b) {
					if (a.index == null || b.index == null) {
						//降序排列
						return b.index - a.index;
					} else {
						//升序
						return a.index - b.index;
					}
				});

				$.each(_items, function (i, v) {
					v.areaType = $domain.attr('data-areaType');
					var $item = that.createQuote(i + 1, v);
					$item.appendTo($list);
					sumd = dv.type != 3 ? utils.accAdd(sumd, parseFloat($item.find('.totalprice-discount .cell-wrap').text())) : 0;
					sum = dv.type != 3 ? utils.accAdd(sum, parseFloat($item.attr('data-undisPrice'))) : 0;
					sumdp = dv.type != 3 ? utils.accAdd(sumdp, parseFloat($item.attr('data-disPrice'))) : 0;
				});
			}

			if(dv.type !=0){
				//各种绑定事件

				$btns.$btnEdit.click(function(){//编辑功能区
					domain.editDomain($domain);
				});
				$btns.$btnAdd.click(function(){//添加工程报价项
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
			}
			//$domain.attr('data-d-totalprice', sumd);
			//$domain.attr('data-totalprice', sum);
			$domain.attr('data-desTotalprice', utils.changeThrDecimal(sumd));
			$domain.attr('data-disPrice', utils.changeThrDecimal(sumdp));
			$domain.attr('data-undisPrice', utils.changeThrDecimal(sum));

			return $domain;
		},
		//创建报价项
		createQuote : function(linenum, qv){
			//将说明写入到提示框中
			var $item = $('<li></li>').addClass('fl-quo-item').prop('title', qv.content);
			
			var discount = utils.accDiv(quo.basicParams['quotation.discount'], 10)
			
			var _dcp = 0;
			var _num = qv.num;
			var _unitPrice = qv.unitPrice;
			var _type = qv.type;
			var _areaType = qv.areaType;
			
			var _class = [1].indexOf(qv.discount) != -1 ? "blue" : "green"; // 打折标识 , 名称样式不同
			
			if(qv.type < 2){
				//计算是否打折计算出折扣后的价格    单价
				//_dcp = utils.changeThrDecimal(utils.accMul(_unitPrice, (qv.discount == 1 ? discount : 1)));//折后单价1打折,0不打折
			    _dcp =  _unitPrice;
			}
			
			if(qv.type == 2){ // 车运费
				_dcp =  _unitPrice;
			}
			
			if(qv.type == 3){ // 管理费 , 单价+非业务人员提点
				_dcp = _unitPrice + quo.notSalesmanRate;
			}
			
			var _lineSet = [
				["line", linenum,["data-areaType", qv.areaType]],//编号
				_areaType == 0 ? "" : ["formula", qv.formula ? qv.formula : "0"],//公式
				["num", _num, ["data-subtype", qv.subtype]],//数量
				["name " + _class, qv.itemName, ["data-qfaId", qv.quotationFunctionAreaId]],//报价名称
				["type", _type == 0 ? "普通" : qv.type == 1 ? "自定义" : qv.type == 4 ? "不计算" : "-" , ["data-type", qv.type]],
				["unit", qv.measurementUnit],//单位
				["worktype", qv.workType],//工种
				["price unitprice", _type == 3 ? _dcp : _unitPrice],//类型 , 0: 普通报价项 , 1: 自定义报价项 , 2: 车运费 , 3: 管理费 , 4: 不计入总额
				["price discountprice", _areaType == 3 ? 0 : _dcp, ["data-discount", qv.discount]],//折扣后的价格   将折扣存入
				["price totalprice-discount", _areaType == 3 ? 0 : _type < 2  ? utils.accMul(_num,  _dcp) : _dcp],//根据类型计算(数量*折扣)
			];

			var $btnCell, $btnCellWrap, $inputLable, $input, $ispan, $btnDel, $btnInfo, $btnset, $up, $down;

			$.each(_lineSet, function(i, v){
				var $cell = $('<div></div>').addClass('cell ' + v[0]);
				var $cellWrap = $('<div></div>').addClass('cell-wrap').html(v[1]);
				if(v[2]){
					$cell.attr(v[2][0], v[2][1]);
				}
				$cell.append($cellWrap).appendTo($item);
			});
			//报价类型为普通跟自定义
			if(qv.type < 2 ||qv.type ==4){
				$btnCell = $('<div></div>').addClass('cell btns');
				$btnCellWrap = $('<div></div>').addClass('cell-wrap');
				$inputLable = $('<label></label>');
				$input = $('<input>').addClass('cbox ace').attr({
					"type" : "checkbox",
					"role" : "checkbox",
					"name" : "deleteItems",
					"data-qiid" : qv.quotationItemId ? qv.quotationItemId : "",
				}).val(qv.qfaiId);
				$ispan = $('<span></span>').addClass('lbl align-top');
				
				$inputLable.append($input).append($ispan);
				$btnCellWrap.append($inputLable).appendTo($btnCell);
				$item.append($btnCell);

				$btnDel = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-remove pink"></i>').mouseenter(function(){
                    com.showTip(this, "删除报价项", "top");
                });
				$btnInfo = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-search"></i>').mouseenter(function(){
                    com.showTip(this, "报价信息", "top");
                });
				$up = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-arrow-up"></i>').mouseenter(function(){
                    com.showTip(this, "向上", "top");
                });
				$down = $('<a></a>').attr({"href": "javascript:void(0)"}).css({"padding-left": "5px"}).append('<i class="bigger-125 icon-arrow-down"></i>').mouseenter(function(){
                    com.showTip(this, "向下", "top");
                });
				
				$btnCellWrap.append($btnDel).append($btnInfo).append($up).append($down);
				qv.qfaiId ? ($up.find("i").addClass("green"),$down.find("i").addClass("red")) :($up.find("i").addClass("grey") ,$down.find("i").addClass("grey"));
				//各种绑定事件
				$item.click(function(){//编辑数量
					quote.getNumCellFocus($item);
				});
				//删除报价项
				$btnDel.click(function(e){
					quote.deleteQuote($item);
					return false;
				});
				//查看
				$btnInfo.click(function(e){
					qv.content && com.showTip(this, qv.content, 'left');
					return false;
				});
				//向上移动
				$up.click(function(e){
					quote.checkedStyle($item);
					quote.moveAreaItem($item,$item.prev(),"up");
					return false;
				});
				//向下移动
				$down.click(function(e){
					quote.checkedStyle($item);
					quote.moveAreaItem($item,$item.next(),"down");
					return false;
				});
			}else{
				if(qv.type == 2){ // 车运费
					$item.attr('id', 'conveyanceCost');
					$btnCell = $('<div></div>').addClass('cell btns');
					$btnCellWrap = $('<div></div>').addClass('cell-wrap');
					$btnset = $('<a></a>').css('visibility', 'hidden').append('<i class="bigger-125 icon-cog purple"></i>');
					$btnCellWrap.append($btnset).appendTo($btnCell);
					$item.append($btnCell);
				}
				if(qv.type == 3){
					$item.attr('id', 'manageCost').attr('qfaiId', qv.qfaiId);//管理费
					$btnCell = $('<div></div>').addClass('cell btns');
					$btnCellWrap = $('<div></div>').addClass('cell-wrap');
					$btnset = $('<a></a>').attr('href', 'javascript:void(0)').append('<i class="bigger-125 icon-cog purple"></i>').mouseenter(function(){
	                    com.showTip(this, "管理费设置", "top");
	                });
					$btnCellWrap.append($btnset).appendTo($btnCell);
					$item.append($btnCell);

					$btnset.click(function(){
						com.focusPage('#manageRateModal').modal('show');
					});
				}
			}
			//$item.attr('data-totalprice', qv.type < 2 || qv.type == 5 ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)) : 0);
			$item.attr('data-undisPrice',qv.discount == 0 && (qv.type < 2 || qv.type == 5) ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)):0);
			$item.attr('data-disPrice', qv.discount == 1 && (qv.type < 2 || qv.type == 5) ? utils.changeThrDecimal(utils.accMul(qv.num ,  qv.unitPrice)):0);

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
				"data-discount": v.discount,
				"data-quotationType" : v.quotationType,
				"data-quotationTypeId" : v.quotationTypeId
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
			var $item = $('<div></div>');
			var $dwrap = $('<label></label>').addClass('col-md-6 no-padding-right');
			var $dorder =$('<span class="order"></span>').text(v.functionAreaOrder);//功能区排序
			var $dname = $('<span class="name"></span>').text(v.functionAreaName);//功能区名字
			var $dsum = $('<label></label>').addClass('col-md-6 no-padding-left').text(sum);//折扣价
			
			$dwrap.append($dorder).append("|").append($dname);
			$item.attr("data-qfaId" , v.qfaId ).append($dwrap).append($dsum);//存入功能区ID
			
			return $item;
		}
	};

	return {
		init : function(){
			quo.orderid = params.orderId;
			quo.quotationid = params.quotationId;
			quo.decorationType = params.orderType;
			
			//管理费选择弹层初始化
			com.post(api.quotation.queryQuotationForConfig, {}, function(res){
				//将管理费取出 放入select标签中(下拉框)
				com.focusPage('#manageRate').bindData(res.configs.manageRates);
			});
			
			//根据报价ID 获取报价信息(同步ajax)
			com.post(api.quotation.queryQuotationById, {"quotation.qid" : quo.quotationid}, function(data){
			    
			    var quotation = data.quotation;
			    
				//将报价数据获取到全局变量中
				quo.basicParams = {
					"quotation.qid" : quotation.qid,//报价Id
					"quotation.basePrice": quotation.basePrice, // 基数
					"quotation.discount" : quotation.discount, // 报价折扣
					"quotation.totalPrice" : quotation.totalPrice, // 报价总额
					"quotation.manageRate" : quotation.manageRate, // 管理费比例
					"quotation.managePrice" : quotation.managePrice, // 管理费
					"quotation.trafficPrice" :quotation.trafficPrice // 车运费
				};
				
				quo.versionId = quotation.no; // 报价版本存入
				quo.notSalesmanRate = quotation.notSalesmanRate; // 非业务人员提点比例
				
                com.focusPage('#quotationName').text(quotation.quotationName); // 左上角显示报价名称
                com.focusPage('#basePrice').text(quotation.basePrice);
				com.focusPage('#sumLabDiscount').text(quotation.discount); // 左上角显示的折扣
			},null, false);
			
			//通过报价ID获取报价项中的功能区
			com.post(api.quotation.queryQuotationFunctionAreaByQuotationId, {"quotation.qid" : quo.quotationid}, function(data){
				
				var _discount = utils.accDiv(quo.basicParams['quotation.discount'], 10); // 将整数折扣换算为小数点(解决浮点数计算BUG)
				var _undisPrice = 0, _disPrice = 0,_dtotalfee = 0, _transfee = 0, _managefee = 0;
				if(data.quotationFunctionAreas.length){
					//报价中的功能区
					$.each(data.quotationFunctionAreas, function(i, v){
					    
						var sum = 0, sumdp = 0, sumd = 0;
						var $domain = painter.createdomain(v).appendTo(com.focusPage('#functionAreaDetailList'));
						
						if(v.type != 0 && v.type != 3){
						    
							sum = parseFloat($domain.attr('data-undisPrice'));//功能区非打折项总价
							sumdp =  parseFloat($domain.attr('data-disPrice'));//功能区打折项折前总价
							sumd = parseFloat($domain.attr('data-desTotalprice'));//功能区折后总价
							
							painter.createDomainMoney(utils.changeThrDecimal(sumd), v).appendTo(com.focusPage('#functionAreaSumList'));
							
							_disPrice = utils.accAdd(_disPrice, sumdp); // 功能区打折项总价相加
							_undisPrice = utils.accAdd(_undisPrice, sum); // 功能区非打折项总价相加
							_dtotalfee = utils.accAdd(_dtotalfee, sumd); // 功能区折后总价相加
						}else if(v.type != 0 && v.type == 3){
							painter.createDomainMoney(sumd, v).appendTo(com.focusPage('#functionAreaSumList'));
						}
					});
					
					var manageCost = com.focusPage('#manageCost'); // 管理费
					var converyanceCost = com.focusPage('#conveyanceCost'); // 车运费
					
					_manageDiscount = manageCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1; // 管理费折扣
					_transDiscount = converyanceCost.find('.discountprice').attr('data-discount') == "1" ? _discount : 1; // 车运费折扣
					
					_manageRate = parseFloat(manageCost.find('.discountprice .cell-wrap').text()); // 获取管理费比例(根据报价版本获得)
					_tranRate = parseFloat(converyanceCost.find('.unitprice .cell-wrap').text()); // 获取车运费比例(根据报价版本获得)
					
					_transfee =  utils.accMul(utils.accAdd(_disPrice,_undisPrice), _tranRate); // 未计算车运费之前的总价格*车运费比例=车运费
					_managefee = utils.accMul(utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee), _manageRate); // (未计算车运费之前的总价格+车运费)*管理费
					
					_dtransfee =  utils.accMul(_transfee, _transDiscount); // 车运费*车运费折扣
					_dmanagefee = utils.accMul(utils.accMul(utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee), _manageRate), _manageDiscount); // (未计算车运费之前的总价格+车运费)*管理费比例*管理费折扣,管理费
					
					_total = utils.accAdd( utils.accAdd(utils.accAdd(_disPrice,_undisPrice) , _transfee),  _managefee); // 未计算车运费之前的总价格+车运费+管理费=(未打折的总价格)

                    if (quo.basicParams["quotation.basePrice"] && quo.basicParams["quotation.basePrice"] != 0){
						//(工程基数 - 工程基数 % 基数) * 折扣 + 工程基数 % 基数 + 管理费
						var total = utils.accAdd(utils.accAdd(_disPrice,_undisPrice), _transfee);  //工程基数
						var remainder = total % quo.basicParams['quotation.basePrice']; //余数
						_dtotal = utils.accAdd(utils.accAdd(utils.accMul(utils.accSub(total,remainder),_discount),remainder),_managefee);
					} else {
                        //(未计算车运费之前的总价格+折扣后的车运费)+折扣后的管理费(打折后的总价格)
                        _dtotal = utils.changeThrDecimal(utils.accAdd(utils.accAdd(utils.accAdd(utils.accMul(_disPrice, _discount), _undisPrice), _dtransfee), _dmanagefee));
                    }
                    
					converyanceCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dtransfee)); // 显示到生成项目  车运费(未折扣的车运费)
					manageCost.find('.num .cell-wrap').text(utils.changeThrDecimal(_dmanagefee)); // 显示到生成项目  管理费(未折扣的管理费)
					
					com.focusPage('#disPrice').text(utils.changeThrDecimal(_disPrice));
                    com.focusPage('#undisPrice').text(utils.changeThrDecimal(_undisPrice));
					com.focusPage('#sumLabSumMoney').text(utils.changeThrDecimal(_total));
					com.focusPage('#sumLabDiscountMoney').text(utils.changeThrDecimal(_dtotal));

					quo.basicParams["quotation.totalPrice"] = utils.changeThrDecimal(_dtotal);
					quo.basicParams["quotation.managePrice"] = utils.changeThrDecimal(_managefee);//管理费
					quo.basicParams["quotation.manageRate"] = utils.changeThrDecimal(utils.accSub(_manageRate,quo.notSalesmanRate));//管理费比例
					quo.basicParams["quotation.trafficPrice"] = utils.changeThrDecimal(_transfee);//车运费
					quo.basicParams["quotation.trafficRate"] = utils.changeThrDecimal(_tranRate);//车运费比例
					quo.basicParams["quotation.undisPrice"] = utils.changeThrDecimal(_undisPrice);//非打折项折前总额
					quo.basicParams["quotation.disPrice"] = utils.changeThrDecimal(_disPrice);//打折项折前总额
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
