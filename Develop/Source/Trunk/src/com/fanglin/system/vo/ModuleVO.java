package com.fanglin.system.vo;

import java.io.Serializable;

public class ModuleVO implements Serializable {
	
	private static final long serialVersionUID = 5406770839477574587L;

	private int id;
	
	private int moduleId;

	private String moduleName;

	private String moduleIcon;
	
	protected String moduleDes;

	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}

	public int getModuleId(){
		return moduleId;
	}

	public void setModuleId(int moduleId){
		this.moduleId = moduleId;
	}

	public String getModuleName(){
		return moduleName;
	}

	public void setModuleName(String moduleName){
		this.moduleName = moduleName;
	}

	public String getModuleIcon(){
		return moduleIcon;
	}

	public void setModuleIcon(String moduleIcon){
		this.moduleIcon = moduleIcon;
	}

	public String getModuleDes(){
		return moduleDes;
	}

	public void setModuleDes(String moduleDes){
		this.moduleDes = moduleDes;
	}
	
}
