package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "roleAction", catalog = "communion")
public class RoleActionPO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	private int id;
	
	private SubFunctionActionPO subFunctionAction;
	
	private RolePO role;

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false)
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "actionId")
	public SubFunctionActionPO getSubFunctionAction(){
		return subFunctionAction;
	}

	public void setSubFunctionAction(SubFunctionActionPO subFunctionAction){
		this.subFunctionAction = subFunctionAction;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.LAZY)
	@javax.persistence.JoinColumn(nullable = false, name = "roleId")
	public RolePO getRole(){
		return role;
	}

	public void setRole(RolePO role){
		this.role = role;
	}
	
}
