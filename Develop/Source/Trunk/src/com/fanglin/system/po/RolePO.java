package com.fanglin.system.po;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "role", catalog = "communion")
public class RolePO implements Serializable {

	private static final long serialVersionUID = 8111974803190366547L;
	
	public static final String SUPER_ROLEID_STR = "1";
	
	private int rId;

	private String roleId;

	private String roleName;

	private String roleDes;
	
	public RolePO(){
		super();
	}
	
	public RolePO(String roleId){
		super();
		this.roleId = roleId;
	}
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "rId") 
	public int getrId() {
		return rId;
	}

	public void setrId(int rId) {
		this.rId = rId;
	}

	@Id
	@Column(name = "roleId", nullable = false)
	public String getRoleId(){
		return roleId;
	}

	public void setRoleId(String roleId){
		this.roleId = roleId;
	}

	@Column(name = "roleName", nullable = false)
	public String getRoleName(){
		return roleName;
	}

	public void setRoleName(String roleName){
		this.roleName = roleName;
	}

	@Column(name = "roleDes", nullable = true)
	public String getRoleDes(){
		return roleDes;
	}

	public void setRoleDes(String roleDes){
		this.roleDes = roleDes;
	}
}
