package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.QuotationSmallCategoryService;
import com.fanglin.communion.vo.QuotationSmallCategoryVO;
import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationSmallCategoryAction extends BaseListAction {

	private static final long serialVersionUID = 5577682041769003450L;

	@Autowired
	private QuotationSmallCategoryService quotationSmallCategoryService;

	private QuotationSmallCategoryVO quotationSmallCategory;

	private List<QuotationSmallCategoryVO> quotationSmallCategorys;

	@Action(value = "queryQuotationSmallCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationSmallCategory() {

		quotationSmallCategorys = quotationSmallCategoryService.queryQuotationSmallCategory(quotationSmallCategory);

		return SUCCESS;
	}

	@Action(value = "pageQuotationSmallCategory", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuotationSmallCategory() {

		quotationSmallCategoryService.pageQuotationSmallCategory(getPaging(), getFilters());

		return SUCCESS;
	}

	public QuotationSmallCategoryVO getQuotationSmallCategory() {
		return quotationSmallCategory;
	}

	public void setQuotationSmallCategory(QuotationSmallCategoryVO quotationSmallCategory) {
		this.quotationSmallCategory = quotationSmallCategory;
	}

	public List<QuotationSmallCategoryVO> getQuotationSmallCategorys() {
		return quotationSmallCategorys;
	}

	public void setQuotationSmallCategorys(List<QuotationSmallCategoryVO> quotationSmallCategorys) {
		this.quotationSmallCategorys = quotationSmallCategorys;
	}

}
