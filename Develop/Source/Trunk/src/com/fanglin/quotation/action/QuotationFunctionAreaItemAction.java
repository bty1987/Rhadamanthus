/**
 * @File Name		: QuotationFunctionAreaItemAction.java
 * @Package   	: com.fanglin.quotation.action
 * @Version		: 1.0
 * @Date			: 2016-6-5
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
import com.fanglin.quotation.service.QuotationFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotationFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotationVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationFunctionAreaItemAction extends BaseListAction {

	private static final long serialVersionUID = 5583688895376858316L;
	
	@Autowired
	private QuotationFunctionAreaItemService quotationFunctionAreaItemService;
	
	private QuotationVO quotation;
	
	private List<QuotationFunctionAreaItemVO> quotationFunctionAreaItems;
	
	private QuotationFunctionAreaItemVO quotationFunctionAreaItem;
	
	private List<Long> qfaiIds;
	
	@Action(value = "queryQuotationFunctionAreaItemByQuotationFunctionAreaId", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuotationFunctionAreaItemByQuotationFunctionAreaId(){
		
		quotationFunctionAreaItems = quotationFunctionAreaItemService.queryQuotationFunctionAreaItemByQuotationFunctionAreaId(quotationFunctionAreaItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotationFunctionAreaItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotationFunctionAreaItem() throws FLException{
		
		quotationFunctionAreaItemService.updateQuotationFunctionAreaItem(quotationFunctionAreaItem, quotation);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotationFunctionAreaItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotationFunctionAreaItem() throws FLException{
		
		quotationFunctionAreaItemService.deleteQuotationFunctionAreaItem(qfaiIds, quotation);
		
		return SUCCESS;
	}

	public List<QuotationFunctionAreaItemVO> getQuotationFunctionAreaItems() {
		return quotationFunctionAreaItems;
	}

	public void setQuotationFunctionAreaItems(
			List<QuotationFunctionAreaItemVO> quotationFunctionAreaItems) {
		this.quotationFunctionAreaItems = quotationFunctionAreaItems;
	}

	public QuotationFunctionAreaItemVO getQuotationFunctionAreaItem() {
		return quotationFunctionAreaItem;
	}

	public void setQuotationFunctionAreaItem(
			QuotationFunctionAreaItemVO quotationFunctionAreaItem) {
		this.quotationFunctionAreaItem = quotationFunctionAreaItem;
	}

	public QuotationVO getQuotation() {
		return quotation;
	}

	public void setQuotation(QuotationVO quotation) {
		this.quotation = quotation;
	}

	public List<Long> getQfaiIds() {
		return qfaiIds;
	}

	public void setQfaiIds(List<Long> qfaiIds) {
		this.qfaiIds = qfaiIds;
	}

}
