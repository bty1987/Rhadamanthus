jQuery(function($) {

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.phone));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnDel = $('<a></a>').addClass('btn btn-minier btn-yellow').html('积分');
			var $free = $('<a></a>').addClass('btn btn-minier btn-success').html('释放');

			$btnDel.click(function(){

				params.unionId = v.unionId;
				params.id = 2;
				com.switchPage(api.index.vscoreRecord.url);

			});

			$free.click(function(){
				release(v.vid);
			});

			var propertyArr = [
				["客户名称:", v.name, "grey"],
				["客户地址:", v.address, "grey"],
				["装修单号:", v.orderId, "grey"],
                ["推荐人:", v.referrer, "grey"],
                ["推荐人电话:", v.referphone, "blue"],
				["创建时间:", v.createTime, "grey"],
				["合同额:", v.contractPrice, "blue"],
				["状态:", v.status == 0 ? "有效" : "无效", "red"],
				["说明:", v.comment, "grey"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			if(v.status == 0){
				$divBtnWrap.append($btnDel).append($free).appendTo($h3);
			}
			if(v.status == 1){
				$divBtnWrap.appendTo($h3);
			}

			$liLine.append($h3).append($ulProperty);

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

	var searcher = new Searcher();

	searcher.init(["cu_name"], "condList", api.customer.pageVustomer, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "vustomerPostData",null, false, null, null);

	function updateVustomer(vid, orderId){
		var options = {};
		options["vustomer.vid"] = vid;
		options["vustomer.orderId"] = orderId;

		com.post(api.customer.updateVustomer, options, function(res){
			searcher.doSearch();
		});
	}

	function release(vid){
	    com.showConfirm("是否确认释放客户", function(){
	        com.post(api.customer.freeVustomer, {"vustomer.vid": vid}, function(res){
                searcher.doSearch();
                com.showAlert(com.info,'释放成功');
            });
	    });
	}

});
