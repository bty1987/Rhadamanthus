/**
 * @File Name		: MaterialOutsideAction.java
 * @Package   	: com.fanglin.action.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-7
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
import com.fanglin.material.service.MaterialOutsideService;
import com.fanglin.material.vo.MaterialOutsideVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialOutsideAction extends BaseListAction{
	
	private static final long serialVersionUID = 9056241481293939124L;
	
	@Autowired
	private MaterialOutsideService materialOutsideService;
	
	private MaterialOutsideVO materialOutside;
	
	private List<Integer> moIds;
	
	@Action(value="pageMaterialOutside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialOutside(){
		
		materialOutsideService.pageMaterialOutside(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialOutsideByUserId", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialOutsideByUserId() throws FLException{
		
		materialOutsideService.pageMaterialOutsideByUserId(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialOutside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialOutside() throws FLException{
		
		materialOutsideService.addMaterialOutside(materialOutside, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialOutside", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialOutside() throws FLException{
		
		materialOutsideService.updateMaterialOutside(materialOutside, queryUserId());
		
		return SUCCESS;
	}

	public MaterialOutsideVO getMaterialOutside(){
		return materialOutside;
	}

	public void setMaterialOutside(MaterialOutsideVO materialOutside){
		this.materialOutside = materialOutside;
	}

	public List<Integer> getMoIds(){
		return moIds;
	}

	public void setMoIds(List<Integer> moIds){
		this.moIds = moIds;
	}

}
