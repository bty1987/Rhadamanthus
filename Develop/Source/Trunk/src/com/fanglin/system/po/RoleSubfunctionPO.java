package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "roleSubFunction", catalog = "communion")
public class RoleSubfunctionPO implements Serializable {
	
	private static final long serialVersionUID = 6244446516300615653L;

	private int id;
	
	private SubFunctionPO subFunction;
	
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

	@javax.persistence.ManyToOne(fetch = FetchType.EAGER)
	@javax.persistence.JoinColumn(nullable = false, name = "subFunctionId")
	public SubFunctionPO getSubFunction(){
		return subFunction;
	}

	public void setSubFunction(SubFunctionPO subFunction){
		this.subFunction = subFunction;
	}

	@javax.persistence.ManyToOne(fetch = FetchType.EAGER)
	@javax.persistence.JoinColumn(nullable = false, name = "roleId")
	public RolePO getRole(){
		return role;
	}

	public void setRole(RolePO role){
		this.role = role;
	}
}
