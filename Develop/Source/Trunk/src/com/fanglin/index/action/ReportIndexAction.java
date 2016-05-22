/**
 * @File Name		: ReportIndexAction.java
 * @Package   	: com.fanglin.common.action
 * @Version		: 1.0
 * @Date			: 2015-5-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.index.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ReportIndexAction extends BaseListAction {
	
	private static final long serialVersionUID = 1000191757139033581L;

	@Action(value = "reportBizDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/report/reportBizDept.html") })
	public String reportBizDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "reportDesignDeptIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/report/reportDesignDept.html") })
	public String reportDesignDeptIndex(){
		return SUCCESS;
	}
	
	@Action(value = "reportBizRegionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/report/reportBizRegion.html") })
	public String reportBizRegionIndex(){
		return SUCCESS;
	}
	
	@Action(value = "reportDesignRegionIndex", results = { @Result(name = "success", type = "dispatcher", location = "/views/report/reportDesignRegion.html") })
	public String reportDesignRegionIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialDepartmentReportIndex", results={@Result(name="success", type="dispatcher", location="/views/report/materialDepartmentReport.html")})
	public String materialDepartmentReportIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialDesignReportIndex", results={@Result(name="success", type="dispatcher", location="/views/report/materialDesignReport.html")})
	public String materialDesignReportIndex(){
		return SUCCESS;
	}
	
	@Action(value="materialMerchantReportIndex", results={@Result(name="success", type="dispatcher", location="/views/report/materialMerchantReport.html")})
	public String materialMerchantReportIndex(){
		return SUCCESS;
	}
	
	@Action(value="rankIndex", results={@Result(name="success", type="dispatcher", location="/views/report/rank.html")})
	public String rankIndex(){
		return SUCCESS;
	}


}
