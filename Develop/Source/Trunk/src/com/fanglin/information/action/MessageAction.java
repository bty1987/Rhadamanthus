package com.fanglin.information.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.service.MessageService;
import com.fanglin.information.vo.MessageVO;
import com.fanglin.personel.vo.UserVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MessageAction extends BaseListAction {

	private static final long serialVersionUID = 2327633841386704953L;
	
	@Autowired
	private MessageService messageService;
	
	private MessageVO message;
	
	private List<MessageVO> messageList;
	
	private List<Integer> messageIds;
	
	private int messageCount;
	
	private String approveParams;
	
	@Action(value="pageMessage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMessage() throws FLException{
		
		messageService.pageMessage(getPaging(), getFilters(), queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryMessageForUnRead", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMessageForUnRead() throws FLException{
		
		messageList = messageService.queryMessageForUnRead(queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="countMessage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String countMessage() throws FLException{
		
		messageCount = messageService.countMessage(queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="sendMessage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String sendMessage() throws FLException{
		
		message.setSender(new UserVO(queryUserId()));
		
		messageService.sendMessage(message,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateMessageForRead", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMessageForRead(){
		
		messageService.updateMessageForRead(getMessageIds());
		
		return SUCCESS;
	}
	
	@Action(value="deleteMessageById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMessageById() throws FLException{
		
		messageService.deleteMessageById(message);
		
		return SUCCESS;
	}
	
	@Action(value="deleteMessageByIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMessageByIds(){
		
		messageService.deleteMessageByIds(messageIds);
		
		return SUCCESS;
	}
	
	public MessageVO getMessage(){
		return message;
	}

	public void setMessage(MessageVO message){
		this.message = message;
	}

	public List<Integer> getMessageIds(){
		return messageIds;
	}

	public void setMessageIds(List<Integer> messageIds){
		this.messageIds = messageIds;
	}

	public List<MessageVO> getMessageList(){
		return messageList;
	}

	public void setMessageList(List<MessageVO> messageList){
		this.messageList = messageList;
	}

	public int getMessageCount(){
		return messageCount;
	}

	public void setMessageCount(int messageCount){
		this.messageCount = messageCount;
	}

	public String getApproveParams(){
		return approveParams;
	}

	public void setApproveParams(String approveParams){
		this.approveParams = approveParams;
	}

}
