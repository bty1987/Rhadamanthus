/**
 * @File Name	: AcceptanceAction.java
 * @Package   	: com.fanglin.action.constructionSchedule
 * @Version		: 1.0
 * @Date		: 2014-9-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.communion.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.HouseService;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;

@ParentPackage("base")
@Namespace("/")
@Controller
public class HouseAction extends BaseListAction{

	private static final long serialVersionUID = 369283426907698981L;
	
	@Autowired
	private HouseService houseService;
	
	private HouseVO house;
	
	@Action(value = "pageHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageHouse() throws FLException{
	
		houseService.pageHouse(getPaging(), getFilters());
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseByHid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseByHid() throws FLException{
		
		house = houseService.queryHouseByHid(house);
		
		return SUCCESS;
	}
	
	@Action(value = "queryHouseByNoAHnum", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryHouseByNoAHnum() throws FLException{
		
		house = houseService.queryHouseByNoAHnum(house);
		
		return SUCCESS;
	}
	
	@Action(value = "addHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addHouse() throws FLException{
		
		houseService.addHouse(house);
		
		return SUCCESS;
	}
	
	@Action(value = "updateHouse", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateHouse() throws FLException{
		
		houseService.updateHouse(house);
		
		return SUCCESS;
	}
	
	public HouseVO getHouse() {
		return house;
	}

	public void setHouse(HouseVO house) {
		this.house = house;
	}
	
}