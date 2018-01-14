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
	public String pageHouseSource() {
		
		houseSourceService.pageHouseSource(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseSourceByHsid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseSourceByHsid(){
		
		houseSource = houseSourceService.queryHouseSourceByHsid(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseSourceForNo", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseSourceForNo() throws FLException{
		
		houseSource = houseSourceService.queryHouseSourceForNo(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "checkHouseSourceByHidAndType", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkHouseSourceByHidAndType() throws FLException{
		
		houseSource = houseSourceService.checkHouseSourceByHidAndType(houseSource);
		
		return SUCCESS;
	}
	
	@Action(value = "addHouseSource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHouseSource() throws FLException{
		
		houseSourceService.addHouseSource(houseSource, queryUserId());
		
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
	
	@Action(value = "updateHouseSourceForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouseSourceForStatus() throws FLException{
		
		houseSourceService.updateHouseSourceForStatus(houseSource);
		
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