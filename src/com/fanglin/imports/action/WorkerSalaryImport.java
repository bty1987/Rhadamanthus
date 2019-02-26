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
import com.fanglin.imports.service.WorkerSalaryImportService;

import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerSalaryImport extends BaseImportAction {
	
	private static final long serialVersionUID = 1977288044998344678L;
	
	@Autowired
	private WorkerSalaryImportService workerSalaryImportService;
	
	@Action(value="batchImportWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String batchImportWorkerSalary() throws FLException{
		
			List<List<String>> excels;
			try {
				excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());
			
				workerSalaryImportService.updateWorkerSalaryForAdvance(excels, queryUserId());
			
			} catch (Exception e) {
				System.out.println(e.getMessage());
				throw new FLException(110009, "导入文件错误");
			}
		
		return SUCCESS;
	}
	@Action(value="importWorkerSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String importWorkerSalary() throws FLException{

			List<List<String>> excels;
			try {
			
				excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());
				workerSalaryImportService.importWorkerSalary(excels, queryUserId());
			
			} catch (Exception e) {
				System.out.println(e.getMessage());
				throw new FLException(110009, "导入文件错误");
			}
		
		return SUCCESS;
	}
}
