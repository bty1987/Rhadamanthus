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
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RoleAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;
	
	@Autowired
	private RoleService roleService;

	private RoleVO role;

	private List<RoleVO> roleList;

	@Action(value = "pageRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRole() throws FLException{
		
		roleService.pageRole(getPaging(), getFilters(),queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "queryRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRole() throws FLException{
		
		roleList = roleService.querylRole(queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "queryRoleByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRoleByRid(){
		
		role = roleService.queryRoleByRid(role);
		
		return SUCCESS;
	}
	
	@Action(value = "queryRoleByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRoleByName() throws FLException{
		
		role = roleService.queryRoleByName(role,queryCompany());
		
		return SUCCESS;
	}

	@Action(value = "addRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addRole() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		roleService.addRole(role,queryCompany());
		
	    return SUCCESS;
	}

	@Action(value = "updateRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String editRole() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		roleService.updateRole(role);
		
		return SUCCESS;
	}
	
	@Action(value = "deleteRoleByRid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteRoleByRid() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		roleService.deleteRoleByRid(role, queryRoleId());
		
		return SUCCESS;
	}

	public RoleVO getRole(){
		return role;
	}

	public void setRole(RoleVO role){
		this.role = role;
	}

	public List<RoleVO> getRoleList(){
		return roleList;
	}

	public void setRoleList(List<RoleVO> roleList){
		this.roleList = roleList;
	}
	
}
