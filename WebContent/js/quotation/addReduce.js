
jQuery(function($) {
	//searcher 第七个参数传参
	var decorationOrderId = params.decorationOrderId;
	var extraParams = {"addReduce.orderId" : decorationOrderId};
	var addReduce = {
		decorationOrderId : params.decorationOrderId,
		saveBtn: com.focusPage("#saveBtn").on("click", saveData),
		cancellBtn: com.focusPage("#cancelBtn"),
		modal: com.focusPage("#addReduceModal"),
		addReduceItems: {
			addReduceDes : com.focusPage("#addReduceDes"),
			addReduceType : com.focusPage("#addReduceType")
		},

		editFlag: false
	};

	var displayFunc  = (function(){

		var typeDict = {"0":"增项", "1":"减项", "2":"漏项"};
		var statusDict = {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"};

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
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "arids",
				"class": "ace ace-checkbox-2"
			}).val(v.arId);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.content);

			var propertyArr = [
				["总价:", v.total, "grey"],
				["类别:", typeDict[v.type + ''], "grey"],
				["状态:", statusDict[v.status], "red"],
                ["管理费:", v.managePrice, "grey"],
				["添加时间:", v.createTime, "grey"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});
			$label.append($input).append($span).appendTo($h3);
			$divBtnWrap.append($btnLook).append($btnDel).appendTo($h3);
			$liLine.append($h3).append($ulProperty);
			
			//查看按钮点击事件
			$btnLook.click(function(){
				params["addReduce.type"] = v.type;
				params["addReduce"] = v;
				viewDetailAddReduce(v.arId);
			});

			$btnDel.click(function(){
				bootbox.confirm("确认删除吗?",function(flag) {
					flag && removeRow(v.arId);
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
		};
	})();



	var search = new Searcher();
	search.init( "", "condList", api.addReduce.queryAddReduceByOrderId, function(data){
		displayFunc.init('resultList', data);
	}, null, "addReducePostData", extraParams, true, "addReduces");


	//查看按钮方法
	function viewDetailAddReduce(addReduceId){
		params["addReduceId"] = addReduceId;
		com.switchPage(api.index.addReduceDetailIndex.url);
	}
	//删除按钮方法
	function removeRow(arid){
		com.post(api.addReduce.deleteAddReduce, {"addReduce.arId" : arid}, function(res){
			if(res.deleteFlag == "EXIST"){
				com.showAlert(com.warning, "删除增减项中存在提交状态,不能删除!");
			}else{
				com.showAlert(com.info, "操作成功!");
				search.doSearch();
			}
		});

		com.focusPage("#eData").trigger("click");
	}

	//添加按钮
	com.focusPage('#add').click(function(){
		addReduce.editFlag = false;
		com.cleanItems(addReduce.addReduceItems);

		addReduce.addReduceItems.addReduceType.attr('disabled', false);

		addReduce.modal.modal("show");
	});
	//打印按钮
	com.focusPage('#print').click(function(){
		var $inputs = com.focusPage('input[name="arids"]:checked');
		var url = api.index.addReduceOutputIndex.url ;
		var _addReduceIds = [];
		if(!$inputs.length) return;
		$.each($inputs, function(i, v){
			_addReduceIds.push(parseInt($(v).val()));
		});
		params.addReduceIds = _addReduceIds;
		//url += "quotation.orderId=" + params.decorationOrderId + "&orderType=" + params.decorationOrderType + "&time=" + parent.params.loginTime;
		com.popup("增减项打印",url,null,null,true);
	});

	//返回按钮
	com.focusPage('#btnBack').click(function(){
		com.switchPage("/views/decoration/decoration.html");
	});
	//刷新按钮
	com.focusPage('#updated').click(function(){
		search.doSearch();
	});


	function saveData(){

		if(com.validate())
			return;

		var url;
		var options = {
			"addReduce.content": addReduce.addReduceItems.addReduceDes.val(),
			"addReduce.type": addReduce.addReduceItems.addReduceType.val(),
			"addReduce.orderId": addReduce.decorationOrderId
		};

		url = api.addReduce.addAddReduce;
		options["addReduce.status"] = 0;
		options["addReduce.total"] = 0;
		options["addReduce.managePrice"] = 0;

		com.post(url, options, function(res){
			com.showAlert(com.info, "操作成功");
			search.doSearch();

		});

		addReduce.modal.modal("hide");
	}
});
