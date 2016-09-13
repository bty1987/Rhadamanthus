package com.fanglin.system.vo;

import java.io.Serializable;
import java.util.Set;

public class ModuleVO implements Serializable {
	
	private static final long serialVersionUID = 5406770839477574587L;
	
	private Integer mId;

	private ModuleVO fatherModule;
	
	private String name;
	
	private String icon;
	
	private String url;
	
	private Short level;
	
	private Short system;
	
	private Set<OperationVO> operations;
	
	public Integer getmId() {
		return mId;
	}

	public void setmId(Integer mId) {
		this.mId = mId;
	}

	public ModuleVO getFatherModule() {
		return fatherModule;
	}

	public void setFatherModule(ModuleVO fatherModule) {
		this.fatherModule = fatherModule;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}

	public Short getSystem() {
		return system;
	}

	public void setSystem(Short system) {
		this.system = system;
	}

	public Set<OperationVO> getOperations() {
		return operations;
	}

	public void setOperations(Set<OperationVO> operations) {
		this.operations = operations;
	}
	
}
