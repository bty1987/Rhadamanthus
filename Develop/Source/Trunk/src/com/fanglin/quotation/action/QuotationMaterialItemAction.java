/**
 * @File Name		: QuotationMaterialItemAction.java
 * @Package   	: com.fanglin.quotation.action
 * @Version		: 1.0
 * @Date			: 2016-10-20
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationMaterialItemService;
import com.fanglin.quotation.vo.QuotationMaterialItemVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationMaterialItemAction extends BaseListAction {

	private static final long serialVersionUID = -4759249505131477812L;
	
	@Autowired
	private QuotationMaterialItemService quotationMaterialItemService;
	
	private List<QuotationMaterialItemVO> quotationMaterialItems;

	private QuotationVO quotation;
	
	private QuotationMaterialItemVO quotationMaterialItem;
	
	@Action(value = "queryQuotationMaterialItemByQId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationMaterialItemByQId(){
		
		quotationMaterialItems = quotationMaterialItemService.queryQuotationMaterialItemByQId(quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "addQuotationMaterialItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuotationMaterialItem() throws FLException{
		
		quotationMaterialItemService.addQuotationMaterialItem(quotationMaterialItem);
		
		return SUCCESS;
	}
	
	@Action(value = "upgradeQuotationMaterialItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String upgradeQuotationMaterialItem() throws FLException{
		
		quotationMaterialItemService.upgradeQuotationMaterialItem(quotationMaterialItem);
		
		return SUCCESS;
	}
	
	@Action(value = "discountQuotationMaterialItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String discountQuotationMaterialItem() throws FLException{
		
		quotationMaterialItemService.discountQuotationMaterialItem(quotationMaterialItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationMaterialItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationMaterialItem(){
		
		quotationMaterialItemService.deleteQuotationMaterialItem(quotationMaterialItem);
		
		return SUCCESS;
	}

	public List<QuotationMaterialItemVO> getQuotationMaterialItems() {
		return quotationMaterialItems;
	}

	public void setQuotationMaterialItems(List<QuotationMaterialItemVO> quotationMaterialItems) {
		this.quotationMaterialItems = quotationMaterialItems;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public QuotationMaterialItemVO getQuotationMaterialItem() {
		return quotationMaterialItem;
	}

	public void setQuotationMaterialItem(QuotationMaterialItemVO quotationMaterialItem) {
		this.quotationMaterialItem = quotationMaterialItem;
	}
	
}
