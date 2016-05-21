
var Approval = (function(){
	var apconfig = {
		hostAddr : "http://" + window.location.host,
		authentication : "",
		approvalType : null,
		getApprovalType : function(){
			var approvalType = {};
			var that = this;

			$.ajax({
				type: 'GET',
				url: that.hostAddr + "/ds/approvalType.json",
				data: {},
				async: false,
				success: function(res){
					$.each(res.approvalType, function(i, v){
						approvalType[v.key] = v.value;
					});
				}
			});

			that.approvalType = approvalType;
		}
	};

	var paging = {
		loading : false,
		searchParam:{},
		page : {
			page : 1,
			rows : 10,
			totalPage : 0,
			totalRecords : 0
		},
		getData : function(params, callBack){
			$('.infinite-scroll-preloader').show();
			var that = this;

			var _authentication = window.localStorage["authentication"];
			var _userId = window.localStorage["userid"];

			if(_authentication && _userId){
				params = $.extend(true, {}, params, {"authentication" : _authentication, "userId" : _userId});
			}

			// 如果正在加载，则退出
			if (that.loading) return;
			that.loading = true;
			$.ajax({
				type: 'POST',
				url: config.serverHost + "pageApprovalByReceiveId.do?timestamp=" + new Date().getTime(),
				data: params,
				async: false,
				dataType : "json",
				success: function(res){
					that.loading = false;
					paging.page.page = res.paging.page;
					paging.page.rows = res.paging.rows;
					paging.page.totalPage = res.paging.totalPage;
					paging.page.totalRecords = res.paging.totalRecords;

					$('.infinite-scroll-preloader').hide();

					callBack(res.paging.data);

				},error: function (xhr, errorType, error) {
					$.alert("错误" + error + errorType);
					$('.infinite-scroll-preloader').hide();
				}
			});
		}
	};

	var painter = {
		renderList : function(list){
			var that = this;
			$.each(list, function(i, v){
				var $line = that.drawLine(v);
				$('#apprvalList').append($line);
			});
		},
		drawLine : function(v){
			var $li, $a, $wrap, $titWrap, $tit, $time, $subTit, $txt;
			var href = "approvalItem.html?approval.aid=" + v.aid + "&authentication=" + apconfig.authentication;
			var replaceStr = '#';

			href = encodeURI(href);
			href = href.replace(new RegExp(replaceStr,'gm'),'%23');

			$li = $('<li></li>');
			$a = $('<a></a>').addClass('item-link item-content').attr('href', href);
			$wrap = $('<div></div>').addClass('item-inner');
			$titWrap  = $('<div></div>').addClass('item-title-row');
			$tit  = $('<div></div>').addClass('item-title').html(v.senderName);
			$time  = $('<div></div>').addClass('item-after').html(v.createTime);
			$subTit  = $('<div></div>').addClass('item-subtitle').html(apconfig.approvalType[v.type]);
			$txt  = $('<div></div>').addClass('item-text').html(v.contents);

			$titWrap.append($tit).append($time);
			$wrap.append($titWrap).append($subTit).append($txt);
			$a.append($wrap).appendTo($li);

			return $li;
		}
	};

	return {
		init: function(authentication, user){
			apconfig.authentication = authentication;
			apconfig.getApprovalType();
			paging.searchParam = {
				"authentication": authentication,
				"userId": user.userId,
				"filters[0].field": "status",
				"filters[0].data": "0",
				"filters[0].op": "eq",
			};

			paging.getData($.extend(true, {}, paging.searchParam, {"paging.page": 1,"paging.rows" : paging.page.rows}), function(list){
				list.length ? painter.renderList(list) :($.alert('未找到审批申请'),
						// 加载完毕，则注销无限加载事件，以防不必要的加载
						$.detachInfiniteScroll($('.infinite-scroll')),
						// 删除加载提示符
						$('.infinite-scroll-preloader').remove()
				) ;
			})
		},
		getList : function(){
			var page = parseInt(paging.page.page) == parseInt(paging.page.totalPage) ? null : parseInt(paging.page.page) + 1;
			page ? paging.getData($.extend(true, {}, paging.searchParam, {"paging.page": page,"paging.rows" : paging.page.rows}), function(list){

				list.length ? (painter.renderList(list),$.refreshScroller()): $.alert('未找到审批申请');
			}) :(
				// 加载完毕，则注销无限加载事件，以防不必要的加载
				$.detachInfiniteScroll($('.infinite-scroll'))
				// 删除加载提示符
				//$('.infinite-scroll-preloader').remove(),
			);
		}
	};
})();

$(function(){

	$.config = {router: false};

	Ding.handle(5390445, window.location.href, function(config, user){
		Approval.init(config.authenticationEncode, user);
		window.localStorage["authentication"] = config.authenticationEncode;
		window.localStorage["userid"] = user.userid;
	});

	//无限滚动
	$(document).on("pageInit", "#page-infinite-scroll-bottom", function(e, id, page) {

		$(page).on('infinite', function() {
			Approval.getList();
		});
	});

	$.init();
});

