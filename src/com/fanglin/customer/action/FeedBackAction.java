package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.FeedBackService;
import com.fanglin.customer.vo.FeedBackVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class FeedBackAction extends BaseListAction{

	private static final long serialVersionUID = 136311071541312065L;
	
	@Autowired
	private FeedBackService feedBackService;
	
	private FeedBackVO feedBack;
	
	@Action(value = "addFeedBack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedBack() throws FLException{
		
		feedBackService.addFeedBack(feedBack);
		
		return SUCCESS;
	}
	
	public FeedBackVO getFeedBack() {
		return feedBack;
	}

	public void setFeedBack(FeedBackVO feedBack) {
		this.feedBack = feedBack;
	}

}
