/**
 * @File Name		: MaterialAction.java
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
import com.fanglin.material.service.MaterialItemService;
import com.fanglin.material.service.MaterialService;
import com.fanglin.material.vo.MaterialItemVO;
import com.fanglin.material.vo.MaterialVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialAction extends BaseListAction{

	private static final long serialVersionUID = 9220766337549324904L;
	
	@Autowired
	private MaterialService materialService;
	
	@Autowired
	private MaterialItemService materialItemService;
	
	private MaterialVO material;
	
	private MaterialItemVO materialItem;
	
	private List<MaterialItemVO> materialItems;
	
	@Action(value="pageMaterial", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterial(){
		
		materialService.pageMaterial(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialByUserId() throws FLException{
		
		materialService.pageMaterialByUserId(getPaging(), getFilters(), material.getOrderId(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialForAdvance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialForAdvance() throws FLException{
		
		materialService.pageMaterialForAdvance(getPaging(), getFilters(), material.getOrderId());
		
		return SUCCESS;
	}

	@Action(value="pageMaterialByOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialByOrderId() throws FLException{
		
		materialService.pageMaterialByOrderId(getPaging(), getFilters(), material.getOrderId(),queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialByMid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialByMid(){
		
		material = materialService.queryMaterialByMid(material);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialByNo() throws FLException{
		
		material = materialService.queryMaterialByNo(material);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialItemByMid", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialItemByMid(){
		
		materialItems = materialItemService.queryMaterialItemByMid(materialItem);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterial", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterial() throws FLException{
		
		materialService.addMaterial(material, materialItems, queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="changeMaterialForOrderId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String changeMaterialForOrderId() throws FLException{
		
		materialService.changeMaterialForOrderId(material.getNo(), material.getOrderId(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialForCoupon", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialForCoupon(){
		
		materialService.updateMaterialForCoupon(material);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialForMaling", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialForMaling(){
		
		materialService.updateMaterialMaling(material);
		
		return SUCCESS;
	}
	
	@Action(value="deleteMaterial", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterial() throws FLException{
		
		materialService.deleteMaterial(material.getMid());
		
		return SUCCESS;
	}
	
	public MaterialVO getMaterial(){
		return material;
	}

	public void setMaterial(MaterialVO material){
		this.material = material;
	}

	public MaterialItemVO getMaterialItem() {
		return materialItem;
	}

	public void setMaterialItem(MaterialItemVO materialItem) {
		this.materialItem = materialItem;
	}

	public List<MaterialItemVO> getMaterialItems(){
		return materialItems;
	}

	public void setMaterialItems(
			List<MaterialItemVO> materialItems){
		this.materialItems = materialItems;
	}

}

