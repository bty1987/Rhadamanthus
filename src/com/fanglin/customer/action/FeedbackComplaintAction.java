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
import com.fanglin.customer.service.FeedbackComplaintService;
import com.fanglin.customer.vo.FeedbackComplaintVO;
import com.fanglin.customer.vo.FeedbackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackComplaintAction extends BaseListAction {

	private static final long serialVersionUID = 7650398150360911398L;

	@Autowired
	private FeedbackComplaintService feedbackComplaintService;

	private FeedbackComplaintVO feedbackComplaint;

	private List<FeedbackComplaintVO> feedbackComplaints;

	private FeedbackVO feedback;

	@Action(value = "queryFeedbackComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackComplaint() throws FLException {

		feedbackComplaints = feedbackComplaintService.queryFeedbackComplaint(feedbackComplaint);

		return SUCCESS;
	}

	@Action(value = "addFeedbackComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedbackComplaint() throws FLException {

		long fcid = feedbackComplaintService.addFeedbackComplaint(feedbackComplaint, authentication());
		feedbackComplaint.setFcid(fcid);
		return SUCCESS;
	}
	
	@Action(value = "finishFeedbackComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String finishFeedbackComplaint() throws FLException {

		feedbackComplaintService.finishFeedbackComplaint(feedbackComplaint, authentication());

		return SUCCESS;
	}

	@Action(value = "updateFeedbackComplaint", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateFeedbackComplaint() throws FLException {

		feedbackComplaintService.updateFeedbackComplaint(feedbackComplaint);

		return SUCCESS;
	}

	public FeedbackComplaintVO getFeedbackComplaint() {
		return feedbackComplaint;
	}

	public void setFeedbackComplaint(FeedbackComplaintVO feedbackComplaint) {
		this.feedbackComplaint = feedbackComplaint;
	}

	public List<FeedbackComplaintVO> getFeedbackComplaints() {
		return feedbackComplaints;
	}

	public void setFeedbackComplaints(List<FeedbackComplaintVO> feedbackComplaints) {
		this.feedbackComplaints = feedbackComplaints;
	}

	public FeedbackVO getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackVO feedback) {
		this.feedback = feedback;
	}
}
