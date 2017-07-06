/**
 * @File Name		: QuotationBigCategoryAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.action;


import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.data.quotation.service.QuotationBigCategoryService;
import com.fanglin.data.quotation.vo.QuotationBigCategoryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationBigCategoryAction extends BaseListAction {

	private static final long serialVersionUID = 5184787172424995580L;
	
	@Autowired
	private QuotationBigCategoryService quotationBigCategoryService;
	
	private List<QuotationBigCategoryVO> quotationBigCategorys;
	
	@Action(value="queryQuotationBigCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationBigCategory(){
		
		quotationBigCategorys = quotationBigCategoryService.queryQuotationBigCategory();
		
		return SUCCESS;
	}
	
	@Action(value="pageQuotationBigCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationBigCategory(){
		
		quotationBigCategoryService.pageQuotationBigCategory(getPaging(), getFilters());
	    
		return SUCCESS;
	}

	public List<QuotationBigCategoryVO> getQuotationBigCategorys(){
		return quotationBigCategorys;
	}

	public void setQuotationBigCategorys(List<QuotationBigCategoryVO> quotationBigCategorys){
		this.quotationBigCategorys = quotationBigCategorys;
	}
	
}
