/**
 * @File Name		: MaterialSubOrderItemAction.java
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
import com.fanglin.material.vo.MaterialSubOrderItemVO;
import com.fanglin.material.vo.MaterialSubOrderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialSubOrderItemAction extends BaseListAction{

	private static final long serialVersionUID = -5642202978260012376L;
	
	@Autowired
	private MaterialSubOrderItemService materialSubOrderItemService;
	
	private MaterialSubOrderVO materialSubOrder;

	private MaterialSubOrderItemVO materialSubOrderItem;
	
	private List<MaterialSubOrderItemVO> materialSubOrderItems;
	
	private List<Long> msoiIds;
	
	private String messageArgs;
	
	private long msoId;
	
	private int redirect;
	
	@Action(value="pageMaterialSubOrderItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderItem(){
		
		materialSubOrderItemService.pageMaterialSubOrderItemByMsoId(getPaging(), getFilters(), materialSubOrder.getMsoId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemByOrderId(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemByOrderId(materialSubOrder.getOrderId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemByMsoId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemByMsoId(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemByMsoId(materialSubOrder.getMsoId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemByMsoiIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemByMsoiIds(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemByMsoiIds(msoiIds);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemForSaleByMsoiId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemForSaleByMsoiId(){
		
		materialSubOrderItem = materialSubOrderItemService.queryMaterialSubOrderItemForSaleByMsoiId(materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemForNoPackageByMsoiId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemForNoPackageByMsoiId(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemForNoPackageByMsoiId(msoiIds);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemForNameByName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemForNameByName(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemForNameByName(materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialSubOrderItemForNameByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialSubOrderItemForNameByNo(){
		
		materialSubOrderItems = materialSubOrderItemService.queryMaterialSubOrderItemForNameByNo(materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialSubOrderItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialSubOrderItem() throws FLException{
		
		materialSubOrderItemService.addMaterialSubOrderItem(materialSubOrder, materialSubOrderItems);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderItemForModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderItemForModel() throws FLException{
		
		materialSubOrderItemService.updateMaterialSubOrderItemForModel(materialSubOrder, materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderItemForPackage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderItemForPackage() throws FLException{
		
		materialSubOrderItemService.updateMaterialSubOrderItemForPackage(materialSubOrder, materialSubOrderItems);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderItemForPrePT", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderItemForPrePT(){
		
		materialSubOrderItemService.updateMaterialSubOrderItemForPrePT(msoiIds, materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderItemForPostPT", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderItemForPostPT(){
		
		materialSubOrderItemService.updateMaterialSubOrderItemForPostPT(msoiIds, materialSubOrderItem);
		
		return SUCCESS;
	}
	
	@Action(value="refundMaterialSubOrderItemForModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundMaterialSubOrderItemForModel() throws FLException{
		
		redirect = materialSubOrderItemService.refundMaterialSubOrderItemForModel(materialSubOrder, materialSubOrderItem, msoId, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="refundMaterialSubOrderItemForPackage", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String refundMaterialSubOrderItemForPackage() throws FLException{
		
		redirect = materialSubOrderItemService.refundMaterialSubOrderItemForPackage(materialSubOrder, materialSubOrderItems, msoId, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="changeMaterialSubOrderItemForCaclType", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String changeMaterialSubOrderItemForCaclType() throws FLException{
		
		materialSubOrderItemService.changeMaterialSubOrderItemForCaclType(materialSubOrderItem, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="deleteMaterialSubOrderItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterialSubOrderItem() throws FLException{
		
		redirect = materialSubOrderItemService.deleteMaterialSubOrderItem(msoiIds, msoId);
		
		return SUCCESS;
	}
	
	public MaterialSubOrderVO getMaterialSubOrder(){
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder){
		this.materialSubOrder = materialSubOrder;
	}

	public MaterialSubOrderItemVO getMaterialSubOrderItem(){
		return materialSubOrderItem;
	}

	public void setMaterialSubOrderItem(MaterialSubOrderItemVO materialSubOrderItem){
		this.materialSubOrderItem = materialSubOrderItem;
	}

	public List<MaterialSubOrderItemVO> getMaterialSubOrderItems(){
		return materialSubOrderItems;
	}

	public void setMaterialSubOrderItems(List<MaterialSubOrderItemVO> materialSubOrderItems){
		this.materialSubOrderItems = materialSubOrderItems;
	}

	public List<Long> getMsoiIds(){
		return msoiIds;
	}

	public void setMsoiIds(List<Long> msoiIds){
		this.msoiIds = msoiIds;
	}

	public long getMsoId(){
		return msoId;
	}

	public void setMsoId(long msoId){
		this.msoId = msoId;
	}

	public int isRedirect(){
		return redirect;
	}

	public void setRedirect(int redirect){
		this.redirect = redirect;
	}

	public String getMessageArgs(){
		return messageArgs;
	}

	public void setMessageArgs(String messageArgs){
		this.messageArgs = messageArgs;
	}

}
