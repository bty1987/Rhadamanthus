/**
 * @FileName	: RegionAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: Howard
 * @Describing	: 
 */
package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.json.annotations.JSON;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.RegionService;
import com.fanglin.system.vo.RegionVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RegionAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private RegionService regionService;

	private RegionVO region;

	private List<RegionVO> regionList;

	private List<String> regionIds;
	
	@Action(value = "pageRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRegion(){
		
		regionService.pageRegion(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "queryRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRegion(){
		
		regionList = regionService.queryRegion();
		
		return SUCCESS;
	}

	@Action(value = "queryRegionById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRegionById(){
		
		region = regionService.queryRegionById(region);
		
		return SUCCESS;
	}

	public RegionVO getRegion(){
		return region;
	}

	public void setRegion(RegionVO region){
		this.region = region;
	}

	@JSON(serialize=false)
	public List<String> getRegionIds(){
		return regionIds;
	}

	public void setRegionIds(List<String> regionIds){
		this.regionIds = regionIds;
	}

	public List<RegionVO> getRegionList(){
		return regionList;
	}

	public void setRegionList(List<RegionVO> regionList){
		this.regionList = regionList;
	}

}
