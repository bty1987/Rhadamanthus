package com.fanglin.report.vo;

import com.fanglin.communion.vo.DepartmentVO;

public class DecorationAchievementVO implements java.io.Serializable {

	private static final long serialVersionUID = 7623648676496902861L;

	private Long daid;

	private DepartmentVO department;

	private Integer year;

	private Integer month;

	private Short typeness;

	private Long cs0;

	private Long cs1;

	private Long cs2;

	private Long cs3;

	private Long cs4;

	private Long cs5;

	private Long cs6;

	private Long cs7;

	private Integer company;

	public DecorationAchievementVO() {
		super();
	}

	public DecorationAchievementVO(DepartmentVO department) {
		super();
		this.department = department;
	}

	public Long getDaid() {
		return daid;
	}

	public void setDaid(Long daid) {
		this.daid = daid;
	}

	public DepartmentVO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentVO department) {
		this.department = department;
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

	public Short getTypeness() {
		return typeness;
	}

	public void setTypeness(Short typeness) {
		this.typeness = typeness;
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

	public Long getCs5() {
		return cs5;
	}

	public void setCs5(Long cs5) {
		this.cs5 = cs5;
	}

	public Long getCs6() {
		return cs6;
	}

	public void setCs6(Long cs6) {
		this.cs6 = cs6;
	}

	public Long getCs7() {
		return cs7;
	}

	public void setCs7(Long cs7) {
		this.cs7 = cs7;
	}

	public Integer getCompany() {
		return company;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

}
