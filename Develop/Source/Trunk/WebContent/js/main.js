var main = {
	top: [],
	skipFlag: false,
	quotationIntervalId: -1,
};

$(function(){
	
	params.authentication = window.authentication;
	
	$(document).attr('title', config.name + ' ' + config.ename);
    $('#name').text(config.name);
    
	com.post(api.common.createTree, {}, loadTreeCallback);
	com.post(api.common.wmCode, {}, function(res){
		params.watermark = res.watermark;
	}, null, false);
	
	var img = new Image();
	img.src = params.watermark;
	url = 'url("' + img.src + '")'
	$("#fl-container").css('background-size', '300px').css('background-image', url).css('bottom', '0');
	
	$("#versionCode").text(config.versionCode);
	
	$(".userProfile").attr("href", api.index.userProfile.url + "?timestamp="+ new Date().getTime());
	$(".userProfile").data("level", 1);
	$(".changePassword").attr("href", api.index.changePasswordIndex.url + "?timestamp=" + new Date().getTime());
	$(".changePassword").data("level", 1);
	
	$(".messageList").attr("href", api.index.messageIndex.url + "?timestamp=" + new Date().getTime());
	$(".messageList").data("level", 1);
	
	$("#logout").on("click", function(e){
//		window.location.href = api.common.logout.url + "?timestamp="+new Date().getTime();
		window.location.href = '/';
	});
	
	$(".userProfile").on("click", function(e){
		$this = $(this);
		navControl($this);

		e.preventDefault();
		var hrefStr = $this.attr("href");
		if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
			com.switchPage(hrefStr);
		}
	});
	
	$(".changePassword").on("click", function(e){
		$this = $(this);
		navControl($this);

		e.preventDefault();
		var hrefStr = $this.attr("href");
		if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
			com.switchPage(hrefStr);
		}
	});
	
	$(".messageList").on("click", function(e){
		$this = $(this);
		navControl($this);

		e.preventDefault();
		var hrefStr = $this.attr("href");
		if(hrefStr != "#" && hrefStr!="null" && hrefStr!=undefined){
			com.switchPage(hrefStr);
		}
		$('.breadcrumb .nav1').empty().append('<i class="icon-envelope"></i>&nbsp;消息查看');
	});
	
//	$(".moreLink").on("click", function(e){
//		var type = "";
//		if(e.target.id == "moreActivity"){
//			type = "活动";
//		}else{
//			type = "通知";
//		}
//		e.preventDefault();
//		com.switchPage(api.index.moreNoticesIndex.url, {}, function(){//			params["notice.type"] = type;	
//		});
//	});
	
	$('#moreActivity').click(function(){
		params["notice.type"] = "活动";
		
		com.switchPage(api.index.moreNoticesIndex.url);
	});
	
	$('#moreNotice').click(function(){
		params["notice.type"] = "通知";
		
		com.switchPage(api.index.moreNoticesIndex.url);
	});
	
	$("#versionInfo").on("click", function(e){
		$('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;版本');
		com.switchPage(api.index.versionIndex.url);
		$('.breadcrumb .nav2').hide();
		$('.breadcrumb .nav3').hide();
	});
	
	$("#faqInfo").on("click", function(e){
		$('.breadcrumb .nav1').empty().append('<i class="icon-bookmark"></i>&nbsp;帮助');
		com.switchPage(api.index.faqIndex.url);
		$('.breadcrumb .nav2').hide();
		$('.breadcrumb .nav3').hide();
	});
	
	com.post(api.personel.queryUserForSelfByUserId, {}, function(res){
		$("#personalPic").attr("src", config.media + api.common.showImg.url + '?imgBasePath='+res.user.userPhoto+'&divFlag=1&width=180&height=200&timestamp='+ new Date().getTime());
	});
	
	loadNotices();
	loadActivities();
	loadMessageCount();
	
//	setInterval(function(){
//		loadMessageCount();
//	}, 1800000);
	
	queryTopInfo('decorationDesignerRank', 'designerName')
	loadTopSelf();
});

function queryTopInfo(url, name){
	var url = api.report[url];
	
	var topTable = $('.top-table').html("");
	
	com.post(url, {}, function(res){
		var topList = "";
		
		$.each(res.ranks, function(i, v){
			
			var _name = v[name];
			var _rank = v["rank"];
			
			var rankImg = '';
			
			if(i == 0){
				rankImg = './images/golden_delicious.png';
			}else if(i == 1){
				rankImg = './images/silver_crown.png';
			}else if(i == 2){
				rankImg = './images/copper_crown.png';
			}
			
			var rankLi = $("<li></li>");
			var rankSpan = $("<span></span>").addClass("topPic").appendTo(rankLi);
			if(rankImg != ""){
				var rankImg = $("<img></img>").attr("src", rankImg).appendTo(rankSpan);
			}
			var rankNameSpan = $("<span></span>").addClass("topName").text(_name).appendTo(rankLi);
			
			if(_rank != null){
				var rankNameSpan = $("<span></span>").addClass("topValue").text(_rank).appendTo(rankLi);
			}
			
			rankLi.appendTo(topTable);
		});
	});
}

function reloadPage(){
	isF5 = true;
	location.reload(true);
//	window.location.href="index.do?timestamp="+new Date().getTime();
}

function loadTopSelf(opts){
	com.post(api.report.queryRankForPlace, opts, function(res){
		$("#decorationPlace").text(res.decorationPlace);
		$("#decorationRank").text(res.decorationRank);
		$("#materialPlace").text(res.materialPlace);
		$("#materialRank").text(res.materialRank);
		$("#zaterialPlace").text(res.zaterialPlace);
		$("#zaterialRank").text(res.zaterialRank);
	});
}

function loadNotices(){
	
	var img = new Image();
	img.src = params.watermark;
	url = 'url("' + img.src + '")'
	$(".page-content").css('background-size', '300px').css('background-image', url).css('bottom', '0');
	
	var options = {
		"paging.rows":5,
		"paging.page":1,
		"notice.type": "通知",
	}
	
	com.post(api.information.pageNoticeForDeptAValid, options, function(res){
		$("#noticeList").empty();
		$.each(res.paging.data, function(i, v){
			getNoticeDOM(v).appendTo($("#noticeList"));
		});
	});
}

function loadActivities(){
	
	var options = {
		"paging.rows":5,
		"paging.page":1,
		"notice.type": "活动",
	}
	
	com.post(api.information.pageNoticeForDeptAValid, options, function(res){
		$("#activityList").empty();
		$.each(res.paging.data, function(i, v){
			getNoticeDOM(v).appendTo($("#activityList"));
		});
	});
}

function getNoticeDOM(notice){
	var $wrap = $('<div class="alert alert-info clearfix" style="padding:5px 12px;"></div>');
	var $title = $('<div><i class="icon-hand-right green"></i></div>');
	var $theme = $('<strong style="margin-left:7px;">'+notice.theme+' </strong>').appendTo($title);
	
	var priorityStyle = "label-warning";
	
	$('<small class="detail" style="cursor:pointer">  [详细]</small>').on(ace.click_event, function(){
		$.gritter.add({
			title: notice.theme,
			text: notice.contents,
			class_name: 'gritter-info gritter-center'
		});
		
		return false;
	}).appendTo($theme);
	
	if(notice.priority == "紧急"){
		priorityStyle = "label-danger";
	}else if(notice.priority == "重要"){
		priorityStyle = "label-warning";
	}else if(notice.priority == "普通"){
		priorityStyle = "label-yellow";
	}
	
	$('<span class="label arrowed-in pull-right" style="line-height: 17px;">' + notice.priority+'</span>').addClass(priorityStyle).appendTo($title);
	var $contents = $('<div class="col-xs-12"><div style="text-overflow: ellipsis;white-space: nowrap;overflow: hidden;margin-right:50px;">'
			+ notice.contentsText+'</div><abbr title="' + notice.contentsText+'"></abbr></div>');
	var $bottomInfo = $('<small><div class="pull-right"><span><i class="icon-time bigger-110"></i>&nbsp;'
			+ notice.startTime + ' 至 ' + notice.endTime + '</span>&nbsp;&nbsp;<span><i class="icon-user bigger-110"></i>&nbsp;'
			+ notice.user.userName + '</span>&nbsp;&nbsp;</div></small>');
	if(notice.filePath!=undefined && notice.filePath != null && notice.filePath != ""){
		$(".pull-right", $bottomInfo).append('<span><i class="icon-download-alt bigger-110"></i>&nbsp;<a href=' + config.media + notice.filePath + "?t=" + new Date().getTime()+' onclick="window.open(this.href); return false;">下载附件</a></span>');
	}
	
	$wrap.append($title).append($contents).append($bottomInfo);
	
	return $wrap;
}

function loadMessageCount(){
	com.post(api.information.countMessage, {}, function(res){
		if(res.messageCount == 0){
			$("#messageCount").remove();
		}else{
			if($("#messageCount").length == 0){
				$("#messageBtn").append("<span id='messageCount' class='badge badge-pink'>"+res.messageCount+"</span>");
			}else{
				$("#messageCount").text(res.messageCount);
			}
		}
	}, function(res){
		console.log("get message count fail...");
	});
}

function loadTreeCallback(nodes){
	$(".user-info .user-name").text(nodes.userName);
	var treeData = nodes.tree;
	var $tree = $("ul.nav-list");
	var $main = $('<li><a href="#" onclick="reloadPage();"><i class="icon-home"></i><span class="menu-text">首页</span></a></li>');
	$tree.append($main);
	for(var x in treeData){
		var node = treeData[x];
		if(typeof node !== "object")
			continue;
		var $li = $("<li></li>");
		if(node.sub){//level 1
			var nodes2 = node.sub;
			var $a = $("<a href='"+node.url+"' class='dropdown-toggle'></a>").data('level', 1);
			var $i = $("<i class='"+node.icon+"'></i>");
			var $span = $("<span class='menu-text'>"+node.name+"</span>");
			var $b = $("<b class='arrow icon-angle-down'></b>");
			$a.append($i).append($span).append($b);
			var $ul = $("<ul class='submenu'></ul>");
			$li.append($a).append($ul);
			for(var y in nodes2){
				var node2 = nodes2[y];
				if(typeof node2 !== "object")
					continue;
				var $li2 = $("<li></li>");
				$ul.append($li2);
				if(node2.sub){//level 2
					var nodes3 = node2.sub;
					
					if(nodes3.length==1){
						var $a2 = $("<a href='"+nodes3[0].url+"?timestamp="+ new Date().getTime()+"'>"+nodes3[0].name+"</a>").data('level', 2);
						var $i2 = $("<i class='"+node2.icon+"'></i>");
						$a2.append($i2);
						$li2.append($a2);
						
					}else{
						var $a2 = $("<a href='"+node2.url+"' class='dropdown-toggle'></a>").data('level', 2);
						var $i2 = $("<i class='"+node2.icon+"'></i>");
						var $b2 = $("<b class='arrow icon-angle-down'></b>");
						$a2.append($i2).append(node2.name).append($b2);
						var $ul2 = $("<ul class='submenu'></ul>");
						$li2.append($a2).append($ul2);
						for(var z in nodes3){//level 3
							var node3 = nodes3[z];
							if(typeof node3 !== "object")
								continue;
							var $li3 = $("<li></li>");
							var $a3 = $("<a href='"+node3.url+"?timestamp="+ new Date().getTime()+"'></a>").data('level', 3);
							var $i3 = $("<i class='"+node3.icon+"'></i>");
							$a3.append($i3).append(node3.name);
							$li3.append($a3);
							$ul2.append($li3);
						}
					}
				}else{
					var $a2 = $("<a href='"+node2.url+"?timestamp="+ new Date().getTime()+"'>"+node2.name+"</a>").data('level', 2);
					var $i2 = $("<i class='"+node2.icon+"'></i>");
					$a2.append($i2);
					$li2.append($a2);
				}
			}
		}else{
			var $a = $("<a href='"+node.url+"'></a>").data('level', 1);
			var $i = $("<i class='"+node.icon+"'></i>");
			var $span = $("<span class='menu-text'>"+node.name+"</span>");
			$a.append($i).append($span);
			$li.append($a);
		}
		$tree.append($li);
	}
	
	$("a", $tree).on("click", function(e){
		$this = $(this);
		navControl($this);
		e.preventDefault();
		
		var hrefStr = $this.attr("href");
		
		if(hrefStr != "#" && hrefStr!="null" && hrefStr != undefined){
//			com.switchPage(hrefStr);
			com.switchPage(hrefStr);
			$(".daterangepicker").remove();
		}
	});
}

function navControl($this){
	if($this.data('level') == 1){
		$('.level1').removeClass('level1');
		$this.addClass('level1');
		if($this.attr('href')!='#'){
			$('ul.breadcrumb .nav1').html("<i class='"+$('i', $this).attr('class')+"'></i> "+$this.text());
			$('ul.breadcrumb .nav2').hide();
			$('ul.breadcrumb .nav3').hide();
		}
	}else if($this.data('level') == 2){
		$('.level2').removeClass('level2');
		$this.addClass('level2');
		if($this.attr('href')!='#'){
			$('ul.breadcrumb .nav1').html("<i class='"+$('.nav-list .level1 i').attr('class')+"'></i> "+$('.nav-list .level1').text());
			$a = $('<a href='+$this.attr("href")+'>'+$this.text()+'</a>');
			$('ul.breadcrumb .nav2').show().html($a);
			$('ul.breadcrumb .nav3').hide();
			$a.on('click', function(e){
				e.preventDefault();
				com.switchPage(e.target.href);
			});
		}
	}else if($this.data('level') == 3){
		$('.level3').removeClass('level3');
		$this.addClass('level3');
		if($this.attr('href')!='#'){
			$('ul.breadcrumb .nav1').html("<i class='"+$('.nav-list .level1 i').attr('class')+"'></i> "+$('.nav-list .level1').text());
			$('ul.breadcrumb .nav2').show().text($('.nav-list .level2').text());
			$a = $('<a href='+$this.attr("href")+'>'+$this.text()+'</a>');
			$('ul.breadcrumb .nav3').show().html($a);
			$a.on('click', function(e){
				e.preventDefault();
				com.switchPage(e.target.href);
			});
		}
	}
}
