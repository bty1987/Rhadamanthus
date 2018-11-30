package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.EmemberService;
import com.fanglin.customer.service.FeedBackService;
import com.fanglin.customer.service.GroupService;
import com.fanglin.customer.vo.DecorationCircleVO;
import com.fanglin.customer.vo.FeedBackVO;
import com.fanglin.customer.vo.GroupVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class BasesAction extends BaseListAction{

	private static final long serialVersionUID = -6030380600664328L;
	
	@Autowired
	private FeedBackService feedBackService;
	
	@Autowired
	private EmemberService ememberService;
	
	@Autowired
	private GroupService groupService;
	
	private GroupVO group;
	
	private FeedBackVO feedBack;
	
	private DecorationCircleVO decorationCircle;

	
	@Action(value = "pageFeedBack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFeedBack() throws FLException{
		
		feedBackService.pageFeedback(getPaging(),getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGroup() throws FLException{
		
		groupService.pageGroup(getPaging(),getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageEmember", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageEmember() throws FLException{
		
		ememberService.pageEmember(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "updateGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGroup() throws FLException{
		
		groupService.updateGroup(group);
		
		return SUCCESS;
	}
	
	@Action(value = "bindGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String bindGroup() throws FLException{
		
		groupService.bindGroup(group);
		
		return SUCCESS;
	}
	
	@Action(value = "unbindGroup", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String unbindGroup() throws FLException{
		
		groupService.unbindGroup(group);
		
		return SUCCESS;
	}

	public FeedBackVO getFeedBack() {
		return feedBack;
	}

	public void setFeedBack(FeedBackVO feedBack) {
		this.feedBack = feedBack;
	}

	public GroupVO getGroup() {
		return group;
	}

	public void setGroup(GroupVO group) {
		this.group = group;
	}

	public DecorationCircleVO getDecorationCircle() {
		return decorationCircle;
	}

	public void setDecorationCircle(DecorationCircleVO decorationCircle) {
		this.decorationCircle = decorationCircle;
	}
	
}
