$(function(){
	var noticeType = {};
	var  noticePriority={};
	var noticeIsPublic={};
	com.post(api.ds.information, {}, function(res){

		$.each(res.noticeType,function (i,v) {
			noticeType[v.key] = v.value;//类型
		});
		$.each(res.noticePriority,function (i,va) {
			noticePriority[va.key] = va.value;//类型
		});
		$.each(res.noticeIsPublic,function (i,val) {
			noticeIsPublic[val.key] = val.value;//类型
		});
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
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.theme));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			
			var $btnDown = $('<a></a>').addClass('btn btn-minier btn-success').html('下载');

			var myDate= new Date();
			var starts = new Date(v.startTime);
			var end = new Date(v.endTime);

			var status="";
			if(starts <= myDate && end >=myDate){
				status="有效";
			}else{
				status="无效";
			}

			var propertyArr = [
				["类型:", noticeType[v.type], "grey"],
				["优先级:", noticePriority[v.priority], "green"],
				["发布人:", v.creater.currentName, "grey"],
				["开始时间:", v.startTime, "grey"],
				["结束时间:", v.endTime, "grey"],
				["公开:", noticeIsPublic[v.isPublic], "blue"],
				["内容:", v.contents, "grey"],
				["状态:", status, "blue"]
			];

			$.each(propertyArr, function (index,value) {
				var $liProperty = $('<li></li>');
				$('<strong></strong>').html(value[0]).appendTo($liProperty);
				$('<b></b>').html(value[1]).addClass(value[2]).appendTo($liProperty);
				$liProperty.appendTo($ulProperty);
			});

			if(v.filePath != undefined && v.filePath != null && v.filePath != ""){
            	$divBtnWrap.append($btnDown);
        	}
			
			$divBtnWrap.appendTo($h3);

			$liLine.append($h3).append($ulProperty);
			
			$btnDown.click(function(){
            	window.open(config.media + v.filePath);
            	return false;
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

	var _condArr = ['theme', 'dateRange'];
	var searcher = new Searcher();
	searcher.init( _condArr, "condList", api.information.pageNoticeForSeenByType, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "moreNoticesPostData", {"notice.type" : params["notice.type"]}, false);


});