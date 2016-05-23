/**
 * Title: CityAction
 * Description:
 * Copyright: Copyright (c) 2014 All rights reserved.
 * Company: JH Corporation, China, Ltd.
 * @author bty1987
 *
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
import com.fanglin.system.service.CityService;
import com.fanglin.system.vo.CityVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityAction extends BaseListAction {

	private static final long serialVersionUID = 4493385608040589247L;

	@Autowired
	private CityService cityService;

	private CityVO city;

	private List<CityVO> cityList;

	private List<String> cityIds;
	
	private List<String> autoFillList;
	
	@Action(value = "pageCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCity(){
		
		cityService.pageCity(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "queryCity", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCity(){
		
		cityList = cityService.queryCity();
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityById(){
		
		city = cityService.queryCityById(city);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityByRegionId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityByRegionId(){
		
		cityList = cityService.queryCityByRegionId(city);
		
		return SUCCESS;
	}

	public CityVO getCity(){
		return city;
	}

	public void setCity(CityVO city){
		this.city = city;
	}

	@JSON(serialize=false)
	public List<String> getCityIds(){
		return cityIds;
	}

	public void setCityIds(List<String> cityIds){
		this.cityIds = cityIds;
	}

	public List<CityVO> getCityList(){
		return cityList;
	}

	public void setCityList(List<CityVO> cityList){
		this.cityList = cityList;
	}

	public List<String> getAutoFillList(){
		return autoFillList;
	}

	public void setAutoFillList(List<String> autoFillList){
		this.autoFillList = autoFillList;
	}

}
