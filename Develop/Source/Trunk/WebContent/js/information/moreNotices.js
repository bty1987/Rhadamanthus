$(function(){
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.theme));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');

			var propertyArr = [
				["类型:", v.type, "grey"],
				["优先级:", v.priority, "grey"],
				["发布部门:", v.dept.deptName, "grey"],
				["发布人:", v.user.userName, "grey"],
				["开始时间:", v.startTime, "grey"],
				["结束时间:", v.endTime, "grey"],
				["公开:", v.isPublic, "grey"],
				["内容:", v.contentsText, "grey"],
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

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

	var _condArr = ['theme', 'dateRange'];
	var searcher = new Searcher();
	searcher.init( _condArr, "condList", api.information.pageNoticeForDeptAValid, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "moreNoticesPostData", {"notice.type" : params["notice.type"]}, false, null, function(){
		
		var $adda = $('<a></a>').addClass('btn btn-minier btn-primary pull-left').attr('name', 'btnBack').css('margin', '5px 5px 0 0');
    	var $addi = $('<i></i>').addClass('icon-mail-forward bigger-110').appendTo($adda);
    	var $addspan = $('<span></span>').text('返回').appendTo($adda);
    	
    	return [$adda];
	});

	$('a[name="btnBack"]').click(function(){
		isF5 = true;
		location.reload(true);
	});
});