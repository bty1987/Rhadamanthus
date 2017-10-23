/**
 * @File Name		: MaterialSubOrderAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.material.service.MaterialSubOrderItemService;
import com.fanglin.material.service.MaterialSubOrderService;
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialSubOrderAction extends BaseListAction{

	private static final long serialVersionUID = 9220766337549324904L;
	
	@Autowired
	private MaterialSubOrderService materialSubOrderService;
	
	@Autowired
	private MaterialSubOrderItemService materialSubOrderItemService;
	
	private MaterialSubOrderVO materialSubOrder;
	
	private MaterialSubOrderItemVO materialSubOrderItem;
	
	private List<MaterialSubOrderItemVO> materialSubOrderItems;
	
	@Action(value="pageMaterialSubOrder", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrder(){
		
		materialSubOrderService.pageMaterialSubOrder(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialSubOrderByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderByUserId() throws FLException{
		
		materialSubOrderService.pageMaterialSubOrderByUserId(getPaging(), getFilters(), materialSubOrder.getOrderId(), queryUserId());
		
		return SUCCESS;
	}

	@Action(value="pageMaterialSubOrderByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderByOrderId(){
		
		materialSubOrderService.pageMaterialSubOrderByOrderId(getPaging(), getFilters(), materialSubOrder.getOrderId());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialSubOrderByOrderIdADeptId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderByOrderIdADeptId() throws FLException{
		
		materialSubOrderService.pageMaterialSubOrderByOrderIdADeptId(getPaging(), getFilters(), materialSubOrder.getOrderId(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderByMsoId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderByMsoId(){
		
		materialSubOrder = materialSubOrderService.queryMaterialSubOrderByMsoId(materialSubOrder);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderByMsoNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderByMsoNo() throws FLException{
		
		materialSubOrder = materialSubOrderService.queryMaterialSubOrderByMsoNo(materialSubOrder);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemByMsoId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemByMsoId(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemByMsoId(materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialSubOrder", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialSubOrder() throws FLException{
		
		materialSubOrderService.addMaterialSubOrder(materialSubOrder, materialSubOrderItems, queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="changeMaterialSubOrderForOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String changeMaterialSubOrderForOrderId() throws FLException{
		
		materialSubOrderService.changeMaterialSubOrderForOrderId(materialSubOrder.getMsoNo(), materialSubOrder.getOrderId(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderForCoupon", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderForCoupon(){
		
		materialSubOrderService.updateMaterialSubOrderForCoupon(materialSubOrder);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderForMaling", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderForMaling(){
		
		materialSubOrderService.updateMaterialSubOrderMaling(materialSubOrder);
		
		return SUCCESS;
	}
	
	@Action(value="deliverMaterialSubOrder", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deliverMaterialSubOrder() throws FLException{
		
		materialSubOrderService.deliverMaterialSubOrder(materialSubOrder, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="deleteMaterialSubOrder", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterialSubOrder() throws FLException{
		
		materialSubOrderService.deleteMaterialSubOrder(materialSubOrder.getMsoId());
		
		return SUCCESS;
	}
	
	public MaterialSubOrderVO getMaterialSubOrder(){
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder){
		this.materialSubOrder = materialSubOrder;
	}

	public MaterialSubOrderItemVO getMaterialSubOrderItem() {
		return materialSubOrderItem;
	}

	public void setMaterialSubOrderItem(MaterialSubOrderItemVO materialSubOrderItem) {
		this.materialSubOrderItem = materialSubOrderItem;
	}

	public List<MaterialSubOrderItemVO> getMaterialSubOrderItems(){
		return materialSubOrderItems;
	}

	public void setMaterialSubOrderItems(
			List<MaterialSubOrderItemVO> materialSubOrderItems){
		this.materialSubOrderItems = materialSubOrderItems;
	}

}

