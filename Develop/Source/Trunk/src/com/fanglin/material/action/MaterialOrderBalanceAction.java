/**
 * @File Name		: MaterialOrderBalanceAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-22
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
import com.fanglin.material.service.MaterialSubOrderBalanceService;
import com.fanglin.material.service.MaterialSubOrderService;
import com.fanglin.material.vo.MaterialSubOrderBalanceVO;
import com.fanglin.material.vo.MaterialSubOrderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialOrderBalanceAction extends BaseListAction{

	private static final long serialVersionUID = -6255753215095300911L;
	
	@Autowired
	private MaterialSubOrderService materialSubOrderService;
	
	@Autowired
	private MaterialSubOrderBalanceService materialSubOrderBalanceService;
	
	private MaterialSubOrderVO materialSubOrder;
	
	private MaterialSubOrderBalanceVO materialSubOrderBalance;
	
	private int caclType;
	
	public List<Long> msoIds;
	
	@Action(value="pageMaterialSubOrderBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderBalance() throws FLException{
		
		materialSubOrderBalanceService.pageMaterialSubOrderBalance(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialSubOrderBalanceForVender", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderBalanceForVender() throws FLException{
		
		materialSubOrderBalanceService.pageMaterialSubOrderBalanceForVender(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialSubOrderForPreBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialSubOrderForPreBalance() throws FLException{
		
		materialSubOrderService.pageMaterialSubOrderForPreBalance(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderForPreBalancePT", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderForPreBalancePT(){
		
		materialSubOrderService.updateMaterialSubOrderForPreBalancePT(materialSubOrder, caclType);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderBalanceForVBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderBalanceForVBalance() throws FLException{
		
		materialSubOrderBalanceService.updateMaterialSubOrderBalanceForVBalance(materialSubOrderBalance);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialSubOrderBalanceForBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialSubOrderBalanceForBalance() throws FLException{
		
		materialSubOrderBalanceService.updateMaterialSubOrderBalanceForBalance(materialSubOrderBalance);
		
		return SUCCESS;
	}
	
	@Action(value="preBalanceMaterialSubOrder", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String preBalanceMaterialSubOrder() throws FLException{
		
		materialSubOrderService.preBalanceMaterialSubOrder(msoIds, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="vpostMaterialSubOrderBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String vpostMaterialSubOrderBalance() throws FLException{
		
		materialSubOrderBalanceService.vpostMaterialSubOrderBalance(materialSubOrderBalance);
		
		return SUCCESS;
	}
	
	@Action(value="postMaterialSubOrderBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String postMaterialSubOrderBalance() throws FLException{
		
		materialSubOrderBalanceService.postMaterialSubOrderBalance(materialSubOrderBalance, queryUserId());
		
		return SUCCESS;
	}
	
	public MaterialSubOrderVO getMaterialSubOrder(){
		return materialSubOrder;
	}

	public void setMaterialSubOrder(MaterialSubOrderVO materialSubOrder){
		this.materialSubOrder = materialSubOrder;
	}

	public int getCaclType(){
		return caclType;
	}

	public void setCaclType(int caclType){
		this.caclType = caclType;
	}

	public List<Long> getMsoIds(){
		return msoIds;
	}

	public void setMsoIds(List<Long> msoIds){
		this.msoIds = msoIds;
	}

}
