package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class RoleActionVO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	@SerializedName("自增主键")
	private int id;
	
	@SerializedName("操作信息")
	private SubFunctionActionVO subFunctionAction;
	
	@SerializedName("角色信息")
	private RoleVO role;
	
	@SerializedName("权限")
	private int right;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public SubFunctionActionVO getSubFunctionAction(){
		return subFunctionAction;
	}

	public void setSubFunctionAction(SubFunctionActionVO subFunctionAction){
		this.subFunctionAction = subFunctionAction;
	}

	public RoleVO getRole(){
		return role;
	}

	public void setRole(RoleVO role){
		this.role = role;
	}

	public int getRight(){
		return right;
	}

	public void setRight(int right){
		this.right = right;
	}
}
