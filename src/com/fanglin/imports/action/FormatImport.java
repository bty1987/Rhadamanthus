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
import com.fanglin.imports.service.FormatImportService;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class FormatImport extends BaseImportAction {

	private static final long serialVersionUID = -1242429561076158230L;
	
	@Autowired
	private FormatImportService formatImportService;
	
	@Action(value="importFormat", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String importFormat() throws FLException{
		
		try {
			
			List<List<String>> excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());

			formatImportService.importFormat(excels);
			
		} catch (Exception e) {
			throw new FLException(110009, "导入文件错误");
		}
		
		return SUCCESS;
	}

}
