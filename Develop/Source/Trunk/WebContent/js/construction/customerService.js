var customerServicePostData = {};

jQuery(function($) {

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId).empty();
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
			var that = this;
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.orderId));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $btnView = $('<a></a>').addClass('btn btn-minier btn-yellow').html("查看");
			var $btnComplain = $('<a></a>').addClass('btn btn-minier btn-success').html("投诉");
			var $btnRepair = $('<a></a>').addClass('btn btn-minier').html("保修");
			var $btnRevisit = $('<a></a>').addClass('btn btn-minier btn-danger').html("回访");

			var propertyArr = [
				["楼盘名:", v.village.villageName, "grey"],
				["客户电话:", v.customer.phone, "grey"],
				["设计部门:", v.designDepartment, "grey"],
				["设计师:", v.designer, "grey"],
				["监理:", v.supervisor, "grey"],
				["总价:", v.orderTotalPrice, "grey"],
				["折扣:", v.discount, "grey"],
				["面积:", v.houseArea, "grey"],
				["工程状态:", v.schedule, "grey"],
				["进度:", v.projectStatus, "red"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.append($btnView).append($btnComplain).append($btnRepair).append($btnRevisit).appendTo($h3);

			$liLine.append($h3).append($ulProperty);

			$btnView.click(function(){
				viewCustomerServiceDetailIndex(v.orderId)
			});
			$btnComplain.click(function(){
				viewCustomerServiceComplaintIndex(v.orderId, v.customer.customerName);
			});
			$btnRepair.click(function(){
				viewCustomerServiceGuaranteeIndex(v.orderId, v.customer.customerName);
			});
			$btnRevisit.click(function(){
				viewCustomerServiceBackVisitIndex(v.orderId, v.village.villageName, v.customer.customerName);
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
		}
	})();

	var searcher = new Searcher();
	searcher.init(['orderId', 'village', 'houseNumber', 'designer', 'schedule'], "condList", api.construction.pageDecorationOrderForConstructionSchedule, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "customerServiceSeacherPostData");

	function viewCustomerServiceDetailIndex(orderId){
		customerServicePostData["constructionSchedule.orderId"] = orderId;
		$("#customerServicePageContent").load(api.index.customerServiceDetailIndex.url);
	}

	function viewCustomerServiceComplaintIndex(orderId, customerName){
		customerServicePostData["customerServiceComplaint.orderId"] = orderId;
		customerServicePostData["customerServiceComplaint.customerName"] = customerName;
		$("#customerServicePageContent").load(api.index.customerServiceComplaintIndex.url);
	}

	function viewCustomerServiceGuaranteeIndex(orderId, customerName){
		customerServicePostData["customerServiceGuarantee.orderId"] = orderId;
		customerServicePostData["customerServiceGuarantee.customerName"] = customerName;
		$("#customerServicePageContent").load(api.index.customerServiceGuaranteeIndex.url);
	}

	function viewCustomerServiceBackVisitIndex(orderId, orderAddr, customerName){
		customerServicePostData["customerServiceBackVisit.orderId"] = orderId;
		customerServicePostData["customerServiceBackVisit.orderAddr"] = orderAddr;
		customerServicePostData["customerServiceBackVisit.customerName"] = customerName;
		$("#customerServicePageContent").load(api.index.customerServiceBackVisitIndex.url);
	}

});

