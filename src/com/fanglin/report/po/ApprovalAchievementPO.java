package com.fanglin.report.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "approval7achievement", catalog = "report")
public class ApprovalAchievementPO implements java.io.Serializable {

	private static final long serialVersionUID = 2269348719337433528L;

	private long aaid;

	private int year; // 年份

	private int month; // 月份

	private short type; // 类型

	private long cs0; // 总数

	private long cs1; // 创建数量

	private long cs2; // 未处理数量

	private long cs3; // 通过数量

	private long cs4; // 驳回数量

	private int company; // 公司

	public ApprovalAchievementPO() {
		super();
	}

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "aaid")
	public long getAaid() {
		return aaid;
	}

	public void setAaid(long aaid) {
		this.aaid = aaid;
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

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
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

	@Column(name = "company")
	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

}
