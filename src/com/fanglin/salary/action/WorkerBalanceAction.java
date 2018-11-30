package com.fanglin.salary.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.salary.service.WorkerBalanceService;

@ParentPackage("base")
@Namespace("/")
@Controller
public class WorkerBalanceAction extends BaseListAction {

	private static final long serialVersionUID = -2091835340368047618L;
	
	@Autowired
	private WorkerBalanceService workerBalanceService;
	
	@Action(value="pageWorkerBalance", results={@org.apache.struts2.convention.annotation.Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pageWorkerBalance() throws FLException{
	  
		workerBalanceService.pageWorkerBalance(getPaging(), getFilters());
    
		return "success";
	}
	
}
