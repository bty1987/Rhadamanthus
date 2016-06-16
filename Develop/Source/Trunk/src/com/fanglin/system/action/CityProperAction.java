/**
 * @File Name		: CityProperAction.java
 * @Package   	: com.fanglin.action
 * @Version		: 1.0
 * @Date			: 2014-8-8
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
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
import com.fanglin.system.service.CityProperService;
import com.fanglin.system.vo.CityProperVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityProperAction extends BaseListAction {

	private static final long serialVersionUID = 3246937855994579649L;
	
	@Autowired
	private CityProperService cityProperService;
	
	private List<CityProperVO> cityProperList;
	
	private CityProperVO cityProper;
	
	private List<String> cityProperIds;
	
	@Action(value = "pageCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityProper(){
		
		cityProperService.pageCityProper(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProper(){
		
		cityProperList = cityProperService.queryCityProper();
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityProperById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProperById(){
		
		cityProper = cityProperService.queryCityProperById(cityProper);
		
		return SUCCESS;
	}
	
	@Action(value = "queryCityProperByCityId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProperByCityId(){
		
		cityProperList = cityProperService.queryCityProperByCityId(cityProper);
		
		return SUCCESS;
	}
	
	public List<CityProperVO> getCityProperList(){
		return cityProperList;
	}

	public void setCityProperList(List<CityProperVO> cityProperList){
		this.cityProperList = cityProperList;
	}

	public CityProperVO getCityProper(){
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper){
		this.cityProper = cityProper;
	}

	public List<String> getCityProperIds(){
		return cityProperIds;
	}

	public void setCityProperIds(List<String> cityProperIds){
		this.cityProperIds = cityProperIds;
	}

	
}
