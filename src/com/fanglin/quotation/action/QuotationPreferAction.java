package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationPreferService;
import com.fanglin.quotation.vo.QuotationPreferVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationPreferAction extends BaseListAction {

	private static final long serialVersionUID = -1404457594072362716L;

	@Autowired
	private QuotationPreferService quotationPreferService;

	private List<QuotationPreferVO> quotationPrefers;

	private QuotationPreferVO quotationPrefer;

	private QuotationVO quotation;

	@Action(value = "queryQuotationPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationPrefer() throws FLException {

		quotationPrefer = quotationPreferService.queryQuotationPrefer(quotationPrefer);

		return SUCCESS;
	}

	@Action(value = "updateQuotationPrefer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationPrefer() throws FLException {

		quotationPreferService.updateQuotationPrefer(quotationPrefer, quotation);

		return SUCCESS;
	}

	@Action(value = "updateQuotationForInfo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationForInfo() throws FLException {

		quotationPreferService.updateQuotationForInfo(quotationPrefer, quotation);

		return SUCCESS;
	}

	public List<QuotationPreferVO> getQuotationPrefers() {
		return quotationPrefers;
	}

	public void setQuotationPrefers(List<QuotationPreferVO> quotationPrefers) {
		this.quotationPrefers = quotationPrefers;
	}

	public QuotationPreferVO getQuotationPrefer() {
		return quotationPrefer;
	}

	public void setQuotationPrefer(QuotationPreferVO quotationPrefer) {
		this.quotationPrefer = quotationPrefer;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}
}
