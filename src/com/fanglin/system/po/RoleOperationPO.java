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

	private int roid;
	
	private int rid;
	
	private OperationPO operation;
	
	public RoleOperationPO() {
		super();
	}

	public RoleOperationPO(OperationPO operation, int rid) {
		super();
		this.operation = operation;
		this.rid = rid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "roid")
	public int getRoid() {
		return roid;
	}

	public void setRoid(int roid) {
		this.roid = roid;
	}
	
	public int getRid() {
		return rid;
	}

	public void setRid(int rid) {
		this.rid = rid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "oid", referencedColumnName = "oid")
	public OperationPO getOperation() {
		return operation;
	}
	
	public void setOperation(OperationPO operation) {
		this.operation = operation;
	}

}