package com.fanglin.system.po;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;


@Entity
@Table(name = "module", catalog = "communion")
public class ModulePO implements Serializable {
	
	private static final long serialVersionUID = -8993777631048468352L;
	
	public static final short LINK_LINK_INT = 0;

	private int mid;
	
	private ModulePO fatherModule;
	
	private String name;
	
	private String alias;
	
	private String icon;
	
	private String url;
	
	private short level;
	
	private short system;
	
	private short order;
	
	private String helpKey;
	
	public ModulePO() {
		super();
	}

	public ModulePO(int mid) {
		super();
		this.mid = mid;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name="mid")
	public int getMid() {
		return mid;
	}

	public void setMid(int mid) {
		this.mid = mid;
	}

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "fatherModuleId", referencedColumnName = "mid")
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

	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
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

	@Column(name = "`order`")
	public short getOrder() {
		return order;
	}

	public void setOrder(short order) {
		this.order = order;
	}

	@Column(name = "helpKey")
	public String getHelpKey() {
		return helpKey;
	}

	public void setHelpKey(String helpKey) {
		this.helpKey = helpKey;
	}
	
}
