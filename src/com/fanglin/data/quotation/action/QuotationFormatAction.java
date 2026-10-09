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
import com.fanglin.data.quotation.service.QuotationFormatService;
import com.fanglin.data.quotation.vo.QuotationFormatVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationFormatAction extends BaseListAction {

	private static final long serialVersionUID = 319514702166317372L;

	@Autowired
	private QuotationFormatService quotationFormatService;

	private List<QuotationFormatVO> quotationFormats;

	private QuotationFormatVO quotationFormat;

	@Action(value = "queryQuotationFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFormat() throws FLException {

		quotationFormats = quotationFormatService.queryQuotationFormat(quotationFormat);

		return SUCCESS;
	}

	@Action(value = "queryQuotationFormatByQcid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFormatByQcid() throws FLException {

		quotationFormats = quotationFormatService.queryQuotationFormatByQcid(quotationFormat.getQuotationCtem().getQcid(), getFilters());

		return SUCCESS;
	}

	@Action(value = "addQuotationFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationFormat() throws FLException {

		quotationFormatService.addQuotationFormat(quotationFormat);

		return SUCCESS;
	}

	@Action(value = "updateQuotationFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFormat() throws FLException {

		quotationFormatService.updateQuotationFormat(quotationFormat);

		return SUCCESS;
	}

	@Action(value = "updateQuotationFormatForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFormatForStatus() throws FLException {

		quotationFormatService.updateQuotationFormatForStatus(quotationFormat);

		return SUCCESS;
	}

	@Action(value = "deleteQuotationFormat", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFormat() throws FLException {

		quotationFormatService.deleteQuotationFormat(quotationFormat);

		return SUCCESS;
	}

	public List<QuotationFormatVO> getQuotationFormats() {
		return quotationFormats;
	}

	public void setQuotationFormats(List<QuotationFormatVO> quotationFormats) {
		this.quotationFormats = quotationFormats;
	}

	public QuotationFormatVO getQuotationFormat() {
		return quotationFormat;
	}

	public void setQuotationFormat(QuotationFormatVO quotationFormat) {
		this.quotationFormat = quotationFormat;
	}

}
