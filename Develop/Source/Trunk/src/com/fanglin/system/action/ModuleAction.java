/**
 * @File Name	: UserAction.java
 * @Package		：com.fanglin.action 
 * @Version		: 1.0
 * @Date		: 2014-7-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
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

@ParentPackage("base")
@Namespace("/")
@Controller
public class ModuleAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	private ModuleVO module;
	
	private RoleVO role;
	
	private UserVO user;
	
	private List<ModuleVO> modules;
	
	private List<Integer> mids;
	
	@Autowired
	private ModuleService moduleService;
	
	@Action(value = "queryModule", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryModule(){
		
		modules = moduleService.queryModuleBySystem(module);
		
		return SUCCESS;
	}
	
	@Action(value = "queryModuleForLogin", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryModuleForLogin() throws FLException{
		
		modules = moduleService.queryModuleByRoleId(module, new RoleVO(queryRoleId()));
		
		return SUCCESS;
	}
	
	@Action(value = "queryModuleByUserId", results = { @Result(name = "success", type = "json" , params={"ignoreHierarchy","false"}) }, params = {"contentType", "text/html" } )
	public String queryModuleByUserId() throws FLException{
		
		modules = moduleService.queryModuleByUserId(module, user);
		
		return SUCCESS;
	}
	
	public ModuleVO getModule(){
		return module;
	}

	public void setModule(ModuleVO module){
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
