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
import com.fanglin.customer.service.FeedbackRecordService;
import com.fanglin.customer.vo.FeedbackRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FeedbackRecordAction extends BaseListAction {

	private static final long serialVersionUID = 136311071541312066L;

	@Autowired
	private FeedbackRecordService feedbackRecordService;

	private FeedbackRecordVO feedbackRecord;

	private List<FeedbackRecordVO> feedbackRecords;

	private String orderId;

	@Action(value = "queryFeedbackRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryFeedbackRecord() {

		feedbackRecords = feedbackRecordService.queryFeedbackRecord(feedbackRecord);

		return SUCCESS;
	}

	@Action(value = "addFeedbackRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addFeedback() throws FLException {

		feedbackRecordService.addFeedbackRecord(feedbackRecord, authentication());

		return SUCCESS;
	}

	public FeedbackRecordVO getFeedbackRecord() {
		return feedbackRecord;
	}

	public void setFeedbackRecord(FeedbackRecordVO feedbackRecord) {
		this.feedbackRecord = feedbackRecord;
	}

	public List<FeedbackRecordVO> getFeedbackRecords() {
		return feedbackRecords;
	}

	public void setFeedbackRecords(List<FeedbackRecordVO> feedbackRecords) {
		this.feedbackRecords = feedbackRecords;
	}

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

}
