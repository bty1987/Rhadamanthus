jQuery(function($) {

	var approvalTrackSender = {
		postParam : {},
	};

	com.post(api.ds.approval, {
		"timestamp" : new Date().getTime()
	}, function(res) {
		approvalTrackSender.approvalType = res.approvalType;

		approvalTrackSender.approvalTypeData = {};

		for ( var i = 0; i < approvalTrackSender.approvalType.length; i++) {
			var _ = approvalTrackSender.approvalType[i];
			approvalTrackSender.approvalTypeData[_["key"]] = _["value"];
		}
	}, null, false);

	var displayFunc = (function() {

		var renderList = function(tableId, listData) {
			var $tableWrap = $('#' + tableId);
			var $ul = $('<ul></ul>').addClass(
					'item-list fl-table-list ui-sortable');

			if (listData && listData.length) {
				$.each(listData, function(i, v) {
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v) {

			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(approvalTrackSender.approvalTypeData[v.type]));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			// 查看主材退款,主材详细信息按钮
			var $btnDetails = $('<a></a>').addClass('btn btn-minier btn-primary').html('详情');


			var propertyArr = [
				[ "审批人:", v.receiverName, "grey" ],
				[ "提交时间:", v.createTime, "grey" ],
				[ "审批时间:", v.approvalTime, "grey" ],
				["状态:", v.status == 0 ? "等待" : (v.status == 1 ? "通过" : "拒绝"), "red" ]
			];

			$.each(propertyArr, function(index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			var $content = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix')
													.append($('<li></li>').append($('<strong></strong>')
													.append($('<b></b>').text(v.contents).addClass("grey"))));

			var typeName = v.type;

				if (typeName == "6"||typeName == "10") {
					$divBtnWrap.append($btnDetails).appendTo($h3);
				}
			$liLine.append($h3).append($ulProperty).append($content);

			

			// 主材详细信息按钮
			$btnDetails.bindClick(function() {
				queryMaterialSubOrder(v.aid, v.type);
			});
			return $liLine;
		};

		return {
			init : function(tableId, listData) {
				$('#' + tableId).html(null);
				renderList(tableId, listData);
			},
			drawLine : function(v) {
				return creatLine(v);
			}
		};
	})();

	var searcher = new Searcher();

	searcher.init([ "approval_receiverName", "approval_Type", "approval_createTime", "approval_Time" ], "condList",
			api.approval.pageApprovalBySenderId, function(data) {
				displayFunc.init('resultList', data);
			}, "pagenation", "approvalSenderTrackPostData");

	function queryMaterialSubOrder(aId,type,$this) {

		if ($('#materialInfoList').children()) {
			$('#materialInfoList').empty();
		}
		if(type=="6"){
			com.post(api.approval.queryApprovalMaterialRefundItem,{"approval.aid" : aId}, function(res) {
				$("#materialInfo").html("主材信息");
				$.each(res.approvalMaterialRefundItems, function(i, v) {
					$('#materialInfoList')
						.append(approvalUtils.addspan('10', '型号  : ', v.materialItem.name))
						.append(approvalUtils.addspan('40', '品类  : ', v.materialItem.category))
						.append(approvalUtils.addspan('40', '品牌  : ', v.materialItem.brand))
						.append('<br/>')
						.append(approvalUtils.addspan('10', '售价  : ', v.materialItem.price))
						.append(approvalUtils.addspan('40', '退货数量  : ', v.num))
						.append(approvalUtils.addspan('40', '退货金额  : ', v.total))
						.append('<hr/>');
				});
				$('#msoiModel').modal("show");
			}, null, false);
		}
		if(type=="10"){
			com.post(api.approval.queryApprovalSalesRefundItem,{"approval.aid" : aId}, function(res) {
				$("#materialInfo").html("销售信息");
				$.each(res.approvalSalesRefundItem, function(i, v) {
					$('#materialInfoList')
						.append(approvalUtils.addspan('0', '名称  : ', v.salesItem.goods.name))
						.append('<br/>')
						.append(approvalUtils.addspan('10', '颜色  : ', v.salesItem.color.name))
						.append(approvalUtils.addspan('40', '规格  : ', v.salesItem.format.info))
						.append(approvalUtils.addspan('10', '数量  : ', v.num))
						.append(approvalUtils.addspan('40', '总价  : ', v.total))
						.append('<hr/>');
				});
				$('#msoiModel').modal("show");
			}, null, false);
		}
	}
});

