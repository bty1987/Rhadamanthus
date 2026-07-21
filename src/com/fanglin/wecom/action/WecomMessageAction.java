/**
 * @File Name		: WecomMessageAction.java
 * @Package   	: com.fanglin.wecom.action
 * @Version		: 1.0
 * @Date			: 2026-7-5
 * @Copyright	: Copyright Creators 2014
 * @Describing	: 企业微信消息推送控制器 (自测/运维触发, 业务调用走 Service)
 */

package com.fanglin.wecom.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.wecom.service.WecomMessageService;

/**
 * 企业微信消息推送 HTTP 端点
 * <p>
 * 用途:
 * <ul>
 *   <li>联调自测: 推一条消息验证通路</li>
 *   <li>运维触发: 定时任务/外部系统主动推送</li>
 *   <li>业务接入前的过渡入口</li>
 * </ul>
 * </p>
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class WecomMessageAction extends BaseListAction {

	private static final long serialVersionUID = 4719203586734192850L;

	@Autowired
	private WecomMessageService wecomMessageService;

	/** 接收人员工号 (对应企业微信 userid) */
	private String receiveId;

	/** 公司明文编号 */
	private Integer company;

	/** 文本内容 */
	private String content;

	/** 文本卡片标题 */
	private String title;

	/** 文本卡片描述 */
	private String description;

	/** 点击跳转 URL */
	private String jumpUrl;

	/** 群机器人 webhook key */
	private String webhookKey;

	/** markdown 内容 */
	private String markdown;

	/** 推送结果 (0=成功, 非 0=errcode) */
	private int result;

	/** 发送应用文本消息 */
	@Action(value = "sendWecomText", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendText() {

		result = wecomMessageService.sendText(receiveId, content, company == null ? 0 : company);

		return SUCCESS;
	}

	/** 发送应用文本卡片消息 */
	@Action(value = "sendWecomTextCard", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendTextCard() {

		result = wecomMessageService.sendTextCard(receiveId, title, description, jumpUrl, company == null ? 0 : company);

		return SUCCESS;
	}

	/** 群机器人发送文本 */
	@Action(value = "sendWecomGroupText", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendGroupText() {

		result = wecomMessageService.sendGroupText(webhookKey, content);

		return SUCCESS;
	}

	/** 群机器人发送 markdown */
	@Action(value = "sendWecomGroupMarkdown", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendGroupMarkdown() {

		result = wecomMessageService.sendGroupMarkdown(webhookKey, markdown);

		return SUCCESS;
	}

	public String getReceiveId() {
		return receiveId;
	}

	public void setReceiveId(String receiveId) {
		this.receiveId = receiveId;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getJumpUrl() {
		return jumpUrl;
	}

	public void setJumpUrl(String jumpUrl) {
		this.jumpUrl = jumpUrl;
	}

	public String getWebhookKey() {
		return webhookKey;
	}

	public void setWebhookKey(String webhookKey) {
		this.webhookKey = webhookKey;
	}

	public String getMarkdown() {
		return markdown;
	}

	public void setMarkdown(String markdown) {
		this.markdown = markdown;
	}

	public int getResult() {
		return result;
	}

	public void setResult(int result) {
		this.result = result;
	}

}
