/**
 * @File Name		: MaterialBrandAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-8-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.MaterialBrandRightService;
import com.fanglin.data.material.vo.MaterialBrandRightVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialBrandRightAction extends BaseListAction {

	private static final long serialVersionUID = 8686232518816189789L;
	
	@Autowired
	private MaterialBrandRightService materialBrandRightService;
	
	private MaterialBrandRightVO materialBrandRight;
	
	@Action(value="queryMaterialBrandRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialBrandRight(){
		
		materialBrandRight = materialBrandRightService.queryMaterialBrandRightByUserId(materialBrandRight);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialBrandRightForLogin", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialBrandRightForLogin() throws FLException{
		
		materialBrandRight = new MaterialBrandRightVO();
		materialBrandRight.setUserId(queryUserId());
		
		materialBrandRight = materialBrandRightService.queryMaterialBrandRightByUserId(materialBrandRight);
		
		return SUCCESS;
	}
	
	
	@Action(value="updateMaterialBrandRight", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialBrandRight(){
		
		materialBrandRightService.updateMaterialBrandRight(materialBrandRight);
		
		return SUCCESS;
	}

	public MaterialBrandRightVO getMaterialBrandRight(){
		return materialBrandRight;
	}

	public void setMaterialBrandRight(MaterialBrandRightVO materialBrandRight){
		this.materialBrandRight = materialBrandRight;
	}

}
