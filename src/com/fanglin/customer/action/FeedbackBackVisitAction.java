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
import com.fanglin.customer.service.FeedbackBackVisitService;
import com.fanglin.customer.vo.FeedbackBackVisitVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackBackVisitAction extends BaseListAction {

	private static final long serialVersionUID = -9080765913554363058L;

	@Autowired
	private FeedbackBackVisitService feedbackBackVisitService;

	private FeedbackBackVisitVO feedbackBackVisit;

	private List<FeedbackBackVisitVO> feedbackBackVisits;

	@Action(value = "queryFeedbackBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackBackVisit() throws FLException {

		feedbackBackVisits = feedbackBackVisitService.queryFeedbackBackVisit(feedbackBackVisit);

		return SUCCESS;
	}

	@Action(value = "addFeedbackBackVisit", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedbackBackVisit() throws FLException {

		long fbid = feedbackBackVisitService.addFeedbackBackVisit(feedbackBackVisit, queryUserId());
		feedbackBackVisit.setFbid(fbid);
		return SUCCESS;
	}

	public FeedbackBackVisitVO getFeedbackBackVisit() {
		return feedbackBackVisit;
	}

	public void setFeedbackBackVisit(FeedbackBackVisitVO feedbackBackVisit) {
		this.feedbackBackVisit = feedbackBackVisit;
	}

	public List<FeedbackBackVisitVO> getFeedbackBackVisits() {
		return feedbackBackVisits;
	}

	public void setFeedbackBackVisits(List<FeedbackBackVisitVO> feedbackBackVisits) {
		this.feedbackBackVisits = feedbackBackVisits;
	}

}
