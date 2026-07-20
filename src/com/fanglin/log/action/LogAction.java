/**
 * @File Name		: LogAction
 * @Package   	: com.fanglin.action.quotation
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
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
import com.fanglin.log.service.LoginLogService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class LogAction extends BaseExportAction {

	private static final long serialVersionUID = -1599812124963548111L;
	
	@Autowired
	private LogService logService;
	
	@Autowired
	private LoginLogService loginLogService;
	
	@Action(value = "pageActionLog", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageActionLog(){

		logService.pageActionLog(getPaging(), getFilters());

		return SUCCESS;
	}

	/**
	 * Phase 4.3: 含历史的操作日志查询（热表 + 归档表 UNION）。
	 *
	 * <p>前端"含历史"开关勾选时调用此接口。要求 filters 含 createTime between 条件。
	 */
	@Action(value = "pageActionLogWithHistory", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageActionLogWithHistory(){

		logService.pageActionLogWithHistory(getPaging(), getFilters());

		return SUCCESS;
	}
	
	@Action(value = "pageLoginLog", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String pageLoginLog(){
		
		loginLogService.pageLoginLog(getPaging(), getFilters());	
		
		return SUCCESS;
	}

}
