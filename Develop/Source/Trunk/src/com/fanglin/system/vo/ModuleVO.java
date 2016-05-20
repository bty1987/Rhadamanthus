package com.fanglin.system.vo;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class ModuleVO implements Serializable {
	
	private static final long serialVersionUID = 5406770839477574587L;

	@SerializedName("自增主键")
	private int id;
	
	@SerializedName("模块序号")
	private int moduleId;

	@SerializedName("模块名")
	private String moduleName;

	@SerializedName("模块图标")
	private String moduleIcon;
	
	@SerializedName("模块描述")
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
