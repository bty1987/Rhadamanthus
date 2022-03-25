package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.communion.po.DepartmentPO;

@Entity
@Table(name = "decoration7achievement", catalog = "report")
public class DecorationAchievementPO implements java.io.Serializable {

	private static final long serialVersionUID = 2919389551222483571L;

	private long daid;

	private DepartmentPO department; // 部门

	private int year; // 年份

	private int month; // 月份

	private long cs0; // 签单数

	private long cs1; // 设计数

	private long cs2; // 签单额

	private long cs3; // 净业绩

	private long cs4; // 设计额

	private long cs5; // 服务费

	private int company; // 公司

	public DecorationAchievementPO() {
		super();
	}

	public DecorationAchievementPO(DepartmentPO department) {
		super();
		this.department = department;
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "daid")
	public long getDaid() {
		return daid;
	}

	public void setDaid(long daid) {
		this.daid = daid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(nullable = true, name = "did", referencedColumnName = "did")
	public DepartmentPO getDepartment() {
		return department;
	}

	public void setDepartment(DepartmentPO department) {
		this.department = department;
	}

	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	@Column(name = "cs0")
	public long getCs0() {
		return cs0;
	}

	public void setCs0(long cs0) {
		this.cs0 = cs0;
	}

	@Column(name = "cs1")
	public long getCs1() {
		return cs1;
	}

	public void setCs1(long cs1) {
		this.cs1 = cs1;
	}

	@Column(name = "cs2")
	public long getCs2() {
		return cs2;
	}

	public void setCs2(long cs2) {
		this.cs2 = cs2;
	}

	@Column(name = "cs3")
	public long getCs3() {
		return cs3;
	}

	public void setCs3(long cs3) {
		this.cs3 = cs3;
	}

	@Column(name = "cs4")
	public long getCs4() {
		return cs4;
	}

	public void setCs4(long cs4) {
		this.cs4 = cs4;
	}

	@Column(name = "cs5")
	public long getCs5() {
		return cs5;
	}

	public void setCs5(long cs5) {
		this.cs5 = cs5;
	}

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
