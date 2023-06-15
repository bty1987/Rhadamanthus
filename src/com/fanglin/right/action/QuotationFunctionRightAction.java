package com.fanglin.right.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.right.service.QuotationFunctionRightService;
import com.fanglin.right.vo.QuotationFunctionRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationFunctionRightAction extends BaseListAction {

	private static final long serialVersionUID = 1131618702646533115L;

	@Autowired
	private QuotationFunctionRightService quotationFunctionRightService;

	private List<QuotationFunctionRightVO> quotationFunctionRights;

	private QuotationFunctionRightVO quotationFunctionRight;

	private List<Long> qfids;

	@Action(value = "queryQuotationFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionRight() throws FLException {

		quotationFunctionRights = quotationFunctionRightService.queryQuotationFunctionRight(quotationFunctionRight);

		return SUCCESS;
	}

	@Action(value = "updateQuotationFunctionRight", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFunctionRight() throws FLException {

		quotationFunctionRightService.updateQuotationFunctionRight(quotationFunctionRight, qfids, queryCompany());

		return SUCCESS;
	}

	public List<QuotationFunctionRightVO> getQuotationFunctionRights() {
		return quotationFunctionRights;
	}

	public void setQuotationFunctionRights(List<QuotationFunctionRightVO> quotationFunctionRights) {
		this.quotationFunctionRights = quotationFunctionRights;
	}

	public QuotationFunctionRightVO getQuotationFunctionRight() {
		return quotationFunctionRight;
	}

	public void setQuotationFunctionRight(QuotationFunctionRightVO quotationFunctionRight) {
		this.quotationFunctionRight = quotationFunctionRight;
	}

	public List<Long> getQfids() {
		return qfids;
	}

	public void setQfids(List<Long> qfids) {
		this.qfids = qfids;
	}

}
