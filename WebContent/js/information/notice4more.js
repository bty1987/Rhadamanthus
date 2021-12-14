$(function(){
	var moreNotices = {

		noticeType: {},
		noticePriority: {},
		noticeIsPublic: {}
	};

	com.post(api.ds.information, {}, function(res){

		moreNotices.noticeType = res.noticeType.split("key", "value");
		moreNotices.noticePriority = res.noticePriority.split("key", "value");
		moreNotices.noticeIsPublic = res.noticeIsPublic.split("key", "value");

	},null,false);

	var displayFunc  = (function(){

		var renderList = function(tableId,listData){
			var $tableWrap = com.focusPage('#' + tableId).empty();

			var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

			if(listData && listData.length){
				$.each(listData,function(i, v){
					creatLine(v).appendTo($ul);
				});

				$ul.appendTo($tableWrap);
			}
		};

		var creatLine = function(v){
			var $liLine = $('<li></li>').addClass('item-blue clearfix');
			var $h3 = $('<h3></h3>').addClass('oid').append($('<small></small>').addClass('blue').html(v.theme));
			var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix');
			var $divBtnWrap = $('<div></div>').addClass('pull-right action-buttons');
			
			var $btnDown = $('<a></a>').addClass('btn btn-minier btn-success').html('查看');

			var myDate= new Date();
			var starts = new Date(v.startTime);
			var end = new Date(v.endTime);

			var propertyArr = [
                ["发布人:", v.creater.currentName, "grey"],
				["类型:", moreNotices.noticeType[v.type], "red"],
				["公开:", moreNotices.noticeIsPublic[v.isPublic], "red"],
				["优先级:", moreNotices.noticePriority[v.priority], "red"],
				["状态:", starts <= myDate && end >= myDate ? "有效":"无效", "red"],
				["开始时间:", v.startTime, "green"],
				["结束时间:", v.endTime, "green"],
				["内容:", v.contents, "grey"],
				["文件名:", v.fileName == "" || v.fileName == null ? "无" : v.fileName, "grey"]
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
				
            	if(parent.window.isPC){
            		nw.Window.open(config.media + v.filePath, {}, function(new_win) { if(new_win) new_win.maximize();});
            	}else{
            		com.popup("公告",config.media + v.filePath);
            	}
            	
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

	var searcher = new Searcher();
	
	searcher.init( ['information-notice-theme', 'information-notice-dateTime'], "condList", api.information.pageNoticeForSeenByType, function(list){
		displayFunc.init('resultList', list);
	}, "pagenation", "moreNoticesPostData", {"notice.type" : params["notice.type"]}, false);


});