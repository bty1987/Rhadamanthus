package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.QuoteTypeService;
import com.fanglin.production.vo.QuoteTypeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuoteTypeAction extends BaseListAction {

	private static final long serialVersionUID = 239041271108700059L;

	@Autowired
	private QuoteTypeService quoteTypeService;

	private List<QuoteTypeVO> quoteTypes;

	private QuoteTypeVO quoteType;

	@Action(value = "pageQuoteType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuoteType() {

		quoteTypeService.pageQuoteType(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryQuoteType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuoteType() {

		quoteTypes = quoteTypeService.queryQuoteType();

		return SUCCESS;
	}

	@Action(value = "addQuoteType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuoteType() throws FLException {

		quoteTypeService.addQuoteType(quoteType);

		return SUCCESS;
	}

	@Action(value = "updateQuoteType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuoteType() throws FLException {

		quoteTypeService.updateQuoteType(quoteType);

		return SUCCESS;
	}

	@Action(value = "updateQuoteTypeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuoteTypeForStatus() throws FLException {

		quoteTypeService.updateQuoteTypeForStatus(quoteType);
		return SUCCESS;
	}

	public List<QuoteTypeVO> getQuoteTypes() {
		return quoteTypes;
	}

	public void setQuoteTypes(List<QuoteTypeVO> quoteTypes) {
		this.quoteTypes = quoteTypes;
	}

	public QuoteTypeVO getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteTypeVO quoteType) {
		this.quoteType = quoteType;
	}

}
