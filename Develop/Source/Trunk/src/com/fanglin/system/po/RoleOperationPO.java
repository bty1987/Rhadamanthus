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
@Table(name = "roleoperation", catalog = "communion")
public class RoleOperationPO implements java.io.Serializable {

	private static final long serialVersionUID = -5001643145007685798L;

	private int roId;
	
	private RolePO role;
	
	private OperationPO operation;
	
	public RoleOperationPO() {
		super();
	}

	public RoleOperationPO(RolePO role, OperationPO operation) {
		super();
		this.role = role;
		this.operation = operation;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "roId")
	public int getRoId() {
		return this.roId;
	}

	public void setRoId(int roId) {
		this.roId = roId;
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
	@JoinColumn(name = "oId", referencedColumnName = "oId")
	public OperationPO getOperation() {
		return operation;
	}
	
	public void setOperation(OperationPO operation) {
		this.operation = operation;
	}

}