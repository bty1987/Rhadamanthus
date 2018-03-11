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
import com.fanglin.production.service.PuoteItemService;
import com.fanglin.production.vo.PuoteItemVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PuoteItemAction extends BaseListAction {

	private static final long serialVersionUID = 8724462847382803395L;

	@Autowired
	private PuoteItemService quoteItemService;
	
	private PuoteItemVO quoteItem;
	
	private List<PuoteItemVO> quoteItems;
	
	@Action(value = "pageQuoteItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageQuoteItem(){
		
		quoteItemService.pageQuoteItem(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryQuoteItemByPinyin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryQuoteItemByPinyin() throws FLException{
		quoteItems = quoteItemService.queryQuoteItemByPinyin(quoteItem,queryCompany());
		return SUCCESS;
	}
	
	@Action(value = "addQuoteItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addQuoteItem() throws FLException{
		quoteItemService.addQuoteItem(quoteItem,queryCompany());
		return SUCCESS;
	}
	
	@Action(value = "updateQuoteItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuoteItem() throws FLException{
		quoteItemService.updateQuoteItem(quoteItem);
		return SUCCESS;
	}
	
	@Action(value = "updateQuoteItemForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuoteItemForStatus() throws FLException{
		quoteItemService.updateQuoteItemForStatus(quoteItem);
		return SUCCESS;
	}
	
	public PuoteItemVO getQuoteItem(){
		return quoteItem;
	}
	
	public List<PuoteItemVO> getQuoteItems(){
		return quoteItems;
	}

	public void setQuoteItem(PuoteItemVO quoteItem) {
		this.quoteItem = quoteItem;
	}

	public void setQuoteItems(List<PuoteItemVO> quoteItems) {
		this.quoteItems = quoteItems;
	}
	
	
	
}
