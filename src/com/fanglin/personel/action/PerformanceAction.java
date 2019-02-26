package com.fanglin.personel.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.PerformanceService;
import com.fanglin.personel.vo.PerformanceVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class PerformanceAction extends BaseListAction{
	
	private static final long serialVersionUID = 6243727024524342670L;
	
	@Autowired
	PerformanceService performanceService;
	
	PerformanceVO performance;
	
	@Action(value="pagePerformance", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String pagePerformance(){
		
		performanceService.pagePerformance(getPaging(), getFilters());
		
		return SUCCESS;
		
	}
	
	@Action(value="addPreformance", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addPreformance() throws FLException{
		
		performanceService.addPreformance(performance);
		
		return SUCCESS;
		
	}

	public PerformanceVO getPerformance() {
		return performance;
	}

	public void setPerformance(PerformanceVO performance) {
		this.performance = performance;
	}

}
