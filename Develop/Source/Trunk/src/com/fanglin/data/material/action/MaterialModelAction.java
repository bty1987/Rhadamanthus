/**
 * @File Name		: MaterialModelAction.java
 * @Package   	: com.fanglin.action.material
 * @Version		: 1.0
 * @Date			: 2014-8-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.material.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseExportAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.MaterialModelService;
import com.fanglin.data.material.vo.MaterialModelVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialModelAction extends BaseExportAction{

	private static final long serialVersionUID = 6194356727193323254L;
	
	@Autowired
	private MaterialModelService materialModelService;
	
	private MaterialModelVO materialModel;
	
	private List<MaterialModelVO> materialModels;
	
	private List<String> ids;
	
	@Action(value="pageMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialModel() throws FLException{
		
		materialModelService.pageMaterialModel(getPaging(), getFilters(),queryUserId(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="pageMaterialModelForAdvance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageMaterialModelForAdvance() throws FLException{
		
		materialModelService.pageMaterialModelForAdvance(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModel(){
		
		materialModels = materialModelService.queryMaterialModel();
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelById(){
		
		materialModel = materialModelService.queryMaterialModelById(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelByNo() throws FLException{
		
		materialModelService.queryMaterialModelByNo(materialModel,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelForAllByName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelForAllByName() throws FLException{
		
		materialModels = materialModelService.queryMaterialModelForAllByName(materialModel,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelForAllByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelForAllByNo(){
		
		materialModels = materialModelService.queryMaterialModelForAllByNo(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialModel() throws FLException{
		
		materialModelService.addMaterialModel(materialModel,queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialModel(){
		
		materialModelService.updateMaterialModel(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialModelForStatus", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialModelForStatus(){
		
		materialModelService.updateMaterialModelForStatus(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="updateMaterialModelForAdvance", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String updateMaterialModelForAdvance(){
		
		materialModelService.updateMaterialModelForAdvance(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="deleteMaterialModelByIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterialModelByIds(){
		
		materialModelService.deleteMaterialModelByIds(ids);
		
		return SUCCESS;
	}
	
	public MaterialModelVO getMaterialModel(){
		return materialModel;
	}

	public void setMaterialModel(MaterialModelVO materialModel){
		this.materialModel = materialModel;
	}

	public List<MaterialModelVO> getMaterialModels(){
		return materialModels;
	}

	public void setMaterialModels(List<MaterialModelVO> materialModels){
		this.materialModels = materialModels;
	}

	public List<String> getIds(){
		return ids;
	}

	public void setIds(List<String> ids){
		this.ids = ids;
	}
	
}
