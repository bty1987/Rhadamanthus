package com.fanglin.system.po;

import java.io.Serializable;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "module", catalog = "communion")
public class ModulePO implements Serializable {
	
	private static final long serialVersionUID = -8993777631048468352L;

	private int mId;
	
	private ModulePO fatherModule;
	
	private String name;
	
	private String icon;
	
	private String url;
	
	private short level;
	
	private short system;
	
	public ModulePO() {
		super();
	}

	public ModulePO(int mId) {
		super();
		this.mId = mId;
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "mId") 
	public int getMid(){
		return mId;
	}

	public void setMid(int mId){
		this.mId = mId;
	}
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "fatherModuleId", referencedColumnName = "mId")
	public ModulePO getFatherModule() {
		return fatherModule;
	}

	public void setFatherModule(ModulePO fatherModule) {
		this.fatherModule = fatherModule;
	}

	@Column(name = "name")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "icon")
	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column(name = "url")
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "system")
	public short getSystem() {
		return system;
	}

	public void setSystem(short system) {
		this.system = system;
	}
	
}
