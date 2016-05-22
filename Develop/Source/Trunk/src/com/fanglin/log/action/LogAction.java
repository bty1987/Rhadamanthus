/**
 * @File Name		: LogAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 739061411@qqcom
 * @Describing	: 
 */

package com.fanglin.log.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseExportAction;
import com.fanglin.log.service.LogService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LogAction extends BaseExportAction {

	private static final long serialVersionUID = -1599812124963548111L;
	
	@Autowired
	private LogService logService;
	
	@Action(value = "pageActionLog", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageActionLog(){
		
		logService.pageActionLog(getPaging(), getFilters());	
		
		return SUCCESS;
	}

}
