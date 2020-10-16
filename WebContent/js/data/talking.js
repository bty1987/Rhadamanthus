$(function () {

  var talking = {
	saveBtn : com.focusPage("#saveBtn"),
	tranpackBtn : com.focusPage("#tranpackBtn"),
	
	modals: {
		talkingModal: com.focusPage("#talkingModal")
	},
	items : {
		name :com.focusPage("#name"),
		type : com.focusPage("#type"),
		content : com.focusPage("#content")
	  },
	editFlg : false,
	talkingType : {},
	talkingStatus : {}
	};

	talking.saveBtn.bindClick(saveData);

	talking.modals.talkingModal.on("hide.bs.modal", function(){
		com.clearValidator();
		com.cleanItems(talking.items);
	});

	com.post(api.ds.data, {}, function (res) {
		talking.items.type.bindData(res.talkingType, "key", "value");
		talking.talkingType = res.talkingType.split("key", "value");
		talking.talkingStatus = res.talkingStatus.split("key", "value");
	},null, false);

	var displayFunc = (function(){

		var renderList = function (tableId, listData) {
			var $tableWrap = com.focusPage('#' + tableId).empty();
			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if (listData && listData.length) {
				$.each(listData, function (i, v) {
					var $liLine = creatLine(v);

					$liLine.appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var  creatLine = function(v) {

			var $liLine = $('<li></li>').addClass('item-orange clearfix');
			var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var $invalid = $('<div></div>').addClass('pull-right');
			var $statusSwitch = $('<input/>').addClass('ace ace-switch ace-switch-5').prop({"type" : "checkbox"});
			var $span = $('<span></span>').addClass('lbl status-lbl');

			var $btnUpdate = $('<a></a>').addClass(' btn btn-minier btn-yellow').html('更新');
			var $btnDelete = $('<a></a>').addClass(' btn btn-minier btn-success').html('删除');

			$invalid.append($statusSwitch).append($span);
			$divBtnWrap.append($btnUpdate).append($btnDelete).append($invalid).appendTo($h3);

			var propertyArr = [
				["名称:",v.name,"grey"],
				["类型:",talking.talkingType[v.type],"grey"],
				["内容:",v.content,"grey"],
				["状态 :",talking.talkingStatus[v.status],"red"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$liLine.append($h3).append($ulProperty);

			$btnDelete.click(function () {
				com.showConfirm("是否确认删除", function(){
					deleteTalking(v.tid);
				});
			});

			!v.status ? $statusSwitch.prop("checked", true) : $statusSwitch.prop("checked", false);

			$invalid.click(function(){
				var cvalue = $statusSwitch.prop("checked") ? 0:1;

				updateTalkingForStatus(v.tid, cvalue);
			});

			$btnUpdate.click(function () {
                talking.editFlg = false;
				talking.items.tid = v.tid;
				talking.items.name.val(v.name);
				talking.items.type.val(v.type);
				talking.items.content.val(v.content);

				talking.modals.talkingModal.modal("show");
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
	
	var searcher = new Searcher();

	searcher.init( ["data-talking-name","data-talking-type","data-talking-status"], "creatLine", api.data.pageTalking, function(data){
		displayFunc.init('resultList', data);
	}, "pageTalking", "pageTalkingPost", null, false, null,function(res){
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('id', 'addTalking').css("margin", "0px 3px");
		var $addi = $('<i></i>').addClass('icon-plus bigger-110').appendTo($adda);
		var $addspan = $('<span></span>').text('添加').appendTo($adda);

		return [$adda];
	},"resultList");

	com.focusPage("#addTalking").click(function() {
		talking.editFlg = true;
		talking.modals.talkingModal.modal("show");
	});

	function updateTalkingForStatus(tid, newstatus){
		com.post(api.data.updateTalkingForStatus, {"talking.tid": tid, "talking.status": newstatus }, function (res) {
			newstatus == 0 ? com.showAlert(com.info, "已启动") : com.showAlert(com.info, "已禁用");
			searcher.doSearch();
		},null, false);

	};

	function deleteTalking(tid){
		com.post(api.data.deleteTalking, {"talking.tid": tid}, function (res) {
			com.showAlert(com.info, "操作成功");
			searcher.doSearch();
		},null, false);

	};

	function saveData(options){

		var url,options;

		options = {
		"talking.name": talking.items.name.val(),
		"talking.type":  talking.items.type.val(),
		"talking.content":  talking.items.content.val()
		};

		talking.editFlg ? url = api.data.addTalking : url = api.data.updateTalking, options["talking.tid"] = talking.items.tid;

		com.post(url, options, function (res) {
			com.closePopup();
			com.showAlert(com.info, "操作成功");
			searcher.doSearch();
		},null, false);

		talking.modals.talkingModal.modal("hide");
	};

});