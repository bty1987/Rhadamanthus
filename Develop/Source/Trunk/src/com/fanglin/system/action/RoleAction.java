/*

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

import java.util.Collections;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.system.service.RoleService;
import com.fanglin.system.vo.RoleVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class RoleAction extends BaseListAction {

	private static final long serialVersionUID = -5295311320323779589L;

	private RoleVO role;

	private List<String> roleIds;

	@SuppressWarnings("unchecked")
	private List<RoleVO> roleList = Collections.EMPTY_LIST;

	@Autowired
	private RoleService roleService;

	@Action(value = "pageRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageRole(){
		
		roleService.pageRole(getPaging(), getFilters());
		
		return SUCCESS;
	}

	@Action(value = "queryRole", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRole(){
		
		roleList = roleService.queryRole();
		
		return SUCCESS;
	}

	@Action(value = "queryRoleById", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRoleById(){
		
		role = roleService.queryRoleById(role);
		
		return SUCCESS;
	}
	
	@Action(value = "queryRoleByName", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryRoleByName(){
		
		role = roleService.queryRoleByName(role);
		
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

	public List<String> getRoleIds(){
		return roleIds;
	}

	public void setRoleIds(List<String> roleIds){
		this.roleIds = roleIds;
	}

}
