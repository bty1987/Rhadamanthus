package com.fanglin.system.po;

import java.io.Serializable;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "module", catalog = "communion")
public class ModulePO implements Serializable {
	
	private static final long serialVersionUID = -8993777631048468352L;

	private int id;
	
	private int moduleId;

	private String moduleName;

	private String moduleIcon;
	
	private String moduleDes;
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id") 
	public int getId(){
		return id;
	}

	public void setId(int id){
		this.id = id;
	}
	
	@Id
	@Column(name = "moduleId", nullable = false)
	public int getModuleId(){
		return moduleId;
	}

	public void setModuleId(int moduleId){
		this.moduleId = moduleId;
	}

	@Column(name = "moduleName", nullable = false)
	public String getModuleName(){
		return moduleName;
	}

	public void setModuleName(String moduleName){
		this.moduleName = moduleName;
	}

	public void setModuleIcon(String icon){
		this.moduleIcon = icon;
	}

	@Column(name = "moduleIcon", nullable = false)
	public String getModuleIcon(){
		return moduleIcon;
	}

	public String getModuleDes(){
		return moduleDes;
	}
	
	public void setModuleDes(String moduleDes){
		this.moduleDes = moduleDes;
	}
	
	
}
