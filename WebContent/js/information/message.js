
$(function(){

	var message = {
		saveBtn : com.focusPage("#saveBtn"),
		messageList : com.focusPage("#messageList"),
		messageDetail : com.focusPage("#messageDetail"),
		isPerformance : com.focusPage("#isPerformance"),

		modals:{
			messageModal : com.focusPage("#messageModal"),
			itemModel : com.focusPage("#itemModel")
		},
		messageItems: {
			receiver : com.focusPage("#receiver"),
			contents : com.focusPage("#contents")
		},
		currMessageId: "",

		messageMngItemInfo : {
			"1": {
				"api": api.inventory.queryAccessoriesItemByAids,
				"title": "辅料单信息",
				"resultname": "accessoriesItems",
				"args": [
					['10', '名称  : ', "goods.name"],
					['10', '品类  : ', "goods.category"],
					['10', '品牌  : ', "goods.brand"],
					['10', '件数  : ', "goods.pieceNum"],
					['10', '数量  : ', "num"],
					['10', '单位  : ', "goods.measurementUnit"],
					['10', '出库价  : ', "selling"]
				]
			}
		},

		status : {},
		messageType : {},

		editFlag: false,
		repeatFlg: false,
	};

	message.saveBtn.bindClick(saveData);
	message.isPerformance.switchBtn("isOrNot");

	message.modals.messageModal.on("hide.bs.modal", function () {
		com.clearValidator();
		com.cleanTypeahead('receiver');
		com.cleanItems(message.messageItems);
	});

	com.initTypeahead('receiver', api.personel.queryUserByPinyin, "pinyinName", {"duty": "", "user.status":0}, "autoFillKeyValue", "key", "value", null);

	com.post(api.ds.information,{},function(res){

		message.status = res.messageStatus.split("key", "value");
		message.messageType = res.messageType.split("key", "value");

	},null,false);

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = com.focusPage('#' + tableId).empty();
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

			var $label = $('<label></label>');
			var $input = $('<input>').attr({"type": "checkbox", "name": "mmids", "class": "ace ace-checkbox-2"}).val(v.mid);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.contents);
			var $btnDetails = $('<a></a>').addClass('btn btn-minier btn-primary').html('详情');

			var propertyArr = [
				["消息分类:",message.messageType[v.type], "grey"],
				["状态:", message.status[v.status], "red"],
				["发送人:", v.sender ? v.sender.userName :"", "grey"],
				["时间:", v.createTime, "grey"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			if([1].indexOf(v.subtype) != -1){
				$divBtnWrap.append($btnDetails);

				$btnDetails.click(function(){
					queryInformationItem(v.ident, v.subtype);
				})
			}

			$label.append($input).append($span).appendTo($h3);

			$liLine.append($divBtnWrap).append($h3).append($ulProperty);

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
	searcher.init( [], "condList", api.information.pageMessage, function(list){
		displayFunc.init('resultList', list);

	}, "pagenation", "messageMngPostData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addMessage').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-envelope bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('发消息').appendTo($adda);

		var $reada = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('id', 'reMessage').css("margin", "0px 3px");
		var $readi = $('<i></i>').addClass('icon-eye-open bigger-110').appendTo($reada);
		var $readspan = $('<span></span>').text('已读').appendTo($reada);

		return [$adda, $reada];
	});

	com.focusPage("#addMessage").click(function() {
		message.editFlg = false;

		message.modals.messageModal.modal("show");
	});

	com.focusPage("#reMessage").click(function() {

		var nums = com.focusPage('input[name="mmids"]:checked');
		if(nums==null || nums.length ==0){
			return;
		}
		var options = {};

		$.each(nums, function(i, v){
			options["mids["+i+"]"] = $(v).val();
		});

		com.post(api.information.updateMessageForRead, options, successCallback);
	});

	com.focusPage("#returnBtn").click(function() {
		com.focusPage(".sysMessage").text("系统消息");

		message.messageList.show();

		message.messageDetail.hide();
	});

	function saveData(){

		if(com.validate('form') || message.repeatFlg)
			return false;

		var options = {
			"message.receiver.userId": com.typeahead("receiver"),
			"message.contents": message.messageItems.contents.val(),
			"message.type": 4,
		};

		com.post(api.information.sendMessage, options, function(){
			message.modals.messageModal.modal("hide");
			successCallback();
		});
	}

	function queryInformationItem(ident, subtype) {

		if (com.focusPage('#itemList').children()) {
			com.focusPage('#itemList').empty();
		}

		var itemInfo = message.messageMngItemInfo[subtype];
		var infoList = com.focusPage('#itemList');
		com.post(itemInfo.api, {"aids[0]": ident}, function (res) {

			com.focusPage("#itemTitle").html(itemInfo.title);

			var data = $.isArray(res[itemInfo.resultname]) ? res[itemInfo.resultname] : [res[itemInfo.resultname]]
			$.each(data, function (i, v) {
				$.each(itemInfo.args, function (j, e) {
					infoList.append(addspan(e[0], e[1], getElement(v, e[2].split('.'))));
				});

				infoList.append('<hr />');
		});

		message.modals.itemModel.modal("show");

		});
	}

	function successCallback(){
		searcher.doSearch();
		loadMessageCount();
	}

	function addspan(px, name, value){
		var $10pxdiv = $('<div></div>').css({
			'display': 'inline-block',
			'margin-left': '10px'
		});
		var $40pxdiv = $('<div></div>').css({
			'display': 'inline-block',
			'margin-left': '40px'
		});
		var $nameSpan = $('<b></b>').html(name);
		var $valueSpan = $('<span></span>').text(value);
		if (px == '40') {
			return $40pxdiv.append($nameSpan).append($valueSpan);
		} else if (px == '10') {
			return $10pxdiv.append($nameSpan).append($valueSpan);
		} else if (px == '0') {
			return $10pxdiv.append($('<h3></h3>').html(value));
		}
	}

	function getElement(o, props) {

		var prop = props.shift();

		if (props.length == 0) {
			return o[prop];
		} else if (o[prop]) {
			return getElement(o[prop], props);
		}

		return "";
	}

});