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
import com.fanglin.customer.service.FeedbackComplaintProblemService;
import com.fanglin.customer.vo.FeedbackComplaintProblemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackComplaintProblemAction extends BaseListAction {

	private static final long serialVersionUID = -49789862012291016L;

	@Autowired
	private FeedbackComplaintProblemService feedbackComplaintProblemService;

	private List<FeedbackComplaintProblemVO> feedbackComplaintProblems;

	private List<Long> deptTypes;

	@Action(value = "queryFeedbackComplaintProblem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackComplaintProblem() throws FLException {

		feedbackComplaintProblems = feedbackComplaintProblemService.queryFeedbackComplaintProblem(deptTypes);

		return SUCCESS;
	}

	public List<FeedbackComplaintProblemVO> getFeedbackComplaintProblems() {
		return feedbackComplaintProblems;
	}

	public void setFeedbackComplaintProblems(List<FeedbackComplaintProblemVO> feedbackComplaintProblems) {
		this.feedbackComplaintProblems = feedbackComplaintProblems;
	}

	public List<Long> getDeptTypes() {
		return deptTypes;
	}

	public void setDeptTypes(List<Long> deptTypes) {
		this.deptTypes = deptTypes;
	}
}
