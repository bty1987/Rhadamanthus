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
import com.fanglin.customer.service.FeedbackGuaranteeService;
import com.fanglin.customer.vo.FeedbackGuaranteeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackGuaranteeAction extends BaseListAction {

	private static final long serialVersionUID = 186524771551312921L;

	@Autowired
	private FeedbackGuaranteeService feedbackGuaranteeService;

	private FeedbackGuaranteeVO feedbackGuarantee;

	private List<FeedbackGuaranteeVO> feedbackGuarantees;

	@Action(value = "queryFeedbackGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackGuarantee() throws FLException {

		feedbackGuarantees = feedbackGuaranteeService.queryFeedbackGuarantee(feedbackGuarantee);

		return SUCCESS;
	}

	@Action(value = "queryFeedbackGuaranteeByFgid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackGuaranteeByFgid() throws FLException {

		feedbackGuarantee = feedbackGuaranteeService.queryFeedbackGuaranteeByFgid(feedbackGuarantee);

		return SUCCESS;
	}

	@Action(value = "addFeedbackGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedbackGuarantee() throws FLException {

		feedbackGuaranteeService.addFeedbackGuarantee(feedbackGuarantee, queryUserId());

		return SUCCESS;
	}

	@Action(value = "updateFeedbackGuarantee", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFeedbackGuarantee() throws FLException {

		feedbackGuaranteeService.updateFeedbackGuarantee(feedbackGuarantee);

		return SUCCESS;
	}

	public FeedbackGuaranteeVO getFeedbackGuarantee() {
		return feedbackGuarantee;
	}

	public void setFeedbackGuarantee(FeedbackGuaranteeVO feedbackGuarantee) {
		this.feedbackGuarantee = feedbackGuarantee;
	}

	public List<FeedbackGuaranteeVO> getFeedbackGuarantees() {
		return feedbackGuarantees;
	}

	public void setFeedbackGuarantees(List<FeedbackGuaranteeVO> feedbackGuarantees) {
		this.feedbackGuarantees = feedbackGuarantees;
	}

}
