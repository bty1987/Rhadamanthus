package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.QuotationTypeService;
import com.fanglin.communion.vo.QuotationTypeVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationTypeAction extends BaseListAction {

	private static final long serialVersionUID = 2171262476853496669L;
	
	@Autowired
	private QuotationTypeService quotationTypeService;
	
	private List<QuotationTypeVO> quotationTypes;
	
	@Action(value="queryQuotationType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationType(){
		
		quotationTypes = quotationTypeService.queryQuotationType();
		
		return SUCCESS;
	}
	@Action(value="pageQuotationType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationType(){
		
		quotationTypeService.pageQuotationType(getPaging(), getFilters());
	    
		return SUCCESS;
	}

	public List<QuotationTypeVO> getQuotationTypes(){
		return quotationTypes;
	}

	public void setQuotationTypes(List<QuotationTypeVO> quotationTypes){
		this.quotationTypes = quotationTypes;
	}
	
}
