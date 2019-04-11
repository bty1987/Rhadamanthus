
var AddReduceDetail = (function(){

	var addReduceDetail = {
        addReduce: null,
		artype : null,//增减项类型 , "0":"增项", "1":"减项", "2":"漏项"
		orderid :null,//装修单号
		versionid : null,//报价版本
		ordertype : null,//订单类型
		discount : null,
		qid : null,//订单的默认报价编号
		arid : null,//增减项编号
		managePrice: 0,
		manageRate: 0,
		isCountIn: false,
		basicParams : {
			"addReduce.arId": null,
			"addReduceItem.arId": null,
			"addReduce.total" : 0
		},
		$modals : {},
		$btnItems : {},
        isCountManage : com.focusPage("#isCountManage").switchBtn("isOrNot"),
        quoManagePrice : 0,
        quoManageRate : 0,
		initModals : function(){
			var that = this;
			that.$modals = {
				//普通报价项弹窗
				addNormalItemModal : com.focusPage('#addNormalItemModal').on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//系统定义
				systemDefineItemModal : com.focusPage("#systemDefineItemModal").on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				//自定义添加
				addItemModal : com.focusPage("#addItemModal").on("show.bs.modal",function(){
					com.focusPage("#itemName").val("");
					com.focusPage("#quotationItemDes").val("");
					com.focusPage("#unitPrice").val("");
					com.focusPage("#num").val("");
					com.focusPage("#measurementUnit").get(0).selectedIndex = 0;
					com.focusPage("#workType").get(0).selectedIndex = 0;
				}),
				//功能区选择弹层
				functionAreaModal : com.focusPage("#functionAreaModal"),
				//报价项弹层
				quotationItemModal : com.focusPage("#quotationItemModal").on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				extensionItemModal :com.focusPage('#extensionItemModal').on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				}),
				addAddItemModal: com.focusPage('#addAddItemModal').on("show.bs.modal", function(a) {
					$('input[name="modalQuots"]:checked').removeAttr('checked');
				})
			};

			//系统定义弹出层
			var _condArr = ['itemName', 'quotationBigCategoryId', 'quotationWorkTypeId'];
			var addReduceDetailSeacher = new Searcher();
			addReduceDetailSeacher.init( _condArr, "condList", api.quotation.pageSystemDefineItemForEnable,  function(data){
				var $tableWrap = com.focusPage('#resultList').empty();
				var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

				if(data && data.length){
					$.each(data,function(i, v){
						v.workType = v.itemWorkType;
						var $liLine = painter.createQuoteModalItem(v, "sdiId");
						$liLine.appendTo($ul);
					});
					$ul.appendTo($tableWrap);
				}
			}, "pagenation", "systemDefineItemModalPostData");

			//普通报价项弹出层
			var extraParams  = {"quotationItem.versionId": addReduceDetail.versionid};
			var _condArrn = ['itemName', 'quotationBigCategoryId', 'quotationSmallCategoryId', 'quotationWorkTypeId'];
			var normalItemSeacher = new Searcher();
			normalItemSeacher.init( _condArrn, "condListn", api.quotation.pageQuotationItemByVersionId,  function(data){
				var $tableWrap = com.focusPage('#resultListn').empty();
				var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

				if(data && data.length){
					$.each(data,function(i, v){
						var $liLine = painter.createQuoteModalItem(v, "qiId");
						$liLine.appendTo($ul);
					});
					$ul.appendTo($tableWrap);
				}
			}, "pagenationn", "addNormalItemModalPostDatan", extraParams);
			//初始化自定义报价中的类型
			com.post(api.quotation.queryQuotationType, {},function(res) {
				com.focusPage("#quotationType").bindData(res.quotationTypes,"id", "name");
			});
			//新增报价项select初始化
            //单位
			com.post(api.common.queryMeasurementUnit,{},function(res){
				com.focusPage("#measurementUnit").bindData(res.measurementUnits, "name", "name");
			});
			//工种
			com.post(api.common.queryWorkType, {}, function(res){
				com.focusPage("#workType").bindData(res.workTypes, "name", "name");
			});

			//功能区选择弹出层 todo
			com.post(api.quotation.queryQuotationFunctionAreaForCommonByQuotationId, {"quotation.qid": that.qid}, function(res){
				com.focusPage("#addQuotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName");
				com.focusPage("#quotationFunctionAreaId").bindData(res.quotationFunctionAreas, "qfaId", "functionAreaName",false,null,"type");
			});
		},
		initBtnItems : function(){
			var that = this;

			that.$btnItems = {
				//选择普通报价项按钮点击(增项)
				addNormalItemBtn : com.focusPage('#addNormalItemBtn').on(ace.click_event, function(){
					modalEventBinding.showingModalName = "addNormalItemModal";
					that.$modals.functionAreaModal.modal("show");
				}),
				//新增(增项)
				addNewItemBtn : com.focusPage('#addNewItemBtn').on(ace.click_event, function(event){
					event.stopPropagation();
					com.clearValidator();
					that.$modals.addItemModal.modal("show");
				}),
				//报价项
				addQuotaionItemBtn : com.focusPage('#addQuotaionItemBtn').on(ace.click_event, function(){
					modalEventBinding.showingModalName = "quotationItemModal";
					that.$modals.functionAreaModal.modal("show");
				}),
				//系统定义
				addSystemDefineItemBtn : com.focusPage('#addSystemDefineItemBtn').on(ace.click_event, function(event){
					modalEventBinding.showingModalName = "systemDefineItemModal";
					that.$modals.functionAreaModal.modal("show");
				}),
				//增项
				addItemBtn: com.focusPage('#addItemBtn').on(ace.click_event, function(event){
					modalEventBinding.showingModalName = "addAddItemModal";
					that.$modals.functionAreaModal.modal("show");
				}),
				//扩展项
				extensionItemBtn:com.focusPage('#extensionItemBtn').on(ace.click_event, function(event){
					modalEventBinding.showingModalName = "extensionItemModal";
					that.$modals.functionAreaModal.modal("show");
				}),
				submitAddReduceDetailOKBtn : com.focusPage('#submitAddReduceDetailOKBtn').on(ace.click_event, function(event){

					var params = {};

					if (addReduceDetail.isCountIn && addReduceDetail.quoManageRate!=0 && addReduceDetail.managePrice!=0) {
                        params = {
                            'addReduce.arId': addReduceDetail.arid,
							'addReduce.total': addReduceDetail.basicParams['addReduce.total'],
                            "addReduce.managePrice": addReduceDetail.managePrice,
                            "addReduce.manageRate": addReduceDetail.quoManageRate
                        }
                    }else{
                        params = {
                            'addReduce.arId': addReduceDetail.arid,
                            'addReduce.total': addReduceDetail.basicParams['addReduce.total'],
                            "addReduce.managePrice": 0,
                            "addReduce.manageRate": 0
                        };
					}

					com.post( api.addReduce.submitAddReduce, params, function(){
						com.showAlert(com.info, '提交成功');
					}, null, false);
					
				}),//提交
//				saveAddReduceDetailBtn : com.focusPage('#saveAddReduceDetailBtn').on(ace.click_event, function(event){
//					//com.post( api.addReduce.updateAddReduceForAdvance, {'addReduce.arId' : addReduceDetail.arid, 'addReduce.total' : addReduceDetail.basicParams['addReduce.total']}, function(){
//					com.post( api.addReduce.updateAddReduceItem, {'addReduce.arId' : addReduceDetail.arid, 'addReduce.total' : addReduceDetail.basicParams['addReduce.total']}, function(){
//						com.showAlert(com.info, '保存成功');
//					}, null, false);
//				}),//保存
				detailBckBtn : com.focusPage('#detailBckBtn').on(ace.click_event, function(){//返回
					//com.focusPage("#fl-container").load(api.index.addReduceIndex.url);
					com.switchPage(api.index.addReduceIndex.url);
				})
			};
		},
		init : function(){
			this.initModals();
			this.initBtnItems();
		}
	};

	var arCalculator = {
		total : 0,//总金额
		//计算报价项各种值
		calculateQuoteFee : function($quote){

			var quotationFunctionAreaType = parseFloat($quote.find('.cell.line').attr("quotationFunctionAreaType"));
			var addReduceItemType = parseFloat($quote.find('.typedict').attr("data-type"));
			var _num = parseFloat($quote.find('.num .cell-wrap').text());
			var _unitprice = parseFloat($quote.find('.unitprice .cell-wrap').text());
			var _discountFlag = $quote.find('.discountprice').attr('data-discount');//1打折,0不打折
			var _discountprice = _unitprice;
			if([1, 3].indexOf(addReduceItemType) != -1){
				_discountprice = utils.changeTwoDecimal(utils.accMul( _discountprice, (_discountFlag == 1 || addReduceDetail.ordertype == 2 || addReduceDetail.ordertype == 3 ? utils.accDiv(addReduceDetail.discount, 10) : 1)));
			}else if([0, 2, 4].indexOf(addReduceItemType) != -1 && (addReduceDetail.ordertype == 2 || addReduceDetail.ordertype == 3)){

				//半价增项款不打折
				 _discountprice = utils.changeTwoDecimal(_discountprice);
			}
			/*_discountprice = quotationFunctionAreaType == 3 && [3].indexOf(addReduceItemType) != -1 ? 0 : utils.changeTwoDecimal(_discountprice) ;*/

			var _totalprice = utils.changeTwoDecimal(utils.accMul(_num ,  _unitprice));
			var _totalpriced =  utils.changeTwoDecimal( utils.accMul(_num ,  _discountprice));
			/*if(quotationFunctionAreaType == 3 &&  [3].indexOf(addReduceItemType) != -1){
				_totalprice = 0 , _totalpriced = 0 ;
			}*/

			/*if(addReduceDetail.artype == 0){
				params.decorationOrderType  == 2 ? _totalpriced = utils.accMul(_totalpriced,utils.accDiv(config.addreduceDiscount,10)):_totalpriced;
			}*/
			/*_totalpriced = utils.changeTwoDecimal(_totalpriced)*/
			return {
				discountprice : _discountprice,
				totalpriced : _totalpriced,
				totalprice : _totalprice
			};
		},
		changeQuoFee : function($quote, discountprice, totalpriced, totalprice){
			$quote.find('.discountprice .cell-wrap').text(discountprice);
			$quote.find('.totalprice-discount .cell-wrap').text(totalpriced);
			$quote.attr('data-totalprice', totalprice);
		},
		//计算增减项各种值
		calculateArFees : function(func){
			var $arr = $('.fl-quo-item:not([data-del-flag="1"])', '#addReduceItemDiv');
			var sum = 0, sumd = 0;

			if($arr.length){
				$arr.each(function(){
					$this = $(this);
					if(func){
						func($this);
					}
					var _totlaPrice = parseFloat($this.attr("data-totalprice"));
					var _totlaPriceDiscount = parseFloat($this.find('.totalprice-discount .cell-wrap').text());

					sum = utils.changeTwoDecimal(utils.accAdd(sum, _totlaPrice));
					sumd = utils.changeTwoDecimal(utils.accAdd(sumd, _totlaPriceDiscount));

				});
			}
			return {
				sum : sum,
				sumd : sumd
			};
		},
		changeSum : function (sum, sumd) {

            var quoManageRate = com.focusPage("#manageRate").text();
            var managePrice = utils.changeTwoDecimal(utils.accMul(sum, quoManageRate));

            if (com.focusPage("#isCountManage").prop("checked") == true){
                // 算入总价
                addReduceDetail.isCountIn = true;
                addReduceDetail.quoManageRate = quoManageRate;
                addReduceDetail.managePrice = managePrice;
                sum = utils.changeTwoDecimal(utils.accAdd(sum, managePrice));
                sumd = utils.changeTwoDecimal(utils.accAdd(sumd, managePrice));
            }
			com.focusPage('#sumLabSumMoney').text(sum);
			com.focusPage('#sumLabDiscountMoney').text(sumd);
			com.focusPage('#managePrice').text(managePrice);
			addReduceDetail.basicParams['addReduce.total'] = sumd;
		}
	};
	//弹层确定按钮事件绑定
	var modalEventBinding = {

		functionAreaId : null,
		functionAreaName : null,
		showingModalName : "",

		//功能区选择弹层确认按钮
		functionAreaModalConfirm : function(){

			var that = this;
			com.focusPage('#confirmItemBtn').off().on(ace.click_event, function(){
				var funcid = com.focusPage('#quotationFunctionAreaId').val();
				that.functionAreaId = funcid;
				that.functionAreaName = com.focusPage('#quotationFunctionAreaId').find('option:selected').text();

				if(that.showingModalName == "quotationItemModal"){
					var _params = {
						"quotationFunctionAreaItem.quotationFunctionAreaId" : funcid
					};
					com.post(api.quotation.queryQuotationFunctionAreaItemByQuotationFunctionAreaId, _params, function(res){
						var $tableWrap = com.focusPage('#quolist', addReduceDetail.$modals.quotationItemModal).empty();
						var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

						if(res.quotationFunctionAreaItems && res.quotationFunctionAreaItems.length){
							$.each(res.quotationFunctionAreaItems,function(i, v){
								v.quotationItemDes = v.content;
								var $liLine = painter.createQuoteModalItem(v, "qfaiId");
								$liLine.appendTo($ul);
							});
							$ul.appendTo($tableWrap);
						}
					}, null, false);
				}else if(that.showingModalName == "addAddItemModal"){
					
					var index = 0;
					var arIds = {};
					
					com.post(api.addReduce.queryAddReduceForPayedByOrderId, {"addReduce.orderId": addReduceDetail.orderid}, function(res){
						$.each(res.addReduces, function(i, v){
							if(v.type == 0){
								arIds['addReduceIds[' + index + ']'] = v.arId;
								index++;
							}
						});
					}, null, false);

					com.post(api.addReduce.queryAddReduceItemByAddReduceIds, arIds, function(res){
						var $tableWrap = com.focusPage('#addItemList', addReduceDetail.$modals.addAddItemModal).empty();
						var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');
						
						if(res.addReduceItems && res.addReduceItems.length){
							$.each(res.addReduceItems, function(i, v){
								if(v.quotationFunctionAreaId == funcid) {
									v.quotationItemDes = v.content;
									var $liLine = painter.createQuoteModalItem(v, "ariId");
									$liLine.appendTo($ul);
								}
							});
							$ul.appendTo($tableWrap);
						}
					}, null, false);
					
				}else if(that.showingModalName == 'extensionItemModal'){
					var index = 0;
					var eids = {};
					com.post(api.quotation.queryExtensionByOrderId, {"extension.orderId": addReduceDetail.orderid,"extension.type": 0}, function(res){
						$.each(res.extensions, function(i, v){
							eids['extensionItemIDs[' + index + ']'] = v.eid;
							index++;
						});
					}, null, false);

					com.post(api.quotation.queryExtensionItemByEids, eids, function(res){
						var $tableWrap = com.focusPage('#extensionItemList', addReduceDetail.$modals.extensionItemModal).empty();
						var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

						if(res.extensionItems && res.extensionItems.length){
							$.each(res.extensionItems, function(i, v){
								if(v.quotationFunctionAreaId == funcid) {
									v.quotationItemDes = v.content;
									var $liLine = painter.createQuoteModalItem(v, "eiId");
									$liLine.appendTo($ul);
								}
							});
							$ul.appendTo($tableWrap);
						}
					}, null, false);
				}

				addReduceDetail.$modals.functionAreaModal.modal('hide');
				addReduceDetail.$modals[that.showingModalName].modal("show");
			});
		},
		// 0表示普通报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 , 4表示增项中项目
		//普通报价项确认按钮点击
		addNormalItemModalConfirm : function(){
			com.focusPage('#saveaddNormalItemBtn').off().on(ace.click_event, function(){
				quote.addQuotesFromModal(0);
				addReduceDetail.$modals.addNormalItemModal.modal('hide');
			});
		},
		//系统定义报价项确认按钮点击
		systemDefineItemModalConfirm : function(){
			com.focusPage('#systemDefineItemBtn').off().on(ace.click_event, function(){
				quote.addQuotesFromModal(1);
				addReduceDetail.$modals.systemDefineItemModal.modal('hide');
			});
		},
		//报价中项目确认按钮点击
		quotationItemModalConfirm : function(){
			com.focusPage('#addItemsBtn').off().on(ace.click_event, function(){
				quote.addQuotesFromModal(3);
				addReduceDetail.$modals.quotationItemModal.modal('hide');
			});
		},
		
		addAddItemModalConfirm: function(){
			com.focusPage('#addAddItemBtn').off().on(ace.click_event, function(){
				quote.addQuotesFromModal(4);
				addReduceDetail.$modals.addAddItemModal.modal('hide');
			});
		},
		extensionItemModalConfirm:function(){
			com.focusPage('#exItemBtn').off().on(ace.click_event, function(){
				quote.addQuotesFromModal(5);
				addReduceDetail.$modals.extensionItemModal.modal('hide');
			});
		},

		//自定义报价项确认按钮点击
		addItemModalConfirm : function(){
			com.focusPage("#saveAddItemBtn").on(ace.click_event, function(event){
				if(com.validate("addItemModal")) return;

				var addRow = {
					"num" : com.focusPage("#num").val(),//工程预算量
					"itemName" : com.focusPage("#itemName").val(),//名称
					"quotationFunctionAreaId" : com.focusPage("#addQuotationFunctionAreaId").val(),//功能区
					"quotationFunctionAreaName" : com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),
					"measurementUnit" : com.focusPage("#measurementUnit").val(),//单位
					"unitPrice" : com.focusPage("#unitPrice").val(),//单价(折后单价、总价为计算值)
					"workType" : com.focusPage("#workType").val(),//工种
					"content" : com.focusPage("#quotationItemDes").val(),//工艺说明
					"subtype" : com.focusPage("#quotationType").val(),
					"type" : 2,//类型(隐藏属性)
					"discount" : 0
					//"ariId" : "",//增减项中报价项的id
				};

				/*
				 api.addReduce.updateAddReduceItem ,
				 参数 :
				 ,
				 "data-quoteItemId" : qv.quoteItemId
				 addReduceItem.quoteItemId , 引用报价项Id , type类型为0, 1, 3需要传递该参数 , 同时分别传递普通报价项id , 系统定义项id , 报价中报价项Id ;
				 addReduceItem.content , 说明信息 , type类型为2需要传递该参数 .
				 */

				var args = {
					"addReduceItem.discount" : addRow.discount,//是否打折;
					"addReduceItem.ariId" : "",//增减项报价项Id , 新建无此参数;
					"addReduceItem.itemName" : addRow.itemName,//项目名;
					"addReduceItem.type" : addRow.type,//增减项类型 , 0表示普通报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 ;
					"addReduceItem.subtype" : addRow.subtype,//1工程,2主材
					"addReduceItem.measurementUnit" : addRow.measurementUnit,//单位 ;
					"addReduceItem.workType" : addRow.workType,//工种 ;
					"addReduceItem.unitPrice" : addRow.unitPrice,//单价 ;
					"addReduceItem.num" : addRow.num,//工程量 ;
					"addReduceItem.quotationFunctionAreaId" : addRow.quotationFunctionAreaId,//所属功能区Id ;
					"addReduceItem.quotationFunctionAreaName" : com.focusPage("#addQuotationFunctionAreaId").find('option:selected').text(),//所属功能区name ;
					"addReduceItem.content" : addRow.content
				};
				var _index = $('.fl-quo-item', '#addReduceItemDiv').length;
				var $item = painter.createQuote(_index + 1, addRow).appendTo(com.focusPage('#addReduceItemDiv > ul'));

				var qfobj = arCalculator.calculateQuoteFee($item);
				arCalculator.changeQuoFee($item, qfobj.discountprice, qfobj.totalpriced, qfobj.totalprice);

				var sumobj = arCalculator.calculateArFees();

				var _params = $.extend(true, {}, args, addReduceDetail.basicParams, {"addReduce.total" : sumobj.sumd});

				com.post(api.addReduce.updateAddReduceItem, _params, function(res){
					$item.find('input[name="deleteItems"]').val(res.addReduceItem.ariId);
					arCalculator.changeSum(sumobj.sum, sumobj.sumd);
				}, null, false);

				addReduceDetail.$modals.addItemModal.modal("hide");
			});
		},
        changeTotalIsCountIn: function () {
            addReduceDetail.isCountManage.on(ace.click_event, function (e) {
				var $this = $(this);

                var oldTotal = com.focusPage('#sumLabSumMoney').text();
                var oldDtotal = com.focusPage('#sumLabDiscountMoney').text();
                var quoManagePrice = com.focusPage("#managePrice").text();
                var quoManageRate = com.focusPage("#manageRate").text();

                var total=0,dtotal=0;

                if ($this.prop("checked") == true) {
                    addReduceDetail.isCountIn = true;
                    total = utils.changeTwoDecimal(utils.accAdd(oldTotal, quoManagePrice));
                    dtotal = utils.changeTwoDecimal(utils.accAdd(oldDtotal, quoManagePrice));

                    addReduceDetail.managePrice = quoManagePrice;
                    addReduceDetail.quoManageRate = quoManageRate;

                }else if($this.prop("checked") == false){
                    addReduceDetail.isCountIn = false;
                    total = utils.changeTwoDecimal(utils.accSub(oldTotal, quoManagePrice));
                    dtotal = utils.changeTwoDecimal(utils.accSub(oldDtotal, quoManagePrice));

                    addReduceDetail.managePrice = 0;
                    addReduceDetail.quoManageRate = 0;
				}
                com.focusPage('#sumLabSumMoney').text(total);
                com.focusPage('#sumLabDiscountMoney').text(dtotal);
                addReduceDetail.basicParams['addReduce.total'] = dtotal;

                var params = {
                    'addReduce.arId': addReduceDetail.arid,
                    'addReduce.total': dtotal,
                    "addReduce.managePrice": addReduceDetail.managePrice,
                    "addReduce.manageRate": addReduceDetail.quoManageRate
                };

				com.post( api.addReduce.submitAddReduce, params, function(){
					com.showAlert(com.info, '更新成功');
				}, null, false);
			});
		},
		init : function(){
			this.functionAreaModalConfirm();
			this.addNormalItemModalConfirm();
			this.systemDefineItemModalConfirm();
			this.quotationItemModalConfirm();
			this.addAddItemModalConfirm();
			this.extensionItemModalConfirm();
			this.addItemModalConfirm();
			this.changeTotalIsCountIn();
		}
	};

	//报价项操作
	var quote = {

		quotesRecord  : [],
		$nowLine : null,
		$nowEditInput : null,
		//排序报价项
		sortQuote : function(){
			var $arr = $('.fl-quo-item', '#addReduceItemDiv');
			if(!$arr){
				return
			}
			$arr.each(function(){
				$this = $(this);
				$this.find('.line .cell-wrap').text($this.index() + 1);
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
			}
		},

		/*
		* 添加弹窗中的报价项到增减项报价项区域
		* type : 0表示普通报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目,4表示增减项中项目,5表示扩展项中项目
		* */
		addQuotesFromModal : function(type){
			var that = this;
			var $arwrap = com.focusPage('#addReduceItemDiv');
			var _arrs = that.quotesRecord;
			var _index = $arwrap.find('.fl-quo-item').length;
			if(!_arrs.length){
				return;
			}

			$.each(_arrs, function(i, v){
				var $this = $(v);
				var $li = $this.parents('.fl-table-list > li');

				if($this.val() && $('input[data-qiid="' + $this.val() +'"]', '#addReduceItemDiv').length){
					return;
				}

				var unitPrice = parseFloat($li.find("li .unitPrice").text() ? $li.find("li .unitPrice").text() : 0);
                if (addReduceDetail.artype == 0){ //增项
					unitPrice = parseFloat($li.find("li .addPrice").text() ? $li.find("li .addPrice").text() : unitPrice);
				}else if(addReduceDetail.artype == 1){ //减项
                    unitPrice = parseFloat($li.find("li .subPrice").text() ? $li.find("li .subPrice").text() : unitPrice);
				}

				var _quotval = {
					"num" : 0,//工程预算量
					"itemName" : $li.find('.lbl').text(),//名称
					"quotationFunctionAreaId" : modalEventBinding.functionAreaId,//功能区
					"quotationFunctionAreaName" : modalEventBinding.functionAreaName,//功能区
					"quotationBigCategory" : $li.find("li .quotationBigCategory").text(),//大类
					"measurementUnit" : $li.find("li .measurementUnit").text(),//单位
					// "unitPrice" : parseFloat($li.find("li .unitPrice").text() ? $li.find("li .unitPrice").text() : 0),//单价(折后单价、总价为计算值)
                    "unitPrice" : unitPrice,
					"content" : $li.find("li .quotationItemDes").text(),//工艺说明
					"workType" : $li.find("li .workType").text(),//工种
					"quotationFunctionAreaType" : $this.attr('quotationFunctionAreaType'),
					"type" : type,//类型(隐藏属性)
					"subtype" :$this.attr("data-quotationType") ,
					"ariId" : "",//增减项中报价项的id
					"quoteItemId" : $this.val(),//id(隐藏属性)
					"discount" : $this.attr('data-discount-flag')
				};
				var $item = painter.createQuote( _index + i + 1, _quotval);
				$item.appendTo($arwrap.find('.fl-quo-list'));
			});
			quote.quotesRecord = [];
		},

		/*选中报价项显示编辑input*/
		getNumCellFocus : function($line){
			var that = this;
			var $numCell = $line.find('.cell.num');
			var $arwrap = com.focusPage('#addReduceItemDiv');
			var $editInput = that.$nowEditInput ? that.$nowEditInput : $arwrap.find('.fl-quo-input');

			$('.fl-quo-item.current').removeClass('current');
			$line.addClass('current');
			$editInput.removeClass('hide').appendTo($numCell).find('input').val(null).focus();
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
				if(com.validate()){
					return;
				}
				var oldmum = that.$nowLine.find('num .cell-wrap').text() ? that.$nowLine.find('num .cell-wrap').text() : '0';
				that.$nowLine.find('.cell.num .cell-wrap').text(num);
				$line = that.$nowLine.next('.fl-quo-item');
				var _type = that.$nowLine.find('.typedict').attr('data-type');

				/*
				api.addReduce.updateAddReduceItem ,
					参数 :
					 ,
					"data-quoteItemId" : qv.quoteItemId
					addReduceItem.quoteItemId , 引用报价项Id , type类型为0, 1, 3需要传递该参数 , 同时分别传递普通报价项id , 系统定义项id , 报价中报价项Id ;
					addReduceItem.content , 说明信息 , type类型为2需要传递该参数 .
				*/
				var args = {
					"addReduceItem.discount" : that.$nowLine.find('.discountprice').attr("data-discount"),//是否打折
					"addReduceItem.ariId" : that.$nowLine.find('input[name="ariid"]').val(),//增减项报价项Id , 新建无此参数;
					"addReduceItem.itemName" : that.$nowLine.find('.name .cell-wrap').text(),//项目名;
					"addReduceItem.type" : _type,//增减项类型 , 0表示普通报价项 , 1表示系统定义 , 2表示自定义 , 3表示报价中项目 ;
					"addReduceItem.subtype" : that.$nowLine.find('.subtypedict').attr('data-subtype'),
					"addReduceItem.measurementUnit" : that.$nowLine.find('.unit .cell-wrap').text(),//单位 ;
					"addReduceItem.workType" : that.$nowLine.find('.worktype .cell-wrap').text(),//工种 ;
					"addReduceItem.unitPrice" : that.$nowLine.find('.unitprice .cell-wrap').text(),//单价 ;
					"addReduceItem.num" : that.$nowLine.find('.num .cell-wrap').text(),//工程量 ;
					"addReduceItem.quotationFunctionAreaId" : that.$nowLine.find('.quotationFunctionArea').attr('data-quotationfunctionareaid'),//所属功能区Id ;
				};

				if(_type != 2){
					args["addReduceItem.quoteItemId"] = that.$nowLine.find('input[name="ariid"]').attr('data-quoteitemid');// , 报价项Id , 普通类型报价项需要传递 "data-qiid"
				}
				if(_type == 2){
					args["quotationFunctionAreaItem.content"] = that.$nowLine.prop('title');// , 报价项说明 , 自定义类型报价项需要传递 ;
				}

				var qfobj = arCalculator.calculateQuoteFee(that.$nowLine);
				that.$nowLine.attr('data-del-flag', 1);
				var sumobj = arCalculator.calculateArFees();
				com.clearValidator();
				var _params = $.extend(true, {}, args, addReduceDetail.basicParams, {"addReduce.total" : sumobj.sumd + qfobj.totalpriced});
				com.post(api.addReduce.updateAddReduceItem, _params, function(res){
					that.$nowLine.removeAttr('data-del-flag');
					arCalculator.changeQuoFee(that.$nowLine, qfobj.discountprice, qfobj.totalpriced, qfobj.totalprice );
					that.$nowLine.find('input[name="ariid"]').val(res.addReduceItem.ariId);
					arCalculator.changeSum(sumobj.sum + qfobj.totalprice, sumobj.sumd + qfobj.totalpriced);
					if($line.length){
						that.getNumCellFocus($line);
					}else{
						that.hideInputWrap();
					}
				}, function(res){
					com.showAlert(com.error, res.errorMsg);
					that.$nowLine.find('.cell.num .cell-wrap').text(oldmum);
					that.$nowLine.removeAttr('data-del-flag');
				}, false);
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
		//点击页面其他位置时清除表格行的选中样式
		clearQuoteSelected : function(){
			var that = this;
			$('body').click( function(e){
				if(!$(e.target).is('.cell-wrap') && !$(e.target).is('[data-action="collapse"]')){
					that.hideInputWrap();
				}
			});
		},

		//删除报价项
		deleteQuote : function($quote){
			var that = this;
			var _qid = $quote.find('input[type="hidden"]').val();
			var _params = {};
			var $rqwrap = com.focusPage('#addReduceItemDiv');
			$rqwrap.find('.fl-quo-input').insertAfter($rqwrap.find('.fl-quo-list')).addClass('hide');
			if(!_qid){
				$quote.remove();
			}else{
				$quote.attr('data-del-flag',1);
				that.sortQuote();
				var sumobj = arCalculator.calculateArFees();

				_params = [];
				_params["addReduceItem.ariId"] = _qid;
				_params["addReduce.arId"] = addReduceDetail.basicParams["addReduce.arId"];
				_params["addReduce.total"] = sumobj.sumd;

				com.post(api.addReduce.deleteAddReduceItem, _params, function(res){
					$quote.remove();
					arCalculator.changeSum(sumobj.sum, sumobj.sumd);
				}, function(res){
					com.showAlert(com.error, res.errorMsg);
					$quote.removeAttr('del-flag');
				}, false);
			}
		},

		init : function(){
			this.clearQuoteSelected();
		}
	};

	var painter = {
		//创建添加报价项弹窗中的报价项 .sdiId

		createQuoteModalItem : function(v, idname){
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').css({"margin-bottom" : 0});
			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type" : "checkbox",
				"name" : "modalQuots",
				"class" : "ace ace-checkbox-2",
				"data-discount-flag" : v.discount,
				"data-quotationType" : v.quotationTypeId ? v.quotationTypeId : v.subtype,
				"quotationFunctionAreaType" : com.focusPage('#quotationFunctionAreaId').find('option:selected').attr("other")
				//功能区
			}).val(v[idname]);

			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.itemName);

			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			
			var propertyArr = [
				["编号:", v.itemId, "grey"],
				["大类:", v.quotationBigCategory, "grey quotationBigCategory"],
				["单位:", v.measurementUnit, "grey measurementUnit"],
				["工种:", v.workType, "grey workType"],
                ["增补价:", v.addPrice, "grey addPrice"],
				["单价:", v.unitPrice, "grey unitPrice"],
                ["退减价:", v.subPrice, "grey subPrice"],
				["工程量:", v.num, "grey"],
				["说明:", v.quotationItemDes, "grey quotationItemDes"],
				["是否打折:", v.discount == 1 ? '打折' : '不打折', "red"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				if(value[1]){
					$('<strong></strong>').html(value[0]).appendTo($liProperty);
					$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
					$liProperty.appendTo($ulProperty);
				}
			});

			$label.append($input).append($span).appendTo($h3);
			$liLine.append($h3).append($ulProperty);

			$input.change(function(){
				var $this = $(this);
				quote.recordQuots($this, $(this).is(':checked'));
			});

			return $liLine;
		},

		//创建报价项

		createQuote : function(linenum, qv){
			var $item = $('<li></li>').addClass('fl-quo-item').prop('title',qv.content);
			var typeDict = {"0" : "普通", "1" : "系统", "2" : "自定义", "3" : "报价中", "4": "增项","5":"扩展项"};
			var _subtype = {"1" : "工程","2" : "主材"};
			var _dcp = utils.changeTwoDecimal(qv.unitPrice);

			if([1, 3].indexOf(qv.type) != -1){
				_dcp = utils.changeTwoDecimal(utils.accMul( _dcp, (qv.discount == 1 || addReduceDetail.ordertype == 2 || addReduceDetail.ordertype == 3 ? utils.accDiv(addReduceDetail.discount, 10) : 1)));
			}else if([0, 2, 4].indexOf(qv.type) != -1 && (addReduceDetail.ordertype == 2 || addReduceDetail.ordertype == 3)){
				//半价增项款8.8折
				//_dcp =  utils.changeTwoDecimal(utils.changeTwoDecimal(utils.accMul(_dcp,utils.accDiv(config.addreduceDiscount, 10))));
				//半价增项款改为不打折

			}
			/*if(qv.quotationFunctionAreaType == 3 && [3].indexOf(qv.type) != -1){
				_dcp = 0;
			}*/
			var total = utils.changeTwoDecimal(utils.accMul(qv.num ,  _dcp));
			var _lineSet = [
				["line", linenum,['quotationFunctionAreaType',qv.quotationFunctionAreaType]],
				["num subtypedict", qv.num,['data-subtype',qv.subtype]],//工程预算量
				["name", qv.itemName],//名称
				["type typedict",typeDict[qv.type], ['data-type', qv.type]],//类型
				["worktype", qv.workType],//工种
				["type quotationFunctionArea", qv.quotationFunctionAreaName ? qv.quotationFunctionAreaName : "---", ["data-quotationFunctionAreaId", qv.quotationFunctionAreaId]],//功能区
				["unit", qv.measurementUnit],//单位
				["price unitprice", qv.unitPrice],//单价
				["price discountprice", _dcp, ["data-discount", addReduceDetail.artype == 0 ?  "0" : qv.discount]],//折后单价
				["price totalprice-discount",  utils.changeTwoDecimal(total),["style", "white-space:nowrap"]],//总价
			];

			var $btnCell, $btnCellWrap, $input, $btnDel, $btnInfo;

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
			$input = $('<input>').attr({
				"type" : "hidden",
				"name" : "ariid",
				"data-quoteItemId" : qv.quoteItemId
			}).val(qv.ariId);

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
			$btnCellWrap.append($input).append($btnDel).append($btnInfo).appendTo($btnCell);
			$item.append($btnCell);

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

			 $item.attr('data-totalprice', utils.changeTwoDecimal(utils.accMul(qv.num ,  qv.unitPrice)));

			return $item;
		}
	};

	return {
		init : function(){

			var _type = params["addReduce.type"];//"0":"增项", "1":"减项", "2":"漏项"
			addReduceDetail.artype = _type;
			addReduceDetail.addReduce = params["addReduce"];
			// addReduce的管理费
            addReduceDetail.managePrice = params["addReduce"].managePrice;
            addReduceDetail.manageRate = params["addReduce"].manageRate;
			if(_type == "0"){
				com.focusPage('#sumLabType').text('增项');
				com.focusPage('#addNormalItemBtn').removeClass('hide');
				com.focusPage('#addNewItemBtn').removeClass('hide');
                com.focusPage('.unitprice .cell-wrap').text('增补价');
			}

			if(_type == "1"){
				com.focusPage('#sumLabType').text('减项');
				com.focusPage('#extensionItemBtn').removeClass('hide');
				com.focusPage('#addQuotaionItemBtn').removeClass('hide');
				com.focusPage('#addSystemDefineItemBtn').removeClass('hide');
				com.focusPage('#addItemBtn').removeClass('hide');
			}
			addReduceDetail.ordertype = params.decorationType;
			addReduceDetail.arid = params.addReduceId;
			addReduceDetail.basicParams["addReduce.arId"] = params.addReduceId;
			addReduceDetail.basicParams["addReduceItem.arId"] = params.addReduceId;
			addReduceDetail.orderid = params.decorationOrderId;//装修单号

            //根据装修单号获取默认报价
			var decorationOrderType = params.decorationOrderType;
			com.post(api.quotation.queryQuotationForDefaultByOrderId, {"quotation.orderId" : addReduceDetail.orderid, "quotation.type": decorationOrderType}, function(res){
				addReduceDetail.discount = res.quotation.discount;
				com.focusPage('#sumLabDiscount').text(addReduceDetail.discount);

				addReduceDetail.qid = res.quotation.qid;
				addReduceDetail.versionid = res.quotation.versionId;

				// 报价中的管理费
                com.focusPage('#manageRate').text(res.quotation.manageRate);
                com.focusPage('#managePrice').text(addReduceDetail.managePrice);

                addReduceDetail.quoManageRate = res.quotation.manageRate;

			}, null, false);

			com.post(api.addReduce.queryAddReduceItemByAddReduceId, {"addReduce.arId" : addReduceDetail.arid}, function(res){
				//res.addReduceItems

				var $ul =$('<ul></ul>').addClass('fl-quo-list').appendTo(com.focusPage('#addReduceItemDiv'));
				if(res.addReduceItems && res.addReduceItems.length){
					$.each(res.addReduceItems, function(i, v){
						var $item = painter.createQuote(i + 1, v);
						$item.appendTo($ul);
					});
				}
				var sumobj = arCalculator.calculateArFees();
				
				arCalculator.changeSum(sumobj.sum, sumobj.sumd);

			}, null, false);

			if (addReduceDetail.managePrice==0 || addReduceDetail.manageRate==0) {
                addReduceDetail.isCountManage.prop("checked", com.isOrNotType["否"]);
                addReduceDetail.isCountIn = false;
            }else{
                addReduceDetail.isCountManage.prop("checked", com.isOrNotType["是"]);
                addReduceDetail.isCountIn = true;

                com.focusPage('#sumLabSumMoney').text(utils.changeTwoDecimal(utils.accAdd(com.focusPage('#sumLabSumMoney').text(), addReduceDetail.managePrice)));
                com.focusPage('#sumLabDiscountMoney').text(utils.changeTwoDecimal(utils.accAdd(com.focusPage('#sumLabDiscountMoney').text(), addReduceDetail.managePrice)));
                addReduceDetail.basicParams['addReduce.total'] = com.focusPage('#sumLabSumMoney').text();
            }

			addReduceDetail.init();
			modalEventBinding.init();
			quote.init();
		}
	};
})();

$(function(){
	AddReduceDetail.init();
});