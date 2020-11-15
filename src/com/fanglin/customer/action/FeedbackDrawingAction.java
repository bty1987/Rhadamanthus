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
import com.fanglin.customer.service.FeedbackDrawingService;
import com.fanglin.customer.vo.FeedbackDrawingVO;
import com.fanglin.customer.vo.FeedbackVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackDrawingAction extends BaseListAction{
	
	private static final long serialVersionUID = -8998946693646885201L;

	@Autowired
	private FeedbackDrawingService feedbackDrawingService;
	
	private FeedbackVO feedback;
	
	private List<FeedbackDrawingVO> feedbackDrawings;
	
	private FeedbackDrawingVO feedbackDrawing;
	
	@Action(value = "queryFeedbackDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackDrawing() throws FLException {

		feedbackDrawings = feedbackDrawingService.queryFeedbackDrawing(feedback);

		return SUCCESS;
	}

	@Action(value = "addFeedbackDrawing", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedbackDrawing() throws FLException {

		feedbackDrawingService.addFeedbackDrawing(feedbackDrawing);

		return SUCCESS;
	}

	public FeedbackVO getFeedback() {
		return feedback;
	}

	public void setFeedback(FeedbackVO feedback) {
		this.feedback = feedback;
	}

	public List<FeedbackDrawingVO> getFeedbackDrawings() {
		return feedbackDrawings;
	}

	public void setFeedbackDrawings(List<FeedbackDrawingVO> feedbackDrawings) {
		this.feedbackDrawings = feedbackDrawings;
	}

	public FeedbackDrawingVO getFeedbackDrawing() {
		return feedbackDrawing;
	}

	public void setFeedbackDrawing(FeedbackDrawingVO feedbackDrawing) {
		this.feedbackDrawing = feedbackDrawing;
	}
	
}
