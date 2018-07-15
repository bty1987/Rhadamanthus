package com.fanglin.system.vo;

public class OperationVO implements java.io.Serializable {

	private static final long serialVersionUID = -6174194941685386010L;

	private Integer oid;
	
	private ModuleVO module;
	
	private String name;
	
	private String operation;
	
	public OperationVO(Integer oid) {
		super();
		this.oid = oid;
	}

	public OperationVO() {
		super();
	}

	public Integer getOid() {
		return oid;
	}

	public void setOid(Integer oid) {
		this.oid = oid;
	}

	public ModuleVO getModule() {
		return module;
	}

	public void setModule(ModuleVO module) {
		this.module = module;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
	}

}