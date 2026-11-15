// 跟单共享字典与渲染(售前pre/售后post两模式共用)
// 数据源=sales.salesprefollowup / sales.salespostfollowup
// 枚举与后端 SalesPreFollowupPO/SalesPostFollowupPO 常量一一对应(照sales4operate.js字典先例,免constant表依赖)

var salesFollowupDict = {
	pre: {
		label: "售前跟单",
		items: {0: "意向沟通", 1: "品牌到店", 2: "方案比价", 9: "其他"},
		ways: {0: "电话", 1: "微信", 2: "到店接待", 3: "上门", 9: "其他"}
	},
	post: {
		label: "售后跟单",
		items: {0: "配送协调", 1: "安装服务", 2: "客户回访", 3: "投诉处理", 9: "其他"},
		ways: {0: "电话", 1: "微信", 2: "上门", 9: "其他"}
	}
};

// 售后配送进度(salesdeliveryitem.status, 照 SalesDeliveryItemPO 状态枚举)
var salesDeliveryItemStatus = {0: "初始", 1: "配送", 2: "审核", 3: "客户确认", 4: "完结"};

function followupOverdue(planTime) {
	return planTime && new Date(String(planTime).replace(/-/g, "/")).getTime() < Date.now();
}

function followupDaysBefore(timeStr) {
	return Math.floor((Date.now() - new Date(String(timeStr).replace(/-/g, "/")).getTime()) / 86400000);
}

// 统计条: 跟单记录总数 / 最近跟进(>7天标橙) / 超期计划(标红); stats={total, lastTime, overdueCount}
function renderFollowupStats($wrap, stats) {

	var $box = $('<div></div>').addClass('clearfix').css({'padding': '4px 8px', 'border-bottom': '1px solid #eee'});

	var overdue = stats.overdueCount || 0;

	$box.append($('<b></b>').addClass('blue').text("跟单记录:" + (stats.total || 0)));

	var $last = $('<b></b>').text(stats.lastTime ? "最近跟进:" + followupDaysBefore(stats.lastTime) + "天前" : "最近跟进:无记录");
	$last.addClass(stats.lastTime && followupDaysBefore(stats.lastTime) > 7 ? 'orange' : 'grey');
	$box.append($last);

	$box.append($('<b></b>').addClass(overdue > 0 ? 'red' : 'grey').text("超期计划:" + overdue));

	$wrap.append($box);
}

// 跟单记录时间轴条目(pre/post共用); me=当前登录人userId(空则不显示删除), onDelete(记录)删除回调
function renderFollowupItem($ul, v, type, me, onDelete) {

	var dict = salesFollowupDict[type];

	var $li = $('<li></li>').addClass('item-orange clearfix');

	if (followupOverdue(v.planTime)) $li.css('border-left', '3px solid #d15b47');

	var $h3 = $('<h3></h3>').addClass('oid');

	$h3.append($('<small></small>').addClass(followupOverdue(v.planTime) ? 'red' : 'blue').text(dict.items[v.item] || v.item));
	$h3.append($('<span></span>').addClass('grey').css('margin-left', '10px').text(v.content || ""));

	if (me && v.creater && v.creater.userId == me && onDelete) {

		var $btns = $('<div></div>').addClass('pull-right action-buttons');
		var $del = $('<a></a>').addClass('btn btn-minier btn-danger').text('删除');

		$del.on('click', function() {
			onDelete(v);
		});

		$btns.append($del);
		$h3.append($btns);
	}

	var $ulProperty = $('<ul></ul>').addClass('list-unstyled fl-inline-list clearfix').css('padding-left', '12px').appendTo($li);

	var props = [
		["记录人:", v.creater ? (v.creater.currentName || v.creater.userName) : "-", "grey"],
		["方式:", dict.ways[v.way] || v.way, "grey"],
		["跟进时间:", v.createTime, "green"],
		["下一步计划:", v.plan || "-", "blue"]
	];

	if (type == "pre") {
		props.push(["品类:", v.category || "-", "grey"], ["品牌:", v.brandName || "-", "grey"]);
	} else {
		props.push(["处理结果:", v.result || "-", "grey"]);
	}

	if (v.planTime) {
		props.push(["计划跟进:", v.planTime, followupOverdue(v.planTime) ? "red" : "orange"]);
	}

	$.each(props, function(j, p) {

		var $liProp = $('<li></li>').appendTo($ulProperty);
		$('<strong></strong>').text(p[0]).appendTo($liProp);
		$('<b></b>').text(p[1] == null || p[1] == "" ? "-" : p[1]).addClass(p[2]).appendTo($liProp);
	});

	$li.prepend($h3);

	$ul.append($li);
}

// 列表容器渲染: records为过滤后的数组
function renderFollowupList($wrap, records, type, me, onDelete) {

	$wrap.html('');

	var $ul = $('<ul></ul>').addClass('item-list fl-table-list ui-sortable');

	if (!records || !records.length) {

		$('<li></li>').addClass('item-orange clearfix').append(
			$('<div></div>').html("暂无跟单记录").css({"text-align": "center", "color": "#999", "padding": "8px"})).appendTo($ul);
	}

	$.each(records || [], function(i, v) {
		renderFollowupItem($ul, v, type, me, onDelete);
	});

	$wrap.append($ul);
}
