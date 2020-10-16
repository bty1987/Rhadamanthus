package com.fanglin.information.vo;

import java.io.Serializable;

public class PlanParamVO implements Serializable {

	private static final long serialVersionUID = -176596579933112324L;

	private Long ppid;

	private Long pid;

	private String fields;

	private String conditions;

	public Long getPpid() {
		return ppid;
	}

	public void setPpid(Long ppid) {
		this.ppid = ppid;
	}

	public Long getPid() {
		return pid;
	}

	public void setPid(Long pid) {
		this.pid = pid;
	}

	public String getFields() {
		return fields;
	}

	public void setFields(String fields) {
		this.fields = fields;
	}

	public String getConditions() {
		return conditions;
	}

	public void setConditions(String conditions) {
		this.conditions = conditions;
	}
}
