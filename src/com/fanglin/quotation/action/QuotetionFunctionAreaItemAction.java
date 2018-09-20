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
import com.fanglin.quotation.service.QuotetionFunctionAreaItemService;
import com.fanglin.quotation.vo.QuotetionFunctionAreaItemVO;
import com.fanglin.quotation.vo.QuotetionFunctionAreaVO;
import com.fanglin.quotation.vo.QuotetionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotetionFunctionAreaItemAction extends BaseListAction {

	private static final long serialVersionUID = 1805282605389708676L;

	@Autowired
	private QuotetionFunctionAreaItemService quotetionFunctionAreaItemService;
	
	private QuotetionVO quotetion;
	
	private List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItems;
	
	private QuotetionFunctionAreaItemVO quotetionFunctionAreaItem;
	
	private QuotetionFunctionAreaVO quotetionFunctionArea;
	
	private List<Long> qfaiIds;
						
	@Action(value = "updateQuotetionFunctionAreaItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetionFunctionAreaItem() throws FLException{
		
		quotetionFunctionAreaItem = quotetionFunctionAreaItemService.updateQuotetionFunctionAreaItem(quotetionFunctionAreaItem, quotetion);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotetionFunctionAreaItemForIndex", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetionFunctionAreaItemForIndex() throws FLException{
		
		quotetionFunctionAreaItemService.updateQuotetionFunctionAreaItemForIndex(quotetionFunctionAreaItems,quotetionFunctionArea);
		
		return SUCCESS;
	}
	
	@Action(value = "updateQuotetionFunctionAreaItemForSpec", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateQuotetionFunctionAreaItemForSpec() throws FLException{
		
		quotetionFunctionAreaItemService.updateQuotetionFunctionAreaItemForSpec(quotetionFunctionAreaItem, quotetion);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteQuotetionFunctionAreaItem", results = { @Result(name = "success", type = "json", params = {"ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteQuotetionFunctionAreaItem() throws FLException{
		
		quotetionFunctionAreaItemService.deleteQuotetionFunctionAreaItem(qfaiIds, quotetion,quotetionFunctionArea);
		
		return SUCCESS;
	}

	public QuotetionVO getQuotetion() {
		return quotetion;
	}

	public void setQuotetion(QuotetionVO quotetion) {
		this.quotetion = quotetion;
	}

	public List<QuotetionFunctionAreaItemVO> getQuotetionFunctionAreaItems() {
		return quotetionFunctionAreaItems;
	}

	public void setQuotetionFunctionAreaItems(
			List<QuotetionFunctionAreaItemVO> quotetionFunctionAreaItems) {
		this.quotetionFunctionAreaItems = quotetionFunctionAreaItems;
	}

	public QuotetionFunctionAreaItemVO getQuotetionFunctionAreaItem() {
		return quotetionFunctionAreaItem;
	}

	public void setQuotetionFunctionAreaItem(
			QuotetionFunctionAreaItemVO quotetionFunctionAreaItem) {
		this.quotetionFunctionAreaItem = quotetionFunctionAreaItem;
	}

	public QuotetionFunctionAreaVO getQuotetionFunctionArea() {
		return quotetionFunctionArea;
	}

	public void setQuotetionFunctionArea(
			QuotetionFunctionAreaVO quotetionFunctionArea) {
		this.quotetionFunctionArea = quotetionFunctionArea;
	}

	public List<Long> getQfaiIds() {
		return qfaiIds;
	}

	public void setQfaiIds(List<Long> qfaiIds) {
		this.qfaiIds = qfaiIds;
	}

}
