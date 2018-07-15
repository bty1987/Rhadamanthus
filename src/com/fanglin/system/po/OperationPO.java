package com.fanglin.system.po;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import static javax.persistence.GenerationType.IDENTITY;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "operation", catalog = "communion")
public class OperationPO implements java.io.Serializable {

	private static final long serialVersionUID = 6057537266407674722L;
	
	public static final String COLUMN_OPERATION_STR = "operation";
	
	public static final String COLUMN_STATUS_STR = "status";
	
	public static final short STATUS_ENABLE_INT = 0;
	
	public static final short THROUGH_PASS_INT = 1;
	
	private int oid;
	
	private ModulePO module;
	
	private String name;
	
	private String operation;
	
	private short status;
	
	private short through;

	public OperationPO() {
		super();
	}

	public OperationPO(int oid) {
		super();
		this.oid = oid;
	}

	public OperationPO(ModulePO module) {
		super();
		this.module = module;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oid")
	public int getOid() {
		return oid;
	}

	public void setOid(int oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "moduleId", referencedColumnName = "mid")
	public ModulePO getModule() {
		return module;
	}

	public void setModule(ModulePO module) {
		this.module = module;
	}

	@Column(name = "name")
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "operation")
	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

	@Column(name = "status")
	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	@Column(name = "through")
	public short getThrough() {
		return through;
	}

	public void setThrough(short through) {
		this.through = through;
	}

}