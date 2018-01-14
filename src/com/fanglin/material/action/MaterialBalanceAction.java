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
import com.fanglin.material.service.MaterialBalanceService;
import com.fanglin.material.service.MaterialService;
import com.fanglin.material.vo.MaterialBalanceVO;
import com.fanglin.material.vo.MaterialVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialBalanceAction extends BaseListAction{

	private static final long serialVersionUID = -6255753215095300911L;
	
	@Autowired
	private MaterialService materialService;
	
	@Autowired
	private MaterialBalanceService materialBalanceService;
	
	private MaterialVO material;
	
	private MaterialBalanceVO materialBalance;
	
	private int caclType;
	
	public List<Long> mids;
	
	@Action(value="pageMaterialBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialBalance() throws FLException{
		
		materialBalanceService.pageMaterialBalance(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialBalanceForVender", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialBalanceForVender() throws FLException{
		
		materialBalanceService.pageMaterialBalanceForVender(getPaging(), getFilters(), queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialForPreBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialForPreBalance() throws FLException{
		
		materialService.pageMaterialForPreBalance(getPaging(), getFilters(), queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialBalanceForVBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialBalanceForVBalance() throws FLException{
		
		materialBalanceService.updateMaterialBalanceForVBalance(materialBalance);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialBalanceForBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialBalanceForBalance() throws FLException{
		
		materialBalanceService.updateMaterialBalanceForBalance(materialBalance);
		
		return SUCCESS;
	}
	
	@Action(value="passBalanceMaterial", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String passBalanceMaterial(){
		
		materialService.passBalanceMaterial(mids);
		
		return SUCCESS;
	}
	
	@Action(value="preBalanceMaterial", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String preBalanceMaterial() throws FLException{
		
		materialService.preBalanceMaterial(mids, queryUserId(), queryUserName());
		
		return SUCCESS;
	}
	
	@Action(value="vpostMaterialBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String vpostMaterialBalance() throws FLException{
		
		materialBalanceService.vpostMaterialBalance(materialBalance);
		
		return SUCCESS;
	}
	
	@Action(value="postMaterialBalance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String postMaterialBalance() throws FLException{
		
		materialBalanceService.postMaterialBalance(materialBalance, queryUserId());
		
		return SUCCESS;
	}
	
	public MaterialVO getMaterial(){
		return material;
	}

	public void setMaterial(MaterialVO material){
		this.material = material;
	}

	public int getCaclType(){
		return caclType;
	}

	public void setCaclType(int caclType){
		this.caclType = caclType;
	}

	public List<Long> getMids(){
		return mids;
	}

	public void setMids(List<Long> mids){
		this.mids = mids;
	}

	public MaterialBalanceVO getMaterialBalance() {
		return materialBalance;
	}

	public void setMaterialBalance(MaterialBalanceVO materialBalance) {
		this.materialBalance = materialBalance;
	}

}
