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

	private int oid;
	
	private ModulePO module;
	
	private String name;
	
	private String operation;
	
	private short system;

	public OperationPO() {
		super();
	}

	public OperationPO(int oid) {
		super();
		this.oid = oid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "oId")
	public int getOid() {
		return oid;
	}

	public void setOid(int oid) {
		this.oid = oid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "moduleId", referencedColumnName = "mId")
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

	@Column(name = "system")
	public short getSystem() {
		return system;
	}

	public void setSystem(short system) {
		this.system = system;
	}

}