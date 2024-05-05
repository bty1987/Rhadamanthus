package com.fanglin.communion.vo;

import java.io.Serializable;

public class DutyVO implements Serializable {

	private static final long serialVersionUID = 2137362794687628843L;

	private Long did;

	private String name;

	private String pinYin;

	private Short status;

	private DepartmentTypeVO departmentType;

	private Integer type;

	private Short lead;

	public DutyVO() {
		super();

	}

	public DutyVO(DepartmentTypeVO departmentType) {
		super();
		this.departmentType = departmentType;
	}

	public Long getDid() {
		return did;
	}

	public void setDid(Long did) {
		this.did = did;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public DepartmentTypeVO getDepartmentType() {
		return departmentType;
	}

	public void setDepartmentType(DepartmentTypeVO departmentType) {
		this.departmentType = departmentType;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Short getLead() {
		return lead;
	}

	public void setLead(Short lead) {
		this.lead = lead;
	}

	public String getPinYin() {
		return pinYin;
	}

	public void setPinYin(String pinYin) {
		this.pinYin = pinYin;
	}

}
