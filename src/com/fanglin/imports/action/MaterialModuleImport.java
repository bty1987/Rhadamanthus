/**
 * @File Name		: MaterialModuleImport.java
 * @Package   	: com.fanglin.imports.action
 * @Version		: 1.0
 * @Date			: 2016-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.imports.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseImportAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.imports.service.MaterialModuleImportService;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MaterialModuleImport extends BaseImportAction {

	private static final long serialVersionUID = 8552167407524472455L;
	
	@Autowired
	private MaterialModuleImportService materialModuleImportService;
	
	@Action(value="importMaterialModule", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String importMaterialModule() throws FLException{
		
		try {
			List<List<String>> excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());
			
			materialModuleImportService.updateMaterialModelForAdvance(excels);
			
		} catch (Exception e) {
			throw new FLException(110009, "导入文件错误");
		}
		
		return SUCCESS;
	}

}
