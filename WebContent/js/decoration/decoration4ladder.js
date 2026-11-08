/**
 * @File Name		: decoration4ladder.js
 * @Package   	: com.fanglin.decoration
 * @Version		: 1.0
 * @Date			: 2026-11-08
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 装修单阶梯奖品直领入口——以活动物品(activityitem.type=30)为显示行,
 *                直接参与预占/领取(免申领审批); 领取=实时库存判定(签约前后均可, 窗口外可领)
 */

$(function() {

	var decorationLadder = {};

	decorationLadder.states = {
		0: "已预占(待领取)",
		1: "已失效",
		2: "已领取(可收款抵扣)",
		3: "已退款",
		7: "已抵扣"
	};

	decorationLadder.panel = com.focusPage("#ladderPanel");

	decorationLadder.init = function() {

		var orderId = params.decoration.orderId;

		decorationLadder.panel.html("");

		// 该单已参加的活动
		com.post(api.decoration.queryDecorationActivityByOrderId, {
			"decorationActivity.orderId": orderId
		}, function(res) {

			var activities = res.decorationActivitys;

			// 该单阶梯券行(type=30)
			com.post(api.decoration.queryDecorationActivityItem, {
				"decoration.orderId": orderId
			}, function(res) {

				var coupons = [];

				$.each(res.decorationActivityItems, function(i, item) {
					if (item.type == 30)
						coupons.push(item);
				});

				var shown = 0;
				var processed = 0;

				$.each(activities, function(i, activity) {

					// 活动的阶梯奖品行(activityitem.type=30, 面值降序即奖级)——显示入口
					com.post(api.information.queryActivityItemByAid, {
						"activity.aid": activity.activity.aid
					}, function(res) {

						$.each(res.activityItems, function(i, activityItem) {

							if (activityItem.type != 30)
								return;

							shown++;
							decorationLadder.renderRow(activity, activityItem, coupons);
						});

						processed++;

						if (processed == activities.length && shown == 0)
							decorationLadder.panel.html('<div class="alert alert-info" style="margin-bottom: 5px;">该装修单参加的活动均未配置阶梯奖品</div>');
					}, null, false);
				});

				if (activities.length == 0)
					decorationLadder.panel.html('<div class="alert alert-info" style="margin-bottom: 5px;">该装修单尚未参加活动, 请先在活动页签参加阶梯活动</div>');
			}, null, false);
		}, null, false);
	};

	decorationLadder.renderRow = function(activity, activityItem, coupons) {

		// 券行与奖品按 asid 对应(券行asid=awardstock, activityitem.asid同源)
		var coupon = null;

		$.each(coupons, function(i, item) {
			if (item.asid == activityItem.asid) {
				coupon = item;
				return false;
			}
		});

		var stateText = coupon ? (decorationLadder.states[coupon.state] || coupon.state) : "未参与";

		var $row = $('<div class="alert" style="margin-bottom: 5px; padding: 8px 15px;"></div>').appendTo(decorationLadder.panel);
		$('<strong></strong>').text(activityItem.name).appendTo($row);
		$('<span></span>').css({
			"margin-left": "15px"
		}).text("面值: " + utils.accDiv(activityItem.money, 1000) + "元").appendTo($row);
		$('<span></span>').css({
			"margin-left": "15px"
		}).text("活动: " + activity.activity.name).appendTo($row);

		var $state = $('<span></span>').css({
			"margin-left": "15px",
			"font-weight": "bold"
		}).text(stateText).appendTo($row);

		var $btn = $('<button type="button" class="btn btn-xs btn-primary" style="float: right;"></button>');
		$btn.appendTo($row);

		if (coupon == null || coupon.state == 1) {

			$btn.text("参与预占").on("click", function() {

				com.post(api.decoration.addDecorationActivityItem, {
					"decorationActivityItem.orderId": params.decoration.orderId,
					"decorationActivityItem.aid": activity.activity.aid,
					"decorationActivityItem.aiid": activityItem.aiid,
					"decorationActivityItem.activityName": activity.activity.name,
					"decorationActivityItem.activityItemName": activityItem.name,
					"decorationActivityItem.type": activityItem.type,
					"decorationActivityItem.num": 1,
					"decorationActivityItem.money": activityItem.money,
					"decorationActivityItem.stateType": 0,
					"decorationActivityItem.asid": activityItem.asid,
					"decorationActivityItem.content": ""
				}, function(res) {

					com.showAlert(com.info, "预占成功, 库存以签约/领取时点为准");
					decorationLadder.init();
				});
			});

		} else if (coupon.state == 0) {

			$btn.text("直接领取").on("click", function() {

				com.post(api.decoration.receiveDecorationActivityItem, {
					"decorationActivityItem.daiId": coupon.daiId
				}, function(res) {

					com.showAlert(com.info, "领取成功");
					decorationLadder.init();
				});
			});

		} else {
			$btn.addClass("disabled").prop("disabled", true).text("—");
			if (coupon.state == 2)
				$row.addClass("alert-success");
		}
	};

	decorationLadder.init();
});