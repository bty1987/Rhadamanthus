/**
 * Title: CityAction
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author Howard
 *
 */

package com.fanglin.system.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.CityService;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private CityService cityService;

	private CityVO city;

	private List<CityVO> citys;

	private List<String> autoFillList;
	
	private List<Integer> cids;
	
	@Action(value = "pageCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCity(){
		
		cityService.pageCity(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCity(){
		
		citys = cityService.queryCity();
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityByCid() throws FLException{
		
		city = cityService.queryCityByCid(city);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityByRid(){
		
		citys = cityService.queryCityByRid(city);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityByName(){
		
		citys = cityService.queryCityByName(city);
		
		return SUCCESS;
	}

	@Action(value = "addCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCity() throws FLException {
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		cityService.addCity(city);
		
		return SUCCESS;
	}

	@Action(value = "updateCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCity() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}

		cityService.updateCity(city);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteCityByCids", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCityByCids() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		cityService.deleteCityByCids(cids);
		
		return SUCCESS;
	}

	public List<Integer> getCids() {
		return cids;
	}

	public void setCids(List<Integer> cids) {
		this.cids = cids;
	}

	public CityVO getCity(){
		return city;
	}

	public void setCity(CityVO city){
		this.city = city;
	}

	public List<CityVO> getCitys() {
		return citys;
	}

	public void setCitys(List<CityVO> citys) {
		this.citys = citys;
	}

	public List<String> getAutoFillList(){
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}

}
