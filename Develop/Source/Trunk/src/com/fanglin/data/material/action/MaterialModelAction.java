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

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.Arrays;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.common.vo.ExcelWorkSheet;
import com.fanglin.core.action.BaseExportAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.MaterialModelService;
import com.fanglin.data.material.vo.MaterialModelVO;
import com.fanglin.utils.PoiExcelUtil;

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
		
		materialModelService.pageMaterialModel(getPaging(), getFilters(), getUserId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModel(){
		
		materialModels = materialModelService.queryMaterialModel();
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelById", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelById(){
		
		materialModel = materialModelService.queryMaterialModelById(materialModel.getMmId());
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelByNo(){
		
		materialModelService.queryMaterialModelByNo(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelForAllByName", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelForAllByName(){
		
		materialModels = materialModelService.queryMaterialModelForAllByName(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="queryMaterialModelForAllByNo", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryMaterialModelForAllByNo(){
		
		materialModels = materialModelService.queryMaterialModelForAllByNo(materialModel);
		
		return SUCCESS;
	}
	
	@Action(value="addMaterialModel", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addMaterialModel() throws FLException{
		
		materialModelService.addMaterialModel(materialModel);
		
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
	
	@Action(value="deleteMaterialModelByIds", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteMaterialModelByIds(){
		
		materialModelService.deleteMaterialModelByIds(ids);
		
		return SUCCESS;
	}
	
	@Action(value = "exportMaterialModel", results = { @Result(name = "success", type = "stream",params = { "contentType", "text/html","contentDisposition","attachment;fileName=${fileName}","inputName","downloadFileInputStream","encode","true"}) })
	public String exportMaterialModel() throws FLException {
		
		if(getFilters() == null){
			throw new FLException(189000, "必须添加筛选条件,否则数据量过大");
		}
		
		setFileName("主材型号.xls");
		
		List<MaterialModelVO> materialModelVOs = materialModelService.queryMaterialModel(getFilters());
		
		ExcelWorkSheet<MaterialModelVO> sheet = new ExcelWorkSheet<MaterialModelVO>();
		sheet.setData(materialModelVOs);
		sheet.setColumns(Arrays.asList("编号", "名称", "品类", "品牌", "单位", "单价", "进价", "折扣", "结算方式", "结算值"));
		sheet.setPropertyNames(Arrays.asList("materialModelNo", "materialModelName", "materialTypeName", "materialBrandName", "measurementUnitName", "materialUnitPrice", "materialPurchasePrice", "discount", "calcTypeName", "calcValue"));
		
		ByteArrayOutputStream os = new ByteArrayOutputStream();
		PoiExcelUtil.exportExcel(sheet, os);
		
		byte[] b = os.toByteArray();
		  
		ByteArrayInputStream in = new ByteArrayInputStream(b);

		setDownloadFileInputStream(in);
	    
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
