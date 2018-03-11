/**
 * @FileName	: RegionAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date		: 2014-7-28
 * @Copyright	: Copyright Decoration 2014
 * @Author		: bty1987
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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.RegionService;
import com.fanglin.system.vo.RegionVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RegionAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private RegionService regionService;

	private RegionVO region;

	private List<RegionVO> regions; 

	private List<String> regionIds;
	
	private List<Integer> rids;
	
	@Action(value = "pageRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRegion(){
		
		regionService.pageRegion(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRegion(){
		
		regions = regionService.queryRegion();
		
		return SUCCESS;
	}

	@Action(value = "queryRegionByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRegionByRid(){
		
		region = regionService.queryRegionByRid(region);
		
		return SUCCESS;
	}
	
	@Action(value = "queryRegionByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRegionByName(){
		
		regions = regionService.queryRegionByName(region);
		
		return SUCCESS;
	}
	
	@Action(value = "addRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRegion() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		regionService.addRegion(region);
		
		return SUCCESS;
	}

	@Action(value = "updateRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRegion() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}

		regionService.updateRegion(region);

		return SUCCESS;
	}

	@Action(value = "deleteRegion", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRegion() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		String quotedRegion = regionService.deleteRegion(rids);
		
		if(!quotedRegion.equals("")){
			StringBuffer message = new StringBuffer();
			message.append("大区[");
			message.append(quotedRegion);
			message.append("]已被引用,不能被删除");
			
			throw new FLException(230004, message.toString());
		}
		
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

	public List<RegionVO> getRegions() {
		return regions;
	}

	public void setRegions(List<RegionVO> regions) {
		this.regions = regions;
	}

	public List<Integer> getRids() {
		return rids;
	}

	public void setRids(List<Integer> rids) {
		this.rids = rids;
	}


}
