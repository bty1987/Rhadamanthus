/**
 * @File Name		: RegionCountAction.java
 * @Package   	: com.fanglin.report.action
 * @Version		: 1.0
 * @Date			: 2016-11-12
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.report.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.report.service.RegionCountService;
import com.fanglin.report.vo.RegionCountDetailVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RegionCountAction extends BaseListAction {

	private static final long serialVersionUID = 3688436075341828929L;
	
	@Autowired
	private RegionCountService regionCountService;
	
	private List<RegionCountDetailVO> regionCounts;
	
	@Action(value="reportRegionCountForCurrent", results={@Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String reportRegionCountForCurrent() throws Exception{
		
		regionCounts = regionCountService.queryRegionCountDetailForCurrent(getFilters());
		
		return SUCCESS;
	}

	public List<RegionCountDetailVO> getRegionCounts() {
		return regionCounts;
	}

	public void setRegionCounts(List<RegionCountDetailVO> regionCounts) {
		this.regionCounts = regionCounts;
	}

}
