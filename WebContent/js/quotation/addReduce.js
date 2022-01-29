jQuery(function($) {
    
    
	var decorationOrderId = params.decorationOrderId;
	var extraParams = {"addReduce.orderId" : decorationOrderId};
	
	var addReduce = {
	        
		decorationOrderId : params.decorationOrderId,
		
		arid: null,
		
		items: {
		    addReduceDes : com.focusPage("#addReduceDes"),
            addReduceType : com.focusPage("#addReduceType"),
            paytype: com.focusPage("#paytype"),
		},
		
		modals: {
		    addReduceModal: com.focusPage("#addReduceModal"),
		    payAddReduceModal: com.focusPage("#payAddReduceModal"),
		},
		
		btns: {
		    saveBtn: com.focusPage("#saveBtn").on("click", saveData),
		    payBtn: com.focusPage("#payBtn").on("click", unpay),
		},

		editFlag: false,
		
		types: {},
		paytypes: {},
		statuses: {}
	};
	
	com.post(api.ds.quotation, {}, function(res){
	    
	    addReduce.types = res.addReduceType.split("key", "value");
	    addReduce.paytypes = res.addReducePaytype.split("key", "value");
	    addReduce.statuses = res.addReduceStatus.split("key", "value");
	    
	}, null, false)

	var displayFunc  = (function(){

		var typeDict = {"0": "增项", "1": "减项", "2": "漏项"};
		var statusDict = {"0": "未提交", "1": "未付款","2": "已付款","3": "已确认"};

		var renderList = function(tableId,listData){
			var $tableWrap = com.focusPage('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
				    creatLine(v).appendTo($ul);
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
			var $btnConf = $('<a></a>').addClass('btn btn-minier btn-info').html('确认');
			var $btnUnpay = $('<a></a>').addClass('btn btn-minier btn-success').html('下拨');

			var $label = $('<label></label>');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "arids",
				"class": "ace ace-checkbox-2"
			}).val(v.arId);
			
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.content);
			
			var propertyArr = [
				["类别:", typeDict[v.type + ''], "red"],
				["创建时间:", v.createTime, "green"],
				["非打折总额:", v.undisPrice, "blue"],
				["打折总额:", v.disPrice, "blue"],
				["总价:", v.total, "blue"],
				["管理费:", v.managePrice, "blue"],
				["状态:", statusDict[v.status], "red"],
				["付款类型:", addReduce.paytypes[v.paytype], "red"],
			];
			
			if(v.discount != 0) propertyArr.push(["折扣:", v.discount, "blue"])

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});
			$label.append($input).append($span).appendTo($h3);
			$divBtnWrap.append($btnLook).appendTo($h3);
			$liLine.append($h3).append($ulProperty);
			
			if(v.status == 0 || v.status == 1){
			    $divBtnWrap.append($btnDel);
			}
			
			if(v.type == 0 && (v.status == 0 || v.status == 1) && v.paytype == 0){
			    $divBtnWrap.append($btnUnpay);
			}
			
			if((v.status == 0 || v.status == 1) && (v.paytype == 1 || v.paytype == 2)){
                $divBtnWrap.append($btnConf);
            }
			
			//查看按钮点击事件
			$btnLook.click(function(){
				params["addReduce.type"] = v.type;
				params["addReduce"] = v;
				viewDetailAddReduce(v.arId);
			});

			$btnDel.click(function(){
			    com.showConfirm("是否确认删除", function() {
                    removeRow(v.arId);
                });
			});
			
			$btnUnpay.click(function(){
			    
			    addReduce.arid = v.arId,
			    
			    com.cleanItems(addReduce.items);

		        addReduce.modals.payAddReduceModal.modal("show");
            });
			
			$btnConf.click(function(){
                com.showConfirm("是否确认增减单", function() {
                    confirm(v.arId);
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

	//添加按钮
	com.focusPage('#add').click(function(){
		addReduce.editFlag = false;
		com.cleanItems(addReduce.items);

		addReduce.items.addReduceType.attr('disabled', false);

		addReduce.modals.addReduceModal.modal("show");
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

		com.popup("增减项打印", url, null, null, true);
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

		if(com.validate("addReduceModal")) return false;

		var url;
		var options = {
			"addReduce.content": addReduce.items.addReduceDes.val(),
			"addReduce.type": addReduce.items.addReduceType.val(),
			"addReduce.orderId": addReduce.decorationOrderId
		};

		url = api.addReduce.addAddReduce;
		options["addReduce.status"] = 0;
		options["addReduce.total"] = 0;
		options["addReduce.managePrice"] = 0;

		com.post(url, options, function(res){
			com.showAlert(com.info, "操作成功");
			search.doSearch();

			addReduce.modals.addReduceModal.modal("hide");
		});
	}
	
	function unpay(){
	    
        var options = {
            "addReduce.arId": addReduce.arid,
            "addReduce.paytype": addReduce.items.paytype.val(),
        };

        com.post(api.addReduce.unpayAddReduce, options, function(res){
            com.showAlert(com.info, "操作成功");
            search.doSearch();

            addReduce.modals.payAddReduceModal.modal("hide");
        });
	}
	
	function confirm(arid){
	    
	    var options = {
            "addReduce.arId": arid
        };

        com.post(api.addReduce.confirmAddReduce, options, function(res){
            com.showAlert(com.info, "操作成功");
            search.doSearch();
        });
	}
	
	//删除按钮方法
    function removeRow(arid){
        com.post(api.addReduce.deleteAddReduce, {"addReduce.arId" : arid}, function(res){
            com.showAlert(com.info, "操作成功");
            search.doSearch();
        });
    }
	
});
