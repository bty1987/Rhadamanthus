
jQuery(function($) {
	
	var extraParams = {"addReduce.orderId" : params.decorationOrderId};
	var displayFunc  = (function(){

		var typeDict = {"0":"增项", "1":"减项", "2":"漏项"};
		var statusDict = {"0":"未提交", "1":"未付款","2":"已付款","3":"已确认"};

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.content));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnLook = $('<a></a>').addClass('btn btn-minier btn-yellow').html('查看');
			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-danger').html('删除');
			var $btnPrint = $('<a></a>').addClass('btn btn-minier btn-purple').html('打印');
			var propertyArr = [

				["总价:", v.total, "grey"],
				["类别:", typeDict[v.type + ''], "grey"],
				["状态:", statusDict[v.status], "grey"],
				["添加时间:", v.createTime, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnLook).append($btnDel).append($btnPrint).appendTo($h3);
			$liLine.append($h3).append($ulProperty);
			//查看按钮点击事件
			$btnLook.click(function(){
				params["addReduce.type"] = v.type;
				viewDetailAddReduce(v.arId);
			});

			$btnDel.click(function(){
				bootbox.confirm("确认删除吗？",function(flag) {
					flag && removeRow(v.arId);
				})

			});

			$btnPrint.click(function(){
				var url = api.index.addReduceOutputIndex.url + "?&addReduceIds[0]=" + v.arId;
				window.open(url);
			});

			return $liLine;
		};

		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		};
	})();

	var _condArr = ['addReduceType'];

	var addReduceSeacher = new Searcher();
	addReduceSeacher.init( _condArr, "condList", api.addReduce.queryAddReduceByOrderId, function(data){
		displayFunc.init('resultList', data);
	}, null, "AddReduceCondPostData", extraParams, true, "addReduces");

	var addReduce = {
		decorationOrderId : params.decorationOrderId,
		saveBtn: $("#saveBtn").on("click", saveData),
		cancellBtn: $("#cancelBtn"),
		modal: $("#addReduceModal"),
		addReduceItems: {
			addReduceDes : $("#addReduceDes"),
		 	addReduceType : $("#addReduceType")
		},

		editFlag: false,
		repeatFlg: false
	};

	//返回按钮
	$('#btnBack').click(function(){
		$("#fl-container").load(api.index.decorationOrderDesignerIndex.url);
	});

	//添加按钮
	$('#add').click(function(){
		addReduce.editFlag = false;
		com.cleanItems(addReduce.addReduceItems);

		addReduce.addReduceItems.addReduceType.attr('disabled', false);

		addReduce.modal.modal("show");
	});

	function viewDetailAddReduce(addReduceId){
		params["addReduceId"] = addReduceId;
		$("#fl-container").load(api.index.addReduceDetailIndex.url, {});
	}

	function removeRow(arid){
		com.post(api.addReduce.deleteAddReduce, {"addReduce.arId" : arid}, function(res){
			if(res.deleteFlag == "EXIST"){
				com.showAlert(com.warning, "删除增减项中存在提交状态,不能删除!");
			}else{
				com.showAlert(com.info, "操作成功!");
				addReduceSeacher.doSearch();
			}
		});

		$("#eData").trigger("click");
	}

	function saveData(){

		if(com.validate() || addReduce.repeatFlg)
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

		com.post(url, options, function(res){
			com.showAlert(com.info, "操作成功");
			addReduceSeacher.doSearch();

		});

		addReduce.modal.modal("hide");
	}
});
