package com.fanglin.system.vo;

import java.io.Serializable;
import java.util.Set;

public class ModuleVO implements Serializable {

	private static final long serialVersionUID = 5406770839477574587L;

	private Integer mid;

	private ModuleVO fatherModule;

	private String name;

	private String alias;

	private String module;

	private String icon;

	private String url;

	private Short level;

	private Short system;

	private Short order;

	private Set<OperationVO> operations;

	private String helpKey;

	private Short link;

	private Short access;

	public Integer getMid() {
		return mid;
	}

	public void setMid(Integer mid) {
		this.mid = mid;
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

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
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

	public Short getOrder() {
		return order;
	}

	public void setOrder(Short order) {
		this.order = order;
	}

	public String getHelpKey() {
		return helpKey;
	}

	public void setHelpKey(String helpKey) {
		this.helpKey = helpKey;
	}

	public Short getLink() {
		return link;
	}

	public void setLink(Short link) {
		this.link = link;
	}

	public Short getAccess() {
		return access;
	}

	public void setAccess(Short access) {
		this.access = access;
	}

}
