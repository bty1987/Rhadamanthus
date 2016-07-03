var materialOrderPostBalance = {
	saveBtn: null,
	cancellBtn: null,
	modal: null,
	materialOrderPostBalanceItems: {},
	
	caclTypeData: [{"id":"0", "name":"点位"}, {"id":"1", "name":"底价"}],
	
	editFlag: false
};

var materialOrderPostBalancePostData = {};

jQuery(function($) {
	$('#fl-statement').statement("主材子订单", "订单信息列表");
	
	materialOrderPostBalance.saveBtn = $("#saveBtn");
	materialOrderPostBalance.cancelBtn = $("#cancelBtn");
	
	materialOrderPostBalance.custProfit = $("#custProfit");
	
	materialOrderPostBalance.materialSubOrderPostBalanceModal = $("#materialSubOrderPostBalanceModal").on('show.bs.modal',function(e){
		materialOrderPostBalance.custProfit.val(0);
		
		com.clearValidator();
	});
	
	materialOrderPostBalance.postBalanceBtn = $("#postBalanceBtn").on("click", function(){
		
		var options = {
			"materialSubOrder.msoId": materialOrderPostBalancePostData.msoId,
			"materialSubOrder.custProfit": materialOrderPostBalance.custProfit.val(),
		}
		
		com.post(api.material.postBalanceMaterialSubOrder, options, function(res){
			searcher.doSearch();
		});
		
		materialOrderPostBalance.materialSubOrderPostBalanceModal.modal("hide");
	});
	
	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					var $liLine = $('<li></li>').addClass('item-orange clearfix');
					var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.msoNo));
					var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
					var $divBtnBlock = $('<div></div>').addClass('clearfix col-sm-12');
					var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

					var $btnItem = $('<a></a>').addClass('btn btn-minier btn-yellow').html('子项');
					var $btnBalance = $('<a></a>').addClass('btn btn-minier btn-success').html('结算');
					
					var propertyArr = [
						["楼盘地址:", v.orderAddr, "grey"],
						["客户名:", v.customerName, "grey"],
						["业务员:", v.salesmanName, "grey"],
						["品类:", v.materialType, "grey"],
						["品牌:", v.materialBrand, "grey"],
						["点位:", v.point, "blue"],
						["底价:", v.base, "blue"],
						["抹零:", v.maling, "green"],
						["厂商抹零:", v.venderMaling, "green"],
						["券信息:", v.couponInfo, "grey"],
						["描述:", v.des, "grey"],
					];
					
					$.each(propertyArr, function (index,value) {
						var $liProperty = $('<li></li>');
						$('<strong></strong>').html(value[0]).appendTo($liProperty);
						$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
						$liProperty.appendTo($ulProperty);
					});
					
					$btnItem.click(function(){
						viewMaterialOrderBalanceDetailIndex(v);
					});
					
					$btnBalance.click(function(){
						dialogMaterialOrderBalanceIndex(v.msoId);
					});
					
					$divBtnWrap.append($btnItem).append($btnBalance).appendTo($h3);
					
					$liLine.append($h3).append($ulProperty).append($divBtnBlock).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		}
		
		return {
			init : function(tableId,listData){
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			}
		}
	})();
	
	var searcher = new Searcher();
	
	searcher.init(["orderId", "msoNo", "orderAddr", "msalesman", "fullCollectTimeRange"], "condList", api.material.pageMaterialSubOrderForPostBalance, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "materialOrderPostBalancePostData");
	
	function viewMaterialOrderBalanceDetailIndex(v){
		
		materialOrderPostBalancePostData["materialOrderPostBalance.msoId"] = v.msoId;
		materialOrderPostBalancePostData["materialOrderPostBalance.maling"] = v.maling;
		materialOrderPostBalancePostData["materialOrderPostBalance.venderMaling"] = v.venderMaling;
		materialOrderPostBalancePostData["materialOrderPostBalance.couponInfo"] = v.couponInfo;
		
		$("#materialOrderPostBalancePageContent").load(api.index.materialOrderPostBalanceDetailIndex.url);
	}

	function dialogMaterialOrderBalanceIndex(msoId){
		
		materialOrderPostBalancePostData.msoId = msoId;
		
		materialOrderPostBalance.materialSubOrderPostBalanceModal.modal("show");
	}

});
