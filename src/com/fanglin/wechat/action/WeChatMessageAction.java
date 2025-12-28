/**
 * @File Name		: WeChatMessageAction.java
 * @Package   	: com.fanglin.wechat.action
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信消息推送控制器
 */

package com.fanglin.wechat.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wechat.service.WeChatMessageService;

/**
 * 微信消息推送控制器
 * 用于发送微信模板消息（支付通知、服务进度通知等）
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WeChatMessageAction extends BaseListAction {

	private static final long serialVersionUID = -387995638369730324L;

	@Autowired
	private WeChatMessageService weChatMessageService;

	/**
	 * 消息类型
	 */
	private Integer type;

	/**
	 * 微信用户 UnionID
	 */
	private String unionId;

	/**
	 * 名称/业务名称
	 */
	private String name;

	/**
	 * 订单ID
	 */
	private String orderId;

	/**
	 * 金额
	 */
	private Float money;

	/**
	 * 备注信息
	 */
	private String comment;

	/**
	 * 消息内容
	 */
	private String content;

	/**
	 * 跳转路径（URL 或小程序路径）
	 */
	private String path;

	/**
	 * 发送支付通知消息
	 * @return 成功
	 */
	@Action(value = "sendWeChatPaymentMessage", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String sendPaymentMessage() {

		weChatMessageService.sendPaymentMessage(type, name, orderId, money, comment);

		return SUCCESS;
	}

	/**
	 * 发送服务进度通知消息（不含路径）
	 * @return 成功
	 */
	@Action(value = "sendWeChatServiceSchedule", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String sendServiceSchedule() {

		weChatMessageService.sendServiceSchedule(unionId, name, orderId, content);

		return SUCCESS;
	}

	/**
	 * 发送服务进度通知消息（含路径）
	 * @return 成功
	 */
	@Action(value = "sendWeChatServiceScheduleWithUrl", results = {
			@Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) },
			params = { "contentType", "text/html" })
	public String sendServiceScheduleWithUrl() {

		weChatMessageService.sendServiceSchedule(unionId, name, orderId, content, path);

		return SUCCESS;
	}

	// Getters and Setters

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Float getMoney() {
		return money;
	}

	public void setMoney(Float money) {
		this.money = money;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
