
jQuery(function($) {

	var materialSubOrderItemPostData = {};
	var refundMaterialSubOrderData = {};
	var refundMaterialSubOrderItemData = {};
	var refundMaterialSubOrderItemIdData = [];
	var updateMaterialSubOrderItemData = [];
	var deleteMaterialSubOrderItemData = [];

	var materialSubOrderDetail = {
		saveRefundBtn : $("#saveRefundBtn").on("click", saveRefundData),
		//返回按钮
		backBtn : $("#backBtn").on("click", function(){
			com.switchPage(api.index.materialSubOrderIndex.url);
		}),
		rejectMaterialSubOrderModal : $("#rejectMaterialSubOrderModal").on('show.bs.modal',function(e){
			$("#refund").val("");
			$("#refundDes").val("");
			com.updateChosen('approver', '', '');
			com.clearValidator();
			com.clearValidator("#refund", true);
		}),
		//退货按钮
		refundBtn : $("#refundBtn").on("click", function(){

			var $checkedItems = $("[name='refund']:checked", '#list');
			if(!$checkedItems.length) return;

			$checkedItems.each(function(i, e){
				var $this = $(this);
				
				var $line = $this.parents('.line');
				
				if($line.attr('packageName') != ''){
					$.each($('[packageName=' + $line.attr('packageName') + ']'), function(i, v){
						var $li = $(v);
						
						var $option = $li.find('.option');
						var $check = $option.find('label');
						var $refund = $option.children('input[name="refundnum"]').val(null);
						$check.addClass('hide');
						$refund.removeClass('hide');
					});
				}else{
					var $option = $this.parents('.option');
					var $check = $this.parents('.option > label');
					var $refund = $option.children('input[name="refundnum"]').val(null);
					$check.addClass('hide');
					$refund.removeClass('hide');
				}
			});
			
			$(this).addClass('hide');
			materialSubOrderDetail.refundCommitBtn.removeClass('hide');
			materialSubOrderDetail.refundCancelBtn.removeClass('hide');
			materialSubOrderDetail.fullRefundBtn.addClass('hide');
			materialSubOrderDetail.daodanBtn.addClass('hide');
		}),
		//全退按钮
		fullRefundBtn: $('#fullRefundBtn').on("click", function(){
			
			var options = {};
			
			$("#refundTotal").val(fullFunctionData(options));
			refundMaterialSubOrderItemData = options;
			
			materialSubOrderDetail.refundType = 6;
			materialSubOrderDetail.rejectMaterialSubOrderModal.modal("show");

			console.log(refundMaterialSubOrderItemData);
		}),
		//倒单按钮
		daodanBtn: $('#daodanBtn').on("click", function(){
			
			var options = {};
			
			$("#refundTotal").val(fullFunctionData(options));
			refundMaterialSubOrderItemData = options;
			
			materialSubOrderDetail.refundType = 7;
			materialSubOrderDetail.rejectMaterialSubOrderModal.modal("show");

			console.log(refundMaterialSubOrderItemData);
		}),
		//退货确认按钮
		refundCommitBtn : $("#refundCommitBtn").click(function(){
			
			$('.popover.fade').remove(); // 取消提示信息

			var $checkedItems = $("[name='refundnum']:visible", '#list');
			
			var index = 0;
			var numRex = /^(\d+|\d+\.[0-9]{1,4})$/;
			var refundFlag = true;
			var totalPrice = 0;
			var options = {};
			
			$checkedItems.each(function(i, e){
				var linetotal = 0;
				
				var $this = $(this);
				var $line = $this.parents('li.line');
				
				if($line.attr('level') == 0 && $line.attr('isleaf') == 'false'){
					var $numOld = $line.find('.total'), $numNew = $this.parents('.option').children('input[name="refundnum"]');
				}else{
					var $numOld = $line.find('.num'), $numNew = $this.parents('.option').children('input[name="refundnum"]');
				}
				var _numOld = parseFloat($numOld.text()), _numNew = parseFloat($numNew.val());
				
				var _price = parseFloat($line.find('.price').text());
				
				if(!numRex.test(_numNew)){
					$numNew.focus().select();
					$numNew.addClass('tooltip-info').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "请输入大于零的数字!"
					}).popover('show');
					refundFlag = false;
					return false;
				}

				if(_numNew > _numOld){
					$numNew.focus().select();
					$numNew.addClass('tooltip-info').attr({
						"data-rel" : "popover",
						"data-placement" : "top",
						"data-original-title" : "",
						"title" : "",
						"data-content" : "退货总数不能超过原有总数!"
					}).popover('show');
					refundFlag = false;
					return false;
				}
				
				$numNew.popover('destroy');
				
				if($line.attr('level') == 0 && $line.attr('isleaf') == 'true'){
					linetotal= utils.changeTwoDecimal(utils.accMul(_numNew, _price));
					totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, linetotal));
					
					options["approvalMaterialRefundItems[" + index + "].materialSubOrderItem.msoiId"] = $line.attr('msoiid');
					options["approvalMaterialRefundItems[" + index + "].num"] = _numNew;
					options["approvalMaterialRefundItems[" + index + "].total"] = linetotal;
					
					index++;
				}else if($line.attr('level') == 1 && $line.attr('isleaf') == 'true'){
					
					_numNew = utils.changeTwoDecimal(parseFloat($line.find('input').val()));
					_totalNew = utils.changeTwoDecimal(parseFloat($('[packageName=' + $line.attr('packageName') + '][level=0]').find('input[name="refundnum"]').val()));
					
					options["approvalMaterialRefundItems[" + index + "].materialSubOrderItem.msoiId"] = $line.attr('msoiid');
					options["approvalMaterialRefundItems[" + index + "].num"] = _numNew;
					options["approvalMaterialRefundItems[" + index + "].total"] = _totalNew;
					
					index++;
				}else{
					linetotal = utils.changeTwoDecimal(parseFloat($line.find('input[name="refundnum"]').val()));
					totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, linetotal));
				}
				
				$numNew.attr({
					"data-resnum" : utils.accSub(_numOld,_numNew),
					"data-restotal" : utils.changeTwoDecimal(utils.accMul(utils.accSub(_numOld,_numNew), _price))
				});
			});
			
			if(!refundFlag){
				return;
			}
			
			$("#refundTotal").val(totalPrice);
			refundMaterialSubOrderItemData = options;
			
			materialSubOrderDetail.refundType = 0;
			materialSubOrderDetail.rejectMaterialSubOrderModal.modal("show");

			console.log(refundMaterialSubOrderItemData);
		}),
		//退货取消按钮
		refundCancelBtn : $("#refundCancelBtn").click(function(){
			
			$('.popover.fade').remove(); // 取消提示信息
			
			var $checkedItems = $("[name='refund']:checked", '#list');
			$checkedItems.each(function(i, e){
				var $this = $(this);
				
				var $line = $this.parents('.line');
				
				if($line.attr('packageName') != ''){
					$.each($('[packageName=' + $line.attr('packageName') + ']'), function(i, v){
						var $li = $(v);
						
						var $option = $li.find('.option');
						var $check = $option.find('label');
						var $refund = $option.children('input[name="refundnum"]').val(null);
						$check.removeClass('hide');
						$refund.addClass('hide');
					});
				}else{
					var $option = $this.parents('.option');
					var $check = $this.parents('.option > label');
					var $refund = $option.children('input[name="refundnum"]').val(null);
					$check.removeClass('hide');
					$refund.addClass('hide');
				}
				
				$this.removeAttr('checked');
			});

			materialSubOrderDetail.refundBtn.removeClass('hide');
			materialSubOrderDetail.refundCommitBtn.addClass('hide');
			materialSubOrderDetail.fullRefundBtn.removeClass('hide');
			materialSubOrderDetail.daodanBtn.removeClass('hide');
			$(this).addClass('hide');
		}),

		modal: null,
		materialSubOrderDetailItems: {},
		
		refundType: 0,

		columnNames:["materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName"],
		disabledColumnNames: ["materialTypeName", "materialBrandName", "measurementUnitName", "salePrice", "price"],
		mmIdLimit: 2,
		record: {},
		_noValue: {},
		_noAction: {},
		_actionValue: {},
		editFlag: false
	};

	var refundMaterialSubOrderItemArgs = {};

	var autoFillList = [];
	var autoFillNameList = [];

	$('#fl-statement').statement("主材订单", "型号信息");

	if(materialSubOrderPostData["materialSubOrder.fullStatus"] ==2 || materialSubOrderPostData["materialSubOrder.fullStatus"] ==3 ){
		$("#refundBtn").removeClass('hide');
	}

	materialSubOrderItemPostData["materialSubOrder.msoId"] = materialSubOrderPostData["materialSubOrder.msoId"];
	materialSubOrderItemPostData["materialSubOrder.msoNo"] = materialSubOrderPostData["materialSubOrder.msoNo"];
	materialSubOrderItemPostData["materialSubOrder.customerId"] = materialSubOrderPostData["materialSubOrder.customerId"];
	materialSubOrderItemPostData["materialSubOrder.customerName"] = materialSubOrderPostData["materialSubOrder.customerName"];
	materialSubOrderItemPostData["materialSubOrder.materialBrand"] = materialSubOrderPostData["materialSubOrder.materialBrand"];
	materialSubOrderItemPostData["materialSubOrder.maling"] = materialSubOrderPostData["materialSubOrder.maling"];
	materialSubOrderItemPostData["materialSubOrder.venderMaling"] = materialSubOrderPostData["materialSubOrder.venderMaling"];

	com.initChosen('approver', api.system.queryApproveUserForNameByType, "user.userNamePinYin", {"userApprove.type": 6}, "autoFillKeyValue", "key", "value");
	
	function initList(){
		com.post(api.material.queryMaterialSubOrderItemByMsoId, materialSubOrderPostData, function(result){
			var $list = $('#list').html('');
			result.materialSubOrderItems.length && $.each(result.materialSubOrderItems, function(i, v){
				var $line = addline(i + 1, v);
				$line.appendTo($list);
			});
		}, null, false);
	}
	
	initList();

	//添加一行
	function addline(lineindex, v){

		var $line = $('<li></li>').addClass('line');
		var $indexWrap = $('<div></div>').addClass('line-wrap order').append($('<div></div>').addClass('cell index').text(lineindex));
		var $lineInfoWrap = $('<div></div>').addClass('line-wrap content');
		var $optWrap= $('<div></div>').addClass('line-wrap action');

		var _lineInfoSet = [
			["name", v.materialModelName],//名称
			["type", v.materialTypeName],//品类
			["brand", v.materialBrandName],//品牌
			["unit", v.measurementUnitName],//单位
			["money", v.salePrice],//折扣价
			["money price", v.price],//售价
			["num", v.num],//数量
			["money total", v.total],//总价
			["money", v.prePoint],//预结算值
			["seat", v.des ? v.des : "--"],//备注
			["package", ''],//占位
		];

		$.each(_lineInfoSet, function(i, val){
			var $cell = $('<div></div>').addClass('cell '+ val[0]);
			if(val[0].indexOf('num') != -1){
				$cell.append($('<span></span>').addClass('numv').text(val[1]));
			}else{
				$cell.text(val[1]);
			}
			$cell.appendTo($lineInfoWrap);
		});

		$optWrap.append($('<div></div>').addClass('cell option'));

		$line.append($indexWrap).append($lineInfoWrap).append($optWrap)
			.attr({
				'materialModelNo' : v.materialModelNo,
				'materialModelName': v.materilModelName,
				'id' : v.id,
				'msoiId' : v.msoiId,
				'msoId' : v.msoId,
				'status' : v.status,
				'level' : v.level,
				'isLeaf' : v.isLeaf,
				'price': v.price,
				'num': v.num,
				'total': v.total,
				'packageName': v.packageName,
			});

		actionBinding($line, v);

		return $line;
	}

	function actionBinding($line, v){

		var fullStatus = materialSubOrderPostData["materialSubOrder.fullStatus"];
		var $btnEdit, $btnDel, $btnCommit, $btnCancel, $check, $refund;
		var $option = $line.find('.cell.option');
		if(fullStatus == 1 || !(fullStatus + '').length){
			$option.append('--')
		}else{

			if(fullStatus == 0){

				if(v.packageName && v.isLeaf){
					return;
				}
				$btnEdit = $('<button>编辑</button>').addClass('btn btn-minier btn-yellow')
					.prop('name','edit')
					.click(function(){
						if(v.packageName){
							editAll($line, v);
						}else{
							editMaterialSubOrderItem($line);
						}
					});
				$btnDel = $('<button>删除</button>').addClass('btn btn-minier btn-danger')
					.prop('name','del')
					.click(function(){
						if(v.packageName){
							deleteAll($line, v);
						}else{
							deleteMaterialSubOrderItem($line, v);
						}
					});
				$btnCommit = $('<div class="ui-pg-div ui-inline-save hide"><span class="ui-icon ui-icon-disk"></span></div>')
					.prop('name','commit')
					.click(function(){
						if(v.packageName){
							saveAll($line, v);
						}else{
							saveRowData($line, v);
						}
					});
				$btnCancel = $('<div class="ui-pg-div ui-inline-cancel hide"><span class="ui-icon ui-icon-cancel"></span></div>')
					.prop('name','cancel')
					.click(function(){
						if(v.packageName){
							cancleAll($line, v);
						}else{
							cancleRowData($line);
						}

					});
				$option.append($btnEdit).append($btnDel).append($btnCommit).append($btnCancel);

			}else if(fullStatus == 2 || fullStatus == 3){
				$check = $('<label></label>').append($('<input>').addClass('cbox ace').attr({name: "refund", type: "checkbox" , role: "checkbox"}).css({"width": "auto"})).append('<span class="lbl align-top"></span>');
				$refund = $('<input type="text" name="refundnum" placeholder="总数">').addClass('hide');
				
				if($line.attr('level') == '1' && $line.attr('isleaf') == 'true'){
					$option.append($refund);
				}else{
					$option.append($check).append($refund);
				}
			}
		}
	}

	function editAll($line, v){
		var _index = $line.index();
		var arr = $( 'li.line[packageName="'+ v.packageName +'"][isLeaf="true"]','#list');
		arr.each(function(i){
			var $numCell = $(this).find('.num');
			var $numv = $(this).find('.num .numv');
			$numv.hide();
			var $editInput = $('<div></div>').addClass('fl-ma-num-input').css('background', 'transparent').append($('<input/>').attr('type', 'text').addClass('v_required v_float')).appendTo($numCell);
			$editInput.find('input').val($numv.text()).focus().select();
		});
		$line.find('.option > button').addClass('hide');
		$line.find('.option > div').removeClass('hide');

		var $total = $line.find('.total');
		var $editInput = $('<input/>').attr('type', 'text').addClass('v_required v_float').val($total.text()).focus().select();
		$total.attr('total',$total.text()).html($editInput);
	}

	function editMaterialSubOrderItem($line){ // 编辑
		var $numCell = $line.find('.num');
		var $numv = $line.find('.num .numv');
		
		$numv.hide();
		
		var $editInput = $('<div></div>').addClass('fl-ma-num-input').css('background', 'transparent').append($('<input/>').attr('type', 'text').addClass('v_required v_float')).appendTo($numCell);
		$editInput.find('input').val($numv.text()).focus().select();
		$line.find('.option > button').addClass('hide');
		$line.find('.option > div').removeClass('hide');
	}

	function deleteAll($line, v){
		bootbox.confirm("确认删除吗?", function(res){
			if(res){
				var options = {};
				var materialSubOrderItem = v;

				var arr = $( 'li.line[packageName="'+ v.packageName +'"][isLeaf="true"]','#list');

				options["msoId"] = materialSubOrderItem.msoId;

				arr.each(function(i){
					var $this = $(this);
					options["msoiIds["+i+"]"] = $this.attr('msoiId');
				});

				com.post(api.material.deleteMaterialSubOrderItem, options, function(result){
					com.showAlert(com.info, "数据删除成功!");
					initList();

				}, function(result){
					com.showAlert(com.error, "数据删除失败!");
				});
			}
		});
	}

	function deleteMaterialSubOrderItem($line, v){ // 删除

		bootbox.confirm("确认删除吗?", function(res){
			if(res){
				var options = {};
				var materialSubOrderItem = v;

				options["msoId"] = materialSubOrderItem.msoId;
				options["msoiIds[0]"] = materialSubOrderItem.msoiId;

				com.post(api.material.deleteMaterialSubOrderItem, options, function(result){
					com.showAlert(com.info, "数据删除成功!");
					$line.remove();
					if(result.redirect == 1 || result.redirect == "1"){
						$("#materialOrderPageContent").load(api.index.materialSubOrderIndex.url);
					}else{
						reorder();
					}

				}, function(result){
					com.showAlert(com.error, "数据删除失败!");
				});
			}
		});
	}
	
	function reorder(){ // 重排序
		var $list = $('.line', '#list');
		$list.length && $list.each(function(i){
			var $this = $(this);
			$this.find('.index').text(i + 1)
		});
	}

	function saveAll($line, v){
		var _index = $line.index();
		var arr = $( 'li.line[packageName="'+ v.packageName +'"][isLeaf="true"]','#list');
		var materialBrand = materialSubOrderItemPostData["materialSubOrder.materialBrand"];
		var options = {};

		var allempty = true;
		var cansubmit = true;

		var _total = $line.find('.total input').val();

		arr.each(function(i){
			var $this = $(this);
			var $numOld = $this.find('.numv'),
				$numNew = $this.find('.fl-ma-num-input input'),
				_numOld, _numNew, _numNewRex;

			_numOld = parseFloat($numOld.text());
			_numNew = parseFloat($numNew.val());
			_numNewRex = /^(\d+|\d+\.[0-9]{1,4})$/;
			if(!_numNewRex.test(_numNew)){
				$numNew.focus().select();
				$numNew.addClass('tooltip-info').attr({
					"data-rel" : "popover",
					"data-placement" : "top",
					"data-original-title" : "",
					"title" : "",
					"data-content" : "请输入大于零的数字!"
				}).popover('show');
				cansubmit = false;
				return;
			}else{
				$numNew.popover('destroy');
			}

			if(_numNew){
				allempty = false;
			}

			//_price = parseFloat($this.find('.price').text());
			//_total = utils.changeTwoDecimal(utils.accMul(_price, _numNew));

			options["materialSubOrderItems["+i+"].msoiId"] = $this.attr('msoiId');
			options["materialSubOrderItems["+i+"].materialModelNo"] = $this.attr('materialModelNo');
			options["materialSubOrderItems["+i+"].materialModelName"] = $this.find('.name').text();
			options["materialSubOrderItems["+i+"].materialTypeName"] = $this.find('.type').text();
			options["materialSubOrderItems["+i+"].materialBrandName"] = $this.find('.brand').text();
			options["materialSubOrderItems["+i+"].measurementUnitName"] = $this.find('.unit').text();

			options["materialSubOrderItems["+i+"].packageName"] = $this.attr('packageName');
			options["materialSubOrderItems["+i+"].num"] = _numNew;
			options["materialSubOrderItems["+i+"].total"] = _total;
		});

		options["materialSubOrder.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];

		if(!cansubmit){
			return false;
		}

		if((allempty && _total) || (_total == 0 && !allempty)){
			com.showAlert(com.error, "总价金额为零或型号数量为零,请使用删除功能");
			return false;
		}

		com.post(api.material.updateMaterialSubOrderItemForPackage, options, function(result){
			com.showAlert(com.info, "数据提交成功!");

			initList();
		}, function(result){
			com.showAlert(com.error, "数据提交失败!");
		});
	}

	function saveRowData($line, v){ // 确认编辑

		var materialBrand = materialSubOrderItemPostData["materialSubOrder.materialBrand"];
		var materialSubOrderItem = v;
		var $numOld = $line.find('.num'),
			$numNew = $line.find('.fl-ma-num-input input'),
			_numOld, _numNew, _numNewRex;
		var _total, _price;

		_numOld = parseFloat($line.find('.numv').text());
		_numNew = parseFloat($numNew.val());

		_numNewRex = /^(\d+|\d+\.[0-9]{1,4})$/;
		if(!_numNewRex.test(_numNew) || _numNew <= 0){
			$numNew.focus().select();
			$numNew.addClass('tooltip-info').attr({
				"data-rel" : "popover",
				"data-placement" : "top",
				"data-original-title" : "",
				"title" : "",
				"data-content" : "请输入大于零的数字!"
			}).popover('show');
			return false;
		}else{
			$numNew.popover('destroy');
		}

		_price = parseFloat(materialSubOrderItem.price);
		_total = utils.changeTwoDecimal(utils.accMul(_price, _numNew));
		
		var options = {};
		options["materialSubOrderItem.msoiId"] = materialSubOrderItem.msoiId;
		options["materialSubOrderItem.materialModelNo"] = materialSubOrderItem.materialModelNo;
		options["materialSubOrderItem.materialModelName"] = materialSubOrderItem.materialModelName;
		options["materialSubOrderItem.materialTypeName"] = materialSubOrderItem.materialTypeName;
		options["materialSubOrderItem.materialBrandName"] = materialSubOrderItem.materialBrandName;
		options["materialSubOrderItem.measurementUnitName"] = materialSubOrderItem.measurementUnitName;

		options["materialSubOrderItem.num"] = _numNew;
		options["materialSubOrderItem.total"] = _total;

		options["materialSubOrder.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];

		com.post(api.material.updateMaterialSubOrderItemForModel, options, function(result){
			com.showAlert(com.info, "数据提交成功!");
			$line.find('.fl-ma-num-input').remove();
			$line.find('.numv').text(_numNew).show();
			$line.find('.total').text(_total);
			$line.find('.option > div').addClass('hide');
			$line.find('.option > button').removeClass('hide');
		}, function(result){
			com.showAlert(com.error, "数据提交失败!");
		});
	}


	function cancleAll($line, v){
		var _index = $line.index();
		var arr = $( 'li.line[packageName="'+ v.packageName +'"][isLeaf="true"]','#list');
		arr.each(function(i){
			$(this).find('.fl-ma-num-input').remove();
			$(this).find('.numv').show();
		});
		$line.find('.option > div').addClass('hide');
		$line.find('.option > button').removeClass('hide');

		var $total = $line.find('.total');
		$total.html($total.attr('total'));
	}

	function cancleRowData($line){ // 取消编辑
		var $editInput = $line.find('.fl-ma-num-input').remove();
		$line.find('.numv').show();
		$editInput.find('input').val(null);
		$line.find('.option > div').addClass('hide');
		$line.find('.option > button').removeClass('hide');
	}

	function saveRefundData(){

		com.clearValidator("#couponType", true);

		if(com.validate()){
			return;
		}

		var refundTotal = $("#refundTotal");
		var refund = $("#refund");
		var refundDes = $("#refundDes");

		var options = refundMaterialSubOrderItemData;

		if(parseFloat(refund.val()) > parseFloat(refundTotal.val())){
			com.showTips(refund, "退款不能大于型号退款总金额.", true);
			return ;
		}

		options["approvalMaterialRefund.msoId"] = materialSubOrderItemPostData["materialSubOrder.msoId"];
		options["approval.receiverId"] = $("#approver").val();
		options["approval.comment"] = refundDes.val();
		options["approvalMaterialRefund.type"] = materialSubOrderDetail.refundType;
		options["approvalMaterialRefund.refund"] = refund.val();
		options["approvalMaterialRefund.referMoney"] = refundTotal.val();

		materialSubOrderDetail.saveRefundBtn.button('loading');

		com.post(api.approval.submitApprovalForMaterialRefund, options, function(result){
			com.showAlert(com.info, "数据提交成功!");

			initList();
			
			materialSubOrderDetail.refundBtn.removeClass('hide');
			materialSubOrderDetail.refundCommitBtn.addClass('hide');
			materialSubOrderDetail.refundCancelBtn.addClass('hide');
			
			materialSubOrderDetail.saveRefundBtn.button('reset');
			
			materialSubOrderDetail.rejectMaterialSubOrderModal.modal("hide");
		}, function(result){
			com.showAlert(com.error, result.errorMsg);
			materialSubOrderDetail.saveRefundBtn.button('reset');
		});
	}
	
	function fullFunctionData(options){
		
		var index = 0;
		var total = 0;
		var totalPrice = 0;
		
		$('#list>li').each(function(i, e){
			  
			  var linetotal = 0;
			  
			  var $line = $(e);
			  
			  if($line.attr('level') == 0 && $line.attr('isleaf') == 'true'){
			    
			    totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, parseFloat($line.attr('total'))));

			    options["approvalMaterialRefundItems[" + index + "].materialSubOrderItem.msoiId"] = $line.attr('msoiid');
			    options["approvalMaterialRefundItems[" + index + "].num"] = $line.attr('num');
			    options["approvalMaterialRefundItems[" + index + "].total"] = $line.attr('total');

			    index++;
			  }else if($line.attr('level') == 1 && $line.attr('isleaf') == 'true'){

			    options["approvalMaterialRefundItems[" + index + "].materialSubOrderItem.msoiId"] = $line.attr('msoiid');
			    options["approvalMaterialRefundItems[" + index + "].num"] = $line.attr('num');
			    options["approvalMaterialRefundItems[" + index + "].total"] = parseFloat($('[packageName=' + $line.attr('packageName') + '][level=0]').attr('total'));

			    index++;
			  }else{
			    totalPrice = utils.changeTwoDecimal(utils.accAdd(totalPrice, $line.attr('total')));
			  }
		});
		
		return totalPrice;
	}

});
