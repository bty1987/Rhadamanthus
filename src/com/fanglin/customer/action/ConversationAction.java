package com.fanglin.customer.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.ConversationService;
import com.fanglin.customer.vo.ConversationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ConversationAction extends BaseListAction {

	private static final long serialVersionUID = -3395769021961630229L;

	@Autowired
	private ConversationService conversationService;

	private ConversationVO conversation;

	private List<ConversationVO> conversations;

	private String orderId;

	@Action(value = "pageConversation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageConversation() throws FLException {

		conversationService.pageConversation(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "requestConversation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String requestConversation() throws FLException {

		conversationService.requestConversation(conversation, queryUserId());

		return SUCCESS;
	}

	@Action(value = "responseConversation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String responseConversation() throws FLException {

		conversationService.responseConversation(conversation, queryUserId());

		return SUCCESS;
	}

	@Action(value = "deleteConversation", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteConversation() throws FLException {

		conversationService.deleteConversation(conversation);

		return SUCCESS;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public ConversationVO getConversation() {
		return conversation;
	}

	public void setConversation(ConversationVO conversation) {
		this.conversation = conversation;
	}

	public List<ConversationVO> getConversations() {
		return conversations;
	}

	public void setConversations(List<ConversationVO> conversations) {
		this.conversations = conversations;
	}

}
