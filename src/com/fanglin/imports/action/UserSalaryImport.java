/**
 * @File Name		: UserSalaryImport.java
 * @Package   	: com.fanglin.imports.action
 * @Version		: 1.0
 * @Date			: 2016-9-2
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
import com.fanglin.imports.service.UserSalaryImportService;
import com.fanglin.utils.PoiExcelUtil;

@ParentPackage("base")
@Namespace("/")
@Controller
public class UserSalaryImport extends BaseImportAction{

	private static final long serialVersionUID = -4713659178659383560L;

	@Autowired
	private UserSalaryImportService userSalaryImportService;

	@Action(value="importUserSalary", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String importUserSalary() throws FLException{

		try {

			List<List<String>> excels = PoiExcelUtil.readExcel(getStrutsUploads(), getStrutsUploadsFileName());

			userSalaryImportService.importUserSalary(excels, queryUserId());

		} catch (FLException e) {
			throw e;
		} catch (Exception e) {
			throw new FLException(110009, "导入文件错误", e);
		}

		return SUCCESS;
	}

}
