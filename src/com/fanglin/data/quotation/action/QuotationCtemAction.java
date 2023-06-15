package com.fanglin.data.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.quotation.service.QuotationCtemService;
import com.fanglin.data.quotation.vo.QuotationCtemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationCtemAction extends BaseListAction {

	private static final long serialVersionUID = 4600186199302187178L;

	@Autowired
	private QuotationCtemService quotationCtemService;

	private List<QuotationCtemVO> quotationCtems;

	private QuotationCtemVO quotationCtem;

	@Action(value = "pageQuotationCtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationCtem() throws FLException {

		quotationCtemService.pageQuotationCtem(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryQuotationCtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationCtem() throws FLException {

		quotationCtems = quotationCtemService.queryQuotationCtem(quotationCtem);

		return SUCCESS;
	}

	@Action(value = "addQuotationCtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationCtem() throws FLException {

		quotationCtemService.addQuotationCtem(quotationCtem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationCtem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationCtem() throws FLException {

		quotationCtemService.updateQuotationCtem(quotationCtem);

		return SUCCESS;
	}

	@Action(value = "updateQuotationCtemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationCtemForStatus() throws FLException {

		quotationCtemService.updateQuotationCtemForStatus(quotationCtem);

		return SUCCESS;
	}

	public List<QuotationCtemVO> getQuotationCtems() {
		return quotationCtems;
	}

	public void setQuotationCtems(List<QuotationCtemVO> quotationCtems) {
		this.quotationCtems = quotationCtems;
	}

	public QuotationCtemVO getQuotationCtem() {
		return quotationCtem;
	}

	public void setQuotationCtem(QuotationCtemVO quotationCtem) {
		this.quotationCtem = quotationCtem;
	}
}
