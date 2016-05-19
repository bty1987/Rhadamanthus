/**
 * @File Name		: QuotationItemAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.service.QuotationItemService;
import com.fanglin.quotation.vo.QuotationItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationItemAction extends BaseListAction {

	private static final long serialVersionUID = -9139698916609681549L;
	
	@Autowired
	private QuotationItemService quotationItemService;
	
	private QuotationItemVO quotationItem;
	
	@Action(value="pageQuotationItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationItem(){
		
		quotationItemService.pageQuotationItem(getPaging(), getFilters());
	    
		return SUCCESS;
	}
	
	@Action(value="pageQuotationItemByVersionId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageQuotationItemByVersionId(){
		
		quotationItemService.pageQuotationItemByVersionId(getPaging(), getFilters(), quotationItem);
		
		return SUCCESS;
	}
	
	@Action(value="queryQuotationItemByItemIdAVersionId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryQuotationItemByItemIdAVersionId() throws FLException{
		
		quotationItem = quotationItemService.queryQuotationItemByItemIdAVersionId(quotationItem);
	    
		return SUCCESS;
	}
	
	@Action(value="addQuotationItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addQuotationItem() throws FLException{

		quotationItemService.addQuotationItem(quotationItem);
	    
		return SUCCESS;
	}
	
	@Action(value="updateQuotationItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateQuotationItem() throws FLException{

		quotationItemService.updateQuotationItem(quotationItem);
	    
		return SUCCESS;
	}
	
	public QuotationItemVO getQuotationItem() {
		return quotationItem;
	}

	public void setQuotationItem(QuotationItemVO quotationItem) {
		this.quotationItem = quotationItem;
	}
	
}
