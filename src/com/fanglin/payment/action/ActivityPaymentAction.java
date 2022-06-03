package com.fanglin.payment.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.ActivityPaymentService;
import com.fanglin.payment.service.ActivityReceiptService;
import com.fanglin.payment.vo.ActivityPaymentVO;
import com.fanglin.payment.vo.ActivityReceiptVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ActivityPaymentAction extends BaseListAction {

	private static final long serialVersionUID = 6820009933491554184L;

	@Autowired
	private ActivityPaymentService activityPaymentService;

	@Autowired
	private ActivityReceiptService activityReceiptService;

	private ActivityPaymentVO activityPayment;

	private ActivityReceiptVO activityReceipt;

	private List<ActivityPaymentVO> activityPayments;

	private List<Long> ptids;

	private List<List<String>> counts;

	@Action(value = "pageActivityPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageActivityPayment() throws FLException {

		activityPaymentService.pageActivityPayment(getPaging(), getFilters(), activityPayment);

		return SUCCESS;
	}

	@Action(value = "queryActivityPaymentByArid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryActivityPaymentByArid() throws FLException {

		activityPayments = activityPaymentService.queryActivityPaymentByArid(activityPayment);

		return SUCCESS;
	}

	@Action(value = "queryActivityReceiptByArid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryActivityReceiptByArid() throws FLException {

		activityReceipt = activityReceiptService.queryActivityReceiptByArid(activityReceipt);

		return SUCCESS;
	}

	@Action(value = "countActivityPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countActivityPayment() throws FLException {

		counts = activityPaymentService.countActivityPayment();

		return SUCCESS;
	}

	@Action(value = "createActivityPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String createActivityPayment() throws FLException {

		activityPaymentService.createActivityPayment(activityPayment, queryUserId());

		return SUCCESS;
	}

	@Action(value = "collectActivityPayment", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String collectActivityPayment() throws FLException {

		activityPaymentService.collectActivityPayment(activityPayments, activityReceipt, ptids, queryUserId());

		return SUCCESS;
	}

	public ActivityPaymentVO getActivityPayment() {
		return activityPayment;
	}

	public void setActivityPayment(ActivityPaymentVO activityPayment) {
		this.activityPayment = activityPayment;
	}

	public ActivityReceiptVO getActivityReceipt() {
		return activityReceipt;
	}

	public void setActivityReceipt(ActivityReceiptVO activityReceipt) {
		this.activityReceipt = activityReceipt;
	}

	public List<ActivityPaymentVO> getActivityPayments() {
		return activityPayments;
	}

	public void setActivityPayments(List<ActivityPaymentVO> activityPayments) {
		this.activityPayments = activityPayments;
	}

	public List<Long> getPtids() {
		return ptids;
	}

	public void setPtids(List<Long> ptids) {
		this.ptids = ptids;
	}

	public List<List<String>> getCounts() {
		return counts;
	}

	public void setCounts(List<List<String>> counts) {
		this.counts = counts;
	}

}
