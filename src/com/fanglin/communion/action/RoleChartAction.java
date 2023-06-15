package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.communion.service.RoleChartService;
import com.fanglin.communion.vo.ChartVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RoleChartAction extends BaseListAction {

	private static final long serialVersionUID = -203252776782704397L;

	@Autowired
	private RoleChartService roleChartService;

	private List<ChartVO> charts;

	private RoleVO role;

	private List<Long> cids;

	@Action(value = "queryChartForLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChartForLogin() throws FLException {

		charts = roleChartService.queryChartForLogin(new RoleVO(queryRoleId()));

		return SUCCESS;
	}

	@Action(value = "queryChartByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryChartByRid() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		charts = roleChartService.queryChartByRid(role);

		return SUCCESS;
	}

	@Action(value = "updateRoleChartByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRoleChartByRid() throws FLException {

		roleChartService.updateRoleChartByRid(role, cids, queryRoleId());

		return SUCCESS;
	}

	public List<ChartVO> getCharts() {
		return charts;
	}

	public void setCharts(List<ChartVO> charts) {
		this.charts = charts;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

	public List<Long> getCids() {
		return cids;
	}

	public void setCids(List<Long> cids) {
		this.cids = cids;
	}

}
