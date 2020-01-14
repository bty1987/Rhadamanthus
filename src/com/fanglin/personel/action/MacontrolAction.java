/**
 * @File Name		: MonitorAction.java
 * @Package   	: com.fanglin.monitor.action
 * @Version		: 1.0
 * @Date			: 2017-9-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.personel.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.service.MacontrolService;
import com.fanglin.personel.vo.MacontrolVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MacontrolAction extends BaseAction {

	private static final long serialVersionUID = -4473794265973012796L;

	@Autowired
	private MacontrolService macontrolService;

	private List<MacontrolVO> macontrols;

	private MacontrolVO macontrol;

	@Action(value = "queryMacontrol", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMacontrol() {

		macontrols = macontrolService.queryMacontrol(macontrol);

		return SUCCESS;
	}

	@Action(value = "addMacontrol", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addMacontrol() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		macontrolService.addMacontrol(macontrol);

		return SUCCESS;
	}

	@Action(value = "deleteMacontrol", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteMacontrol() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		macontrolService.deleteMacontrol(macontrol);

		return SUCCESS;
	}

	public List<MacontrolVO> getMacontrols() {
		return macontrols;
	}

	public void setMacontrols(List<MacontrolVO> macontrols) {
		this.macontrols = macontrols;
	}

	public MacontrolVO getMacontrol() {
		return macontrol;
	}

	public void setMacontrol(MacontrolVO macontrol) {
		this.macontrol = macontrol;
	}

}
