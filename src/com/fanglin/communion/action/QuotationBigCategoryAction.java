package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.QuotationBigCategoryService;
import com.fanglin.communion.vo.QuotationBigCategoryVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationBigCategoryAction extends BaseListAction {

	private static final long serialVersionUID = 5184787172424995580L;
	
	@Autowired
	private QuotationBigCategoryService quotationBigCategoryService;
	
	private QuotationBigCategoryVO quotationBigCategory;
	
	private List<QuotationBigCategoryVO> quotationBigCategorys;
	
	@Action(value="queryQuotationBigCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationBigCategory(){
		
		quotationBigCategorys = quotationBigCategoryService.queryQuotationBigCategory(quotationBigCategory);
		
		return SUCCESS;
	}
	
	@Action(value="pageQuotationBigCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationBigCategory(){
		
		quotationBigCategoryService.pageQuotationBigCategory(getPaging(), getFilters());
	    
		return SUCCESS;
	}

	public QuotationBigCategoryVO getQuotationBigCategory() {
		return quotationBigCategory;
	}

	public void setQuotationBigCategory(QuotationBigCategoryVO quotationBigCategory) {
		this.quotationBigCategory = quotationBigCategory;
	}

	public List<QuotationBigCategoryVO> getQuotationBigCategorys(){
		return quotationBigCategorys;
	}

	public void setQuotationBigCategorys(List<QuotationBigCategoryVO> quotationBigCategorys){
		this.quotationBigCategorys = quotationBigCategorys;
	}
	
}
