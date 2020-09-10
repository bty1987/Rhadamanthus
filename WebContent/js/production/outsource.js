$(function(){
	var outsource = {
			saveBtn : com.focusPage("#saveBtn"),
			tranpackBtn : com.focusPage("#tranpackBtn"),
			modals: {
				outsourceModal: com.focusPage("#outsourceModal"),
				layerImportModal: com.focusPage("#layerImportModal"),
				tranpackModal : com.focusPage("#tranpackModal")
			},
			items : {
				userId :com.focusPage("#userId"),
				comment : com.focusPage("#comment"),
				timeLimit : com.focusPage("#timeLimit"),
				num : com.focusPage("#num")
			},
			editFlg : true,
			outsourceStatus : {},
			productionStatus :{},
			pid : params["pid"],
			status : params["status"]
	};

	outsource.saveBtn.bindClick(saveData);
	outsource.tranpackBtn.bindClick(endStatus);

	outsource.modals.outsourceModal.on("hide.bs.modal", function(){
		com.clearValidator();
		com.cleanItems(outsource.items);
	});

	com.post(api.ds.production, {}, function (res) {
		outsource.outsourceStatus = res.outsourceStatus.split("key", "value");
		outsource.productionStatus = res.productionStatus.split("key", "value");
	},null, false);


	var displayFunc = (function(){

		var renderList = function (tableId, listData) {
			var $tableWrap = com.focusPage('#' + tableId).empty();
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if (listData && listData.length) {
				$.each(listData, function (i, v) {
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var  creatLine = function(v) {

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass('oid');
			var $title = $('<small></small>').addClass('blue') .html(v.no);
			var $btnDiv = $('<div></div>').addClass('action-buttons pull-right');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var $btnChild = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('外协项');
			var $btnimport = $('<a></a>').addClass(' btn btn-minier btn-success').html('图表');
			var $btnReceipt = $('<a></a>').addClass(' btn btn-minier btn-warning').html('审核');
			var $btnConfirm = $('<a></a>').addClass(' btn btn-minier btn-inverse').html('确认');
			var $btnEnd = $('<a></a>').addClass(' btn btn-minier btn-danger').html('完结');
			var $btnEdit = $('<a></a>').addClass(' btn btn-minier btn-pink ').html('编辑');
			var $btnaBolition = $('<a></a>').addClass(' btn btn-minier btn-purple ').html('废除');

			var remainDate = productionUtils.dateDiffer(v.createTime, v.timeLimit);//计算剩余工期
			var remainDay = 0 ;  //显示剩余工期

			if(v.status == 3 || v.status == 4){
				remainDay = "订单已结束";
			}else if(remainDate < 0){
				remainDay = "已超过期限"+Math.abs(remainDate)+"天";
			}else {
				remainDay = "剩余工期"+Math.abs(remainDate)+"天"
			}

			var propertyArr = [
			                   ["生产单号:",v.production.pno,"blue"],
			                   ["装修单号:",v.production.orderId,"blue"],
			                   ["楼盘地址:",v.production.house.village.name+" "+v.production.house.houseNumber,"grey"],
			                   ["创建人:",v.creater.userName,"grey"],
			                   ["厂商:",v.supplier.userName,"grey"],
			                   ["创建时间:",v.createTime,"green"],
			                   ["结束时间:",v.finishTime,"green"],
			                   ["状态:",outsource.outsourceStatus[v.status],"red"],
			                   ["工期:", v.timeLimit, "green"],
			                   ["订单剩余时间:",remainDay,(remainDate < 5 ? "red":"green")],
			                   ["备注:",v.comment,"grey"]
			                   ];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$liLine.append($h3).append($ulProperty);

			switch (v.status) {
			case 0:
				$btnDiv.append($btnChild).append($btnimport).append($btnReceipt).append($btnEdit).append($btnaBolition);
				break;
			case 1:
				$btnDiv.append($btnChild).append($btnimport).append($btnConfirm).append($btnEdit).append($btnaBolition);
				break;
			case 2:
				$btnDiv.append($btnChild).append($btnimport).append($btnEnd).append($btnEdit).append($btnaBolition);
				break;
			case 3:
				$btnDiv.append($btnChild).append($btnimport);
				break;
			case 4:
				$btnDiv.append($btnChild).append($btnimport);
				break;
			}

			$h3.append($title).append($btnDiv);


			$btnReceipt.click(function () {
				com.showConfirm("是否接收", function(){
					updateStatus(v.oid,"1");
				});
			});

			$btnConfirm.click(function () {
				com.showConfirm("是否确认", function(){
					updateStatus(v.oid,"2");
				});
			});

			$btnEnd.click(function () {
				com.showConfirm("是否确认完结", function(){
					outsource.items.oid = v.oid;
					outsource.modals.tranpackModal.modal("show");
				});
			});

			$btnaBolition.click(function () {
				com.showConfirm("是否确认废除", function(){
					updateStatus(v.oid,"4");
				});
			});

			$btnEdit.click(function() {
				com.clearValidator();
				outsource.editFlg = false;

				outsource.items.oid = v.oid;
				outsource.items.userId.val(v.supplier.userName).attr("disabled", "disabled");
				var $TimeLimit = outsource.items.timeLimit.val(v.timeLimit);
				v.status == 0 ? $TimeLimit.removeAttr("disabled", "disabled") : $TimeLimit.attr("disabled","disabled");
				outsource.items.comment.val(v.comment);
				outsource.modals.outsourceModal.modal("show");
			});

			$btnimport.click(function () {
				graphpload(v);//图表上传
			});

			$btnChild.click(function () {
				params["oid"] = v.oid;
				params.outsourceStatus = v.status;
				params.productionStatus = outsource.status;
				com.popup4page('#outsourceViewPopUp',"views/production/outsourceItem.html","名称 : "+v.no);
			});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				if(!listData.length){
					var $resultList = com.focusPage('#' + tableId).addClass('dz-default dz-message').html('');
					var $zone = $('<div></div>').addClass('dropzone dz-clickable').css('margin', '20px').css('border', '0px').appendTo($resultList);
					var $mesg = $('<div></div>').addClass('dz-default dz-message').appendTo($zone);
					var $span = $('<span></span>').text('无可用数据提供').appendTo($mesg);
					return $resultList;
				}else{
					com.focusPage('#' + tableId).html(null);
					renderList(tableId,listData);
				}
			},
			drawLine : function(v){
				return creatLine(v);
			}
		};
	})();

	com.focusPage('#backs').click(function() {
		com.switchPage(api.index.productionIndex.url)
	});

	com.focusPage("#addOutsource").click(function() {

		outsource.items.userId.removeAttr("disabled", "disabled");
		outsource.items.timeLimit.removeAttr("disabled", "disabled");

		if (outsource.status ==  2) {
			outsource.editFlg = true;
			outsource.modals.outsourceModal.modal("show");
			return false;
		}

		com.showAlert(com.warning, "订单为"+outsource.productionStatus[outsource.status]+"状态不可添加");
	});

	function updateStatus(id,status){

		var url;

		switch (status) {
		case '1':
			url = api.production.receiptOutsource;
			break;
		case '2':
			url = api.production.confirmOutsource;
			break;
		case '4':
			url = api.production.deleteOutsource;
			break;
		}

		com.post(url, {"outsource.oid":id , "outsource.status": status},function(res){
			com.showAlert(com.info, "操作成功");
			initQuery();
		});
	}

	function endStatus (){

		var options = {
				"outsource.production.pid":outsource.pid,
				"outsource.num" :outsource.items.num.val(),
				"outsource.oid" :  outsource.items.oid,
				"outsource.status" : "3"
		};

		com.post(api.production.finishOutsource,options,function(res){
			com.showAlert(com.info, "操作成功");
			initQuery();
		});

		outsource.modals.tranpackModal.modal("hide");
	}

	com.initTypeahead('userId', api.personel.querySupplierByPinyin, "supplier.pinYin", {"user.status":0}, "suppliers", "userId", "userName",null);

	function saveData() {

		if (com.validate('outsourceModal')) {
			return false;
		}

		var url;
		var options = {
				"outsource.production.pid" : outsource.pid,
				"outsource.supplier.userId" : com.typeahead("userId"),
				"outsource.path" : "",
				"outsource.timeLimit" : outsource.items.timeLimit.val(),
				"outsource.comment":  outsource.items.comment.val()
		};
		//判断editFlg是否为true或false true执行添加 false执行更新
		outsource.editFlg ? url = api.production.addOutsource : url = api.production.updateOutsource, options["outsource.oid"] = outsource.items.oid;

		com.post(url, options, function(res){
			com.closePopup();
			initQuery();
			com.showAlert(com.info, "操作成功");
		});
		outsource.modals.outsourceModal.modal("hide");
	}

	function graphpload(v){

		outsource.modals.layerImportModal.modal("show").find(".infobox").remove();
		var $line = com.focusPage('#download');

		if(v.path){
			productionUtils.createLine(v.path, v.no, $line);//显示文件与下载
		}

		com.focusPage('#importProductionPicture').removeClass('hide');

		if(v.status == 3||v.status == 4){
			com.focusPage('#importProductionPicture').addClass('hide');
		}
		com.uploadify("#importProductionPicture","添加上传文件",'btn btn-success col-sm-12',"*.xlsx","'uploadType': 2",1,function(data) {
			var option = {
					"outsource.oid": v.oid,
					"outsource.path": data.resUrl
			};
			com.post(api.production.updateOutsource,option,function(res){
				com.showAlert(com.info, "操作成功");
				$line.find(".infobox").remove();
				productionUtils.createLine(v.path, v.no, $line);
				initQuery();
			});
		});
	}

	function initQuery() {
		com.post(api.production.queryOutsourceByPid, {"outsource.production.pid": outsource.pid}, function (res) {
			var outsources = res.outsources;
			displayFunc.init('outsourceResultList', outsources);
		});
	};

	initQuery();

	if (outsource.status != 2) {
		com.focusPage("#addOutsource").addClass('hide');
	}
});