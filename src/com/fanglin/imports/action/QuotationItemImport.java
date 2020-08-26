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
import com.fanglin.imports.service.QuotationItemImportService;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class QuotationItemImport extends BaseImportAction{

	private static final long serialVersionUID = 491042968391708389L;
	
	@Autowired
	private QuotationItemImportService quotationItemImportService;
	
	@Action(value="importQuotationItem", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String importQuotationItem() throws FLException{

			List<List<String>> excels;
			try {
				excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());
				quotationItemImportService.importQuotationItem(excels, queryUserId());
			
			} catch (Exception e) {
				throw new FLException(110009, "导入文件错误");
			}
		
		return SUCCESS;
	}

}
