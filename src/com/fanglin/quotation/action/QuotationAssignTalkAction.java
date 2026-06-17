/**
 * @File Name     : QuotationAssignTalkAction.java
 * @Package       : com.fanglin.quotation.action
 * @Version       : 1.0
 * @Date          : 2026-04-30
 * @Copyright     : Copyright Creators 2026
 * @Author        : Claude AI
 * @Describing    : 报价分配沟通消息 Action 控制器
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationAssignTalkService;
import com.fanglin.quotation.vo.QuotationAssignTalkVO;

/**
 * 报价分配沟通消息 Action 控制器
 * 
 * <p>
 * 职责：处理设计师和预算员之间的沟通消息 HTTP 请求
 * </p>
 * 
 * <p>
 * 主要功能：
 * </p>
 * <ul>
 * <li>根据装修单号查询沟通消息列表</li>
 * <li>发送沟通消息（同时触发钉钉通知）</li>
 * </ul>
 * 
 * @author Claude AI
 * @version 1.0
 */
@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationAssignTalkAction extends BaseListAction {

	private static final long serialVersionUID = 5274112234270256197L;

	@Autowired
	private QuotationAssignTalkService quotationAssignTalkService;

	/**
	 * 沟通消息对象（用于接收前端参数和返回结果）
	 */
	private QuotationAssignTalkVO quotationAssignTalk;

	/**
	 * 沟通消息列表（用于返回查询结果）
	 */
	private List<QuotationAssignTalkVO> quotationAssignTalks;

	/**
	 * 根据装修单号查询沟通消息列表
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "queryQuotationAssignTalkByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "excludeNullProperties", "true" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationAssignTalkByOrderId() throws FLException {

		quotationAssignTalks = quotationAssignTalkService.queryQuotationAssignTalkByOrderId(quotationAssignTalk.getOrderId(), queryUserId(), queryRoleId());

		return SUCCESS;
	}

	/**
	 * 发送沟通消息
	 * 
	 * <p>
	 * 前端传递 quotationAssignTalk.orderId 和 quotationAssignTalk.content， 后端自动从当前登录用户获取发送人信息
	 * </p>
	 * 
	 * @return JSON 响应
	 * @throws FLException 业务异常
	 */
	@Action(value = "sendQuotationAssignTalk", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false", "excludeNullProperties", "true" }), @Result(name = "error", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String sendQuotationAssignTalk() throws FLException {

		quotationAssignTalk = quotationAssignTalkService.sendQuotationAssignTalk(quotationAssignTalk, queryUserId());

		return SUCCESS;
	}

	// ==================== Getter & Setter ====================

	public QuotationAssignTalkVO getQuotationAssignTalk() {
		return quotationAssignTalk;
	}

	public void setQuotationAssignTalk(QuotationAssignTalkVO quotationAssignTalk) {
		this.quotationAssignTalk = quotationAssignTalk;
	}

	public List<QuotationAssignTalkVO> getQuotationAssignTalks() {
		return quotationAssignTalks;
	}

	public void setQuotationAssignTalks(List<QuotationAssignTalkVO> quotationAssignTalks) {
		this.quotationAssignTalks = quotationAssignTalks;
	}
}
