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
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.service.CityProperService;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class CityProperAction extends BaseListAction {

	private static final long serialVersionUID = 3246937855994579649L;

	@Autowired
	private CityProperService cityProperService;

	private List<CityProperVO> cityPropers;

	private CityProperVO cityProper;

	private List<Integer> cpids;

	@Action(value = "pageCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityProper() {

		cityProperService.pageCityProper(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProper() {

		cityPropers = cityProperService.queryCityProper();

		return SUCCESS;
	}

	@Action(value = "queryCityProperByCpid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProperByCpid() {

		cityProper = cityProperService.queryCityProperByCpid(cityProper);

		return SUCCESS;
	}

	@Action(value = "queryCityProperByCid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCityProperByCid() {

		cityPropers = cityProperService.queryCityProperByCid(cityProper);

		return SUCCESS;
	}

	@Action(value = "queryCityProperByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageCityProperByName() {

		cityPropers = cityProperService.queryCityProperByName(cityProper);

		return SUCCESS;
	}

	@Action(value = "addCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCityProper() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		cityProperService.addCityProper(cityProper);

		return SUCCESS;
	}

	@Action(value = "updateCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCityProper() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		cityProperService.updateCityProper(cityProper);

		return SUCCESS;
	}

	@Action(value = "updateCityProperForPosition", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCityProperForPosition() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		cityProperService.updateCityProperForPosition(cityProper);

		return SUCCESS;
	}

	@Action(value = "deleteCityProper", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCityProper() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		String quotedCityProper = cityProperService.deleteCityProper(cpids);

		if (!quotedCityProper.equals("")) {
			throw new FLException(230003, String.format("城区[%s]已被引用,不能被删除", quotedCityProper));
		}

		return SUCCESS;
	}

	public List<CityProperVO> getCityPropers() {
		return cityPropers;
	}

	public void setCityPropers(List<CityProperVO> cityPropers) {
		this.cityPropers = cityPropers;
	}

	public List<Integer> getCpids() {
		return cpids;
	}

	public void setCpids(List<Integer> cpids) {
		this.cpids = cpids;
	}

	public CityProperVO getCityProper() {
		return cityProper;
	}

	public void setCityProper(CityProperVO cityProper) {
		this.cityProper = cityProper;
	}

}
