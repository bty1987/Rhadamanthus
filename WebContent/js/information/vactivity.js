
jQuery(function($) {

	var vactivity = {
		vpid: null,
		saveBtn: null,
		modal: null,
		items:{},
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
			var $h3 = $('<h3></h3>').addClass("oid").append($('<small></small>').addClass('blue').html(v.name));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');

			var propertyArr = [
				["名称: ", v.name, "grey"],
				["状态: ", v.isregist == 0 ? "启用" : "禁用", "red"]
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

	searcher.init(["vactivityName", "vactivityStatus"], "condList", api.information.pageVactivity, function(data){
		displayFunc.init('resultList', data);
	}, "pagenation", "vprizePostData",null, false, null, null);

});
