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
import com.fanglin.system.service.RoleModuleService;
import com.fanglin.system.vo.CompanyVO;
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

	@Autowired
	private RoleModuleService roleModuleService;

	private ModuleVO module;

	private List<ModuleVO> modules;

	private RoleVO role;

	private UserVO user;

	private List<CompanyVO> companys;

	@Action(value = "pageModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageModule() {

		moduleService.pageModule(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModule() {

		modules = moduleService.queryModule(module);

		return SUCCESS;
	}

	@Action(value = "queryModuleForLogin", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleForLogin() throws FLException {

		// 如果指定了层级，则按层级查询；否则查询所有层级（保持原有逻辑）
		if (module != null && module.getLevel() != null) {
			// 按指定层级查询
			modules = moduleService.queryModuleByLevel(module, queryCompany());
		} else {
			// 原有逻辑：查询用户权限内的所有模块
			modules = moduleService.queryModuleByUserId(module, new UserVO(queryUserId()), queryCompany());
		}

		return SUCCESS;
	}

	@Action(value = "queryModuleForLink", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleForLink() throws FLException {

		modules = moduleService.queryModuleForLinkByRid(module, new RoleVO(queryRoleId()), queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryModuleByUserId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleByUserId() throws FLException {

		modules = moduleService.queryModuleByUserId(module, user, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryModuleByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleByRid() throws FLException {

		modules = moduleService.queryModuleByRid(module, role, queryCompany());

		return SUCCESS;
	}

	@Action(value = "queryModuleByFatherModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryModuleByFatherModule() throws FLException {

		modules = moduleService.queryModuleByFatherModule(module);

		return SUCCESS;
	}

	@Action(value = "checkModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String checkModule() throws FLException {

		moduleService.checkModule(module, queryUserId(), queryCompany());

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

		moduleService.updateRoleModuleByRid(module, role, modules, queryRoleId(), queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "syncRoleModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String syncRoleModule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		roleModuleService.syncRoleModule(role, companys, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteModule", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteModule() throws FLException {

		if (SystemConfig.getString("communion") == null) {
			throw new FLException(-1, "无操作权限");
		}

		moduleService.deleteModule(module, queryCompany());

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

	public List<CompanyVO> getCompanys() {
		return companys;
	}

	public void setCompanys(List<CompanyVO> companys) {
		this.companys = companys;
	}

}
