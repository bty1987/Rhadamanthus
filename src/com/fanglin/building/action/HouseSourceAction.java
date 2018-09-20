package com.fanglin.building.action;

import java.util.ArrayList;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.building.service.HouseSourceService;
import com.fanglin.building.vo.HouseSourceVO;
import com.fanglin.common.vo.KeyValueVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class HouseSourceAction extends BaseListAction{

	private static final long serialVersionUID = 369283426907698982L;
	
	@Autowired
	private HouseSourceService houseSourceService;
	
	private HouseSourceVO houseSource;
	
	private List<KeyValueVO> autoFillHouseSource;
	
	private List<String> autoFillList;
	
	@Action(value = "pageHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHouseSource() throws FLException {
		
		houseSourceService.pageHouseSource(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "pageHouseSourceForFollower", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHouseSourceForFollower() throws FLException {
		
		houseSourceService.pageHouseSourceForFollower(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "pageHouseSourceForAdvance", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHouseSourceForAdvance() throws FLException {
		
		houseSourceService.pageHouseSourceForAdvance(getPaging(), getFilters(), queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseSourceByHsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseSourceByHsid(){
		
		houseSource = houseSourceService.queryHouseSourceByHsid(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseSourceByNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseSourceByNo() throws FLException{
		
		houseSource = houseSourceService.queryHouseSourceByNo(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "checkHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkHouseSource() throws FLException{
		
		houseSource = houseSourceService.checkHouseSource(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "addHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHouseSource() throws FLException{
		
		houseSourceService.addHouseSource(houseSource, queryUserId(), queryCompany());
		
		return SUCCESS;
	}
	
	@Action(value = "takeHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String takeHouseSource() throws FLException{
		
		houseSourceService.takeHouseSource(houseSource, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSource() throws FLException{
		
		houseSourceService.updateHouseSource(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouseSourceForBelong", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSourceForBelong() throws FLException{
		
		houseSourceService.updateHouseSourceForBelong(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouseSourceForKeyer", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSourceForKeyer() throws FLException{
		
		houseSourceService.updateHouseSourceForKeyer(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouseSourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSourceForStatus() throws FLException{
		
		houseSourceService.updateHouseSourceForStatus(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouseSourceForPath", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSourceForPath() throws FLException{
		
		houseSourceService.updateHouseSourceForPath(houseSource);
		
		return SUCCESS;
	}

	public HouseSourceVO getHouseSource() {
		return houseSource;
	}

	public void setHouseSource(HouseSourceVO houseSource) {
		this.houseSource = houseSource;
	}

	public List<KeyValueVO> getAutoFillHouseSource(){
		if(autoFillHouseSource == null){
			autoFillHouseSource = new ArrayList<KeyValueVO>();
		}
		return autoFillHouseSource;
	}

	public void setAutoFillHouseSource(List<KeyValueVO> autoFillHouseSource) {
		this.autoFillHouseSource = autoFillHouseSource;
	}
	
	public List<String> getAutoFillList() {
		if(autoFillList == null){
			autoFillList = new ArrayList<String>();
		}
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList) {
		this.autoFillList = autoFillList;
	}
	
}