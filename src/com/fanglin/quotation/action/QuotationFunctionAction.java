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
import com.fanglin.quotation.service.QuotationFunctionService;
import com.fanglin.quotation.vo.QuotationFunctionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationFunctionAction extends BaseListAction {

	private static final long serialVersionUID = -9222174209116330821L;

	@Autowired
	private QuotationFunctionService quotationFunctionService;

	private List<QuotationFunctionVO> quotationFunctions;

	private QuotationFunctionVO quotationFunction;

	@Action(value = "queryQuotationFunction", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunction() throws FLException {

		quotationFunctions = quotationFunctionService.queryQuotationFunction(quotationFunction);

		return SUCCESS;
	}

	public List<QuotationFunctionVO> getQuotationFunctions() {
		return quotationFunctions;
	}

	public void setQuotationFunctions(List<QuotationFunctionVO> quotationFunctions) {
		this.quotationFunctions = quotationFunctions;
	}

	public QuotationFunctionVO getQuotationFunction() {
		return quotationFunction;
	}

	public void setQuotationFunction(QuotationFunctionVO quotationFunction) {
		this.quotationFunction = quotationFunction;
	}

}
