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
@Table(name = "operation", catalog = "communion")
public class OperationPO implements java.io.Serializable {

	private static final long serialVersionUID = 6057537266407674722L;

	public static final String COLUMN_OPERATION_STR = "operation";

	public static final String COLUMN_STATUS_STR = "status";

	public static final String COLUMN_TYPE_STR = "type";

	public static final short STATUS_ENABLE_INT = 0;

	public static final short THROUGH_PASS_INT = 1;

	public static final short THROUGH_COMMON_INT = 2;

	public static final short THROUGH_DINGTALK_INT = 3;

	public static final short THROUGH_COMMUNION_INT = 4;

	private int oid;

	private ModulePO module;

	private String name;

	private String operation;

	private short system;

	private short status;

	private short through;

	private short type;

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

	@Column(name = "system")
	public short getSystem() {
		return system;
	}

	public void setSystem(short system) {
		this.system = system;
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

}