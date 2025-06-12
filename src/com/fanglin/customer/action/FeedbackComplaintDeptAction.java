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
import com.fanglin.customer.service.FeedbackComplaintDeptService;
import com.fanglin.customer.vo.FeedbackComplaintDeptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackComplaintDeptAction extends BaseListAction {

	private static final long serialVersionUID = 4246598913209439542L;

	@Autowired
	private FeedbackComplaintDeptService feedbackComplaintDeptService;

	private FeedbackComplaintDeptVO feedbackComplaintDept;

	private List<FeedbackComplaintDeptVO> feedbackComplaintDepts;


	@Action(value = "queryFeedbackComplaintDept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackComplaintDept() throws FLException {

		feedbackComplaintDepts = feedbackComplaintDeptService.queryFeedbackComplaintDept(feedbackComplaintDept);

		return SUCCESS;
	}

	@Action(value = "addFeedbackComplaintDept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedbackComplaintDept() throws FLException {

		long fcdid = feedbackComplaintDeptService.addFeedbackComplaintDept(feedbackComplaintDept, authentication());
		feedbackComplaintDept.setFcdid(fcdid);
		return SUCCESS;
	}

	@Action(value = "updateFeedbackComplaintDept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFeedbackComplaintDept() throws FLException {

		feedbackComplaintDeptService.updateFeedbackComplaintDept(feedbackComplaintDept);

		return SUCCESS;
	}

	@Action(value = "deleteFeedbackComplaintDept", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteFeedbackComplaintDept() throws FLException {

		feedbackComplaintDeptService.deleteFeedbackComplaintDept(feedbackComplaintDept);

		return SUCCESS;
	}
	public FeedbackComplaintDeptService getFeedbackComplaintDeptService() {
		return feedbackComplaintDeptService;
	}

	public void setFeedbackComplaintDeptService(FeedbackComplaintDeptService feedbackComplaintDeptService) {
		this.feedbackComplaintDeptService = feedbackComplaintDeptService;
	}

	public FeedbackComplaintDeptVO getFeedbackComplaintDept() {
		return feedbackComplaintDept;
	}

	public void setFeedbackComplaintDept(FeedbackComplaintDeptVO feedbackComplaintDept) {
		this.feedbackComplaintDept = feedbackComplaintDept;
	}

	public List<FeedbackComplaintDeptVO> getFeedbackComplaintDepts() {
		return feedbackComplaintDepts;
	}

	public void setFeedbackComplaintDepts(List<FeedbackComplaintDeptVO> feedbackComplaintDepts) {
		this.feedbackComplaintDepts = feedbackComplaintDepts;
	}

}
