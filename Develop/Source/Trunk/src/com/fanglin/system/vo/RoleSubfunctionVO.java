package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class RoleSubfunctionVO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	@SerializedName("自增主键")
	private int id;
	
	@SerializedName("子功能信息")
	private SubFunctionVO subFunction;
	
	@SerializedName("角色信息")
	private RoleVO role;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public SubFunctionVO getSubFunction(){
		return subFunction;
	}

	public void setSubFunction(SubFunctionVO subFunction){
		this.subFunction = subFunction;
	}

	public RoleVO getRole(){
		return role;
	}

	public void setRole(RoleVO role){
		this.role = role;
	}
	
}
