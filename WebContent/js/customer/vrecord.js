
jQuery(function($) {

	var vrecord = {
		"vid": params.vid
	};

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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.comment));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var propertyArr = [
				["操作人:", v.creater.userName, "grey"],
				["创建时间:", v.createTime, "grey"]
			];

			$.each(propertyArr, function (index, value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2] ? value[2] : "").appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			$divBtnWrap.appendTo($h3);

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

	searcher.init([], "condList", api.customer.queryVrecordByVid, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "vrecordPostData", {"vrecord.vid":vrecord.vid}, true, "vrecords", null);

	//返回
	com.focusPage("#back").click(function(){
		com.switchPage(api.index.vustomerAdvance.url);
	});

	//添加
	com.focusPage("#add").click(function(){
		com.focusPage("#comment").val("");
		com.focusPage("#vrecordModal").modal("show");
		com.clearValidator();
	});

	//保存
	com.focusPage("#saveBtn").click(function(){
		if(com.validate()){
			return;
		}
		
		var options = {
			"vrecord.vid":vrecord.vid,
			"vrecord.comment":com.focusPage("#comment").val()
		};
		com.post(api.customer.addVrecord, options, function(res){
			searcher.doSearch();
			com.showAlert(com.info, "保存成功！");
			com.focusPage("#vrecordModal").modal("hide");
		});
	});
});
