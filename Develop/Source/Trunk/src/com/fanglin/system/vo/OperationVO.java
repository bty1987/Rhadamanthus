package com.fanglin.system.vo;

public class OperationVO implements java.io.Serializable {

	private static final long serialVersionUID = -6174194941685386010L;

	private Integer oId;
	
	private ModuleVO module;
	
	private String name;
	
	private String operation;
	
	private Short system;
	
	public Integer getoId() {
		return oId;
	}

	public void setoId(Integer oId) {
		this.oId = oId;
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

	public Short getSystem() {
		return system;
	}

	public void setSystem(Short system) {
		this.system = system;
	}

}