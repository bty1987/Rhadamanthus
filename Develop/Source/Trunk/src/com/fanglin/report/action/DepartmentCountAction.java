/**
 * @File Name		: DepartmentCountAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2016-11-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.text.ParseException;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.report.service.DDepartmentCountDetailService;
import com.fanglin.report.service.DRegionCountDetailService;
import com.fanglin.report.vo.DDepartmentCountDetailVO;
import com.fanglin.report.vo.DRegionCountDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DepartmentCountAction extends BaseListAction {

	private static final long serialVersionUID = 3369130277160890335L;
	
	@Autowired
	private DRegionCountDetailService dRegionCountDetailService;
	
	@Autowired
	private DDepartmentCountDetailService dDepartmentCountDetailService;
	
	private List<DRegionCountDetailVO> dRegionCountDetails;
	
	private List<DDepartmentCountDetailVO> dDepartmentCountDetails;
	
	@Action(value="queryDRegionCountDetail", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDRegionCountDetail() throws FLException, ParseException{
		
		dRegionCountDetails = dRegionCountDetailService.queryDRegionCountDetail(getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="queryDDepartmentCountDetail", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDDepartmentCountDetail() throws FLException, ParseException{
		
		dDepartmentCountDetails = dDepartmentCountDetailService.queryDDepartmentCountDetail(getFilters(), queryUserId());
		
		return SUCCESS;
	}

	public List<DDepartmentCountDetailVO> getdDepartmentCountDetails() {
		return dDepartmentCountDetails;
	}

	public void setdDepartmentCountDetails(List<DDepartmentCountDetailVO> dDepartmentCountDetails) {
		this.dDepartmentCountDetails = dDepartmentCountDetails;
	}

	public List<DRegionCountDetailVO> getdRegionCountDetails() {
		return dRegionCountDetails;
	}

	public void setdRegionCountDetails(List<DRegionCountDetailVO> dRegionCountDetails) {
		this.dRegionCountDetails = dRegionCountDetails;
	}

}
