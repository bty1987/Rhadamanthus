package com.fanglin.system.vo;

import java.io.Serializable;

public class RoleVO implements Serializable {

	private static final long serialVersionUID = 9045008682677539729L;

	private String roleId;
	
	private String roleName;

	protected String roleDes;
	
	public RoleVO(){
		super();
	}

	public RoleVO(String roleId){
		this.roleId = roleId;
	}

	public String getRoleId(){
		return roleId;
	}

	public void setRoleId(String roleId){
		this.roleId = roleId;
	}

	public String getRoleName(){
		return roleName;
	}

	public void setRoleName(String roleName){
		this.roleName = roleName;
	}

	public String getRoleDes(){
		return roleDes;
	}

	public void setRoleDes(String roleDes){
		this.roleDes = roleDes;
	}
}
