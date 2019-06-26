
$(function(){

	var message = {
		saveBtn : com.focusPage("#saveBtn"),
		messageList : com.focusPage("#messageList"),
	 	messageDetail : com.focusPage("#messageDetail"),
		isPerformance : com.focusPage("#isPerformance"),
		
		modals:{
			messageModal : com.focusPage("#messageModal")
		},
		messageItems: {
			receiver : com.focusPage("#receiver"),
			contents : com.focusPage("#contents")
		},
		currMessageId: "",

		status : {},
		messageType : {},

		editFlag: false,
		repeatFlg: false,
	};

	message.saveBtn.bindClick(saveData);

	message.isPerformance.switchBtn("isOrNot");

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

			var $label = $('<label></label>');
			var $input = $('<input>').attr({"type": "checkbox", "name": "mmids", "class": "ace ace-checkbox-2"}).val(v.mid);
			var $span = $('<span></span>').addClass('lbl blue bigger-150').text(v.contents);

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

			$label.append($input).append($span).appendTo($h3);

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

		com.clearValidator();
		com.cleanItems(message.messageItems);
		com.cleanTypeahead('receiver');

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

	function successCallback(){
		searcher.doSearch();
		loadMessageCount();
	}

});