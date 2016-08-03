messagePostData = {};

$(function(){

	var message = {
		saveBtn : $("#saveBtn").on("click", saveData),
		messageList : $("#messageList"),
	 	messageDetail : $("#messageDetail"),
		isPerformance : $("#isPerformance").switchBtn("isOrNot"),
		modal : $("#messageModal").on('show.bs.modal',function(e){
			com.clearValidator();
		}),
		messageItems: {
			receiver : $("#receiver"),
			contents : $("#contents")
		},

		READED: "已读",
		UNREAD: "未读",

		currMessageId: "",

		editFlag: false,
		repeatFlg: false,
	};
	
	com.initChosen('receiver', api.personel.queryUserForNameByPinyinName, "pinyinName", {}, "autoFillKeyValue", "key", "value");

	$("#performanceSaveBtn").on("click", function(){
		var isPerformance = com.isOrNotType[message.isPerformance.prop("checked")];
		var options = {'message.messageId': message.currMessageId, 'approveParams': "pass"};

		if(isPerformance == "是"){
			options['approveParams'] += "-1";
		}else{
			options['approveParams'] += "-0";
		}

		com.post(api.information.approveMessage, options, function(){
			$("#discountModal").modal("hide");
			$(".approve-btn").prop("disabled", true);

			com.showAlert(com.info, "操作成功");
		});
	});

	$(".approve-btn").on("click", function(){
		var passCard = this.id == "passBtn" ? "pass" : "refuse";

		if(this.id == "passBtn" && message.currArgs.type == "orderDiscountApprove" && parseFloat(message.currArgs.newDiscount) < 7.5){
			$("#discountModal").modal("show");
			message.isPerformance.prop('checked', com.isOrNotType["否"]);

			return false;
		}

		var options = {
			'message.messageId': message.currMessageId,
			'approveParams': passCard
		};

		com.post(api.information.approveMessage, options, function(){
			$(".approve-btn").prop("disabled", true);
			com.showAlert(com.info, "操作成功");
		});
	});

	$("#returnBtn").on("click", function(){
		$(".sysMessage").text("系统消息");
		
		message.messageList.show();
		
		message.messageDetail.hide();
	});

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
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid');
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var $label = $('<label></label>').css('font-size', 'inherit');
			var $input = $('<input>').attr({
				"type": "checkbox",
				"name": "mmids",
				"class": "ace ace-checkbox-2",
			}).val(v.messageId);
			var $span = $('<span></span>').addClass('lbl').append($('<small></small>').addClass('blue').css({'font-size': '0.75em', 'font-weight' : 'bold'}).html(" " + v.contents));

			var propertyArr = [
				["消息分类:", v.type, "grey"],
				["状态:", v.status, "red"],
				["发送人:", v.sender.userName, "grey"],
				["时间:", v.createTime, "grey"],
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
				$('#' + tableId).html(null);
				renderList(tableId,listData);
			},
			drawLine : function(v){
				return creatLine(v);
			}
		}
	})();

	var searcher = new Searcher();
	searcher.init( [], "condList", api.information.pageMessage, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "messageMngPostData", null, false, null, function(){

		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'addVillage').css('margin', '5px 5px 0 0');
		var $addi = $('<i></i>').addClass('icon-envelope bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('发消息').appendTo($adda);

		$adda.click(function(){
			message.editFlg = false;
			
			com.cleanItems(message.messageItems);

			com.updateChosen('receiver', '', '');

			message.modal.modal("show");
		});

		var $reada = $('<a></a>').addClass('btn btn-minier btn-success pull-left').attr('name', 'addVillage').css('margin', '5px 5px 0 0');
		var $readi = $('<i></i>').addClass('icon-eye-open bigger-110').appendTo($reada);
		var $readspan = $('<span></span>').text('已读').appendTo($reada);

		$reada.click(function(){
			var nums = $('input[name="mmids"]:checked');
			if(nums==null || nums.length ==0){
				return;
			}
			var options = {};
			$.each(nums, function(i, v){
				options["messageIds["+i+"]"] = $(v).val();
			});

			com.post(api.information.updateMessageForRead, options, successCallback);
		});

		return [$adda, $reada];
	});

	function saveData(){

		if(com.validate() || message.repeatFlg)
			return;

		var options = {
			"message.receiver.userId": message.messageItems.receiver.val(),
			"message.contents": message.messageItems.contents.val(),
			"message.type": "个人消息",
		};

		com.post(api.information.sendMessage, options, function(){
			message.modal.modal("hide");
			successCallback();
		});
	}

	function successCallback(){
		searcher.doSearch();
		loadMessageCount();
	}

});