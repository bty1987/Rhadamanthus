package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rolemodule", catalog = "communion")
public class RoleModulePO implements java.io.Serializable {

	private static final long serialVersionUID = -6081152605726686260L;

	private int rmId;
	
	private RolePO role;
	
	private ModulePO module;
	
	public RoleModulePO() {
		super();
	}
	
	public RoleModulePO(RolePO role, ModulePO module) {
		super();
		this.role = role;
		this.module = module;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "rmId")
	public int getRmId() {
		return this.rmId;
	}

	public void setRmId(int rmId) {
		this.rmId = rmId;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rId", referencedColumnName = "rId")
	public RolePO getRole() {
		return role;
	}

	public void setRole(RolePO role) {
		this.role = role;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "mId", referencedColumnName = "mId")
	public ModulePO getModule() {
		return module;
	}

	public void setModule(ModulePO module) {
		this.module = module;
	}

}