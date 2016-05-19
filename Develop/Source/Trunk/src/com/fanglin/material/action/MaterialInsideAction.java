/**
 * @File Name		: MaterialInsideAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
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
import com.fanglin.material.service.MaterialInsideService;
import com.fanglin.material.vo.MaterialInsideVO;
import com.fanglin.payment.vo.MaterialInsidePaymentVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialInsideAction extends BaseListAction {

	private static final long serialVersionUID = -4755629990556906865L;
	
	@Autowired
	private MaterialInsideService materialInsideService;
	
	private MaterialInsideVO materialInside;
	
	private MaterialInsidePaymentVO materialInsidePayment;
	
	private List<Integer> miIds;
	
	@Action(value="pageMaterialInside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialInside(){
		
		materialInsideService.pageMaterialInside(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialInsideByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialInsideByUserId() throws FLException{
		
		materialInsideService.pageMaterialInsideByUserId(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialInside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialInside() throws FLException{
		
		materialInsideService.addMaterialInside(materialInside, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialInside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialInside() throws FLException{
		
		materialInsideService.updateMaterialInside(materialInside, getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="deleteMaterialInsideByMiIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterialInsideByMiIds(){
		
		materialInsideService.deleteMaterialInsideByMiIds(miIds);
		
		return SUCCESS;
	}
	
	public MaterialInsideVO getMaterialInside(){
		return materialInside;
	}

	public void setMaterialInside(MaterialInsideVO materialInside){
		this.materialInside = materialInside;
	}

	public List<Integer> getMiIds(){
		return miIds;
	}

	public void setMiIds(List<Integer> miIds){
		this.miIds = miIds;
	}

	public MaterialInsidePaymentVO getMaterialInsidePayment(){
		return materialInsidePayment;
	}

	public void setMaterialInsidePayment(
			MaterialInsidePaymentVO materialInsidePayment){
		this.materialInsidePayment = materialInsidePayment;
	}

}
