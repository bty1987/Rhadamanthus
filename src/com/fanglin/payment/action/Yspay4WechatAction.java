package com.fanglin.payment.action;

import java.io.FileNotFoundException;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.Yspay4WeChatService;
import com.fanglin.payment.vo.Yspayment4NotifyVO;
import com.fanglin.payment.vo.Yspayment4WeChatVO;
import com.fanglin.payment.vo.YspaymentVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class Yspay4WechatAction extends BaseListAction {

	private static final long serialVersionUID = 5576902223437921773L;

	@Autowired
	private Yspay4WeChatService yspay4WeChatService;
	
	private YspaymentVO yspayment;
	
	private Yspayment4WeChatVO yspayment4WeChat;
	
	private Yspayment4NotifyVO yspayment4Notify;
	
	@Action(value = "makeYsPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String makeYsPayment() throws FLException, FileNotFoundException {
		
		yspayment4WeChat = yspay4WeChatService.makeYsPayment(yspayment);

		return SUCCESS;
	}
	
	@Action(value = "updatePayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updatePayment() throws FLException {
		
		yspay4WeChatService.updatePayment(yspayment4Notify);

		return SUCCESS;
	}

	public YspaymentVO getYspayment() {
		return yspayment;
	}

	public void setYspayment(YspaymentVO yspayment) {
		this.yspayment = yspayment;
	}

	public Yspayment4WeChatVO getYspayment4WeChat() {
		return yspayment4WeChat;
	}

	public void setYspayment4WeChat(Yspayment4WeChatVO yspayment4WeChat) {
		this.yspayment4WeChat = yspayment4WeChat;
	}

	public Yspayment4NotifyVO getYspayment4Notify() {
		return yspayment4Notify;
	}

	public void setYspayment4Notify(Yspayment4NotifyVO yspayment4Notify) {
		this.yspayment4Notify = yspayment4Notify;
	}
	
}
