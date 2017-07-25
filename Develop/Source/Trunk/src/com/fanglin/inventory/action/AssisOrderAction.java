package com.fanglin.inventory.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;


import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.service.AssisOrderItemService;
import com.fanglin.inventory.service.AssisOrderService;
import com.fanglin.inventory.vo.AssisOrderItemVO;
import com.fanglin.inventory.vo.AssisOrderVO;
@ParentPackage("base")
@Namespace("/")
@Controller
public class AssisOrderAction extends BaseListAction{

	private static final long serialVersionUID = 4725011827802059146L;
	
	@Autowired
	private AssisOrderService assisOrderService;
	
	private AssisOrderVO assisOrder;
	
	private List<AssisOrderItemVO> assisOrderItems;
	
	private AssisOrderItemVO assisOrderItem;
	
	private List<Long> aoids;
	
	@Autowired
	private AssisOrderItemService assisOrderItemService;
	
	@Action(value = "pageAssisOrder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageAssisOrder() throws FLException{
		
		assisOrderService.pageAssisOrder(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "addAssisOrder", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAssisOrder() throws FLException{
		
		assisOrderService.addAssisOrder(assisOrder, assisOrderItems, queryUserId() ,"",queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "updateAssisOrderForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updataAssisOrderForStatus() throws FLException{
		
		assisOrderService.updateAssisOrderForStatus(assisOrder,queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryAssisOrderItemByAoid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssisOrderItemByAoid(){
		
		assisOrderItems = assisOrderItemService.queryAssisOrderItemByAoid(assisOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value = "queryAssisOrderItemByAoids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryAssisOrderItemByAoids(){
		
		assisOrderItems = assisOrderItemService.queryAssisOrderItemByAoids(aoids);
		
		return SUCCESS;
	}
	
	@Action(value = "addAssisOrderItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addAssisOrderItem() throws FLException{
		
		assisOrderItemService.addAssisOrderItem(assisOrder, assisOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value = "updateAssisOrderItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateAssisOrderItem() throws FLException{
		
		assisOrderItemService.updateAssisOrderItem(assisOrder,assisOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteAssisOrderItem", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteAssisOrderItem() throws FLException{
		
		assisOrderItemService.deleteAssisOrderItem(assisOrder,assisOrderItem);
		
		return SUCCESS;
	}
	
	public AssisOrderVO getAssisOrder() {
		return assisOrder;
	}

	public void setAssisOrder(AssisOrderVO assisOrder) {
		this.assisOrder = assisOrder;
	}

	public List<AssisOrderItemVO> getAssisOrderItems() {
		return assisOrderItems;
	}
	
	public void setAssisOrderItems(List<AssisOrderItemVO> assisOrderItems) {
		this.assisOrderItems = assisOrderItems;
	}
	
	public AssisOrderItemVO getAssisOrderItem() {
		return assisOrderItem;
	}
	
	public void setAssisOrderItem(AssisOrderItemVO assisOrderItem) {
		this.assisOrderItem = assisOrderItem;
	}

	public List<Long> getAoids() {
		return aoids;
	}

	public void setAoids(List<Long> aoids) {
		this.aoids = aoids;
	}

}
