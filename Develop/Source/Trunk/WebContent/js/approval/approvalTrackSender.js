jQuery(function($) {

	var approvalTrack = {
		postParam : {},
	};

	com.post(api.ds.approvalType, {
		"timestamp" : new Date().getTime()
	}, function(res) {
		approvalTrack.approvalType = res.approvalType;

		approvalTrack.approvalTypeData = {};

		for ( var i = 0; i < approvalTrack.approvalType.length; i++) {
			var _ = approvalTrack.approvalType[i];
			approvalTrack.approvalTypeData[_["key"]] = _["value"];
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(approvalTrack.approvalTypeData[v.type]));
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

				if (typeName == "6") {
					$divBtnWrap.append($btnDetails).appendTo($h3);
				}
			$liLine.append($h3).append($ulProperty).append($content);

			

			// 主材详细信息按钮
			$btnDetails.bindClick(function() {
				queryMaterialSubOrder(v.aid);
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
		}
	})();

	var searcher = new Searcher();

	searcher.init([ "receiverName", "approvalType", "createTime", "approvalTime" ], "condList",
			api.approval.pageApprovalBySenderId, function(data) {
				displayFunc.init('resultList', data);
			}, "pagenation", "approvalSenderTrackPostData");



	function queryMaterialSubOrder(aId) {
		if ($('#materialInfoList').children()) {
			$('#materialInfoList').empty();
		}

		com.post(api.approval.queryApprovalMaterialRefundItem,{"approval.aid" : aId}, function(res) {
			$.each(res.approvalMaterialRefundItems, function(i, v) {
				$('#materialInfoList')
					.append(addspan('10', '型号  : ', v.materialSubOrderItem.materialModelName))
					.append(addspan('40', '品类  : ', v.materialSubOrderItem.materialTypeName))
					.append(addspan('40', '品牌  : ', v.materialSubOrderItem.materialBrandName))
					.append('<br/>')
					.append(addspan('10', '售价  : ', v.materialSubOrderItem.price))
					.append(addspan('40', '退货数量  : ', v.num))
					.append(addspan('40', '退货金额  : ', v.total))
					.append('<hr/>');
			})
			$('#msoiModel').modal("show");
		}, null, false)
	}

});

function addspan(px, name, value) {
	var $10pxdiv = $('<div></div>').css({
		'display' : 'inline-block',
		'margin-left' : '10px'
	});
	var $40pxdiv = $('<div></div>').css({
		'display' : 'inline-block',
		'margin-left' : '40px'
	});
	var $nameSpan = $('<b></b>').html(name);
	var $valueSpan = $('<span></span>').text(value);

	if (px == '40') {
		return $40pxdiv.append($nameSpan).append($valueSpan);
	} else if (px == '10') {
		return $10pxdiv.append($nameSpan).append($valueSpan);
	}
}
