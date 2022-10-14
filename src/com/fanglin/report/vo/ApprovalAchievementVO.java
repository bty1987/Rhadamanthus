package com.fanglin.report.vo;

public class ApprovalAchievementVO implements java.io.Serializable {

	private static final long serialVersionUID = -4410842570261718476L;

	private Long aaid;

	private Integer year;

	private Integer month;

	private Short type;

	private Long cs0;

	private Long cs1;

	private Long cs2;

	private Long cs3;

	private Long cs4;

	private Integer company;

	public ApprovalAchievementVO() {
		super();
	}

	public Long getAaid() {
		return aaid;
	}

	public void setAaid(Long aaid) {
		this.aaid = aaid;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public Long getCs0() {
		return cs0;
	}

	public void setCs0(Long cs0) {
		this.cs0 = cs0;
	}

	public Long getCs1() {
		return cs1;
	}

	public void setCs1(Long cs1) {
		this.cs1 = cs1;
	}

	public Long getCs2() {
		return cs2;
	}

	public void setCs2(Long cs2) {
		this.cs2 = cs2;
	}

	public Long getCs3() {
		return cs3;
	}

	public void setCs3(Long cs3) {
		this.cs3 = cs3;
	}

	public Long getCs4() {
		return cs4;
	}

	public void setCs4(Long cs4) {
		this.cs4 = cs4;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
