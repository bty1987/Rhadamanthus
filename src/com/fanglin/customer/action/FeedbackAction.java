package com.fanglin.customer.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.service.FeedbackService;
import com.fanglin.customer.vo.FeedbackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackAction extends BaseListAction {

	private static final long serialVersionUID = 136311071541312065L;

	@Autowired
	private FeedbackService feedbackService;

	private FeedbackVO feedback;
	
	@Action(value = "pageFeedbackByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageFeedbackByOrderId() throws FLException {

		feedbackService.pageFeedbackByOrderId(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "addFeedback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedback() throws FLException {

		feedbackService.addFeedback(feedback);

		return SUCCESS;
	}

	@Action(value = "receiveFeedback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String receiveFeedback() throws FLException {

		feedbackService.receiveFeedback(feedback, authentication());

		return SUCCESS;
	}

	@Action(value = "finishFeedback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishFeedback() throws FLException {

		feedbackService.finishFeedback(feedback, authentication());

		return SUCCESS;
	}

	public FeedbackVO getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackVO feedback) {
		this.feedback = feedback;
	}


}
