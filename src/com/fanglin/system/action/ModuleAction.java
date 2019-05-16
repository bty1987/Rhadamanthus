/**
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email		: 
 * Describing	: 用户管理相关action
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
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.service.ModuleService;
import com.fanglin.system.vo.ModuleVO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class ModuleAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	@Autowired
	private ModuleService moduleService;

	private ModuleVO module;

	private RoleVO role;

	private UserVO user;

	private List<ModuleVO> modules;

	private List<Integer> mids;

	@Action(value = "pageModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageModule() {

		moduleService.pageModule(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModule() {

		modules = moduleService.queryModuleBySystem(module);

		return SUCCESS;
	}

	@Action(value = "queryModuleForLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleForLogin() throws FLException {

		modules = moduleService.queryModuleByRid(module, new RoleVO(queryRoleId()));

		return SUCCESS;
	}

	@Action(value = "queryModuleByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleByUserId() throws FLException {

		modules = moduleService.queryModuleByUserId(module, user);

		return SUCCESS;
	}

	@Action(value = "queryModuleByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleByRid() throws FLException {

		modules = moduleService.queryModuleByRid(module, role);

		return SUCCESS;
	}

	@Action(value = "addModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addModule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		moduleService.addModule(module);

		return SUCCESS;
	}

	@Action(value = "updateRoleModuleByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateRoleModuleByRid() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		moduleService.updateRoleModuleByRid(module, role, mids, queryRoleId());

		return SUCCESS;
	}

	@Action(value = "deleteModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteModule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		moduleService.deleteModule(module);

		return SUCCESS;
	}

	public ModuleVO getModule() {
		return module;
	}

	public void setModule(ModuleVO module) {
		this.module = module;
	}

	public List<ModuleVO> getModules() {
		return modules;
	}

	public void setModules(List<ModuleVO> modules) {
		this.modules = modules;
	}

	public List<Integer> getMids() {
		return mids;
	}

	public void setMids(List<Integer> mids) {
		this.mids = mids;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

}
