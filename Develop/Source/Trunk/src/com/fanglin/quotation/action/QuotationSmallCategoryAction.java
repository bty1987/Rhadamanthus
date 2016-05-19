/**
 * @File Name		: QuotationSmallCategoryAction.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.quotation.service.QuotationSmallCategoryService;
import com.fanglin.quotation.vo.QuotationSmallCategoryVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationSmallCategoryAction extends BaseListAction {

	private static final long serialVersionUID = 5577682041769003450L;
	
	@Autowired
	private QuotationSmallCategoryService quotationSmallCategoryService;
	
	private List<QuotationSmallCategoryVO> quotationSmallCategorys;
	
	@Action(value="queryQuotationSmallCategory", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationSmallCategory(){
		
		quotationSmallCategorys = quotationSmallCategoryService.queryQuotationSmallCategory();
		
		return SUCCESS;
	}

	public List<QuotationSmallCategoryVO> getQuotationSmallCategorys(){
		return quotationSmallCategorys;
	}

	public void setQuotationSmallCategorys(
			List<QuotationSmallCategoryVO> quotationSmallCategorys){
		this.quotationSmallCategorys = quotationSmallCategorys;
	}
	
}
