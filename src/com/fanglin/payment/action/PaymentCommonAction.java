package com.fanglin.payment.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.payment.service.ActivityPaymentService;
import com.fanglin.payment.vo.ActivityPaymentVO;

@ParentPackage("common")
@Namespace("/")
@Controller
public class PaymentCommonAction extends BaseListAction {

	private static final long serialVersionUID = -2007495587213689831L;
	
	@Autowired
	private ActivityPaymentService activityPaymentService;
	
	private ActivityPaymentVO activityPayment;

	@Action(value = "divisionCallback", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String divisionCallback() throws FLException {

		Map<String, String[]> params = request.getParameterMap();

		System.out.println(JSONObject.toJSON(params));

		System.out.println("---------------------------division callback---------------------------");

		System.out.println(String.format("code: %s", request.getParameter("code")));
		System.out.println(String.format("msg: %s", request.getParameter("msg")));
		System.out.println(String.format("note: %s", request.getParameter("note")));

		System.out.println(String.format("payee_usercode: %s", request.getParameter("payee_usercode")));
		System.out.println(String.format("sref_no: %s", request.getParameter("sref_no")));
		System.out.println(String.format("term_no: %s", request.getParameter("term_no")));
		System.out.println(String.format("total_amount: %s", request.getParameter("total_amount")));

		System.out.println(String.format("division_mode: %s", request.getParameter("division_mode")));
		System.out.println(String.format("division_status: %s", request.getParameter("division_status")));
		System.out.println(String.format("division_status_code: %s", request.getParameter("division_status_code")));

		System.out.println(String.format("account_date: %s", request.getParameter("account_date")));
		System.out.println(String.format("updatetime: %s", request.getParameter("updatetime")));

		System.out.println(String.format("detailResults: %s", request.getParameter("detailResults")));

		System.out.println(String.format("sign: %s", request.getParameter("sign")));

		return SUCCESS;
	}
	
	@Action(value = "queryActivityPaymentByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryActivityPaymentByNo() throws FLException {

		activityPaymentService.queryActivityPaymentByNo(activityPayment);

		return SUCCESS;
	}

	public ActivityPaymentVO getActivityPayment() {
		return activityPayment;
	}

	public void setActivityPayment(ActivityPaymentVO activityPayment) {
		this.activityPayment = activityPayment;
	}
}
